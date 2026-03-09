
import { CouchId, CouchRecord, Repository } from './repository.ts'

export class Service<T extends CouchRecord> {
	constructor(protected readonly repo: Repository, protected readonly prefix: string) {}

	async all(): Promise<T[]> {
		return await this.repo.getAllByType(this.prefix)
	}

	async byId(id: string): Promise<T> {
		return await this.repo.getByTypeId(new CouchId(this.prefix, id))
	}

	async byIds(ids: string[]): Promise<T[]> {
		const couchIds = ids.map(id => new CouchId(this.prefix, id).toString())
		const all = await this.all()
		const result: T[] = []

		all.forEach(item => {
			const index =  couchIds.indexOf(item._id)

			if(index > -1) {
				result[index] = item
			}
		})

		return result
	}
}
