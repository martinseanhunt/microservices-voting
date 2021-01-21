import { Request, Response } from 'express'
import { body, check } from 'express-validator'

import { BadRequestError } from '@mhunt/voting-common'

import { Cause } from '../models/Cause'
import { User } from '../models/User'

export const allocatePoints = async (req: Request, res: Response) => {
  const allocations: [
    {
      cause: string
      points: number
    }
  ] = req.body.allocations

  const user = await User.findById(req.currentUser?.id)
  if (!user) throw new BadRequestError('user not found in allocations db')

  // TODO: Save the current epoch to the allocation so we maintian a history of allocations
  // for the epoch at the point the epoch ends.

  // Check to see if the amount of points allocated total is less than or equal to available allocatePoints
  const totalPointsAllocated = allocations.reduce(
    (total, allocation) => total + allocation.points,
    0
  )

  if (totalPointsAllocated > user.points)
    throw new BadRequestError(
      "You don't have enough points to make this allocation"
    )

  // Check to see that the given causes exist
  for (const allocation of allocations) {
    const { cause } = allocation
    const exists = await Cause.exists({ _id: cause })
    if (!exists)
      throw new BadRequestError(
        `Cause: ${cause} does not exist in allocations db`
      )
  }

  // Remove all existing allocations for the user (TODO: For this epch)

  // Create new allocations for the user (TODO: For this epoch)

  console.log(user.points)

  // TODO: Emit allocations updated event

  // TODO: Rceeive cause updated event

  return res.status(201).send(allocations)
}

export const allocatePointsValidation = [
  body('allocations')
    .isArray({ min: 1 })
    .withMessage('Please provide some allocations'),
  check('allocations.*.cause')
    .isMongoId()
    .withMessage('Please provide a valid cause ID'),
  check('allocations.*.points')
    .isInt()
    .withMessage('Please provide a number of points to allocate')
    .toInt(),
]
