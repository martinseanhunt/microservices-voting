// TODO - saved as dev dep.. Make sure this works in prod
import { Message } from 'node-nats-streaming'

import {
  Listener,
  UpdateUserPointsEvent,
  Subjects,
  nats,
} from '@mhunt/voting-common'

import { queueGroupName } from './queueGroupName'
import { User } from '../../models/User'
import { UserUpdatedPublisher } from '../publishers/UserUpdatedPublisher'

// Ideally this points logic should be seperated out in to a points service but I'd like to keep
// the number of services minimal for this project.

// TODO: tests

export class UpdateUserPointsListener extends Listener<UpdateUserPointsEvent> {
  readonly subject = Subjects.UpdateUserPoints
  queueGroupName = queueGroupName

  async onMessage(data: UpdateUserPointsEvent['data'], msg: Message) {
    // As explained in other comments in jobs service this is not ideal. We should be using redis/bull jobs to update
    // each user seperately so we can track / handle any failures & retries etc individually.

    // Get all users - NOTE/TODO: this won't scale
    const users = await User.find({})

    // For each user, increment the points by one and emit a user updated event
    for (const user of users) {
      user.points = user.points + 1
      await user.save()

      await new UserUpdatedPublisher(nats.client).publish({
        id: user.id,
        points: user.points,
        version: user.version,
      })
    }

    console.log('Updated points for all users')

    // Acknowledge the message on success so NATS knows it can stop sending the event
    msg.ack()
  }
}
