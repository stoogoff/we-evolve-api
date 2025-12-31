import { Repository, Service } from "../../mvc/index.ts";
import { Book } from "./models.ts";

export class BooksService extends Service<Book> {
	constructor(repo: Repository) {
		super(repo, 'book')
	}
}
