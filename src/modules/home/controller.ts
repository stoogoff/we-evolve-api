
import { Context, Router } from '@oak/oak'
import { route, Controller } from '../../mvc/index.ts'

export class HomeController extends Controller {
	@route('/')
	async index() {
		return await this.render('index', {})
	}
}
