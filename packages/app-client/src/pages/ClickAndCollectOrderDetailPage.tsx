import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { OrderDto } from '@pawplace/order-shared';
import { fetchOrder, markOrderCollected, markOrderPrepared } from '@pawplace/order-client/order.api';
import { StaffPage } from '../components/CustomerPage';

export function ClickAndCollectOrderDetailPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = () => {
    if (!orderNumber) return;
    void fetchOrder(orderNumber).then(setOrder);
  };

  useEffect(reload, [orderNumber]);

  const handlePrepared = async () => {
    if (!orderNumber) return;
    setBusy(true);
    try {
      const updated = await markOrderPrepared(orderNumber);
      setOrder(updated);
    } finally {
      setBusy(false);
    }
  };

  const handleCollected = async () => {
    if (!orderNumber) return;
    setBusy(true);
    try {
      const updated = await markOrderCollected(orderNumber);
      setOrder(updated);
    } finally {
      setBusy(false);
    }
  };

  if (!order) {
    return (
      <StaffPage title="click-and-collect order detail">
        <p>Loading…</p>
      </StaffPage>
    );
  }

  return (
    <StaffPage title="click-and-collect order detail">
      <p><strong>order number:</strong> {order.orderNumber}</p>
      <p><strong>status:</strong> {order.status}</p>
      <p><strong>guest email:</strong> {order.guestEmail}</p>
      <ul>
        {order.items.map((item) => (
          <li key={item.sku}>{item.name} × {item.quantity}</li>
        ))}
      </ul>

      {order.stockWarnings?.map((warning) => (
        <p key={warning.sku} role="alert" style={{ color: '#b00020' }}>
          stock warning: {warning.message} — contact guest email {order.guestEmail}
        </p>
      ))}

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        {order.status === 'confirmed' && (
          <button type="button" onClick={() => void handlePrepared()} disabled={busy}>
            mark prepared
          </button>
        )}
        {order.status === 'ready_for_pickup' && (
          <button type="button" onClick={() => void handleCollected()} disabled={busy}>
            mark collected
          </button>
        )}
      </div>

      <Link to="/admin/click-and-collect" style={{ display: 'inline-block', marginTop: 16 }}>
        back to queue
      </Link>
    </StaffPage>
  );
}
