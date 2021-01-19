// TODO - saved as dev dep.. Make sure this works in prod
import { Message } from 'node-nats-streaming'

import { Listener, UserCreatedEvent, Subjects } from '@mhunt/voting-common'

import { queueGroupName } from './queueGroupName'
import { User } from '../../models/User'

// TODO: tests

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  readonly subject = Subjects.UserCreated
  queueGroupName = queueGroupName

  async onMessage(data: UserCreatedEvent['data'], msg: Message) {
    const { id, points } = data

    // Save a copy of the user ID and their initial points value to the Users collection
    const user = User.build({ id, points })
    await user.save()

    console.log('User saved to collection')

    // Acknowledge the message on success so NATS knows it can stop sending the event
    msg.ack()
  }
}
