import { Request, Response } from 'express'
import { body } from 'express-validator'

import { nats } from '@mhunt/voting-common'

import { Cause } from '../models/Cause'
import { CauseCreatedPublisher } from '../events/publishers/CauseCreatedPublisher'

export const createCause = async (req: Request, res: Response) => {
  const { title, image, url, description } = req.body

  const cause = Cause.build({
    title,
    image,
    url,
    description,
  })

  await cause.save()

  await new CauseCreatedPublisher(nats.client).publish({
    id: cause.id,
    description: cause.description,
    url: cause.url,
    image: cause.image,
    title: cause.title,
    totalPointsAllocated: cause.totalPointsAllocated,
    version: cause.version,
  })

  // TODO: listen for allocations updated event and emit cause updated in return

  return res.status(201).send(cause)
}

export const createCauseValidation = [
  body('title').notEmpty().withMessage('Please provide a title'),
  body('image').notEmpty().isURL().withMessage('Please provide an image url'),
  body('url').notEmpty().isURL().withMessage('Please provide a url'),
  body('description').notEmpty().withMessage('Please provide a description'),
]
