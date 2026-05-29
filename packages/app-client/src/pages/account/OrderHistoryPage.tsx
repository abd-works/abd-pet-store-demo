import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { OrderHistorySummary } from '@pawplace/customer-account-client';
import { fetchOrderHistory, reorderOrder } from '@pawplace/customer-account-client';
import { fetchOrderReturnStatuses } from '../../../../return/client/return.api';
import { CustomerPage } from '../../components/CustomerPage';
import { AccountSettingsLayout } from '../../components/AccountSettingsNav';

type ReturnStatusMap = Record<string, { eligible: boolean; reason?: string; hasActiveReturn: boolean }>;

type OrderHistoryRow = OrderHistorySummary & {
  placedAt?: string;
  totalFormatted?: string;
  statusLabel?: string;
};

function sortKey(order: OrderHistoryRow): string {
  return order.placedAt ?? order.date ?? '';
}

export function OrderHistoryPage() {
  const [orders, setOrders] = useState<OrderHistoryRow[]>([]);
  const [returnStatuses, setReturnStatuses] = useState<ReturnStatusMap>({});
  const navigate = useNavigate();

  useEffect(() => {
    void fetchOrderHistory().then((rows) => {
      const sorted = [...rows].sort((a, b) => sortKey(b).localeCompare(sortKey(a)));
      setOrders(sorted);
      const orderNumbers = sorted.map((o) => o.orderNumber);
      if (orderNumbers.length > 0) {
        void fetchOrderReturnStatuses(orderNumbers).then(setReturnStatuses).catch(() => {});
      }
    });
  }, []);

  const handleReorder = async (orderNumber: string) => {
    const result = await reorderOrder(orderNumber);
    navigate('/cart', { state: { reorderResult: result } });
  };

  return (
    <CustomerPage title="order history">
      <AccountSettingsLayout>
        {orders.length === 0 ? (
          <section aria-label="order history empty state">
            <p>no orders yet — start shopping</p>
            <Link to="/product-catalog" style={{ display: 'inline-block', marginTop: 12, padding: '10px 16px', background: '#111', color: '#fff', borderRadius: 6, textDecoration: 'none' }}>
              shop supplies
            </Link>
          </section>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {orders.map((order) => {
              const rs = returnStatuses[order.orderNumber];
              const returnEligible = rs?.eligible ?? false;
              const hasActiveReturn = rs?.hasActiveReturn ?? false;
              const ineligibleReason = rs?.reason;

              return (
                <li key={order.orderNumber} style={{ marginBottom: 12, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0 }}><strong>order number:</strong> {order.orderNumber}</p>
                      <p style={{ margin: '4px 0 0' }}><strong>date:</strong> {order.placedAt ?? order.date}</p>
                      <p style={{ margin: '4px 0 0' }}><strong>items:</strong> {order.itemSummary}</p>
                      <p style={{ margin: '4px 0 0' }}><strong>total:</strong> {order.totalFormatted ?? order.total}</p>
                      <p style={{ margin: '4px 0 0' }}><strong>order status:</strong> {order.statusLabel ?? order.orderStatus}</p>

                      {hasActiveReturn && (
                        <span
                          aria-label="return in progress"
                          style={{
                            display: 'inline-block',
                            marginTop: 8,
                            padding: '3px 10px',
                            fontSize: 12,
                            fontWeight: 600,
                            background: '#fef3c7',
                            color: '#92400e',
                            borderRadius: 12,
                          }}
                        >
                          return in progress
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', minWidth: 120 }}>
                      <Link
                        to={`/account/orders/${order.orderNumber}`}
                        style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none' }}
                      >
                        View Detail
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleReorder(order.orderNumber)}
                        style={{ fontSize: 13, padding: '6px 12px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: 4, cursor: 'pointer' }}
                      >
                        Reorder
                      </button>
                      {returnEligible && !hasActiveReturn && (
                        <Link
                          to={`/account/orders/${order.orderNumber}/return`}
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            padding: '6px 14px',
                            background: '#111',
                            color: '#fff',
                            borderRadius: 6,
                            textDecoration: 'none',
                          }}
                        >
                          Return
                        </Link>
                      )}
                      {!returnEligible && ineligibleReason && (
                        <span
                          style={{ fontSize: 12, color: '#9ca3af' }}
                          title={ineligibleReason}
                          aria-label={`Return unavailable: ${ineligibleReason}`}
                        >
                          {ineligibleReason}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </AccountSettingsLayout>
    </CustomerPage>
  );
}
