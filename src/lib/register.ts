
import { CouchRepository } from './repository'
import { Service } from './services'
import { GetController } from './controllers'

export default (fastify, options) => {
	for(const key in options.services) {
		const current = options.services[key]
		const repo = new CouchRepository(options.database, current.type)
		const service = new Service(repo)
		const controller = new GetController(service, current.converter)

		fastify.register(
			controller.registerRoutes.bind(controller),
			{ ...options, prefix: current.slug }
		)
	}
}
