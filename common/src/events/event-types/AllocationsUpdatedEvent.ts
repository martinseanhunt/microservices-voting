import { Subjects } from '../types/Subjects'

export interface AllocationsUpdatedEvent {
  subject: Subjects.AllocationsUpdated
  // Empty data object because this event triggers a cross ervice http request/
  // to get reliably current data
  data: {}
}
