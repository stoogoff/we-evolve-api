
export class HttpError extends Error {
	constructor(private status: number, message: string) {
		super(message)

		this.name = typeof this
	}
}

export class NotFoundError extends HttpError {
	constructor(message: string | undefined) {
		super(404, message ?? 'Not found')
	}
}

export class BadRequestError extends HttpError {
	constructor(message: string | undefined) {
		super(400, message ?? 'Bad request')
	}
}

export class ServerError extends HttpError {
	constructor(message: string | undefined) {
		super(500, message ?? 'Server error')
	}
}
