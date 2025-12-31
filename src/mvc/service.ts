import { Repository } from './repository.ts'

export class Service<T> {
	constructor(private repo: Repository, private prefix: string) {}

	async all(): Promise<T[]> {
		return await this.repo.getAllByType(this.prefix)
	}

	async byId(id: string): Promise<T> {
		return await this.repo.getByTypeId(this.prefix, id)
	}
}
