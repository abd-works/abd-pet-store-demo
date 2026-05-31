export interface INotificationRepository {
  markSent(referenceId: string, type: string, recipient: string): Promise<void>;
  enqueue(job: { referenceId: string; type: string; attempts: number }): Promise<void>;
}

export class InMemoryNotificationRepository implements INotificationRepository {
  private readonly sent: Array<{ referenceId: string; type: string; recipient: string }> = [];
  private readonly queue: Array<{ referenceId: string; type: string; attempts: number }> = [];

  async markSent(referenceId: string, type: string, recipient: string): Promise<void> {
    this.sent.push({ referenceId, type, recipient });
  }

  async enqueue(job: { referenceId: string; type: string; attempts: number }): Promise<void> {
    this.queue.push(job);
  }

  reset(): void {
    this.sent.length = 0;
    this.queue.length = 0;
  }
}
