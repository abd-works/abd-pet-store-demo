import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StaffPage } from '../../components/CustomerPage';
import { checkReturnEligibility, staffInitiateReturn } from '../../../../return/client/return.api';
import type { ReturnedItemDto } from '../../../../return/shared/return.schema';
import type { ReturnReason, ItemCondition } from '../../../../return/shared/return.schema';
import { returnReasonValues, itemConditionValues } from '../../../../return/shared/return.schema';

interface SelectedItem {
  sku: string;
  quantity: number;
}

export function StaffProcessReturnPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const [eligibleItems, setEligibleItems] = useState<ReturnedItemDto[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [returnReason, setReturnReason] = useState<ReturnReason | ''>('');
  const [itemCondition, setItemCondition] = useState<ItemCondition | ''>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{ returnId: string; orderNumber: string } | null>(null);

  const [ineligibleItems, setIneligibleItems] = useState<ReturnedItemDto[]>([]);
  const [overrideRequested, setOverrideRequested] = useState(false);
  const [approvingManager, setApprovingManager] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [managerApproved, setManagerApproved] = useState(false);

  useEffect(() => {
    if (!orderNumber) return;
    void checkReturnEligibility(orderNumber)
      .then((result) => {
        setEligibleItems(result.eligibleItems.filter((i) => i.eligible));
        setIneligibleItems(result.eligibleItems.filter((i) => !i.eligible && !i.alreadyReturning));
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
    if (overrideRequested && !managerApproved) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await staffInitiateReturn({
        orderNumber,
        items: selectedItems,
        returnReason,
        itemCondition,
        managerOverride: overrideRequested ? true : undefined,
        overrideReason: overrideRequested ? overrideReason : undefined,
        approvingManager: overrideRequested ? approvingManager : undefined,
      });
      setConfirmation({ returnId: result.returnId, orderNumber: result.orderNumber });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process in-store return');
    }
    setSubmitting(false);
  };

  if (loading) return <StaffPage title="process in-store return"><p>Loading…</p></StaffPage>;

  if (confirmation) {
    return (
      <StaffPage title="process in-store return">
        <section
          aria-label="return recorded confirmation"
          style={{ padding: 20, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8 }}
        >
          <h2 style={{ fontSize: 18, color: '#166534', marginTop: 0, marginBottom: 8 }}>
            In-store return recorded
          </h2>
          <p style={{ margin: '4px 0' }}>
            Return linked to original order <strong>#{confirmation.orderNumber}</strong>.
          </p>
          <p style={{ margin: '4px 0' }}>
            Refund triggered through original payment vendor.
          </p>
          <p style={{ margin: '4px 0' }}>
            Return visible in customer order history.
          </p>
          <button
            type="button"
            onClick={() => navigate('/staff/returns')}
            style={{ marginTop: 16, padding: '10px 16px', background: '#111', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
          >
            Back to Returns
          </button>
        </section>
      </StaffPage>
    );
  }

  return (
    <StaffPage title="process in-store return">
      <section aria-label="order context" style={{ marginBottom: 16, padding: 12, background: '#f9fafb', borderRadius: 6 }}>
        <p style={{ margin: 0 }}><strong>order number:</strong> {orderNumber}</p>
      </section>

      {error && (
        <p role="alert" aria-live="assertive" style={{ color: '#dc2626', marginBottom: 12, padding: '8px 12px', background: '#fef2f2', borderRadius: 6 }}>
          {error}
        </p>
      )}

      <form onSubmit={(e) => void handleSubmit(e)} aria-label="process in-store return form">
        <fieldset style={{ border: 'none', padding: 0 }}>
          <legend style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Select items to return</legend>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {eligibleItems.map((item) => {
              const isSelected = selectedItems.some((s) => s.sku === item.sku);
              return (
                <li
                  key={item.sku}
                  style={{
                    padding: '10px 12px',
                    marginBottom: 8,
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    background: isSelected ? '#eff6ff' : '#fff',
                  }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleItem(item.sku)}
                      aria-label={`Select ${item.name} for return`}
                    />
                    <span style={{ flex: 1 }}>
                      <strong>{item.name}</strong>
                      <span style={{ marginLeft: 8, fontSize: 12, color: '#16a34a' }}>eligible</span>
                    </span>
                    {isSelected && (
                      <span>
                        <label htmlFor={`staff-qty-${item.sku}`} style={{ fontSize: 12, marginRight: 4 }}>Qty:</label>
                        <input
                          id={`staff-qty-${item.sku}`}
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
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>

        {ineligibleItems.length > 0 && (
          <section aria-label="ineligible items" style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#dc2626' }}>Ineligible items</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {ineligibleItems.map((item) => (
                <li
                  key={item.sku}
                  style={{ padding: '10px 12px', marginBottom: 8, border: '1px solid #fecaca', borderRadius: 6, background: '#fef2f2' }}
                >
                  <span style={{ flex: 1 }}>
                    <strong>{item.name}</strong>
                    <span style={{ marginLeft: 8, fontSize: 12, color: '#dc2626' }}>
                      not eligible — return window expired or wrong condition
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            {!overrideRequested ? (
              <button
                type="button"
                onClick={() => setOverrideRequested(true)}
                style={{ padding: '8px 14px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
              >
                Manager Override
              </button>
            ) : (
              <section
                aria-label="manager override confirmation"
                style={{ marginTop: 12, padding: 16, border: '1px solid #fcd34d', background: '#fffbeb', borderRadius: 8 }}
              >
                <p style={{ margin: '0 0 12px', fontWeight: 600, color: '#92400e' }}>
                  Manager approval required before return proceeds
                </p>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <label htmlFor="approving-manager" style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
                      Approving manager
                    </label>
                    <input
                      id="approving-manager"
                      type="text"
                      value={approvingManager}
                      onChange={(e) => setApprovingManager(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #d1d5db' }}
                      aria-required="true"
                    />
                  </div>
                  <div style={{ flex: 2, minWidth: 200 }}>
                    <label htmlFor="override-reason" style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
                      Override reason
                    </label>
                    <textarea
                      id="override-reason"
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      required
                      rows={2}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #d1d5db' }}
                      aria-required="true"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  disabled={!approvingManager || !overrideReason}
                  onClick={() => {
                    setManagerApproved(true);
                    ineligibleItems.forEach((item) => {
                      if (!selectedItems.some((s) => s.sku === item.sku)) {
                        setSelectedItems((prev) => [...prev, { sku: item.sku, quantity: 1 }]);
                      }
                    });
                  }}
                  style={{
                    padding: '8px 14px',
                    background: approvingManager && overrideReason ? '#16a34a' : '#9ca3af',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {managerApproved ? 'Override Approved ✓' : 'Approve Override'}
                </button>
              </section>
            )}
          </section>
        )}

        <div style={{ display: 'flex', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label htmlFor="staff-return-reason" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
              Return reason
            </label>
            <select
              id="staff-return-reason"
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
            <label htmlFor="staff-item-condition" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
              Item condition
            </label>
            <select
              id="staff-item-condition"
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

        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          <button
            type="submit"
            disabled={submitting || selectedItems.length === 0 || !returnReason || !itemCondition || (overrideRequested && !managerApproved)}
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
            {submitting ? 'Processing…' : 'Record In-Store Return'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/staff/returns')}
            style={{ padding: '10px 20px', color: '#374151', borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </StaffPage>
  );
}
