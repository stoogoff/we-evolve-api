
import { Context, Router } from '@oak/oak'
import { View } from './view.ts'

export abstract class Controller {
	protected context: Context;

	constructor(private view: View) {}

	abstract registerRoutes(router: Router): void

	get isJsonRequest() {
		return this.requestHasMimeType('application/json')
	}

	get isXmlRequest() {
		return this.requestHasMimeType('application/xml')
	}

	requestHasMimeType(mime: string): boolean {
		if(!this.context) return false

		const acceptHeader = this.context.request.headers.get('Accept').split(/\s*,\s*/)

		return acceptHeader.filter(requested => requested === mime).length > 0
	}

	// TODO this needs to get the context
	// and use the request header to return a correct response type
	// if request.headers['Accepts'] === 'application/json' // OR 'application/json'
	// it should return the model as JSON (possibly with a default wrapper)
	// should possibly work for CSV and XML as well

	async render(template: string, model: Record<string, unknown>): Promise<string> {
		if(this.isJsonRequest) {
			this.context.response.headers.set('Content-Type', 'application/json')

			return JSON.stringify(model)
		}

		return await this.view.render(template, model)
	}
}
