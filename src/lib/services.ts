
import { sortByProperty } from './list'
import { IRepository } from './repository'

const FILTER_SEPARATOR = ':'

export interface IQuery {
	sort?: string;
	limit?: number;
	offset?: number;
	dir?: 'asc' | 'desc';
	filter?: string;
}

export interface IService<T> {
	getById(id: string): Promise<T>;
	getAll(query: IQuery): Promise<T[]>;
	create(input: T): Promise<T>;
	update(id: string, input: T): Promise<T>;
	deleteById(id: string): Promise<void>;
}

export class Service<T> implements IService<T> {
	constructor(private repository: IRepository<T>) {}

	async getById(id: string): Promise<T> {
		return await this.repository.getById(id)
	}

	async getAll({ sort, limit, offset, dir, filter }: IQuery): Promise<T[]> {
		let items = await this.repository.getAll()

		if(filter && filter.indexOf(FILTER_SEPARATOR)) {
			const [key, value] = filter.split(FILTER_SEPARATOR)

			items = items.filter(item =>
				(item[key] ?? '').toString().toLowerCase() === value)
		}

		if(sort) {
			items = items.sort(sortByProperty(sort))
		}

		if(dir && dir.toLowerCase() === 'desc') {
			items = items.reverse()
		}

		console.log({ offset, limit })

		if(limit && limit > 0 && offset && offset > 0) {
			console.log('limit and offset', offset + limit)
			items = items.slice(offset, offset + limit)
		}
		else if(limit && limit > 0) {
			console.log('just limit')
			items = items.slice(0, limit)
		}
		else if(offset && offset > 0) {
			console.log('just offset')
			items = items.slice(offset)
		}

		return items
	}

	async create(input: T): Promise<T> {
		return await this.repository.create(input)
	}

	async update(id: string, input: T): Promise<T> {
		return await this.repository.update(id, input)
	}

	async deleteById(id: string): Promise<void> {
		await this.repository.deleteById(id)
	}
}
