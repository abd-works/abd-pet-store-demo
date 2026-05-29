/**
 * Restores shared order.api queue mocks after every test (ship-to-home harness).
 *
 * Wired from vitest.setup.ts so this afterEach runs after per-test-file cleanup.
 */
import { afterEach, vi } from 'vitest';

export async function restoreSharedOrderApiQueueMocks(): Promise<void> {
  const orderApi = await import('@pawplace/order-client/order.api');
  if (vi.isMockFunction(orderApi.fetchClickAndCollectQueue)) {
    vi.mocked(orderApi.fetchClickAndCollectQueue).mockImplementation(async () => []);
  }
  if (vi.isMockFunction(orderApi.fetchOrderQueue)) {
    vi.mocked(orderApi.fetchOrderQueue).mockImplementation(async () => []);
  }
}

afterEach(async () => {
  await restoreSharedOrderApiQueueMocks();
});
