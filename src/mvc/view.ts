
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

	async renderContext(ctx: Context) {
		const file = ctx.request.url.pathname.replace(/^\//, '')

		try {
			return await this.renderTemplate(file || 'index')
		}
		catch(error) {
			ctx.response.status = 404

			return await this.renderTemplate('404')
		}
	}

	async renderTemplate(path: string) {
		return await this.renderer.render(path, this.baseModel)
	}
}
