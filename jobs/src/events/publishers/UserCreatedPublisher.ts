import {
  Subjects,
  Publisher,
  UpdateUserPointsEvent,
} from '@mhunt/voting-common'

export class UpdateUserPointsPublisher extends Publisher<UpdateUserPointsEvent> {
  // read only so we keep TS happy that we're not going to try and change it later
  readonly subject = Subjects.UpdateUserPoints
}
