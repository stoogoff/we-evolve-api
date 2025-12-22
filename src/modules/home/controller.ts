
import { Context, Router } from '@oak/oak'
import { Controller } from '../../mvc/index.ts'

export class HomeController extends Controller {
	registerRoutes(router: Router): void {
		router.get('/', async (ctx: Context) => {
			this.context = ctx

			ctx.response.body = await this.index()
		})
	}

	async index() {
		return await this.render('index', {})
	}
}
