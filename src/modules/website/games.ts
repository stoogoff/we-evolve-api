
import { BaseModel } from './utils'

export class GameModel extends BaseModel {
	id: string;
	urls: string;

	constructor(input) {
		super(input)
		this.id = input._id.replace('game:', '')
		this.urls = input.urls
	}

	static fromDb(input) {
		return new GameModel(input)
	}
}