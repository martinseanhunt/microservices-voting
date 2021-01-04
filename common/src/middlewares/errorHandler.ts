import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO check to see if we're throwing one of our custom error types and
  // serialise it if so..

  // Otherwise handle generic errors
  console.error(err)
  return res.status(500).send({
    errors: [{ message: err.message || 'something unexpected went wrong' }],
  })
}
