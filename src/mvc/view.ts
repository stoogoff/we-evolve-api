
import { Eta } from '@bgub/eta'

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
}
