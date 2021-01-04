// Abstract class which extends Error. Used to create our own error classes which
// can be used across the entire application for consistant errors.

export abstract class CustomError extends Error {
  // using abstract keyword means a subclass must implement this property
  // making this class similar to an interface
  abstract statusCode: number

  constructor() {
    super()
    // Have to do this when extending a standard javascript class.
    Object.setPrototypeOf(this, CustomError.prototype)
  }

  abstract serializeErrors(): {
    message: string
    // Optionally can provide a field param (if we're validating a request)
    field?: string
  }[]
}
