import { CustomError } from './CustomError'

// TODO: Add ability to customise the not found error for throwing when objects not found etc

export class NotFoundError extends CustomError {
  statusCode = 404

  constructor(private applicationMessage: string = 'Not found') {
    super()
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeErrors() {
    return [{ message: `404: ${this.applicationMessage}` }]
  }
}
