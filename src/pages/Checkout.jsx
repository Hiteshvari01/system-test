import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Checkout() {
  const { cart, cartTotal, placeOrder, user } = useApp();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Zimbabwe');

  // Payment states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Discount
  const [discountPercent, setDiscountPercent] = useState(0);

  // Status & Validation
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    document.title = 'Checkout - E-Commerce';
    
    // Check if cart is empty, redirect back to cart
    if (cart.length === 0 && !orderSuccess) {
      navigate('/cart');
    }

    // Retrieve active discount from sessionStorage
    const savedDiscount = sessionStorage.getItem('active_discount_percent');
    if (savedDiscount) {
      setDiscountPercent(parseInt(savedDiscount));
    }
  }, [cart, navigate, orderSuccess]);

  const validateForm = () => {
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = 'Full Name is required.';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) tempErrors.email = 'Valid Email is required.';
    if (!phone.trim()) tempErrors.phone = 'Phone number is required.';
    if (!address.trim()) tempErrors.address = 'Shipping Address is required.';
    if (!city.trim()) tempErrors.city = 'City is required.';
    if (!postalCode.trim()) tempErrors.postalCode = 'Postal Code is required.';
    
    // Payment validations
    if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 16) {
      tempErrors.cardNumber = 'Valid 16-digit Card Number is required.';
    }
    if (!cardExpiry.trim() || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      tempErrors.cardExpiry = 'Expiry date must be in MM/YY format.';
    }
    if (!cardCvv.trim() || cardCvv.length < 3) {
      tempErrors.cardCvv = 'Valid 3-digit CVV is required.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API network request latency
    setTimeout(() => {
      const shippingDetails = { name, email, phone, address, city, postalCode, country };
      const paymentDetails = { method: 'Credit Card', cardNumber };

      const res = placeOrder(shippingDetails, paymentDetails);
      setIsSubmitting(false);

      if (res.success) {
        setOrderSuccess(res.order);
        sessionStorage.removeItem('active_discount_percent');
      } else {
        alert(res.message);
      }
    }, 1500);
  };

  const discountAmount = (cartTotal * discountPercent) / 100;
  const finalTotal = cartTotal - discountAmount;

  if (orderSuccess) {
    return (
      <div className="checkout-success-view animate-fade-in">
        <div className="success-receipt-card">
          <div className="success-icon-badge">✓</div>
          <h2>Thank You For Your Order!</h2>
          <p className="order-number-tag">Order ID: <strong>{orderSuccess.id}</strong></p>
          <p className="success-message">
            We have emailed your order confirmation to <strong>{orderSuccess.shipping.email}</strong>. 
            Your items will be dispatched within 24 hours.
          </p>

          <div className="receipt-details">
            <h3>Delivery Address</h3>
            <p>{orderSuccess.shipping.name}</p>
            <p>{orderSuccess.shipping.address}</p>
            <p>{orderSuccess.shipping.city}, {orderSuccess.shipping.postalCode}</p>
            <p>{orderSuccess.shipping.country}</p>
          </div>

          <div className="receipt-items">
            <h3>Items Ordered</h3>
            {orderSuccess.items.map((item) => (
              <div className="receipt-item-row" key={item.id}>
                <span>{item.title} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="receipt-total-row">
              <span>Total Paid</span>
              <span>${orderSuccess.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="receipt-actions">
            <Link to="/profile?tab=orders" className="view-orders-btn">Go To My Orders</Link>
            <Link to="/" className="continue-btn">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-container animate-fade-in">
      <h1 className="checkout-page-title">Secure Checkout</h1>

      <div className="checkout-layout-grid">
        {/* Left: Checkout Forms */}
        <form onSubmit={handlePlaceOrder} className="checkout-form-column">
          
          {/* Shipping Details */}
          <div className="checkout-form-section">
            <h2 className="section-title"><span>1</span> Shipping Address</h2>
            
            <div className="form-row-two">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={errors.name ? 'input-error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row-two">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +263 77 123 4567"
                  className={errors.phone ? 'input-error' : ''}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
              
              <div className="form-group">
                <label>Country</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)}>
                  <option value="Zimbabwe">Zimbabwe</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Zambia">Zambia</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Apartment, suite, unit, building, street, etc."
                className={errors.address ? 'input-error' : ''}
              />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>

            <div className="form-row-two">
              <div className="form-group">
                <label>City / Suburb</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={errors.city ? 'input-error' : ''}
                />
                {errors.city && <span className="error-text">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className={errors.postalCode ? 'input-error' : ''}
                />
                {errors.postalCode && <span className="error-text">{errors.postalCode}</span>}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="checkout-form-section">
            <h2 className="section-title"><span>2</span> Payment Information</h2>
            
            <div className="payment-type-selector">
              <div className="payment-option active">
                <input type="radio" id="card" name="paymentMethod" defaultChecked />
                <label htmlFor="card" className="payment-lbl">
                  <span className="radio-dot"></span>
                  Credit / Debit Card
                  <span className="card-icons">💳</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => {
                  // Auto format card number: groups of 4 digits
                  const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                  const matches = v.match(/\d{4,16}/g);
                  const match = (matches && matches[0]) || '';
                  const parts = [];
                  for (let i = 0, len = match.length; i < len; i += 4) {
                    parts.push(match.substring(i, i + 4));
                  }
                  if (parts.length > 0) {
                    setCardNumber(parts.join(' '));
                  } else {
                    setCardNumber(v);
                  }
                }}
                maxLength="19"
                placeholder="4242 4242 4242 4242"
                className={errors.cardNumber ? 'input-error' : ''}
              />
              {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
            </div>

            <div className="form-row-two">
              <div className="form-group">
                <label>Expiration Date</label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '');
                    if (v.length >= 2) {
                      setCardExpiry(v.slice(0, 2) + '/' + v.slice(2, 4));
                    } else {
                      setCardExpiry(v);
                    }
                  }}
                  maxLength="5"
                  placeholder="MM/YY"
                  className={errors.cardExpiry ? 'input-error' : ''}
                />
                {errors.cardExpiry && <span className="error-text">{errors.cardExpiry}</span>}
              </div>

              <div className="form-group">
                <label>Security Code (CVV)</label>
                <input
                  type="password"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                  maxLength="3"
                  placeholder="123"
                  className={errors.cardCvv ? 'input-error' : ''}
                />
                {errors.cardCvv && <span className="error-text">{errors.cardCvv}</span>}
              </div>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="checkout-submit-btn">
            {isSubmitting ? (
              <span className="loading-spinner-wrapper">
                <span className="spinner-dot"></span> Processing Order...
              </span>
            ) : (
              `PLACE ORDER ($${finalTotal.toFixed(2)})`
            )}
          </button>
        </form>

        {/* Right: Checkout Summary */}
        <div className="checkout-summary-column">
          <div className="checkout-summary-card">
            <h3>Cart Review</h3>
            <div className="summary-divider"></div>

            <div className="checkout-summary-items">
              {cart.map((item) => (
                <div className="summary-item-row" key={item.id}>
                  <img src={item.image} alt={item.title} className="summary-item-img" />
                  <div className="summary-item-meta">
                    <span className="summary-item-name">{item.title}</span>
                    <span className="summary-item-qty-price">${item.price.toFixed(2)} × {item.quantity}</span>
                  </div>
                  <span className="summary-item-subtotal">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="checkout-pricing-rows">
              <div className="pricing-row">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="pricing-row">
                <span>Shipping</span>
                <span className="free-shipping">FREE</span>
              </div>
              {discountPercent > 0 && (
                <div className="pricing-row discount-row">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-divider"></div>
              <div className="pricing-row total-row">
                <span>Grand Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
