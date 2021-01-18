// TODO - saved as dev dep.. Make sure this works in prod
import { Message } from 'node-nats-streaming'

import { Listener, UpdateUserPointsEvent, Subjects } from '@mhunt/voting-common'

import { queueGroupName } from './queueGroupName'
import { User } from '../../models/User'

// TODO: tests

// TODO: Update this function to emit an event for each individual user. and handle adding points
// tothe user document in the auth serve (rename auth service to user service). Then have the user
// service emit a user updated event which this servicce will receive and update the user doc accordingly!

export class UpdateUserPointsListener extends Listener<UpdateUserPointsEvent> {
  readonly subject = Subjects.UpdateUserPoints
  queueGroupName = queueGroupName

  async onMessage(data: UpdateUserPointsEvent['data'], msg: Message) {
    // Again... This is not good. We should be using redis/bull jobs to update
    // each user seperately so we can track / handle any failures individually.
    const users = await User.updateMany(
      {},
      // Incremenent all users points by 1 - just placeholder for more complex functionality
      {
        $inc: {
          points: 1,
          // Version number doesn't automatically increment when using updateMany! Only when using .save()
          version: 1,
        },
      }
    )

    console.log('Updated points for all users')

    // Acknowledge the message on success so NATS knows it can stop sending the event
    msg.ack()
  }
}
