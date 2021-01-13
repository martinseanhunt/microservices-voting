import { Subjects } from '../types/Subjects'

export interface UserCreatedEvent {
  subject: Subjects.UserCreated
  data: {
    id: string
    version: number
  }
}
