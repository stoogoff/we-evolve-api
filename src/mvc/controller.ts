
import { Context } from '@oak/oak'
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

	// TODO this needs to get the context
	// and use the request header to return a correct response type
	// if request.headers['Accepts'] === 'application/json' // OR 'application/xml'
	// it should return the model as JSON (possibly with a default wrapper)
	// should possibly work for CSV and XML as well

	async render(template: string, model: Record<string, unknown>): Promise<string> {
		if(this.context && this.isJsonRequest) {
			this.context.response.headers.set('Content-Type', 'application/json')

			return JSON.stringify(model)
		}

		return await this.view.render(template, model)
	}
}
