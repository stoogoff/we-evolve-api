
import { Eta } from '@bgub/eta'
import { Context } from '@oak/oak'
import { PageModel, SiteModel } from './models.ts'

export class View {
	private renderer: Eta

	constructor(private readonly templatePath: string, private readonly siteModel: SiteModel) {
		this.renderer = new Eta({
			views: templatePath,
			cache: false,
			defaultExtension: '.ejs',
		})
	}

	async render(path: string, data: PageModel) {
		this.siteModel.merge(data)

		const raw = await this.siteModel.toRaw()

		return await this.renderer.render(path, raw)
	}

	async renderContext(ctx: Context) {
		const file = ctx.request.url.pathname.replace(/^\//, '')

		try {
			return await this.renderTemplate(file || 'index')
		}
		catch(_error) {
			ctx.response.status = 404

			return await this.renderTemplate('404')
		}
	}

	async renderTemplate(path: string) {
		return await this.renderer.render(path, this.siteModel)
	}
}
