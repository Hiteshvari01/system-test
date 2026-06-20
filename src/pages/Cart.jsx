import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Cart() {
  const { cart, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'My Shopping Cart - E-Commerce';
  }, []);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    if (couponCode.toUpperCase() === 'PROMO10') {
      setDiscountPercent(10);
      setCouponSuccess('Promo code "PROMO10" applied! You saved 10%.');
    } else if (couponCode.trim() === '') {
      setCouponError('Please enter a coupon code.');
    } else {
      setCouponError('Invalid coupon code. Try "PROMO10".');
    }
  };

  const discountAmount = (cartTotal * discountPercent) / 100;
  const finalTotal = cartTotal - discountAmount;

  const handleProceedToCheckout = () => {
    // Save active discount to sessionStorage for checkout access
    sessionStorage.setItem('active_discount_percent', discountPercent.toString());
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page-empty animate-fade-in">
        <div className="empty-cart-card">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>You haven't added any products to your shopping cart yet.</p>
          <Link to="/" className="shop-now-btn">Shop Our Catalog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container animate-fade-in">
      <h1 className="cart-page-title">Shopping Cart <span className="cart-title-count">({cartCount} items)</span></h1>

      <div className="cart-layout-grid">
        {/* Left Side: Cart Items List */}
        <div className="cart-items-column">
          <div className="cart-items-header">
            <span>Product Details</span>
            <span className="hide-mobile">Price</span>
            <span>Quantity</span>
            <span>Subtotal</span>
          </div>

          <div className="cart-items-wrapper">
            {cart.map((item) => (
              <div className="cart-item-card" key={item.id}>
                {/* Product Info */}
                <div className="cart-item-main">
                  <Link to={`/product/${item.id}`} className="cart-item-img-link">
                    <img src={item.image} alt={item.title} className="cart-item-img" />
                  </Link>
                  <div className="cart-item-text">
                    <Link to={`/product/${item.id}`} className="cart-item-name">{item.title}</Link>
                    <span className="cart-item-category">{item.category}</span>
                    <button onClick={() => removeFromCart(item.id)} className="cart-item-remove-link">
                      Remove Item
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="cart-item-unit-price hide-mobile">
                  ${item.price.toFixed(2)}
                </div>

                {/* Quantity */}
                <div className="cart-item-quantity-control">
                  <div className="qty-spinner">
                    <button onClick={() => updateQuantity(item.id, -1)} className="spinner-btn">-</button>
                    <span className="spinner-val">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="spinner-btn">+</button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="cart-item-subtotal-val">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-actions-row">
            <Link to="/" className="continue-shopping-link">← Continue Shopping</Link>
            <button onClick={clearCart} className="clear-cart-text-btn">Clear Shopping Cart</button>
          </div>
        </div>

        {/* Right Side: Order Summary Card */}
        <div className="cart-summary-column">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-divider"></div>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping">FREE</span>
            </div>

            {discountPercent > 0 && (
              <div className="summary-row discount-row">
                <span>Discount ({discountPercent}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-divider"></div>

            <div className="summary-row grand-total-row">
              <span>Estimated Total</span>
              <span className="grand-total-price">${finalTotal.toFixed(2)}</span>
            </div>

            {/* Coupon Code Entry */}
            <form onSubmit={handleApplyCoupon} className="coupon-form">
              <input
                type="text"
                placeholder="Promo Code (e.g. PROMO10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="coupon-input"
              />
              <button type="submit" className="coupon-btn">Apply</button>
            </form>
            {couponError && <p className="coupon-msg error-msg">{couponError}</p>}
            {couponSuccess && <p className="coupon-msg success-msg">{couponSuccess}</p>}

            <button onClick={handleProceedToCheckout} className="checkout-cta-btn">
              PROCEED TO CHECKOUT
            </button>

            <div className="assurance-badges-list">
              <div className="assurance-badge">
                <span className="icon">🔒</span>
                <span>Secured Checkout SSL Encrypted</span>
              </div>
              <div className="assurance-badge">
                <span className="icon">📦</span>
                <span>Insured Shipping with Live Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
