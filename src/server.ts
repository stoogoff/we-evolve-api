
import { Application, Context, Router } from '@oak/oak'
import { PORT, PATH, BASE_MODEL, IMAGE_URL } from './config.ts'

import { HomeController } from './modules/home/controller.ts'
import { BooksController, BooksService } from './modules/books/index.ts'
import { router, staticFiles, Repository, SiteModel, View } from './mvc/index.ts'

const repo = new Repository({
	dbHost: Deno.env.get('DATABASE_URL')!,
	dbUser: Deno.env.get('DATABASE_USER')!,
	dbPassword: Deno.env.get('DATABASE_PASSWORD')!,
})

console.log(Deno.version.typescript)

const site = new SiteModel({
	url: 'https://we-evolve.co.uk',
	title: 'we evolve',
	description: 'Publisher of the Aegean, WILD, and Action Potential role-playing games.',
	image: `https://cdn.we-evolve.co.uk/img/home/banner-aegean.png`,
	type: 'website'
}, IMAGE_URL)

const view = new View(`${Deno.cwd()}/${PATH.PAGES}`, site)
const books = new BooksController(new BooksService(repo), view)
const home = new HomeController(view)


const app = new Application()

app.use(router.routes())
app.use(router.allowedMethods())

// serve static files
app.use(staticFiles(PATH.STATIC))

// catch all static pages which don't need a controller
app.use(async (ctx: Context) => {
	ctx.response.body = await view.renderContext(ctx)
})

app.addEventListener('listen', ({ port }) => console.log(`Listening on port: ${port}`))
app.listen({ port: PORT })
