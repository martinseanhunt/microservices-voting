import { Request, Response, Handler } from 'express'
import { body } from 'express-validator'

import { BadRequestError, nats } from '@mhunt/voting-common'

import { User } from '../models/User'
import { createJwt } from '../utils/createJwt'
import { UserCreatedPublisher } from '../events/publishers/UserCreatedPublisher'

export const signup: Handler = async (req: Request, res: Response) => {
  const { email, password } = req.body

  // Check if user already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) throw new BadRequestError('Email in use')

  // Create the user and add to mongodb
  const user = User.build({ email, password })
  await user.save()

  // Send the event to NATS:
  // NOTE: Interesting consideration around data integrity here and what happens if this publish fails.
  // We would have a DB record for the user but other services won't know about it!

  // In a production environment, a solution to this would be, rather than publishing here, to add to an events
  // collection in the DB which would store all events and their status. They would go in with a status of pending
  // then some other function would be responsible for watching the DB, sending off any unpublished events and
  // marking them as sent. Then we could use a transaction when adding the userr, to the users collection and the event
  // to the events collection at the same time. If one fails, they both fail andwe can throw / notify the user.
  await new UserCreatedPublisher(nats.client).publish({
    id: user.id,
    version: user.version,
    points: user.points,
  })

  // Create the jwt, save to session
  req.session = { jwt: createJwt(user) }

  res.status(201).send(user)
}

export const signupValidation = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .trim()
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters'),
]
