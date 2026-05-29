import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { OrderDto } from '@pawplace/order-shared';
import { fetchClickAndCollectQueue } from '@pawplace/order-client/order.api';
import { fetchStores, type StoreResponse } from '@pawplace/store-client/store.api';
import { StaffHeader } from '../components/CustomerPage';

export function ClickAndCollectQueuePage() {
  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [storeCode, setStoreCode] = useState('');
  const [orders, setOrders] = useState<OrderDto[]>([]);

  useEffect(() => {
    fetchStores().then((rows) => {
      setStores(rows);
      if (rows[0]) setStoreCode(rows[0].storeCode);
    });
  }, []);

  useEffect(() => {
    if (!storeCode) return;
    fetchClickAndCollectQueue(storeCode).then(setOrders);
  }, [storeCode]);

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#fafafa' }}>
      <StaffHeader />
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
        <h1 style={{ fontSize: 22, marginBottom: 16 }}>click-and-collect queue</h1>
        <label htmlFor="pickup-store-selector">pickup store</label>
        <select
          id="pickup-store-selector"
          value={storeCode}
          onChange={(event) => setStoreCode(event.target.value)}
          style={{ display: 'block', marginBottom: 16, padding: 8 }}
        >
          {stores.map((store) => (
            <option key={store.storeCode} value={store.storeCode}>{store.storeName}</option>
          ))}
        </select>
        {orders.length === 0 ? (
          <p data-testid="queue-empty-state" role="status">all orders collected</p>
        ) : (
          <ul data-testid="click-and-collect-queue" style={{ listStyle: 'none', padding: 0 }}>
            {orders.map((order) => (
              <li key={order.orderNumber} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
                <Link to={`/admin/click-and-collect/${order.orderNumber}`}>
                  {order.orderNumber}
                </Link>
                <div>
                  {order.items.map((item) => (
                    <span key={item.sku}>{item.name} × {item.quantity}; </span>
                  ))}
                </div>
                <div>guest email: {order.guestEmail}</div>
                <div>status: {order.status}</div>
                {order.stockWarnings?.map((warning) => (
                  <div key={warning.sku} role="alert" style={{ color: '#b00020' }}>
                    stock warning: {warning.message}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
