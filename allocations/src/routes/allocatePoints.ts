import { Request, Response } from 'express'
import { body, check } from 'express-validator'

import { BadRequestError, nats } from '@mhunt/voting-common'

import { Cause } from '../models/Cause'
import { User } from '../models/User'
import { Allocation, AllocationDoc } from '../models/Allocation'
import { AllocationsUpdatedPublisher } from '../events/publishers/AllocationsUpdatedPublisher'

// TODO: TEst

export const allocatePoints = async (req: Request, res: Response) => {
  const {
    allocations,
  }: {
    allocations: {
      cause: string
      points: number
    }[]
  } = req.body

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

  // Remove all existing allocations for the user (TODO: For this epoch)
  const existingAllocations = await Allocation.deleteMany({ userId: user.id })
  console.log(
    `Deleted ${existingAllocations.n} existing allocations for user: ${user.id}`
  )

  // Create new allocations for the user (TODO: For this epoch)
  // Create an array of all the new documents
  const newAllocationDocuments = allocations.map((allocation) =>
    Allocation.build({
      userId: user.id,
      causeId: allocation.cause,
      points: allocation.points,
    })
  )

  // Save all the new documents in a batch operation
  // Create returns the wrong type... Should be AllocationDoc[] since we're passing an array.
  // @ts-ignore - TODO: How can I avoid having to use this?
  const newAllocations: AllocationDoc[] = await Allocation.create(
    newAllocationDocuments
  )

  console.log(
    `Created ${newAllocations.length} new allocations for user: ${user.id}`
  )

  // Emit allocations updated event
  await new AllocationsUpdatedPublisher(nats.client).publish({})

  return res.status(201).send(newAllocations)
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
