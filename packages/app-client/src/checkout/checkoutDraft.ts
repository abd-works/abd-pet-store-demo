import type { BillingAddress, ShippingAddress } from '@pawplace/order-shared';



export type CheckoutDeliveryPath = 'legacy_pickup_first' | 'standard_delivery' | 'click_and_collect';



export interface CheckoutDraft {

  checkoutPath?: CheckoutDeliveryPath;

  deliveryOption?: 'standard_delivery' | 'click_and_collect';

  pickupStoreCode?: string;

  pickupStoreName?: string;

  pickupStoreAddress?: string;

  guestEmail?: string;

  guestName?: string;

  billingAddress?: BillingAddress;

  shippingAddress?: ShippingAddress;

  orderNumber?: string;

}



const STORAGE_KEY = 'pawplace-checkout-draft';



export function loadCheckoutDraft(): CheckoutDraft {

  try {

    const raw = sessionStorage.getItem(STORAGE_KEY);

    return raw ? (JSON.parse(raw) as CheckoutDraft) : {};

  } catch {

    return {};

  }

}



export function saveCheckoutDraft(draft: CheckoutDraft): void {

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));

}



export function clearCheckoutDraft(): void {

  sessionStorage.removeItem(STORAGE_KEY);

}



export function mergeCheckoutDraft(partial: Partial<CheckoutDraft>): CheckoutDraft {

  const next = { ...loadCheckoutDraft(), ...partial };

  saveCheckoutDraft(next);

  return next;

}



export function isLegacyCheckoutPath(draft: CheckoutDraft = loadCheckoutDraft()): boolean {

  return !draft.deliveryOption && !draft.checkoutPath;

}



export function resolveCheckoutPath(draft: CheckoutDraft = loadCheckoutDraft()): CheckoutDeliveryPath {

  if (draft.deliveryOption === 'standard_delivery') return 'standard_delivery';

  if (draft.deliveryOption === 'click_and_collect') return 'click_and_collect';

  if (draft.checkoutPath === 'legacy_pickup_first') return 'legacy_pickup_first';

  return isLegacyCheckoutPath(draft) ? 'legacy_pickup_first' : 'click_and_collect';

}


