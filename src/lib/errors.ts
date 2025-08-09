
import { FastifyReply } from 'fastify'

export class HttpError extends Error {
	#status = 500
	#error = ''

	constructor(error: string, message: string, status: number = 500) {
		super(message)

		this.#error = error
		this.#status = status
	}

	get error() {
		return this.#error
	}

	get status() {
		return this.#status
	}

	toJson() {
		return {
			error: this.error,
			message: this.message,
			statusCode: this.status,
		}
	}

	response(response: FastifyReply) {
		return response.code(this.status).send(this.toJson())
	}

	static ToError(error: unknown): HttpError {
		if(error instanceof HttpError) {
			return error
		}

		const errorMessage = error instanceof Error ? error.message : String(error)
		
		return new ServerError(errorMessage)
	}
}

export class ServerError extends HttpError {
	constructor(message: string) {
		super('Internal Server Error', message, 500)
	}
}

export class NotFoundError extends HttpError {
	constructor(message: string) {
		super('Not Found', message, 404)
	}
}

export class BadRequestError extends HttpError {
	constructor(message: string) {
		super('Bad Request', message, 404)
	}
}

export class UnprocessableContent extends HttpError {
	constructor(message: string) {
		super('Unprocessable Content', message, 424)
	}
}
