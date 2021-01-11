import { Request, Response } from 'express'

import { Cause } from '../models/Cause'

export const getCauses = async (req: Request, res: Response) => {
  const causes = await Cause.find({})

  return res.status(200).send({
    causes,
  })
}
