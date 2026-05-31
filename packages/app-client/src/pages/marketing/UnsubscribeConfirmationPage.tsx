import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CustomerPage } from '../../components/CustomerPage';
import { executeUnsubscribe } from '../../../../content/client/content.api';

export function UnsubscribeConfirmationPage() {
  const { token = '' } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [categoryLabel, setCategoryLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    void executeUnsubscribe(token)
      .then((result) => {
        setMessage("You've been unsubscribed");
        setCategoryLabel(result.categoryLabel);
      })
      .catch(() => setError('Invalid unsubscribe link'));
  }, [token]);

  return (
    <CustomerPage title="unsubscribe confirmation">
      <div data-testid="unsubscribe-confirmation">
        {error && <p role="alert">{error}</p>}
        {message && (
          <>
            <h1>{message}</h1>
            {categoryLabel && <p>{categoryLabel}</p>}
            <p>You can re-subscribe anytime from Communication Preferences.</p>
            <p role="status">already unsubscribed note — repeat clicks show the same confirmation</p>
            <p>
              <Link to="/account/communication">Manage Communication Preferences</Link>
            </p>
            <button type="button" onClick={() => navigate('/product-catalog')} style={{ marginTop: 12 }}>
              Continue Shopping
            </button>
          </>
        )}
      </div>
    </CustomerPage>
  );
}
