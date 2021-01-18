import { Request, Response } from 'express'

import { nats } from '@mhunt/voting-common'

import { UpdateUserPointsPublisher } from '../events/publishers/UserCreatedPublisher'

export const updateUserPoints = async (req: Request, res: Response) => {
  // This service is simply emitting events to trigger other services to run
  // jobs. This feels like not a great setup and I don't really think it's how
  // nats streaming server is intended to be used. Would be better off either
  // Actually doing the computing for the jobs in this service or using a redis/bull queue
  // but I'm just doing it this way to save some time for now.
  await new UpdateUserPointsPublisher(nats.client).publish({})

  res.status(200).send('success')
}
