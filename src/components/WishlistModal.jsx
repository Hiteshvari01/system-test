import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function WishlistModal() {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
    cart,
  } = useApp();

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsWishlistOpen(false);
    };

    if (isWishlistOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isWishlistOpen, setIsWishlistOpen]);

  if (!isWishlistOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setIsWishlistOpen(false)}>
      <div
        className="modal-drawer wishlist-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <h3>My Wishlist</h3>
            <span className="drawer-count-badge wishlist-count-badge">
              {wishlist.length}
            </span>
          </div>
          <button
            className="drawer-close-btn"
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close wishlist"
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
          {wishlist.length === 0 ? (
            <div className="drawer-empty-state">
              <div className="empty-icon-circle wishlist-empty-circle">
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
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h4>Your Wishlist is Empty</h4>
              <p>Items you add to your wishlist will be saved here.</p>
              <button
                className="drawer-shop-btn"
                onClick={() => setIsWishlistOpen(false)}
              >
                Explore Products
              </button>
            </div>
          ) : (
            <div className="wishlist-items-list">
              {wishlist.map((item) => {
                const isInCart = cart.some((cItem) => cItem.id === item.id);

                return (
                  <div className="wishlist-item-row" key={item.id}>
                    {/* Image */}
                    <div className="wishlist-item-image">
                      <img src={item.image} alt={item.title} />
                    </div>

                    {/* Details */}
                    <div className="wishlist-item-details">
                      <h4 className="wishlist-item-title">{item.title}</h4>
                      <p className="wishlist-item-price">${item.price.toFixed(2)}</p>

                      <div className="wishlist-item-actions">
                        {/* Add to Cart button */}
                        <button
                          className={`wishlist-add-to-cart-btn ${isInCart ? 'already-added' : ''}`}
                          onClick={() => addToCart(item)}
                          disabled={isInCart}
                        >
                          {isInCart ? 'In Cart' : 'Add to Cart'}
                        </button>

                        {/* Remove from Wishlist */}
                        <button
                          className="wishlist-remove-btn"
                          onClick={() => toggleWishlist(item)}
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
