
import { Context } from '@oak/oak'
import { HttpError, ServerError } from './errors.ts'
import { PageModel } from './models.ts'
import { View } from './view.ts'

const controllers = new Map()

export abstract class Controller {
	protected context: Context | undefined;

	constructor(private view: View) {}

	initialise(ctx: Context) {
		this.context = ctx
	}

	get isJsonRequest() {
		return this.requestHasMimeType('application/json')
	}

	get isXmlRequest() {
		return this.requestHasMimeType('application/xml')
	}

	requestHasMimeType(mime: string): boolean {
		if(!this.context) return false

		const acceptHeader = this.context?.request?.headers?.get('Accept')?.split(/\s*,\s*/)

		return (acceptHeader ?? []).filter(requested => requested === mime).length > 0
	}

	// TODO this needs to be able to return just the relevant data for an api call
	// which should not include all of the base model (e.g. title), just the data

	async render(template: string, model: PageModel): Promise<string> {
		if(this.context && this.isJsonRequest) {
			this.context.response.headers.set('Content-Type', 'application/json')

			return JSON.stringify(model.toJson())
		}

		return await this.view.render(template, model)
	}

	async renderError(error: any) {
		let httpError: HttpError

		if(error instanceof HttpError) {
			httpError = error as HttpError
		}
		else {
			httpError = new ServerError()
		}

		//@ts-ignore
		this.context.response.status = httpError.status
			
		if(this.isJsonRequest) {
			this.context?.response.headers.set('Content-Type', 'application/json')

			return JSON.stringify(httpError.toJson())
		}

		return await this.view.render('404', new PageModel({}, httpError))
	}
}
