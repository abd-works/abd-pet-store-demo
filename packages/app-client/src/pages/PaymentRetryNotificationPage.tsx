import React from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CustomerPage } from '../components/CustomerPage';

export function PaymentRetryNotificationPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const outcome = searchParams.get('outcome') ?? 'success';

  const isSuccess = outcome === 'success';

  return (
    <CustomerPage title="account notification — background payment retry outcome">
      <section aria-label="background payment retry outcome">
        {isSuccess ? (
          <>
            <p role="status">payment retry succeeded — order confirmed</p>
            <Link to={`/order-confirmation/${id ?? 'ORD-0001'}`}>view order confirmation</Link>
          </>
        ) : (
          <>
            <p role="alert">payment could not be processed — retry window exhausted</p>
            <Link to="/checkout/payment">return to payment method selector</Link>
          </>
        )}
      </section>
    </CustomerPage>
  );
}
