
export const DB_NAME = 'stoogoff'

// get the public id of the item, without the type: prefix
export const id = input => input.substring(input.lastIndexOf(':') + 1)

export class BaseModel {
	title: string;
	summary: string;
	category: string;
	tags: string;
	publish_date: Date;
	image: string;
	path: string;

	constructor({
		_id,
		_rev,
		title,
		summary,
		category,
		tags,
		publish_date,
		image,
		type,
	}) {
		this.title = title
		this.summary = summary
		this.category = category
		this.tags = tags
		this.publish_date = new Date(publish_date)
		this.image = image
		this.path = `/${type.toLowerCase()}s/${id(_id)}`
	}
}
