
import { AxiosInstance } from 'axios'
import { NotFoundError, UnprocessableContent } from './errors'
import { db } from './db'

export interface IRepository<T> {
	getById(id: string): Promise<T>;
	getAll(): Promise<T[]>;
	create(input: T): Promise<T>;
	update(id: string, input: T): Promise<T>;
	deleteById(id: string): Promise<void>;
}

export interface ICouchModel {
	_id: string;
	_rev: string;
}

export class CouchRepository<T extends ICouchModel> implements IRepository<T> {
	private db: AxiosInstance

	constructor(dbName: string, private type: string) {
		this.db = db(dbName)
	}

	private addTypeToId(id: string): string {
		if(!id.startsWith(this.type)) {
			id = `${this.type}:${id}`
		}

		return id		
	}

	async getById(id: string): Promise<T> {
		id = this.addTypeToId(id)

		try {
			const response = await this.db.get(`/${id}`)

			return response.data
		}
		catch(error) {
			throw new NotFoundError(id)
		}
	}

	async getAll(): Promise<T[]> {
		const params = {
			startkey: `"${this.type}:"`,
			endkey: `"${this.type}:\ufff0"`,
			include_docs: true
		}

		const response = await this.db.get('_all_docs', { params })

		return response.data.rows.map(row => row.doc)
	}

	async create(input) {
		const response = await this.db.post('/', input)

		if(!response.data.ok) {
			throw new UnprocessableContent('Create failed')
		}

		return await this.getById(response.data.id)
	}

	async update(id: string, input: T): Promise<T> {
		id = this.addTypeToId(id)

		if(id !== input._id || !input._rev) {
			throw new UnprocessableContent('Invalid data')
		}

		const response = await this.db.put(`/${id}`, input)

		if(!response.data.ok) {
			throw new UnprocessableContent('Create failed')
		}

		return await this.getById(id)
	}

	async deleteById(id: string): Promise<void> {
		id = this.addTypeToId(id)

		const current = await this.getById(id)
		const response = await this.db.delete(`/${id}?rev=${current._rev}`)

		if(!response.data.ok) {
			throw new UnprocessableContent('Delete failed')
		}
	}
}
