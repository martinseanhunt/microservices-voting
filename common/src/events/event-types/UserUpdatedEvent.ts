import { Subjects } from '../types/Subjects'

export interface UserUpdatedEvent {
  subject: Subjects.UserUpdated
  data: {
    id: string
    version: number
    points: number
  }
}
