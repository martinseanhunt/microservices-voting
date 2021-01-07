import { Request, Response, Handler } from 'express'
import { body } from 'express-validator'

import { BadRequestError } from '@mhunt/voting-common'

import { User } from '../models/User'
import { createJwt } from '../utils/createJwt'

export const signup: Handler = async (req: Request, res: Response) => {
  const { email, password } = req.body

  // Check if user already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) throw new BadRequestError('Email in use')

  // Create the user and add to mongodb
  const user = User.build({ email, password })
  await user.save()

  // Create the jwt, save to session
  req.session = { jwt: createJwt(user) }
  console.log({ jwt: createJwt(user) })

  res.status(201).send(user)
}

export const signupValidation = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .trim()
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters'),
]
