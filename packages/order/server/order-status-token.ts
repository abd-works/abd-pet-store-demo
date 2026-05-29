import { createHmac, timingSafeEqual } from 'node:crypto';



const DEFAULT_SECRET = 'pawplace-order-status-dev-secret';



function secret(): string {

  return process.env.ORDER_STATUS_TOKEN_SECRET ?? DEFAULT_SECRET;

}



export class OrderStatusToken {

  static sign(orderNumber: string, guestEmail: string): string {

    const payload = `${orderNumber}:${guestEmail}`;

    return createHmac('sha256', secret()).update(payload).digest('hex');

  }



  static verify(orderNumber: string, guestEmail: string, token: string): boolean {

    const expected = this.sign(orderNumber, guestEmail);

    if (expected.length !== token.length) return false;

    return timingSafeEqual(Buffer.from(expected), Buffer.from(token));

  }



  static signUrl(orderNumber: string, guestEmail: string): string {

    return `/orders/status/${encodeURIComponent(orderNumber)}?token=${this.sign(orderNumber, guestEmail)}`;

  }

}


