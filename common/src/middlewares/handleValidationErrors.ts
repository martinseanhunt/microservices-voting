import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

import { RequestValidationError } from '../errors/RequestValidationError'

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Express validator attatches any validation errors to the request which
  // we can check for here and throw a custom error type which handles the serialization
  // of any validation errors.
  const errors = validationResult(req)
  if (!errors.isEmpty()) throw new RequestValidationError(errors.array())

  next()
}
