import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function CartModal() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
  } = useApp();

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };

    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setIsCartOpen(false)}>
      <div
        className="modal-drawer cart-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <h3>Shopping Cart</h3>
            <span className="drawer-count-badge">{cartCount}</span>
          </div>
          <button
            className="drawer-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Drawer Content */}
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="drawer-empty-state">
              <div className="empty-icon-circle">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <h4>Your Cart is Empty</h4>
              <p>Looks like you haven't added anything to your cart yet.</p>
              <button
                className="drawer-shop-btn"
                onClick={() => setIsCartOpen(false)}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <div className="cart-item-row" key={item.id}>
                  {/* Product Image */}
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.title} />
                  </div>

                  {/* Product Details */}
                  <div className="cart-item-details">
                    <h4 className="cart-item-title">{item.title}</h4>
                    <p className="cart-item-price">${item.price.toFixed(2)}</p>

                    {/* Quantity Selector */}
                    <div className="cart-item-actions">
                      <div className="qty-picker">
                        <button
                          className="qty-picker-btn"
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                        <span className="qty-picker-value">{item.quantity}</span>
                        <button
                          className="qty-picker-btn"
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        className="item-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Subtotal for Item */}
                  <div className="cart-item-subtotal">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="cart-summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span className="summary-label">Shipping</span>
              <span className="summary-value free-shipping">FREE</span>
            </div>
            <div className="cart-summary-row total-row">
              <span className="summary-label">Total</span>
              <span className="summary-value">${cartTotal.toFixed(2)}</span>
            </div>

            <button className="checkout-btn" onClick={() => alert('Proceeding to checkout!')}>
              PROCEED TO CHECKOUT
            </button>

            <button className="clear-cart-btn" onClick={clearCart}>
              Clear All Items
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
