import React from 'react';

import { Link, useLocation } from 'react-router-dom';

import { FONT_WEIGHT_ACTIVE, FONT_WEIGHT_INACTIVE } from '../../../shared/layout-tokens';

import { useCart } from '../context/CartContext';

import { useCustomerSession } from '../context/CustomerSessionContext';
import { GlobalSearchBar } from './GlobalSearchBar';



const navStyle: React.CSSProperties = {

  display: 'flex',

  gap: 16,

  padding: '12px 16px',

  borderBottom: '1px solid #ddd',

  fontFamily: 'sans-serif',

  fontSize: 14,

  alignItems: 'center',

};



const linkStyle = (active: boolean): React.CSSProperties => ({

  textDecoration: 'none',

  color: active ? '#111' : '#555',

  fontWeight: active ? FONT_WEIGHT_ACTIVE : FONT_WEIGHT_INACTIVE,

});



const primaryLinkStyle: React.CSSProperties = {

  textDecoration: 'none',

  color: '#fff',

  background: '#111',

  padding: '6px 12px',

  borderRadius: 4,

  fontWeight: FONT_WEIGHT_ACTIVE,

};



export function CustomerNav() {

  const { pathname } = useLocation();

  const { cart } = useCart();

  const { isVerified, loading } = useCustomerSession();

  const onStores = pathname.startsWith('/store-locator');

  const onCatalog = pathname.startsWith('/product-catalog') || pathname.startsWith('/products/');
  const onBlog = pathname.startsWith('/blog');
  const onGuides = pathname.startsWith('/guides');

  const onCart = pathname.startsWith('/cart') || pathname.startsWith('/checkout');

  const onWishlist = pathname.startsWith('/wishlist');

  const onAccount = pathname.startsWith('/account');

  const onAuth = pathname.startsWith('/login') || pathname.startsWith('/register');
  const onVerifyEmail = pathname.startsWith('/verify-email');



  return (

    <header data-testid="customer-nav" style={navStyle}>

      <span style={{ fontWeight: FONT_WEIGHT_ACTIVE, marginRight: 8 }}>PawPlace</span>

      <Link to="/store-locator" style={linkStyle(onStores)}>find stores</Link>

      <Link to="/product-catalog" style={linkStyle(onCatalog)}>shop supplies</Link>
      <Link to="/blog" style={linkStyle(onBlog)}>blog</Link>
      <Link to="/guides" style={linkStyle(onGuides)}>pet care guides</Link>

      <Link to="/cart" style={linkStyle(onCart)} aria-label={`shopping cart (${cart.itemCount} items)`}>

        shopping cart ({cart.itemCount})

      </Link>

      {!loading && isVerified ? (

        <>

          <Link to="/wishlist" style={linkStyle(onWishlist)}>wishlist</Link>

          <Link to="/account" style={{ ...primaryLinkStyle, ...(onAccount ? { outline: '2px solid #555' } : {}) }}>

            account

          </Link>

        </>

      ) : (

        !loading && !onVerifyEmail && (

          <>

            <Link to="/login" style={linkStyle(onAuth)}>log in</Link>

            <Link to="/register" style={primaryLinkStyle}>register</Link>

          </>

        )

      )}

      <GlobalSearchBar />

    </header>

  );

}


