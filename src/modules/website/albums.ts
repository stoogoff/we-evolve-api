
import { BaseModel } from './utils'

export class AlbumModel extends BaseModel {
	id: string;
	content: string;
	urls: string;
	track_listing: string;

	constructor(input) {
		super(input)

		this.id = input._id.replace('album:', '')
		this.content = input.content
		this.urls = input.urls
		this.track_listing = input.track_listing
		this.tags = input.tags
	}

	static fromDb(input) {
		return new AlbumModel(input)
	}
}
