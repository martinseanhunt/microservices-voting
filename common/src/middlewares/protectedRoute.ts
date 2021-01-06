import { Request, Response, NextFunction } from 'express'

import { AuthorizationError } from '../errors/AuthorizationError'

export const protectedRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // if there's no current user on the request then the user isn't signed in
  if (!req.currentUser) throw new AuthorizationError()

  // Otherwise the user is signed in and we can safely call next to allow them access
  // to the requested route.
  // NOTE: We could optionally check the userDb here to make sure that the user is still valid
  // and hasn't been deleted from the db or dissallowed access in some way. That would create a
  // dependency on the users db for all od our services that have protected routes and I'd rather
  // avoid that for such a simple application.
  next()
}
