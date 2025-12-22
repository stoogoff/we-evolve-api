import { Repository } from './repository.ts'

export class Service<T, S> {
	constructor(private repo: Repository, private prefix: string, private converter: (input: S) => T) {}

	async all(): Promise<T[]> {
		const items = await this.repo.getAllByType(this.prefix)

		return items.map(item => this.converter(item))
	}

	async byId(id: string): Promise<T> {
		const item = await this.repo.getByTypeId(this.prefix, id)

		return this.converter(item)
	}
}
