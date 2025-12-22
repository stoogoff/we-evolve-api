
import { Context } from '@oak/oak'
import { Eta } from '@bgub/eta'
import { PATH } from './config.ts'

console.log(PATH.PAGES)

export const template = new Eta({
	views: `${Deno.cwd()}/${PATH.PAGES}`,
	cache: false,
	defaultExtension: '.ejs',
})

export const templateRenderer = async (ctx: Context) => {
	const file = ctx.request.url.pathname.replace(/^\//, '')

	console.log({ file })

	return await template.render(file || 'index', {
		title: file,
	})
}
