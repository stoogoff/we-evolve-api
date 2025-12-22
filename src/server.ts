
import { Application, Context, Router } from '@oak/oak'
import { PORT, PATH, BASE_MODEL } from './config.ts'
import { templateRenderer } from './templating.ts'

import { HomeController } from './modules/home/controller.ts'
import { BooksController, BooksService } from './modules/books/index.ts'
import { Repository, View } from './mvc/index.ts'

const repo = new Repository({
	dbHost: Deno.env.get('DATABASE_URL'),
	dbUser: Deno.env.get('DATABASE_USER'),
	dbPassword: Deno.env.get('DATABASE_PASSWORD'),
})

const router = new Router()
const view = new View(`${Deno.cwd()}/${PATH.PAGES}`, BASE_MODEL)
const books = new BooksController(new BooksService(repo), view)
const home = new HomeController(view)


home.registerRoutes(router)
books.registerRoutes(router)

const app = new Application()

app.use(router.routes())
app.use(router.allowedMethods())

// serve static files
app.use(async (ctx: Context, next) => {
	if(/\.(css|js|jpg|ico|png|gif|svg|otf|webmanifest)$/.test(ctx.request.url.pathname)) {
		const opts = {
			root: PATH.STATIC,
			path: ctx.request.url.pathname,
			maxage: ctx.state.env == 'production' ? 1000 * 60 * 60 * 24 : 1000,
		};

		try {
			await ctx.send(opts)
		}
		catch {
			ctx.response.status = 404
		}
	}
	else {
		await next()
	}
})

// catch all static pages which don't need a controller
app.use(async (ctx: Context) => {
	ctx.response.body = await templateRenderer(ctx)
})

app.addEventListener('listen', ({ port }) => console.log(`Listening on port: ${port}`))
app.listen({ port: PORT })
