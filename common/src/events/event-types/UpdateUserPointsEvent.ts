import { Subjects } from '../types/Subjects'

// Sending an empty event which just triggers a job on another service.
// Really should be using something like redis/bull for this but this works
// for now and I'm trying to save some time!
export interface UpdateUserPointsEvent {
  subject: Subjects.UpdateUserPoints
  data: {}
}
