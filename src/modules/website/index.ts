
import register from '../../lib/register'
import { DB_NAME } from './utils'
import { ArticleModel } from './articles'
import { AlbumModel } from './albums'
import { BookModel } from './books'
import { GameModel } from './games'

export default (fastify, options) => {
	fastify.register(register, {
		database: DB_NAME,
		services: {
			articles: {
				type: 'article',
				slug: 'articles',
				converter: ArticleModel.fromDb,
			},
			albums: {
				type: 'album',
				slug: 'albums',
				converter: AlbumModel.fromDb,
			},
			books: {
				type: 'book',
				slug: 'books',
				converter: BookModel.fromDb,
			},
			games: {
				type: 'game',
				slug: 'games',
				converter: GameModel.fromDb,
			},
		}
	})
}
