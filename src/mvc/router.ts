
import { Context, Router } from '@oak/oak'
import { Controller } from './controller.ts'

export const router = new Router()

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export function route(path: string, method: HttpMethod = 'get') {
	return function (_func: any, decorator: ClassMethodDecoratorContext) {
		decorator.addInitializer(function() {
			router[method](path, async (context: Context) => {
				(this as Controller).initialise(context)

				//@ts-ignore
				context.response.body = await this[decorator.name]()
			})
		})
	}
}
