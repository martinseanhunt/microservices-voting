import { Subjects } from '../types/Subjects'

export interface AllocationsUpdatedEvent {
  subject: Subjects.AllocationsUpdated
  data: {
    causeId: string
    totalPoints: number
    allocationsToCause: number
  }[]
}
