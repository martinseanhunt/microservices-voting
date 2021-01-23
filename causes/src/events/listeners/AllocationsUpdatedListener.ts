import { Message } from 'node-nats-streaming'

import {
  Listener,
  AllocationsUpdatedEvent,
  Subjects,
  nats,
} from '@mhunt/voting-common'

import { queueGroupName } from './queueGroupName'
import { Cause } from '../../models/Cause'
import { CauseUpdatedPublisher } from '../publishers/CauseUpdatedPublisher'

export class AllocationsUpdatedListener extends Listener<AllocationsUpdatedEvent> {
  readonly subject = Subjects.AllocationsUpdated
  queueGroupName = queueGroupName

  async onMessage(data: AllocationsUpdatedEvent['data'], msg: Message) {
    // NOTE/TODO: There is a concurrency issue here.
    // What if we have lots of users submitting point allocations at the same time
    // or the causes service goes down for a time? The events would likely not be
    // processed in the correct oder.

    // I think the best way to tackle this problem would be to have this event we're
    // listening for be triggered by a regular job, rather than being triggered by a user
    // allocating some points. That way we know if it gets out of sync we only have to wait
    // a short amount of time before the total point allocations are updated. Need to understand
    // this better before making a decision on how to handle long term. Either that or a rethink of
    // how I'm handling this process entirely.

    console.log('Updating total points allocated to causes')

    // Loop through each cause and update the total value
    let errors: string[] = []
    for (const allocation of data) {
      console.log(`Updating points for cause ${allocation.causeId}`)

      const cause = await Cause.findById(allocation.causeId)
      if (!cause) {
        console.error(
          `Cause: ${allocation.causeId} not found in causes-service database`
        )
        continue
      }

      // If the points haven't changed we don't need to save to the db or emit an event.
      // If we were to go ahead then the version number wouldn't be auto incremented in
      // mongo and so we'd an emit an updted event with the same version which would mess
      // with concurrency checks in other services.
      if (allocation.totalPoints === cause.totalPointsAllocated) {
        console.log(`points for cause ${allocation.causeId} haven't changed`)
        continue
      }

      cause.totalPointsAllocated = allocation.totalPoints

      // NOTE: If we are receiving lots of events simultaneously this save can fail as we're
      // using optimistic concurrency and we're using find rather than our custom method to find
      // the previous version. This happens if the document has already been modified and
      // its version updated in the time between us finding the document and saving the modified version.
      // in this case we don't want to ack and we can let nats retry until it succeeds.
      try {
        await cause.save()
      } catch (e) {
        errors = [...errors, e.message]
        continue
      }

      console.log(`Updated points for cause ${allocation.causeId}`)

      // Emit a cause updated event
      await new CauseUpdatedPublisher(nats.client).publish({
        id: cause.id,
        title: cause.title,
        image: cause.image,
        description: cause.description,
        url: cause.url,
        totalPointsAllocated: cause.totalPointsAllocated,
        version: cause.version,
      })

      // TODO: Should implement better error hanling on the Listener class otherwise an error in
      // one of these listeners will not be caught and the express server will crash.
    }

    //  If there were any concurrency errors, don't ack the message
    if (errors.length) return console.error(errors)

    console.log('Updated total points allocated to causes')
    msg.ack()
  }
}
