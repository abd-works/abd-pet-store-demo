import React, { useState } from 'react';
import { StaffPage } from '../../components/CustomerPage';
import { staffLookupOrder } from '../../../../return/client/return.api';
import { Link } from 'react-router-dom';

interface MatchedOrder {
  orderNumber: string;
  date: string;
  customerName: string;
  email: string;
  items: string;
  total: string;
  orderStatus: string;
}

export function StaffReturnLookupPage() {
  const [orderNumberInput, setOrderNumberInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [matchedOrder, setMatchedOrder] = useState<MatchedOrder | null>(null);
  const [noMatch, setNoMatch] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumberInput && !emailInput) return;
    setSearching(true);
    setNoMatch(false);
    setMatchedOrder(null);
    try {
      const result = await staffLookupOrder({
        orderNumber: orderNumberInput || undefined,
        email: emailInput || undefined,
      });
      if (result) {
        setMatchedOrder(result);
      } else {
        setNoMatch(true);
      }
    } catch {
      setNoMatch(true);
    }
    setSearching(false);
  };

  return (
    <StaffPage title="returns">
      <nav aria-label="staff navigation" style={{ marginBottom: 20 }}>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: 4 }}>
          {['Stock Levels', 'Incoming Appointments', 'Pet Profiles', 'Returns'].map((tab) => (
            <li key={tab}>
              <span
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px 6px 0 0',
                  background: tab === 'Returns' ? '#111' : '#f3f4f6',
                  color: tab === 'Returns' ? '#fff' : '#374151',
                  fontSize: 13,
                  fontWeight: tab === 'Returns' ? 600 : 400,
                  cursor: 'pointer',
                }}
                aria-current={tab === 'Returns' ? 'page' : undefined}
              >
                {tab}
              </span>
            </li>
          ))}
        </ul>
      </nav>

      <form onSubmit={(e) => void handleLookup(e)} aria-label="order lookup for return" style={{ marginBottom: 20 }}>
        <fieldset style={{ border: 'none', padding: 0 }}>
          <legend style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Look up order for return</legend>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label htmlFor="staff-order-number" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                Order number
              </label>
              <input
                id="staff-order-number"
                type="text"
                value={orderNumberInput}
                onChange={(e) => setOrderNumberInput(e.target.value)}
                placeholder="ORD-123456"
                style={{ padding: '8px 10px', borderRadius: 4, border: '1px solid #d1d5db', width: 160 }}
              />
            </div>
            <span style={{ fontSize: 13, color: '#6b7280', paddingBottom: 8 }}>or</span>
            <div>
              <label htmlFor="staff-customer-email" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                Customer email
              </label>
              <input
                id="staff-customer-email"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="customer@example.com"
                style={{ padding: '8px 10px', borderRadius: 4, border: '1px solid #d1d5db', width: 220 }}
              />
            </div>
            <button
              type="submit"
              disabled={searching || (!orderNumberInput && !emailInput)}
              style={{ padding: '8px 16px', background: '#111', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
            >
              {searching ? 'Searching…' : 'Look Up Order'}
            </button>
          </div>
        </fieldset>
      </form>

      {noMatch && (
        <p role="alert" style={{ padding: '10px 14px', background: '#fef2f2', color: '#dc2626', borderRadius: 6 }}>
          No order found — verify the order number or customer email.
        </p>
      )}

      {matchedOrder && (
        <section aria-label="matched order result" style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff' }}>
          <p><strong>order number:</strong> {matchedOrder.orderNumber}</p>
          <p><strong>date:</strong> {matchedOrder.date}</p>
          <p><strong>customer name:</strong> {matchedOrder.customerName}</p>
          <p><strong>email:</strong> {matchedOrder.email}</p>
          <p><strong>items:</strong> {matchedOrder.items}</p>
          <p><strong>total:</strong> {matchedOrder.total}</p>
          <p><strong>order status:</strong> {matchedOrder.orderStatus}</p>
          <Link
            to={`/staff/returns/${matchedOrder.orderNumber}/process`}
            style={{ display: 'inline-block', marginTop: 12, padding: '10px 16px', background: '#111', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}
          >
            Start Return
          </Link>
        </section>
      )}

      <p style={{ marginTop: 16, fontSize: 13, color: '#6b7280', padding: '8px 12px', background: '#f9fafb', borderRadius: 6 }}>
        Guest orders: lookup by order number and guest email — refund routes through original vendor.
      </p>
    </StaffPage>
  );
}
