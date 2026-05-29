import type { CartService } from '../../cart/server/cart.service';
import type { CatalogStockLevels } from '../../product-catalog/server/catalog-stock-levels';
import type { RetailStoreCatalog } from '../../store/server/retail-store-catalog';
import { OrderController } from './order.controller';
import { InMemoryOrderRepository } from './order.in-memory-repository';
import { createOrderRouter } from './order.routes';
import { NotificationService, OrderService } from './order.service';

export function createOrderModule(
  cartService: CartService,
  storeCatalog: RetailStoreCatalog,
  stockLevels: CatalogStockLevels,
) {
  const repository = new InMemoryOrderRepository();
  const notification = new NotificationService();
  const service = new OrderService(repository, cartService, storeCatalog, stockLevels, notification);
  const controller = new OrderController(service);
  return {
    orderRouter: createOrderRouter(controller),
    orderService: service,
    orderRepository: repository,
  };
}

export { OrderService, NotificationService };
