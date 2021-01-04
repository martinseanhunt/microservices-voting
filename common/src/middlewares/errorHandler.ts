import { Request, Response, NextFunction } from 'express'

import { CustomError } from '../errors/CustomError'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.message || err)

  // Check if the error is one of our custom errors. If so, serialize it.
  if (err instanceof CustomError)
    return res.status(err.statusCode).send({ errors: err.serializeErrors() })

  // Otherwise handle generic errors
  return res.status(500).send({
    errors: [{ message: err.message || 'something unexpected went wrong' }],
  })
}
