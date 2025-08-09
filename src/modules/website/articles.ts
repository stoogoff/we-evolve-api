
import { ICouchModel } from '../../lib/repository'
import { BaseModel } from './utils'

const PREFIX = 'article'

export class ArticleModel extends BaseModel {
	content: string;
	id: string;

	constructor(input) {
		super(input)
		this.id = input._id.replace(`${PREFIX}:`, '')
		this.content = input.content
		this.path = `/blog/${PREFIX}s/${input._id.replace(PREFIX + ':', '')}`
	}

	static fromDb(input) {
		return new ArticleModel(input)
	}
}
