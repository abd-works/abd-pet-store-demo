import type { Order } from '@pawplace/order-shared';



export class NotificationService {

  sendConfirmationEmail(order: Order): 'sent' | 'queued' | 'failed' {

    console.log(

      `[notification] confirmation email queued for ${order.guestEmail} — order ${order.orderNumber}`,

    );

    return 'queued';

  }



  sendShippingNotification(order: Order): 'sent' | 'queued' | 'failed' {

    console.log(

      `[notification] shipping notification queued for ${order.guestEmail} — order ${order.orderNumber} tracking ${order.trackingNumber?.value ?? 'n/a'}`,

    );

    return 'queued';

  }

}


