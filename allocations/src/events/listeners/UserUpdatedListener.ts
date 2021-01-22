import { Message } from 'node-nats-streaming'

import { Listener, UserUpdatedEvent, Subjects } from '@mhunt/voting-common'

import { queueGroupName } from './queueGroupName'
import { User } from '../../models/User'

// TODO: tests

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
  readonly subject = Subjects.UserUpdated
  queueGroupName = queueGroupName

  async onMessage(data: UserUpdatedEvent['data'], msg: Message) {
    const { id, version, points } = data

    console.log(`updating user ${id} to version ${version}`)

    // Find the user we're updating - if the version === incoming version - 1
    const user = await User.findPreviousVersion(id, version)

    if (!user)
      return console.log(
        `User ${id} does not exist in allocations service database or the version is not sequential`
      )

    // Update the user - version number will be auto incremented
    user.set({
      id,
      points,
    })

    await user.save()

    console.log(`updated user ${id} to version ${version}`)

    // Acknowledge the message on success so NATS knows it can stop sending the event
    msg.ack()
  }
}
