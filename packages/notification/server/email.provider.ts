export interface IEmailProvider {
  send(message: { to: string; subject: string; html: string }): Promise<void>;
}

/** Test/dev email provider — records sends in memory. */
export class ConsoleEmailProvider implements IEmailProvider {
  readonly sent: Array<{ to: string; subject: string; html: string }> = [];

  async send(message: { to: string; subject: string; html: string }): Promise<void> {
    this.sent.push(message);
  }

  reset(): void {
    this.sent.length = 0;
  }
}
