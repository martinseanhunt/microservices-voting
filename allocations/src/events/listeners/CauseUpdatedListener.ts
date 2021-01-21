// TODO - saved as dev dep.. Make sure this works in prod
import { Message } from 'node-nats-streaming'

import { Listener, CauseUpdatedEvent, Subjects } from '@mhunt/voting-common'

import { queueGroupName } from './queueGroupName'
import { Cause } from '../../models/Cause'

// TODO: tests

export class CauseUpdatedListener extends Listener<CauseUpdatedEvent> {
  readonly subject = Subjects.CauseUpdated
  queueGroupName = queueGroupName

  async onMessage(data: CauseUpdatedEvent['data'], msg: Message) {
    const { id, title, image, description, url, totalPointsAllocated } = data

    console.log('Cause has been udpated, need to implemtn update functionality')

    // Acknowledge the message on success so NATS knows it can stop sending the event
    // msg.ack()
  }
}
