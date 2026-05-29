/**
 * Pay your way — shared test data (Increment 5)
 */
import { ClickAndCollectBase } from '../../click-and-collect/helpers/click-and-collect.base';

export class PayYourWayBase extends ClickAndCollectBase {
  static readonly ORD_PAYNOVA = 'ORD-2001';
  static readonly ORD_VAULTPAY = 'ORD-2003';
  static readonly ORD_STRIPE_RETRY = 'ORD-2004';
  static readonly PAYNOVA_VENDOR_REF = 'pn_txn_7890';
  static readonly VAULTPAY_VENDOR_REF = 'vp_ref_5001';
}
