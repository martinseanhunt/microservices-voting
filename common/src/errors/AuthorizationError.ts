import { CustomError } from './CustomError'

export class AuthorizationError extends CustomError {
  statusCode = 401
  message = '401: Unauthorized'

  constructor() {
    super()
    Object.setPrototypeOf(this, AuthorizationError.prototype)
  }

  serializeErrors() {
    return [{ message: this.message }]
  }
}
