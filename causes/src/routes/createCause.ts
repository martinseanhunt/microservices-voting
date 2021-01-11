import { Request, Response } from 'express'
import { body } from 'express-validator'

import { Cause } from '../models/Cause'

export const createCause = async (req: Request, res: Response) => {
  const { title, image, url, description } = req.body

  const cause = Cause.build({
    title,
    image,
    url,
    description,
  })

  await cause.save()

  return res.status(201).send(cause)
}

export const createCauseValidation = [
  body('title').notEmpty().withMessage('Please provide a title'),
  body('image').notEmpty().isURL().withMessage('Please provide an image url'),
  body('url').notEmpty().isURL().withMessage('Please provide a url'),
  body('description').notEmpty().withMessage('Please provide a description'),
]
