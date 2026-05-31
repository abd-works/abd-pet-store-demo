import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CustomerPage } from '../../components/CustomerPage';
import { fetchReturn } from '../../../../return/client/return.api';
import type { ReturnDto } from '../../../../return/shared/return.schema';

export function ReturnConfirmationPage() {
  const { returnId } = useParams<{ returnId: string }>();
  const [returnData, setReturnData] = useState<ReturnDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!returnId) return;
    void fetchReturn(returnId)
      .then(setReturnData)
      .finally(() => setLoading(false));
  }, [returnId]);

  if (loading) return <CustomerPage title="return confirmation"><p>Loading…</p></CustomerPage>;
  if (!returnData) return <CustomerPage title="return confirmation"><p>Return not found.</p></CustomerPage>;

  return (
    <CustomerPage title="return confirmation">
      <section aria-label="return submitted header" style={{ marginBottom: 20, padding: 16, background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0' }}>
        <h2 style={{ fontSize: 18, margin: '0 0 8px', color: '#166534' }}>Return request submitted!</h2>
        <p style={{ margin: 0 }}><strong>return reference:</strong> {returnData.returnReference}</p>
        <p style={{ margin: '4px 0 0' }}><strong>order number:</strong> {returnData.orderNumber}</p>
      </section>

      <section aria-label="returned items summary" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, marginBottom: 8 }}>Items being returned</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {returnData.returnedItems.map((item) => (
            <li key={item.sku} style={{ padding: '8px 12px', marginBottom: 4, background: '#f9fafb', borderRadius: 4 }}>
              <strong>{item.name}</strong> × {item.quantity}
              <span style={{ marginLeft: 12, color: '#6b7280', fontSize: 13 }}>
                reason: {returnData.returnReason.replace(/_/g, ' ')} · condition: {returnData.itemCondition}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {returnData.labelUrl && (
        <section aria-label="return label download" style={{ marginBottom: 16, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>Return Label (PDF)</h3>
          <p style={{ fontSize: 13, color: '#374151', marginBottom: 8 }}>
            Includes: return address, order number, return reference, carrier barcode
          </p>
          <a
            href={returnData.labelUrl}
            download
            style={{ display: 'inline-block', padding: '10px 16px', background: '#111', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}
            aria-label="Download return label PDF"
          >
            Download Return Label
          </a>
        </section>
      )}

      {returnData.qrCodeData && (
        <section aria-label="return QR code display" style={{ marginBottom: 16, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>Return QR Code</h3>
          <div
            style={{ width: 160, height: 160, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, marginBottom: 8 }}
            aria-label={`QR code for return reference ${returnData.returnReference}`}
            role="img"
          >
            <span style={{ fontSize: 12, color: '#6b7280', textAlign: 'center' }}>
              [QR Code]<br />{returnData.returnReference}
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#374151' }}>
            Display this QR code on your mobile device at the carrier drop-off point.
            Same return reference as the printed label.
          </p>
        </section>
      )}

      {returnData.labelUnavailable && (
        <section
          aria-label="label unavailable fallback"
          role="alert"
          style={{ marginBottom: 16, padding: 16, background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8 }}
        >
          <p style={{ margin: 0, fontWeight: 600, color: '#92400e' }}>
            Return recorded — label generation temporarily unavailable
          </p>
          <p style={{ margin: '4px 0 0', color: '#92400e', fontSize: 13 }}>
            Check back shortly or contact support for your return label.
          </p>
        </section>
      )}

      <section aria-label="email confirmation note" style={{ marginBottom: 20, padding: 12, background: '#f9fafb', borderRadius: 6 }}>
        <p style={{ margin: 0, fontSize: 13, color: '#374151' }}>
          Return label and QR code emailed to your registered email.
        </p>
      </section>

      <nav aria-label="post-submission actions" style={{ display: 'flex', gap: 12 }}>
        <Link
          to={`/account/orders/${returnData.orderNumber}`}
          style={{ padding: '10px 20px', background: '#111', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}
        >
          View Return Status
        </Link>
        <Link
          to="/account/orders"
          style={{ padding: '10px 20px', color: '#374151', textDecoration: 'none', borderRadius: 6, border: '1px solid #d1d5db' }}
        >
          Back to Order History
        </Link>
      </nav>
    </CustomerPage>
  );
}
