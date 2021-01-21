import { Publisher, CauseUpdatedEvent, Subjects } from '@mhunt/voting-common'

export class CauseUpdatedPublisher extends Publisher<CauseUpdatedEvent> {
  readonly subject = Subjects.CauseUpdated
}
