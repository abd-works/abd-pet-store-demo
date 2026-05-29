const DEFAULT_RETURN_WINDOW_DAYS = 60;
const MS_PER_DAY = 86_400_000;

/** << ValueObject >> — configurable time period after delivery within which returns are accepted. */
export class ReturnWindow {
  readonly windowDays: number;

  constructor(params?: { configuredPeriod?: number } | number) {
    if (typeof params === 'number') {
      this.windowDays = params;
    } else if (params && typeof params === 'object' && params.configuredPeriod) {
      this.windowDays = params.configuredPeriod;
    } else {
      this.windowDays = DEFAULT_RETURN_WINDOW_DAYS;
    }
    if (this.windowDays <= 0) throw new Error('return window must be a positive number of days');
  }

  isWithinWindow(deliveryDate: Date, currentDate: Date = new Date()): boolean {
    const elapsed = currentDate.getTime() - deliveryDate.getTime();
    return elapsed <= this.windowDays * MS_PER_DAY;
  }

  daysSinceDelivery(deliveryDate: Date, currentDate: Date = new Date()): number {
    return Math.floor((currentDate.getTime() - deliveryDate.getTime()) / MS_PER_DAY);
  }
}
