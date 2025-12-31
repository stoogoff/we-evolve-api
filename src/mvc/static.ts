
import { Context, Next } from '@oak/oak'

export const staticFiles = (staticPath: string)  => {
	return async (ctx: Context, next: Next) => {
		if(/\.(pdf|zip|txt|css|js|jpg|ico|png|gif|svg|otf|webmanifest)$/.test(ctx.request.url.pathname)) {
			const opts = {
				root: staticPath,
				path: ctx.request.url.pathname,
				maxage: ctx.state.env == 'production' ? 1000 * 60 * 60 * 24 : 1000,
			};

			try {
				await ctx.send(opts)
			}
			catch {
				ctx.response.status = 404
			}
		}
		else {
			await next()
		}
	}
}
