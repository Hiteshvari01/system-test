import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function UserDropdown({ isOpen, onClose }) {
  const { user, logout, cart, cartCount, cartTotal, updateQuantity, removeFromCart } = useApp();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'cart', 'info'
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="user-dropdown-panel" ref={dropdownRef}>
      {/* Dropdown Tabs */}
      <div className="dropdown-tabs">
        <button
          className={`dropdown-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Profile
        </button>
        <button
          className={`dropdown-tab-btn ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => setActiveTab('cart')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Cart ({cartCount})
        </button>
        <button
          className={`dropdown-tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Quick Links
        </button>
      </div>

      {/* Tab Content */}
      <div className="dropdown-tab-content">
        
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="tab-pane profile-pane animate-fade-in">
            {user ? (
              <div className="user-profile-summary">
                <div className="user-profile-header">
                  <img src={user.avatar} alt={user.name} className="dropdown-avatar" />
                  <div className="user-profile-meta">
                    <h4 className="dropdown-user-name">{user.name}</h4>
                    <span className="dropdown-user-email">{user.email}</span>
                    <span className="user-badge">{user.tier || 'Standard Member'}</span>
                  </div>
                </div>
                
                <div className="dropdown-menu-list">
                  <button onClick={() => handleNavigate('/profile')} className="dropdown-menu-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    Account Profile
                  </button>
                  <button onClick={() => handleNavigate('/profile?tab=orders')} className="dropdown-menu-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                    My Orders
                  </button>
                  <button onClick={() => handleNavigate('/profile?tab=settings')} className="dropdown-menu-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    Notification Settings
                  </button>
                  <button onClick={() => handleNavigate('/admin')} className="dropdown-menu-item admin-link-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="9" y1="3" x2="9" y2="21"></line>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                    </svg>
                    Merchant Ops Center
                  </button>
                </div>
                
                <button onClick={handleLogout} className="dropdown-logout-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="dropdown-auth-prompt">
                <div className="lock-icon-container">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h4>Welcome Guest</h4>
                <p>Sign in to track orders, manage your profile, and receive rewards.</p>
                <div className="auth-prompt-buttons">
                  <button onClick={() => handleNavigate('/login')} className="dropdown-auth-btn login-btn">
                    Log In
                  </button>
                  <button onClick={() => handleNavigate('/register')} className="dropdown-auth-btn register-btn">
                    Register
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cart Preview Tab */}
        {activeTab === 'cart' && (
          <div className="tab-pane cart-pane animate-fade-in">
            {cart.length === 0 ? (
              <div className="dropdown-empty-cart">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <p>Your shopping cart is empty</p>
                <button onClick={() => { onClose(); navigate('/'); }} className="go-shop-btn">
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="dropdown-cart-list">
                <div className="mini-cart-items">
                  {cart.slice(0, 3).map((item) => (
                    <div className="mini-cart-item" key={item.id}>
                      <img src={item.image} alt={item.title} />
                      <div className="mini-item-info">
                        <span className="mini-item-title">{item.title}</span>
                        <span className="mini-item-price">${item.price.toFixed(2)} × {item.quantity}</span>
                      </div>
                      <div className="mini-item-actions">
                        <button onClick={() => updateQuantity(item.id, 1)} className="mini-qty-btn">+</button>
                        <button onClick={() => updateQuantity(item.id, -1)} className="mini-qty-btn">-</button>
                        <button onClick={() => removeFromCart(item.id)} className="mini-remove-btn">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  {cart.length > 3 && (
                    <div className="more-items-notice">
                      and {cart.length - 3} more items in cart
                    </div>
                  )}
                </div>
                
                <div className="dropdown-cart-footer">
                  <div className="mini-cart-total">
                    <span>Total:</span>
                    <span className="total-amt">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="mini-cart-buttons">
                    <button onClick={() => handleNavigate('/cart')} className="mini-btn view-cart-btn">
                      View Cart
                    </button>
                    <button onClick={() => handleNavigate('/checkout')} className="mini-btn checkout-btn-accent">
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Links Tab */}
        {activeTab === 'info' && (
          <div className="tab-pane info-pane animate-fade-in">
            <h4 className="quick-links-title">Customer Assistance</h4>
            <div className="quick-links-grid">
              <button onClick={() => handleNavigate('/info/faq')} className="quick-link-box">
                <span className="quick-link-icon">❓</span>
                <span className="quick-link-text">FAQs</span>
              </button>
              <button onClick={() => handleNavigate('/info/track')} className="quick-link-box">
                <span className="quick-link-icon">📦</span>
                <span className="quick-link-text">Track Order</span>
              </button>
              <button onClick={() => handleNavigate('/info/tickets')} className="quick-link-box">
                <span className="quick-link-icon">🎫</span>
                <span className="quick-link-text">Support Tickets</span>
              </button>
              <button onClick={() => handleNavigate('/info/contact')} className="quick-link-box">
                <span className="quick-link-icon">📞</span>
                <span className="quick-link-text">Contact Us</span>
              </button>
              <button onClick={() => handleNavigate('/info/privacy')} className="quick-link-box">
                <span className="quick-link-icon">🛡️</span>
                <span className="quick-link-text">Privacy Rules</span>
              </button>
              <button onClick={() => handleNavigate('/info/terms')} className="quick-link-box">
                <span className="quick-link-icon">📄</span>
                <span className="quick-link-text">Terms of Use</span>
              </button>
            </div>
            
            <div className="info-promo-banner">
              <span className="promo-badge">Summer Deal</span>
              <p>Become a supplier & enjoy 0% platform fees for 3 months!</p>
              <button onClick={() => handleNavigate('/info/supplier')} className="promo-btn-link">Learn More →</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
