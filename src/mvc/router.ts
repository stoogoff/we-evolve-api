
import { Context, Router } from '@oak/oak'

export const router = new Router()

export function route(path: string) {
	return function (method: any, decorator: ClassMethodDecoratorContext) {
		decorator.addInitializer(function() {
			router.get(path, async (context: Context) => {
				this.context = context

				context.response.body = await this[decorator.name]()
			})
		})
	}
}
