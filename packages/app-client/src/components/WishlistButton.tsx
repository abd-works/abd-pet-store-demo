import React, { useEffect, useState } from 'react';
import { addToWishlist, isInWishlist, removeFromWishlist } from '@pawplace/customer-account-client';
import { useCustomerSession } from '../context/CustomerSessionContext';
import { GuestWishlistPrompt } from './GuestWishlistPrompt';

interface WishlistButtonProps {
  sku: string;
}

export function WishlistButton({ sku }: WishlistButtonProps) {
  const { isVerified } = useCustomerSession();
  const [inWishlist, setInWishlist] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  useEffect(() => {
    if (!isVerified) {
      setInWishlist(false);
      return;
    }
    void isInWishlist(sku).then(setInWishlist);
  }, [sku, isVerified]);

  const handleClick = async () => {
    if (!isVerified) {
      setShowGuestPrompt(true);
      return;
    }
    if (inWishlist) {
      await removeFromWishlist(sku);
      setInWishlist(false);
    } else {
      await addToWishlist(sku);
      setInWishlist(true);
    }
  };

  return (
    <>
      <button type="button" onClick={() => void handleClick()} style={{ marginTop: 12, padding: '8px 12px' }}>
        {inWishlist ? 'remove from wishlist' : 'add to wishlist'}
      </button>
      {showGuestPrompt && <GuestWishlistPrompt onDismiss={() => setShowGuestPrompt(false)} />}
    </>
  );
}
