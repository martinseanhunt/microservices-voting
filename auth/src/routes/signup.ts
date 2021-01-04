import { Request, Response, Handler } from 'express'

export const signup: Handler = async (req: Request, res: Response) => {
  res.status(201).send({ success: true })
}
