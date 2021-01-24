import { Request, Response } from 'express'

import { Allocation } from '../models/Allocation'

export const aggregateAllocations = async (req: Request, res: Response) => {
  // TODO: only count allocations for the current epoch
  const totalAllocations = await Allocation.aggregate([
    // Sum up the points for every cause.
    {
      $group: {
        _id: '$causeId',
        totalPoints: { $sum: '$points' },
        allocationsToCause: { $sum: 1 },
      },
    },
  ])

  const causesWithAllocations = totalAllocations.map(({ _id, ...rest }) => ({
    // Rename _id to causeId for clarity
    causeId: _id,
    ...rest,
  }))

  return res.status(200).send(causesWithAllocations)
}
