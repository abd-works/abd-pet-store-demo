import { httpJson } from '../../shared/http-client';
import type { InventoryDashboardDto } from './inventoryDashboardUtils';

export async function fetchInventoryDashboard(): Promise<InventoryDashboardDto> {
  return httpJson<InventoryDashboardDto>('/api/admin/inventory');
}
