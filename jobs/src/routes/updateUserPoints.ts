import { Request, Response } from 'express'

export const updateUserPoints = async (req: Request, res: Response) => {
  console.log('udpating points')

  res.status(200).send('success')
}
