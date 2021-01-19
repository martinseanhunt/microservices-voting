import { Request, Response } from 'express'

export const currentUserHandler = (req: Request, res: Response) => {
  // send current user payload from JWT. Could us this to look the user up in the DB
  // if we had more interesting information saved etc
  const { currentUser } = req

  return currentUser
    ? res.status(200).send(currentUser)
    : res.status(404).send({})
}
