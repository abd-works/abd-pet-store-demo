import type { Order } from '@pawplace/order-shared';

import type { OrderRepository } from './order.repository';



export class InMemoryOrderRepository implements OrderRepository {

  private readonly orders = new Map<string, Order>();



  async save(order: Order): Promise<void> {

    this.orders.set(order.orderNumber, order);

  }



  async findByOrderNumber(orderNumber: string): Promise<Order | null> {

    return this.orders.get(orderNumber) ?? null;

  }



  async listByGuestEmail(email: string): Promise<Order[]> {
    const normalized = email.toLowerCase();
    return [...this.orders.values()]
      .filter((order) => order.guestEmail.toLowerCase() === normalized)
      .sort((left, right) => right.createdAt - left.createdAt);
  }

  async listQueue(storeCode?: string): Promise<Order[]> {

    const queue = [...this.orders.values()].filter((order) => {

      if (order.deliveryOption.type === 'click_and_collect') {

        return order.status === 'confirmed' || order.status === 'ready_for_pickup';

      }

      return order.status === 'confirmed' || order.status === 'fulfilled';

    });



    const filtered = storeCode

      ? queue.filter((order) => {

          if (order.deliveryOption.type === 'standard_delivery') return true;

          return order.pickupStore?.storeCode === storeCode;

        })

      : queue;



    return filtered.sort((left, right) => left.createdAt - right.createdAt);

  }

}


