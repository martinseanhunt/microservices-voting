import { Request, Response } from 'express'

export const notFoundHandler = (req: Request, res: Response) => {
  // TODO: use custom errors
  throw new Error('Route not found')
}
