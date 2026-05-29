export interface IEmailProvider {
  send(message: { to: string; subject: string; html: string }): Promise<void>;
}
