export interface INotificationRepository {
  markSent(referenceId: string, type: string, recipient: string): Promise<void>;
  enqueue(job: { referenceId: string; type: string; attempts: number }): Promise<void>;
}
