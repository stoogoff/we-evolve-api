import { Repository, Service } from "../../mvc/index.ts";
import { Book, ExpectedJson } from "./models.ts";

export class BooksService extends Service<Book, ExpectedJson> {
	constructor(repo: Repository) {
		super(repo, 'book', Book.fromJson)
	}
}
