import { Message } from 'node-nats-streaming'
import axios from 'axios'

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
    // This is an instance where it would seeem worth creating a dependancy on the allocations service.
    // We can grab the most up to date allocation data with which to update the cuase here.
    // This avoids any concurrancy issue and it wouldn't cause an issue if the allocations service was down
    // because nats would just retry the events and the user isn't waiting for a succesful resolution to this.

    console.log('Updating total points allocated to causes')
    console.log('getting latest aggregation from allocations service')

    let allocations
    try {
      // TODO: URL in constants file or env var
      allocations = await axios.get(
        'http://allocations-srv:3000/allocations/aggregate-alloctions'
      )
    } catch (e) {
      return console.error(
        `Error getting aggreation from allocations service: ${e.message}`
      )
    }

    if (!allocations.data?.length) {
      console.log('No aggregation data found in allocations service')
      return msg.ack()
    }

    // Loop through each cause and update the total value
    let errors: string[] = []
    for (const allocation of allocations.data) {
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
    }

    //  If there were any concurrency errors, don't ack the message
    if (errors.length) return console.error(errors)

    console.log('Updated total points allocated to causes')
    msg.ack()
  }
}
