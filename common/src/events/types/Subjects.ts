export enum Subjects {
  UserCreated = 'user:created',
  UserUpdated = 'user:updated',
  CauseCreated = 'cause:created',
  CauseUpdated = 'cause:updated',
  AllocationsUpdated = 'allocations:updated',

  // These channels are for triggering automated Jobs
  UpdateUserPoints = 'user-points:update',
}
