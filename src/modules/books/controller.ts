
import { encodeBase64 } from 'jsr:@std/encoding/base64'
import { Context, Router } from '@oak/oak'
import { route, Controller, PageModel, View } from '../../mvc/index.ts'
import { BooksService } from './service.ts'

export class BooksController extends Controller {
	constructor(private service: BooksService, view: View) {
		super(view)
	}

	@route('/books')
	async index() {
		const books = await this.service.all()

		return await this.render('books/index', new PageModel({
				title: 'Books | ',
			},
			books,
		))
	}

	@route('/books/:book')
	async book() {
		try {
			//@ts-ignore
			const book = await this.service.byId(this.context?.params.book)

			return await this.render('books/book', new PageModel({
					title: book.title + ' | ',
				},
				book,
			))
		}
		catch(error) {
			return await this.renderError(error)
		}
	}
}
