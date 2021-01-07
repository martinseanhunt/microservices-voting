import { Request, Response } from 'express'
import { body } from 'express-validator'

import { AuthorizationError } from '@mhunt/voting-common'

import { User } from '../models/User'
import { compare } from '../utils/password'
import { createJwt } from '../utils/createJwt'

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body

  // Check if user exists
  const user = await User.findOne({ email })

  // Authorization error if user not found
  if (!user) throw new AuthorizationError()

  // Check the password hash matches
  const matchedPassword = await compare(password, user.password)

  // Authorization error if wrong password
  if (!matchedPassword) throw new AuthorizationError()

  // Create the JWT and save it to the cookie-session
  req.session = { jwt: createJwt(user) }

  return res.status(200).send(user)
}

export const signinValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').trim().notEmpty().withMessage('Please provide a password'),
]
