import { UserCreatedEvent, Subjects, Publisher } from '@mhunt/voting-common'

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  // read only so we keep TS happy that we're not going to try and change it later
  readonly subject = Subjects.UserCreated
}
