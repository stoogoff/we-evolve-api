
import { encodeBase64 } from 'jsr:@std/encoding/base64'
import { Context, Router } from '@oak/oak'
import { Controller, View } from '../../mvc/index.ts'
import { BooksService } from './service.ts'
import { Book } from './models.ts'

export class BooksController extends Controller {
	constructor(private service: BooksService, view: View) {
		super(view)
	}

	registerRoutes(router: Router): void {
		router.get('/books', async (ctx: Context) => {
			this.context = ctx

			ctx.response.body = await this.index()
		})

		router.get('/books/:book', async (ctx: Context) => {
			this.context = ctx
			
			ctx.response.body = await this.book(ctx.params.book)
		})
	}

	async index() {
		const books = await this.service.all()

		return await this.render('books/index', {
			title: 'Books',
			books,
		})
	}

	async book(id: string) {
		const book = await this.service.byId(id)

		return await this.render('books/book', {
			title: book.title,
			book,
		})
	}
}
