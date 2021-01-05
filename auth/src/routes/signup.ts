import { Request, Response, Handler } from 'express'
import { body } from 'express-validator'

export const signup: Handler = async (req: Request, res: Response) => {
  res.status(201).send({ success: true })
}

export const signupValidation = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .trim()
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters'),
]
