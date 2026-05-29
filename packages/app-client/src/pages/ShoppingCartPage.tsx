import React, { useState } from 'react';



import { Link, useLocation, useNavigate } from 'react-router-dom';



import { mergeCheckoutDraft } from '../checkout/checkoutDraft';

import { CheckoutProgressTabs } from '../components/CheckoutProgressTabs';

import { ReorderFeedbackBanner } from '../components/ReorderFeedbackBanner';



import { CustomerPage } from '../components/CustomerPage';



import { useCart } from '../context/CartContext';



import { CartItemList } from './CartItemList';







export function ShoppingCartPage() {



  const navigate = useNavigate();



  const location = useLocation();



  const { cart } = useCart();



  const reorderResult = (location.state as { reorderResult?: { skippedSkus: string[]; stockWarnings: string[] } } | null)?.reorderResult;



  const [dismissReorder, setDismissReorder] = useState(false);



  const isEmpty = cart.items.length === 0;



  const handleProceedToCheckout = () => {



    mergeCheckoutDraft({



      checkoutPath: 'standard_delivery',



      deliveryOption: 'standard_delivery',



    });



    navigate('/checkout/billing');



  };







  return (



    <CustomerPage title="shopping cart">



      <CheckoutProgressTabs />



      {reorderResult && !dismissReorder && (



        <ReorderFeedbackBanner



          skippedSkus={reorderResult.skippedSkus}



          stockWarnings={reorderResult.stockWarnings}



          onDismiss={() => setDismissReorder(true)}



        />



      )}



      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>



        <section aria-label="cart item list">



          {isEmpty ? (



            <p data-testid="empty-cart-message" role="status">



              Your shopping cart is empty.



            </p>



          ) : (



            <CartItemList items={cart.items} />



          )}



        </section>



        <aside aria-label="cart summary" style={{ background: '#fff', border: '1px solid #ddd', padding: 16 }}>



          <p>



            cart total: <strong>{cart.subtotalFormatted}</strong>



          </p>



          <p>visible item count indicator: {cart.itemCount}</p>



          <p style={{ marginTop: 16 }}>



            <Link to="/product-catalog">continue shopping</Link>



          </p>



          {!isEmpty && (



            <>



              <button



                type="button"



                data-testid="proceed-to-checkout"



                onClick={handleProceedToCheckout}



                style={{



                  display: 'inline-block',



                  marginTop: 12,



                  padding: '10px 16px',



                  background: '#111',



                  color: '#fff',



                  textDecoration: 'none',



                  borderRadius: 4,



                  marginRight: 8,



                  border: 'none',



                  cursor: 'pointer',



                }}



              >



                proceed to checkout



              </button>



              <Link to="/checkout/pickup-store" style={{ display: 'inline-block', marginTop: 8, fontSize: 13 }}>



                click-and-collect checkout (legacy)



              </Link>



            </>



          )}



        </aside>



      </div>



    </CustomerPage>



  );



}




