import type { OrderDto } from '@pawplace/order-shared';
import type { OrderService } from '../../order/server/order.service';
import type { OrderRepository } from '../../order/server/order.repository';
import { toOrderDto } from '../../order/server/order.mapper';
import type { CartService } from '../../cart/server/cart.service';
import type { CatalogProductBrowse } from '../../product-catalog/server/catalog-product-browse';
import type { CatalogStockLevels } from '../../product-catalog/server/catalog-stock-levels';
import type { CustomerAccountRepository } from './customer-account.repository';
import type { AccountDashboardDto } from '@pawplace/customer-account-shared';

export interface OrderHistorySummaryDto {
  orderNumber: string;
  date: string;
  itemSummary: string;
  total: string;
  orderStatus: string;
}

export interface ReorderResultDto {
  addedSkus: string[];
  skippedSkus: string[];
  stockWarnings: string[];
}

export class ProfileService {
  constructor(
    private readonly accounts: CustomerAccountRepository,
    private readonly orderRepository: OrderRepository,
    private readonly orderService: OrderService,
    private readonly cartService: CartService,
    private readonly catalog: CatalogProductBrowse,
    private readonly stockLevels: CatalogStockLevels,
  ) {}

  async getDashboard(accountId: string): Promise<AccountDashboardDto> {
    const account = await this.accounts.findById(accountId);
    if (!account) throw new Error('Account not found');
    return {
      email: account.email,
      accountVerificationStatus: account.accountVerificationStatus,
      firstName: account.firstName,
      lastName: account.lastName,
    };
  }

  async listOrderHistory(accountId: string): Promise<OrderHistorySummaryDto[]> {
    const account = await this.accounts.findById(accountId);
    if (!account) return [];
    const orders = this.orderRepository.listByGuestEmail
      ? await this.orderRepository.listByGuestEmail(account.email)
      : [];
    return orders.map((order) => {
      const dto = toOrderDto(order);
      return {
        orderNumber: dto.orderNumber,
        date: new Date(order.createdAt).toLocaleDateString('en-GB'),
        itemSummary: dto.items.map((i) => i.name).join(', '),
        total: dto.subtotalFormatted,
        orderStatus: dto.statusLabel,
      };
    });
  }

  async getOrderDetail(accountId: string, orderNumber: string): Promise<OrderDto | null> {
    const account = await this.accounts.findById(accountId);
    if (!account) return null;
    const order = await this.orderService.getOrder(orderNumber);
    if (order.guestEmail.toLowerCase() !== account.email.toLowerCase()) return null;
    return order;
  }

  async reorder(accountId: string, orderNumber: string, sessionId: string): Promise<ReorderResultDto> {
    const detail = await this.getOrderDetail(accountId, orderNumber);
    if (!detail) throw new Error('Order not found');

    const addedSkus: string[] = [];
    const skippedSkus: string[] = [];
    const stockWarnings: string[] = [];

    for (const item of detail.items) {
      const product = this.catalog.getProductBySku(item.sku);
      if (!product) {
        skippedSkus.push(item.sku);
        continue;
      }
      try {
        await this.cartService.addItem(sessionId, item.sku, item.quantity);
        addedSkus.push(item.sku);
        const maxStock = this.stockLevels.getMaxAvailableToSell(item.sku);
        if (maxStock < item.quantity) {
          stockWarnings.push(`${item.name} — stock availability warning`);
        }
      } catch {
        stockWarnings.push(`${item.name} — stock availability warning`);
        addedSkus.push(item.sku);
      }
    }

    return { addedSkus, skippedSkus, stockWarnings };
  }
}
