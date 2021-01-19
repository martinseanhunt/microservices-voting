import { UserUpdatedEvent, Subjects, Publisher } from '@mhunt/voting-common'

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
  // read only so we keep TS happy that we're not going to try and change it later
  readonly subject = Subjects.UserUpdated
}
