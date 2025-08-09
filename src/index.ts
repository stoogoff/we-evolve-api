import Fastify from 'fastify'
import config from './config'
//import blog from './modules/blog/index'
//import tweet from './modules/tweet/index'
import website from './modules/website/index'

const start = async () => {
	const fastify = Fastify({
		logger: true
	})

	//fastify.addHook('onRoute', opt => console.log(`${opt.method}: ${opt.path}`))

	fastify.addHook('onSend', (request, response, payload, done) => {
		response.header('Access-Control-Allow-Origin', '*')
		done(null, payload)
	})

	//fastify.register(blog, { prefix: 'blog' })
	//fastify.register(tweet, { prefix: 'tweets', config })
	fastify.register(website, { prefix: 'stoogoff' })

	try {
		console.log(fastify.printRoutes())
		await fastify.listen({ port: config.port })
	}
	catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start()
