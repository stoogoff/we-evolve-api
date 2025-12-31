
import { Eta } from '@bgub/eta'
import { Context } from '@oak/oak'

export class View {
	private renderer: Eta

	constructor(private templatePath: string, private baseModel: Record<string, unknown>) {
		this.renderer = new Eta({
			views: templatePath,
			cache: false,
			defaultExtension: '.ejs',
		})
	}

	async render(path: string, data: Record<string, any>) {
		return await this.renderer.render(path, { ...this.baseModel, ...data })
	}

	async renderTemplate (ctx: Context) {
		const file = ctx.request.url.pathname.replace(/^\//, '')

		// this may need some way to pass in a model
		return await this.renderer.render(file || 'index', this.baseModel)
	}
}
