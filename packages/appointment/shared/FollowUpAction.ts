export const FollowUpActionValues = {
  None: 'none',
  ScheduleReturnVisit: 'schedule_return_visit',
  HoldPet: 'hold_pet',
  SendAdoptionPaperwork: 'send_adoption_paperwork',
} as const;

export type FollowUpAction = (typeof FollowUpActionValues)[keyof typeof FollowUpActionValues];
