import { Request, Response, NextFunction } from 'express'

import { AuthorizationError } from '../errors/AuthorizationError'
import { Role } from '../types/Role'

export const adminRoute = (req: Request, res: Response, next: NextFunction) => {
  // if there's no current user on the request then the user isn't signed in
  if (!req.currentUser) throw new AuthorizationError()

  // if the user isn't an admin throw an authentication error
  if (req.currentUser.role !== Role.Admin) throw new AuthorizationError()

  // Otherwise the user is signed in and an admin and we can safely call next to allow them access
  // to the requested route.

  // NOTE: We could optionally check the userDb here to make sure that the user is still and
  // admin rather than just trusting the JWT. This would create a dependancy on the user DB or
  // service though... For now keeping things seperate
  next()
}
