import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import logo from '../assets/logo.png';

export default function Header() {
  const {
    searchQuery,
    setSearchQuery,
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
  } = useApp();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounce search query changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 300);

    return () => clearTimeout(handler);
  }, [localSearch, setSearchQuery]);

  const wishlistCount = wishlist.length;

  return (
    <header className="header-container">
      <div className="header-content">
        {/* Logo */}
        <div className="logo-section">
          <img src={logo} alt="e-commerce logo" className="header-logo" />
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search for Products, Brands and More"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            <button className="search-button" aria-label="Search">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Header Icons & Actions */}
        <div className="header-actions">
          {/* User Profile */}
          <div className="user-profile">
            <span className="user-avatar-icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            <span className="user-name">Tim ▼</span>
          </div>

          {/* Wishlist Button */}
          <button
            className="action-btn"
            onClick={() => setIsWishlistOpen(true)}
            aria-label="Wishlist"
          >
            <div className="icon-wrapper">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="heart-icon-header"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
              </svg>
              {wishlistCount > 0 && (
                <span className="badge-count wishlist-badge">{wishlistCount}</span>
              )}
            </div>
            <span className="action-label">Wishlist</span>
          </button>

          {/* Cart Button */}
          <button
            className="action-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="Cart"
          >
            <div className="icon-wrapper">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="cart-icon-header"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartCount > 0 && (
                <span className="badge-count cart-badge">{cartCount}</span>
              )}
            </div>
            <span className="action-label">Cart</span>
          </button>
        </div>
      </div>
    </header>
  );
}
