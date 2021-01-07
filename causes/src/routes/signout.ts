import { Request, Response } from 'express'

export const signout = (req: Request, res: Response) => {
  req.session = null
  return res.status(200).send({ success: true })
}
