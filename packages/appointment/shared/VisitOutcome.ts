export const VisitOutcomeValues = {
  Adopted: 'adopted',
  InterestedReturning: 'interested_returning',
  NotAFit: 'not_a_fit',
  BrowsingOnly: 'browsing_only',
} as const;

export type VisitOutcome = (typeof VisitOutcomeValues)[keyof typeof VisitOutcomeValues];
