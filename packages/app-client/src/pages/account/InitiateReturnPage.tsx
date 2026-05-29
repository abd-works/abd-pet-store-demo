import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CustomerPage } from '../../components/CustomerPage';
import { checkReturnEligibility, initiateReturn } from '../../../return/client/return.api';
import type { ReturnedItemDto } from '../../../return/shared/return.schema';
import type { ReturnReason, ItemCondition } from '../../../return/shared/return.schema';
import { returnReasonValues, itemConditionValues } from '../../../return/shared/return.schema';

interface SelectedItem {
  sku: string;
  quantity: number;
}

export function InitiateReturnPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const [eligibleItems, setEligibleItems] = useState<ReturnedItemDto[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [returnReason, setReturnReason] = useState<ReturnReason | ''>('');
  const [itemCondition, setItemCondition] = useState<ItemCondition | ''>('');
  const [damageDescription, setDamageDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!orderNumber) return;
    void checkReturnEligibility(orderNumber)
      .then((result) => {
        setEligibleItems(result.eligibleItems);
        if (!result.eligible && result.reason) {
          setError(result.reason);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to check return eligibility');
        setLoading(false);
      });
  }, [orderNumber]);

  const toggleItem = (sku: string) => {
    setSelectedItems((prev) => {
      const exists = prev.find((s) => s.sku === sku);
      if (exists) return prev.filter((s) => s.sku !== sku);
      return [...prev, { sku, quantity: 1 }];
    });
  };

  const updateQuantity = (sku: string, quantity: number) => {
    setSelectedItems((prev) =>
      prev.map((s) => (s.sku === sku ? { ...s, quantity } : s)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || selectedItems.length === 0 || !returnReason || !itemCondition) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await initiateReturn({
        orderNumber,
        items: selectedItems,
        returnReason,
        itemCondition,
        damageDescription: itemCondition === 'damaged' ? damageDescription : undefined,
      });
      navigate(`/account/returns/${result.returnId}/confirmation`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit return request');
      setSubmitting(false);
    }
  };

  if (loading) return <CustomerPage title="initiate return"><p>Loading…</p></CustomerPage>;

  return (
    <CustomerPage title="initiate return">
      <nav aria-label="breadcrumb" style={{ fontSize: 14, marginBottom: 16 }}>
        <a href="/account/orders">Account</a>{' › '}
        <a href="/account/orders">Orders</a>{' › '}
        <a href={`/account/orders/${orderNumber}`}>Order #{orderNumber}</a>{' › '}
        <span aria-current="page">Return</span>
      </nav>

      <section aria-label="order context" style={{ marginBottom: 16, padding: 12, background: '#f9fafb', borderRadius: 6 }}>
        <p style={{ margin: 0 }}><strong>order number:</strong> {orderNumber}</p>
      </section>

      {error && (
        <p role="alert" aria-live="assertive" style={{ color: '#dc2626', marginBottom: 12, padding: '8px 12px', background: '#fef2f2', borderRadius: 6 }}>
          {error}
        </p>
      )}

      <form onSubmit={(e) => void handleSubmit(e)} aria-label="initiate return form">
        <fieldset style={{ border: 'none', padding: 0 }}>
          <legend style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Select items to return</legend>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {eligibleItems.map((item) => {
              const isSelected = selectedItems.some((s) => s.sku === item.sku);
              const isDisabled = item.alreadyReturning === true;
              return (
                <li
                  key={item.sku}
                  style={{
                    padding: '10px 12px',
                    marginBottom: 8,
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    opacity: isDisabled ? 0.5 : 1,
                    background: isSelected ? '#eff6ff' : '#fff',
                  }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: isDisabled ? 'not-allowed' : 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => toggleItem(item.sku)}
                      aria-label={`Select ${item.name} for return`}
                    />
                    <span style={{ flex: 1 }}>
                      <strong>{item.name}</strong>
                      {isDisabled && <span style={{ marginLeft: 8, fontSize: 12, color: '#9ca3af' }}>return in progress</span>}
                    </span>
                    {isSelected && !isDisabled && (
                      <span>
                        <label htmlFor={`qty-${item.sku}`} style={{ fontSize: 12, marginRight: 4 }}>Qty:</label>
                        <input
                          id={`qty-${item.sku}`}
                          type="number"
                          min={1}
                          max={item.quantity}
                          value={selectedItems.find((s) => s.sku === item.sku)?.quantity ?? 1}
                          onChange={(e) => updateQuantity(item.sku, parseInt(e.target.value, 10) || 1)}
                          style={{ width: 50, padding: '2px 6px' }}
                          aria-label={`Quantity to return for ${item.name}`}
                        />
                      </span>
                    )}
                    {!isDisabled && (
                      <span style={{ fontSize: 12, color: item.eligible ? '#16a34a' : '#dc2626' }}>
                        {item.eligible ? 'eligible' : 'not eligible'}
                      </span>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label htmlFor="return-reason" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
              Return reason
            </label>
            <select
              id="return-reason"
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value as ReturnReason)}
              required
              style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #d1d5db' }}
              aria-required="true"
            >
              <option value="">Select a reason</option>
              {returnReasonValues.map((r) => (
                <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: 180 }}>
            <label htmlFor="item-condition" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
              Item condition
            </label>
            <select
              id="item-condition"
              value={itemCondition}
              onChange={(e) => setItemCondition(e.target.value as ItemCondition)}
              required
              style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #d1d5db' }}
              aria-required="true"
            >
              <option value="">Select condition</option>
              {itemConditionValues.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {itemCondition === 'damaged' && (
          <div style={{ marginTop: 16 }}>
            <label htmlFor="damage-description" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
              Describe the damage
            </label>
            <textarea
              id="damage-description"
              value={damageDescription}
              onChange={(e) => setDamageDescription(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #d1d5db' }}
              aria-describedby="damage-help"
            />
            <p id="damage-help" style={{ fontSize: 12, color: '#6b7280', margin: '4px 0 0' }}>
              Optionally upload a photo of the damage (file upload not yet available)
            </p>
          </div>
        )}

        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          <button
            type="submit"
            disabled={submitting || selectedItems.length === 0 || !returnReason || !itemCondition}
            style={{
              padding: '10px 20px',
              background: selectedItems.length > 0 && returnReason && itemCondition ? '#111' : '#9ca3af',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: submitting ? 'wait' : 'pointer',
              fontWeight: 600,
            }}
          >
            {submitting ? 'Submitting…' : 'Submit Return Request'}
          </button>
          <a
            href={`/account/orders/${orderNumber}`}
            style={{ padding: '10px 20px', color: '#374151', textDecoration: 'none', borderRadius: 6, border: '1px solid #d1d5db', display: 'inline-block' }}
          >
            Back to Order Detail
          </a>
        </div>
      </form>
    </CustomerPage>
  );
}
