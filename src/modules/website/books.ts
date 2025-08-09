
import { BaseModel } from './utils'

export class BookModel extends BaseModel {
	id: string;
	urls: string;
	series: string;
	part: string;

	constructor(input) {
		super(input)
		this.id = input._id.replace('book:', '')
		this.urls = input.urls
		this.series = input.series
		this.part = input.part
	}

	static fromDb(input) {
		return new BookModel(input)
	}
}
