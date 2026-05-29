import type { Order } from '@pawplace/order-shared';

export interface OrderRepository {
  save(order: Order): Promise<void>;
  findByOrderNumber(orderNumber: string): Promise<Order | null>;
  listQueue(storeCode?: string): Promise<Order[]>;
  listByGuestEmail?(email: string): Promise<Order[]>;
}
