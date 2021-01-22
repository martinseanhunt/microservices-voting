import { Request, Response } from 'express'
import { body, check } from 'express-validator'

import { BadRequestError } from '@mhunt/voting-common'

import { Cause } from '../models/Cause'
import { User } from '../models/User'
import { Allocation } from '../models/Allocation'

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
  const newAllocations = await Allocation.create(newAllocationDocuments)

  // Create returns the wrong type above... Should be AllocationDoc[] since we're passing an array.
  console.log(
    // @ts-ignore
    `Created ${newAllocations.length} new allocations for user: ${user.id}`
  )

  // TODO: Should we do this in a redis/bull job sp we can do this asyncronously and handle failures / retries?
  // Is this a big enough job to be inpactful to the user waiting on it?
  const totalAllocations = await aggregateTotalAllocations()

  // TODO: Emit allocations updated event
  console.log(totalAllocations)

  // TODO: Create a cuase updated listener to handle the update that will be received in return
  // from emitting the event above

  return res.status(201).send(newAllocations)
}

const aggregateTotalAllocations = async (): Promise<
  {
    id: string
    totalPoints: number
    allocationsToCause: number
  }[]
> => {
  const totalAllcations = await Allocation.aggregate([
    {
      $group: {
        _id: '$causeId',
        totalPoints: { $sum: '$points' },
        allocationsToCause: { $sum: 1 },
      },
    },
  ])

  return totalAllcations
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
