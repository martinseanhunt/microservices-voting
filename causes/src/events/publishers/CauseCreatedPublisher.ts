import { Publisher, CauseCreatedEvent, Subjects } from '@mhunt/voting-common'

export class CauseCreatedPublisher extends Publisher<CauseCreatedEvent> {
  readonly subject = Subjects.CauseCreated
}
