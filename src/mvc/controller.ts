
import { Context } from '@oak/oak'
import { HttpError, ServerError } from './errors.ts'
import { PageModel } from './models.ts'
import { View } from './view.ts'

export abstract class Controller {
	protected context: Context | undefined;

	constructor(private readonly view: View) {}

	initialise(ctx: Context) {
		this.context = ctx
	}

	get isJsonRequest() {
		return this.requestHasMimeType('application/json')
	}

	get isXmlRequest() {
		return this.requestHasMimeType('application/xml')
	}

	async bodyData() {
		if(!this.context) {
			throw new ServerError('Context not set')
		}

		const type = this.context.request.body.type() ?? 'none'

		switch(type) {
			case 'form': {
				const form = await this.context.request.body.formData()
				const result = {}

				form.keys().forEach(key => result[key] = form.get(key))

				return result
			}

			case 'json':
				return await this.context.request.body.json()
		}

		return null
	}

	requestHasMimeType(mime: string): boolean {
		if(!this.context) return false

		const acceptHeader = this.context?.request?.headers?.get('Accept')?.split(/\s*,\s*/)

		return (acceptHeader ?? []).filter(requested => requested === mime).length > 0
	}

	renderData(model: PageModel): string {
		if(!this.context) {
			throw new ServerError('Context not set')
		}

		this.context.response.headers.set('Content-Type', 'application/json')

		return JSON.stringify(model.toJson())
	}

	async render(template: string, model: PageModel): Promise<string> {
		if(!this.context) {
			throw new ServerError('Context not set')
		}

		if(this.isJsonRequest) {
			return this.renderData(model)
		}

		const urlModel = new PageModel({
			url: this.context.request.url
		})

		return await this.view.render(template, model.merge(urlModel) as PageModel)
	}

	renderStatus(status: number, message: string | undefined) {
		this.context!.response.status = status

		return message ?? ''
	}

	async renderError(error: any) {
		let httpError: HttpError

		if(error instanceof HttpError) {
			httpError = error as HttpError
		}
		else {
			httpError = new ServerError()
		}

		this.context!.response.status = httpError.status

		if(this.isJsonRequest) {
			this.context?.response.headers.set('Content-Type', 'application/json')

			return JSON.stringify(httpError.toJson())
		}

		return await this.view.render(httpError.status.toString(), new PageModel({}, httpError))
	}
}
