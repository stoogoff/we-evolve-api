
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { HttpError, ServerError } from './errors'
import { IService, IQuery } from './services'

export class Controller {
	registerRoutes(fastify: FastifyInstance) {
		if('get' in this) {
			fastify.route<{Querystring: IQuery}>({
				method: 'GET',
				url: '/',
				handler: async (request: FastifyRequest, response: FastifyReply) => {
					try {
						const { limit, offset, sort, dir, filter } = request.query as IQuery

						// @ts-ignore
						return await this.get({
							limit: Number(limit),
							offset: Number(offset),
							sort: Number(sort),
							dir,
							filter,
						})
					}
					catch(error) {
						return HttpError.ToError(error).response(response)
					}
				},
			})
		}

		if('getById' in this) {
			fastify.route({
				method: 'GET',
				url: '/:id',
				handler: async (request: FastifyRequest, response: FastifyReply) => {
					try {
						// @ts-ignore
						return await this.getById(request.params.id)
					}
					catch(error) {
						return HttpError.ToError(error).response(response)
					}
				},
			})
		}

		if('create' in this) {
			fastify.route({
				method: 'POST',
				url: '/',
				handler: async (request: FastifyRequest, response: FastifyReply) => {
					try {
						// @ts-ignore
						const result = await this.create(request.body)

						return response.code(201).send(result)
					}
					catch(error) {
						return HttpError.ToError(error).response(response)
					}
				}
			})
		}

		if('update' in this) {
			fastify.route({
				method: 'PUT',
				url: '/:id',
				handler: async (request: FastifyRequest, response: FastifyReply) => {
					try {
						// @ts-ignore
						const result = await this.update(request.params.id, request.body)

						return response.code(200).send(result)
					}
					catch(error) {
						return HttpError.ToError(error).response(response)
					}
				},
			})
		}

		if('deleteById' in this) {
			fastify.route({
				method: 'DELETE',
				url: '/:id',
				handler: async (request: FastifyRequest, response: FastifyReply) => {
					try {
						// @ts-ignore
						await this.deleteById(request.params.id)

						return response.code(204).send()
					}
					catch(error) {
						return HttpError.ToError(error).response(response)
					}
				}
			})
		}
	}
}

export class GetController<T> extends Controller {
	constructor(private service: IService<T>, private converter: (item: T) => T = a => a) {
		super()
	}

	async getById(id): Promise<T> {
		const result = await this.service.getById(id)

		return this.converter(result)
	}

	async get(query: IQuery): Promise<T[]> {
		const results = await this.service.getAll(query)

		return results.map(this.converter)
	}
}
