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
    const {
      id,
      title,
      image,
      description,
      url,
      totalPointsAllocated,
      version,
    } = data

    const cause = await Cause.findPreviousVersion(id, version)
    if (!cause)
      return console.error(
        `Cause: ${id} not found in database or version: ${version} non-sequential`
      )

    cause.set({
      title,
      image,
      description,
      url,
      totalPointsAllocated,
    })

    await cause.save()

    console.log(`Updated cause ${id}`)
    msg.ack()
  }
}
