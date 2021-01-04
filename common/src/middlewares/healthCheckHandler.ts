import { Request, Response } from 'express'

export const healthCheckHandler = (req: Request, res: Response) => {
  return res.status(200).send('I am alive')
}
