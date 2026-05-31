import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CustomerPage } from '../../components/CustomerPage';
import { fetchReturnsForOrder, fetchRefundStatus } from '../../../../return/client/return.api';
import { fetchOrderDetail } from '../../../../customer-account/client/account.api';
import type { ReturnDto, RefundDto } from '../../../../return/shared/return.schema';
import type { ReturnStatus } from '../../../../return/shared/return.schema';
import { returnStatusValues } from '../../../../return/shared/return.schema';
import type { OrderDto } from '../../../order/shared';

const statusLabels: Record<ReturnStatus, string> = {
  initiated: 'Initiated',
  label_generated: 'Label Generated',
  shipped_back: 'Shipped Back',
  received: 'Received',
  inspected: 'Inspected',
  refund_processing: 'Refund Processing',
  completed: 'Completed',
};

function ReturnStatusTimeline({ currentStatus }: { currentStatus: ReturnStatus }) {
  const currentIndex = returnStatusValues.indexOf(currentStatus);
  return (
    <ol
      aria-label="return status timeline"
      role="listbox"
      style={{ listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', gap: 4 }}
    >
      {returnStatusValues.map((status, idx) => {
        const isCurrent = idx === currentIndex;
        const isPast = idx < currentIndex;
        return (
          <li
            key={status}
            role="option"
            aria-selected={isCurrent}
            style={{
              padding: '6px 12px',
              borderRadius: 16,
              fontSize: 12,
              fontWeight: isCurrent ? 700 : 400,
              background: isCurrent ? '#111' : isPast ? '#d1fae5' : '#f3f4f6',
              color: isCurrent ? '#fff' : isPast ? '#065f46' : '#6b7280',
            }}
          >
            {statusLabels[status]}
          </li>
        );
      })}
    </ol>
  );
}

function RefundStatusSection({ refund }: { refund: RefundDto }) {
  return (
    <section aria-label="refund status" style={{ marginTop: 16, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
      <h3 style={{ fontSize: 16, marginBottom: 8 }}>Refund Status</h3>
      {refund.refundStatus === 'processing' && (
        <div>
          <p style={{ margin: 0 }}>
            <strong>refund status:</strong>{' '}
            <span style={{ color: '#d97706' }}>processing</span>
          </p>
          <p style={{ margin: '4px 0 0' }}><strong>refund amount:</strong> {refund.amountFormatted}</p>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: '#6b7280' }}>
            Refunds typically take 5–10 business days depending on your payment provider.
          </p>
        </div>
      )}
      {refund.refundStatus === 'completed' && (
        <div>
          <p style={{ margin: 0 }}>
            <strong>refund status:</strong>{' '}
            <span style={{ color: '#16a34a' }}>completed</span>
          </p>
          <p style={{ margin: '4px 0 0' }}><strong>refunded amount:</strong> {refund.amountFormatted}</p>
          {refund.maskedPaymentMethod && (
            <p style={{ margin: '4px 0 0' }}>
              <strong>credit returned to:</strong> {refund.maskedPaymentMethod}
            </p>
          )}
          <p style={{ margin: '8px 0 0', fontSize: 13, color: '#6b7280' }}>
            Refund completed notification sent.
          </p>
        </div>
      )}
      {refund.refundStatus === 'requires_review' && (
        <div role="alert">
          <p style={{ margin: 0 }}>
            <strong>refund status:</strong>{' '}
            <span style={{ color: '#dc2626' }}>requires review</span>
          </p>
          <p style={{ margin: '8px 0 0', color: '#dc2626' }}>
            Please contact support for assistance with your refund.
          </p>
        </div>
      )}
    </section>
  );
}

export function ReturnTrackingPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [returns, setReturns] = useState<ReturnDto[]>([]);
  const [refund, setRefund] = useState<RefundDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) return;
    Promise.all([
      fetchOrderDetail(orderNumber),
      fetchReturnsForOrder(orderNumber),
      fetchRefundStatus(orderNumber),
    ]).then(([orderData, returnsData, refundData]) => {
      setOrder(orderData);
      setReturns(returnsData);
      setRefund(refundData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [orderNumber]);

  if (loading) return <CustomerPage title="order detail"><p>Loading…</p></CustomerPage>;
  if (!order) return <CustomerPage title="order detail"><p>Order not found.</p></CustomerPage>;

  const activeReturn = returns[0];
  const hasRemainingEligible = order.items.some(
    (item) => !returns.some((r) => r.returnedItems.some((ri) => ri.sku === item.sku)),
  );

  return (
    <CustomerPage title="order detail — return and refund tracking">
      <nav aria-label="breadcrumb" style={{ fontSize: 14, marginBottom: 16 }}>
        <a href="/account/orders">Account</a>{' › '}
        <a href="/account/orders">Orders</a>{' › '}
        <span aria-current="page">Order #{orderNumber}</span>
      </nav>

      <section aria-label="order summary" style={{ marginBottom: 16, padding: 12, background: '#f9fafb', borderRadius: 6 }}>
        <p style={{ margin: 0 }}><strong>order number:</strong> {order.orderNumber}</p>
        <p style={{ margin: '4px 0 0' }}><strong>order status:</strong> {order.statusLabel}</p>
        {order.maskedPaymentMethod && (
          <p style={{ margin: '4px 0 0' }}><strong>payment method:</strong> {order.maskedPaymentMethod}</p>
        )}
      </section>

      {activeReturn && (
        <>
          <section aria-label="return status" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, marginBottom: 8 }}>Return Status</h3>
            <ReturnStatusTimeline currentStatus={activeReturn.returnStatus} />
          </section>

          <section aria-label="returned items detail" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, marginBottom: 8 }}>Returned Items</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {activeReturn.returnedItems.map((item) => (
                <li key={item.sku} style={{ padding: '6px 12px', marginBottom: 4, background: '#f9fafb', borderRadius: 4, fontSize: 14 }}>
                  {item.name} × {item.quantity}
                  <span style={{ marginLeft: 12, color: '#6b7280', fontSize: 12 }}>
                    reason: {activeReturn.returnReason.replace(/_/g, ' ')} · condition: {activeReturn.itemCondition}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {refund && <RefundStatusSection refund={refund} />}

      {hasRemainingEligible && (
        <section aria-label="remaining eligible items" style={{ marginTop: 16, padding: 12, background: '#eff6ff', borderRadius: 6 }}>
          <p style={{ margin: 0, fontSize: 13 }}>
            Remaining eligible items can still be returned separately.
          </p>
          <Link
            to={`/account/orders/${orderNumber}/return`}
            style={{ display: 'inline-block', marginTop: 8, padding: '8px 14px', background: '#111', color: '#fff', borderRadius: 6, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}
          >
            Return More Items
          </Link>
        </section>
      )}

      <div style={{ marginTop: 20 }}>
        <Link to="/account/orders" style={{ color: '#374151', fontSize: 14 }}>
          ← Back to Order History
        </Link>
      </div>
    </CustomerPage>
  );
}
