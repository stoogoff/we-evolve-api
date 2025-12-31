
export interface CouchRecord {
	_id: string;
	_rev: string;
}

export interface Book extends CouchRecord {
	type: string;
	title: string;
	summary: string;
	series: string;
	part: number;
	publish_date: string;
	image:  string;
	urls: Record<string, string>;
	tags: string[];
	content: string;
}

/*
export class Book {
	public title: string;
	public summary: string;
	public content: string;
	public image: string;
	public series: string;
	public part: number;
	public urls: Record<string, string>;

	constructor(private id: string) {}

	get slug(): string {
		return this.id.replace('book:', 'books/')
	}

	static fromJson(json: ExpectedJson): Book {
		const book = new Book(json._id)

		book.title = json.title ?? ''
		book.summary = json.summary ?? ''
		book.content = json.content ?? ''
		book.image = json.image ?? ''
		book.series = json.series ?? ''
		book.part = json.part ?? 0
		book.urls = json.urls ?? {}

		return book
	}
}
*/