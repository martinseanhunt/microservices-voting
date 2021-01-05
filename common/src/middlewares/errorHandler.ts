import { Request, Response, NextFunction } from 'express'

import { CustomError } from '../errors/CustomError'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if the error is one of our custom errors. If so, serialize it.
  if (err instanceof CustomError) {
    const errors = err.serializeErrors()
    errors.forEach((e) => console.error(e.message))

    return res.status(err.statusCode).send({ errors })
  }

  // Otherwise handle generic errors
  console.error(err.message || err)
  return res.status(500).send({
    errors: [{ message: err.message || 'something unexpected went wrong' }],
  })
}
