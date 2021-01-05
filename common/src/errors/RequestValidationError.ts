import { ValidationError } from 'express-validator'

import { CustomError } from './CustomError'

export class RequestValidationError extends CustomError {
  statusCode = 400

  constructor(private errors: ValidationError[]) {
    super()
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serializeErrors() {
    return this.errors.map((e) => ({
      message: e.msg,
      field: e.param,
    }))
  }
}
