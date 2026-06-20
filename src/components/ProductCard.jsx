import React from 'react';
import { useApp } from '../context/AppContext';

export default function ProductCard({ product }) {
  const { cart, addToCart, updateQuantity, wishlist, toggleWishlist } = useApp();

  // Check if item is in cart
  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Check if item is in wishlist
  const isWishlisted = wishlist.some((item) => item.id === product.id);

  // Format title to avoid extremely long texts in card layout
  const displayTitle =
    product.title.length > 45 ? product.title.slice(0, 42) + '...' : product.title;

  return (
    <div className={`product-card ${quantity > 0 ? 'in-cart' : ''}`}>
      {/* Wishlist Toggle Button */}
      <button
        className={`wishlist-toggle-btn ${isWishlisted ? 'active' : ''}`}
        onClick={() => toggleWishlist(product)}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={isWishlisted ? '#ff4d4f' : 'none'}
          stroke={isWishlisted ? '#ff4d4f' : '#8c8c8c'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>

      {/* Image Container */}
      <div className="product-image-container">
        <img src={product.image} alt={product.title} className="product-image" loading="lazy" />
      </div>

      {/* Details */}
      <div className="product-details">
        <h3 className="product-title" title={product.title}>
          {displayTitle}
        </h3>
        <p className="product-price">
          From <span className="price-val">${product.price.toFixed(2)}</span>
        </p>

        {/* Add / Quantity Button */}
        <div className="product-action-wrapper">
          {quantity === 0 ? (
            <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
              <span className="btn-icon">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13 2v9h9v2h-9v9h-2v-9H2v-2h9V2h2z"/>
                </svg>
              </span>
              ADD TO CART
            </button>
          ) : (
            <div className="quantity-controls-container">
              <button
                className="qty-btn qty-btn-minus"
                onClick={() => updateQuantity(product.id, -1)}
                aria-label="Decrease quantity"
              >
                {quantity === 1 ? (
                  /* Trash icon for quantity = 1 */
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                ) : (
                  /* Minus icon for quantity > 1 */
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                )}
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                className="qty-btn qty-btn-plus"
                onClick={() => updateQuantity(product.id, 1)}
                aria-label="Increase quantity"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Added Indicator */}
        {quantity > 0 && (
          <div className="added-indicator">
            <span className="indicator-dot"></span>
            Added To Cart
          </div>
        )}
      </div>
    </div>
  );
}
