import { CustomError } from './CustomError'

export class BadRequestError extends CustomError {
  statusCode = 400

  constructor(private applicationMessage: string) {
    super()
    Object.setPrototypeOf(this, BadRequestError.prototype)
  }

  serializeErrors() {
    return [{ message: `Bad Request: ${this.applicationMessage}` }]
  }
}
