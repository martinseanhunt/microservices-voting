// TODO - saved as dev dep.. Make sure this works in prod
import { Message } from 'node-nats-streaming'

import { Listener, CauseCreatedEvent, Subjects } from '@mhunt/voting-common'

import { queueGroupName } from './queueGroupName'
import { Cause } from '../../models/Cause'

// TODO: tests

export class CauseCreatedListener extends Listener<CauseCreatedEvent> {
  readonly subject = Subjects.CauseCreated
  queueGroupName = queueGroupName

  async onMessage(data: CauseCreatedEvent['data'], msg: Message) {
    const { id, title, image, description, url, totalPointsAllocated } = data

    // Save a copy of the user ID and their initial points value to the Users collection
    const cause = Cause.build({
      id,
      title,
      image,
      description,
      url,
      totalPointsAllocated,
    })
    await cause.save()

    console.log('Cause saved to alloations db')

    // Acknowledge the message on success so NATS knows it can stop sending the event
    msg.ack()
  }
}
