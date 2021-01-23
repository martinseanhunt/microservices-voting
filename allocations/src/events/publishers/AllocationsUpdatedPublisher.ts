import {
  Publisher,
  Subjects,
  AllocationsUpdatedEvent,
} from '@mhunt/voting-common'

export class AllocationsUpdatedPublisher extends Publisher<AllocationsUpdatedEvent> {
  readonly subject = Subjects.AllocationsUpdated
}
