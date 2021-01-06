import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface UserPayload {
  id: string
  email: string
}

// Add session and currentUser property on to Request interface
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload
    }
  }
}

// Middleware to verify a JWT being passend and add the user info on to the
// request if it's valid.
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // See if the request has a cookie containng the JWT. If not forward to next middleware
  if (!req.session?.jwt) return next()

  try {
    // check the token is valid and assign UerPayload type to the decoded UerPayload
    const decodedJwt = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload

    // add payload on to request
    req.currentUser = decodedJwt
  } catch (e) {
    // An invalid JWT was provided
    console.error(e)
  }

  next()
}
