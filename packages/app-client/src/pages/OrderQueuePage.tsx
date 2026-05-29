import React, { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import type { OrderDto } from '@pawplace/order-shared';

import { fetchOrderQueue } from '@pawplace/order-client/order.api';

import { fetchStores, type StoreResponse } from '@pawplace/store-client/store.api';

import { StaffHeader } from '../components/CustomerPage';



export function OrderQueuePage() {

  const navigate = useNavigate();

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

    fetchOrderQueue(storeCode).then(setOrders);

  }, [storeCode]);



  const handleSelect = (order: OrderDto) => {

    if (order.deliveryOption?.type === 'standard_delivery' || order.deliveryTypeLabel === 'Standard Delivery') {

      navigate(`/admin/orders/${order.orderNumber}/ship-to-home`);

      return;

    }

    navigate(`/admin/click-and-collect/${order.orderNumber}`);

  };



  return (

    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#fafafa' }}>

      <StaffHeader />

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>

        <h1 style={{ fontSize: 22, marginBottom: 16 }}>order queue</h1>

        <label htmlFor="fulfillment-store-selector">pickup store</label>

        <select

          id="fulfillment-store-selector"

          value={storeCode}

          onChange={(event) => setStoreCode(event.target.value)}

          style={{ display: 'block', marginBottom: 16, padding: 8 }}

        >

          {stores.map((store) => (

            <option key={store.storeCode} value={store.storeCode}>{store.storeName}</option>

          ))}

        </select>

        {orders.length === 0 ? (

          <p data-testid="queue-empty-state" role="status">no pending orders</p>

        ) : (

          <ul data-testid="order-queue" style={{ listStyle: 'none', padding: 0 }}>

            {orders.map((order) => (

              <li key={order.orderNumber} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>

                <button type="button" onClick={() => handleSelect(order)} style={{ background: 'none', border: 'none', padding: 0, color: '#06c', cursor: 'pointer', textDecoration: 'underline' }}>

                  {order.orderNumber}

                </button>

                <div>

                  {order.items.map((item) => (

                    <span key={item.sku}>{item.name} × {item.quantity}; </span>

                  ))}

                </div>

                <div>delivery type label: {order.deliveryTypeLabel ?? 'Click-and-Collect'}</div>

                <div>guest email: {order.guestEmail}</div>

                <div>order status: {order.status}</div>

                {order.stockWarnings?.map((warning) => (

                  <div key={warning.sku} role="alert" style={{ color: '#b00020' }}>

                    stock warning: {warning.message}

                  </div>

                ))}

              </li>

            ))}

          </ul>

        )}

        <Link to="/admin/click-and-collect" style={{ display: 'inline-block', marginTop: 16 }}>

          legacy click-and-collect queue

        </Link>

      </main>

    </div>

  );

}


