import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import UserDropdown from './UserDropdown';
import logo from '../assets/logo.png';

export default function Header() {
  const {
    searchQuery,
    setSearchQuery,
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    user,
  } = useApp();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Debounce search query changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localSearch);
      // Redirect to home if user searches while on another page
      if (localSearch.trim() !== '' && location.pathname !== '/') {
        navigate('/');
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [localSearch, setSearchQuery, location.pathname, navigate]);

  // Sync header search query if reset externally
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const wishlistCount = wishlist.length;

  return (
    <header className="header-container">
      <div className="header-content">
        
        {/* Logo */}
        <Link to="/" className="logo-section" aria-label="Go to Homepage">
          <img src={logo} alt="e-commerce logo" className="header-logo" />
        </Link>

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
          
          {/* User Profile Action Trigger */}
          <div className="user-profile-wrapper">
            <div 
              className={`user-profile ${isDropdownOpen ? 'active' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              role="button"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              {user ? (
                <>
                  <img src={user.avatar} alt={user.name} className="header-user-avatar" />
                  <span className="user-name">{user.name} ▼</span>
                </>
              ) : (
                <>
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
                  <span className="user-name">Sign In ▼</span>
                </>
              )}
            </div>
            
            {/* Dynamic Mega Dropdown Panel */}
            <UserDropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)} />
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
            <span className="action-label hide-mobile">Wishlist</span>
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
            <span className="action-label hide-mobile">Cart</span>
          </button>

        </div>
      </div>
    </header>
  );
}
