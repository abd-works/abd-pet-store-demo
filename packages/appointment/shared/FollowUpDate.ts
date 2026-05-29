export class FollowUpDate {
  private readonly date: Date;

  constructor(date: Date) {
    this.date = date;
  }

  toDate(): Date {
    return this.date;
  }

  isToday(): boolean {
    const today = new Date();
    return (
      this.date.getFullYear() === today.getFullYear() &&
      this.date.getMonth() === today.getMonth() &&
      this.date.getDate() === today.getDate()
    );
  }
}
