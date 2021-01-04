import { Request, Response } from 'express'

import { NotFoundError } from '../errors/NotFoundError'

export const notFoundHandler = (req: Request, res: Response) => {
  throw new NotFoundError()
}
