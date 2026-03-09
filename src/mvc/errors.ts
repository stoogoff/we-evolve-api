
export class HttpError extends Error {
	constructor(private _status: number, message: string) {
		super(message)

		this.name = this.constructor.name
	}

	get status() {
		return this._status
	}

	toJson() {
		return {
			status: this._status,
			name: this.name,
			message: this.message,
		}
	}
}

// 4xx errors

export class BadRequestError extends HttpError {
	constructor(message: string | undefined = undefined) {
		super(400, message ?? 'Bad request')
	}
}

export class UnauthorisedError extends HttpError {
	constructor(message: string | undefined = undefined) {
		super(401, message ?? 'Unauthenticated')
	}
}

export class ForbiddenError extends HttpError {
	constructor(message: string | undefined = undefined) {
		super(403, message ?? 'Forbidden')
	}
}

export class NotFoundError extends HttpError {
	constructor(message: string | undefined = undefined) {
		super(404, message ?? 'Not found')
	}
}

export class ConflictError extends HttpError {
	constructor(message: string | undefined = undefined) {
		super(409, message ?? 'Conflict')
	}
}

// 5xx errors

export class ServerError extends HttpError {
	constructor(message: string | undefined = undefined) {
		super(500, message ?? 'Server error')
	}
}
