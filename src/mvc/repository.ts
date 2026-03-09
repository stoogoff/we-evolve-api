
import { encodeBase64 } from 'jsr:@std/encoding/base64'
import { NotFoundError, ServerError } from './errors.ts'

export interface CouchRecord {
	_id: string;
	_rev: string;
	created: string;
	modified: string;
}

export interface CouchInput {
	_id: string;
	_rev?: string;
}

export interface DbCredentials {
	dbHost: string;
	dbUser: string;
	dbPassword: string;
}

const DELIMITER = ':'

export class CouchId {
	private _id: string;

	constructor(private _prefix: string, id: string) {
		const parts = id.split(DELIMITER)

		this._id = parts.length === 1 ? parts[0] : parts[1]
	}

	get prefix() {
		return this._prefix
	}

	get id() {
		return this._id
	}

	[Symbol.toPrimitive]() {
		return this.toString()
	}

	toSlug() {
		return `/${this.prefix}s/${this.id}`
	}

	toString() {
		return `${this.prefix}${DELIMITER}${this.id}`
	}

	static fromString(input: string): CouchId {
		const parts = input.split(DELIMITER)

		if(parts.length === 1) {
			throw new ServerError(`Invalid CouchId for '${input}'`)
		}

		return new CouchId(parts[0], parts[1])
	}
}

export interface CouchDesignDoc<T extends CouchRecord> {
	id: string;
	key: string;
	value: string | number;
	doc?: T;
}

export interface CouchDesignDocResponse<T extends CouchRecord> {
	total_rows: number;
	offset: number;
	rows: CouchDesignDoc<T>[];
}

export class Repository {
	private authHeader: string;

	constructor(private dbCredentials: DbCredentials) {
		this.authHeader = 'Basic ' + encodeBase64(`${dbCredentials.dbUser}:${dbCredentials.dbPassword}`)
	}

	async create(data: CouchInput) {
		return await this.put(`/${data._id}`, {
			...data,
			created: new Date().toISOString(),
			modified: new Date().toISOString(),
		})
	}

	async getAllByType(prefix: string, limit: number | false = false) {
		const params = new URLSearchParams({
			startkey: `"${prefix}:"`,
			endkey: `"${prefix}:\ufff0"`,
			include_docs: 'true',
		})
		const response = await this.fetch('/_all_docs?' + params.toString())
		let items = (await response.json()).rows

		if(limit) {
			items = items.slice(0, limit)
		}

		return items.map(({ doc }: { doc: unknown }) => doc)
	}

	async getByTypeId(id: CouchId) {
		const response = await this.fetch(`/${id}`)
		const item = await response.json()

		if('error' in item) {
			throw new NotFoundError(`item '${id}' not found`)
		}

		return item
	}

	async getView<T extends CouchRecord>(
		designDoc: string,
		view: string,
		key?: string,
		includeDocs: boolean = false
	): Promise<CouchDesignDocResponse<T>> {
		let path = `/_design/${designDoc}/_view/${view}?include_docs=${includeDocs}`

		if(key) {
			path += `&key="${key}"`
		}

		const response = await this.fetch(path)
		const item = await response.json()

		if('error' in item) {
			throw new NotFoundError(`design doc '${path}' not found`)
		}

		return item
	}

	private async put(url: string, data) {
		return await fetch(this.dbCredentials.dbHost + url, {
			method: 'put',
			headers: {
				Authorization: this.authHeader,
			},
			body: JSON.stringify(data)
		})
	}

	private async fetch(url: string) {
		return await fetch(this.dbCredentials.dbHost + url, {
			headers: {
				Authorization: this.authHeader,
			},
		})
	}
}
