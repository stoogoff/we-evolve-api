import { encodeBase64 } from 'jsr:@std/encoding/base64'
import { NotFoundError } from './errors.ts'

export interface DatabaseCredentials {
	dbHost: string;
	dbUser: string;
	dbPassword: string;
}

export class Repository {
	private authHeader: string;

	constructor(private dbCredentials: DatabaseCredentials) {
		this.authHeader = 'Basic ' + encodeBase64(`${dbCredentials.dbUser}:${dbCredentials.dbPassword}`)
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

		// @ts-ignore
		return items.map(({ doc }) => doc)
	}

	async getByTypeId(prefix: string, id: string) {
		const response = await this.fetch(`/${prefix}:${id}`)
		const item = await response.json()

		if('error' in item) {
			throw new NotFoundError(`item '${prefix}:${id}' not found`)
		}

		return item
	}

	private async fetch(url: string) {
		return await fetch(this.dbCredentials.dbHost + url, {
			headers: {
				Authorization: this.authHeader,
			},
		})
	}
}
