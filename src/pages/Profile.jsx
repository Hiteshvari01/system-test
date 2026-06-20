import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Profile() {
  const { user, orders, updateProfile } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Parse active tab from URL query params
  const getTabFromUrl = () => {
    const query = new URLSearchParams(location.search);
    const tab = query.get('tab');
    return ['profile-details', 'orders', 'settings'].includes(tab) ? tab : 'profile-details';
  };

  const [activeTab, setActiveTab] = useState(getTabFromUrl());

  // Input states for Profile Update
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Settings states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingMails, setMarketingMails] = useState(true);
  const [settingsMsg, setSettingsMsg] = useState('');

  // Expandable orders tracking UI
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    document.title = 'My Profile - E-Commerce';
    setActiveTab(getTabFromUrl());
  }, [location.search]);

  const handleTabChange = (tabName) => {
    navigate(`/profile?tab=${tabName}`);
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    
    if (!name.trim()) {
      setProfileMsg({ type: 'error', text: 'Name cannot be empty.' });
      return;
    }

    const res = updateProfile({ name, phone, address });
    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setProfileMsg({ type: '', text: '' }), 3000);
    } else {
      setProfileMsg({ type: 'error', text: res.message });
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettingsMsg('Notification preferences updated successfully!');
    setTimeout(() => setSettingsMsg(''), 3000);
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="profile-page-container animate-fade-in">
      <div className="profile-layout-grid">
        
        {/* Left: Sidebar Tabs */}
        <div className="profile-sidebar-column">
          <div className="profile-card-header">
            <img src={user?.avatar} alt={user?.name} className="profile-sidebar-avatar" />
            <h3>{user?.name}</h3>
            <span className="profile-sidebar-tier">{user?.tier || 'Standard Member'}</span>
            <span className="profile-sidebar-joined">Joined: {user?.joined || 'June 2026'}</span>
          </div>

          <div className="profile-tabs-list">
            <button
              className={`profile-tab-btn ${activeTab === 'profile-details' ? 'active' : ''}`}
              onClick={() => handleTabChange('profile-details')}
            >
              👤 Profile Information
            </button>
            <button
              className={`profile-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => handleTabChange('orders')}
            >
              📦 Order History ({orders.length})
            </button>
            <button
              className={`profile-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => handleTabChange('settings')}
            >
              ⚙️ Account Settings
            </button>
          </div>
        </div>

        {/* Right: Tab Contents */}
        <div className="profile-content-column">
          
          {/* Tab 1: Profile Information */}
          {activeTab === 'profile-details' && (
            <div className="profile-content-card animate-fade-in">
              <h2>Profile Details</h2>
              <p className="card-subtitle">Manage your personal information and delivery address.</p>
              <div className="card-divider"></div>

              <form onSubmit={handleUpdateProfile} className="profile-form">
                {profileMsg.text && (
                  <div className={`form-alert-msg ${profileMsg.type}`}>
                    {profileMsg.text}
                  </div>
                )}

                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address (Cannot be changed)</label>
                  <input type="email" value={user?.email || ''} disabled className="input-disabled" />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +263 77 123 4567"
                  />
                </div>

                <div className="form-group">
                  <label>Default Shipping Address</label>
                  <textarea
                    rows="3"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Provide your main delivery address"
                  />
                </div>

                <button type="submit" className="profile-save-btn">
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Order History */}
          {activeTab === 'orders' && (
            <div className="profile-content-card animate-fade-in">
              <h2>My Order History</h2>
              <p className="card-subtitle">Track and view details of your past and active orders.</p>
              <div className="card-divider"></div>

              {orders.length === 0 ? (
                <div className="orders-empty-state">
                  <div className="orders-empty-icon">📦</div>
                  <h3>No Orders Found</h3>
                  <p>You have not placed any orders yet.</p>
                </div>
              ) : (
                <div className="orders-list-wrapper">
                  {orders.map((order) => {
                    const isExpanded = expandedOrderId === order.id;

                    return (
                      <div className={`order-history-card ${isExpanded ? 'expanded' : ''}`} key={order.id}>
                        {/* Order Header Summary */}
                        <div className="order-summary-header" onClick={() => toggleOrderExpand(order.id)}>
                          <div className="header-meta-group">
                            <span className="order-date">{order.date}</span>
                            <span className="order-id">ID: {order.id}</span>
                          </div>
                          
                          <div className="header-status-group">
                            <span className="order-total-price">${order.total.toFixed(2)}</span>
                            <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                            <span className="expand-chevron">{isExpanded ? '▲' : '▼'}</span>
                          </div>
                        </div>

                        {/* Order Expanded Details */}
                        {isExpanded && (
                          <div className="order-expanded-details animate-fade-in">
                            <div className="card-divider"></div>
                            
                            {/* Tracking visual stages */}
                            <div className="order-tracking-stepper">
                              <div className="step active">
                                <div className="step-circle">✓</div>
                                <span>Order Placed</span>
                              </div>
                              <div className={`step ${['processing', 'shipped', 'delivered'].some(s => order.status.toLowerCase().includes(s)) ? 'active' : ''}`}>
                                <div className="step-circle">✓</div>
                                <span>Processing</span>
                              </div>
                              <div className={`step ${['shipped', 'delivered'].some(s => order.status.toLowerCase().includes(s)) ? 'active' : ''}`}>
                                <div className="step-circle">✓</div>
                                <span>Dispatched</span>
                              </div>
                              <div className={`step ${order.status.toLowerCase() === 'delivered' ? 'active' : ''}`}>
                                <div className="step-circle">✓</div>
                                <span>Delivered</span>
                              </div>
                            </div>

                            <div className="grid-details-split">
                              <div className="delivery-info-pane">
                                <h4>Shipping Method</h4>
                                <p>Standard Secured Courier</p>
                                <h4 style={{ marginTop: '15px' }}>Delivery Address</h4>
                                <p>{order.shipping.name}</p>
                                <p>{order.shipping.address}</p>
                                <p>{order.shipping.city}, {order.shipping.postalCode}</p>
                                <p>{order.shipping.country}</p>
                              </div>

                              <div className="payment-info-pane">
                                <h4>Payment Details</h4>
                                <p>Method: {order.payment.method}</p>
                                <p>Card: {order.payment.cardNumber}</p>
                                <p>Payment Status: <span className="status-paid">Paid Verified</span></p>
                              </div>
                            </div>

                            <div className="order-items-list-pane">
                              <h4>Items Summary</h4>
                              {order.items.map((item) => (
                                <div className="order-item-summary-row" key={item.id}>
                                  <div className="item-img-title">
                                    <img src={item.image} alt={item.title} />
                                    <span>{item.title}</span>
                                  </div>
                                  <span className="item-qty-sub">${item.price.toFixed(2)} × {item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Notification Settings */}
          {activeTab === 'settings' && (
            <div className="profile-content-card animate-fade-in">
              <h2>Account Settings</h2>
              <p className="card-subtitle">Manage your notification and privacy preferences.</p>
              <div className="card-divider"></div>

              <form onSubmit={handleSaveSettings} className="settings-form">
                {settingsMsg && (
                  <div className="form-alert-msg success">
                    {settingsMsg}
                  </div>
                )}

                <div className="settings-section">
                  <h3>Alert Preferences</h3>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="emailNotif"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                    <label htmlFor="emailNotif">
                      <strong>Email Alerts</strong>
                      <span>Receive email receipt invoices and shipment tracking links.</span>
                    </label>
                  </div>

                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="smsNotif"
                      checked={smsNotifications}
                      onChange={(e) => setSmsNotifications(e.target.checked)}
                    />
                    <label htmlFor="smsNotif">
                      <strong>SMS Alerts</strong>
                      <span>Receive text messages when packages are out for delivery.</span>
                    </label>
                  </div>
                </div>

                <div className="card-divider"></div>

                <div className="settings-section">
                  <h3>Marketing & News</h3>
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="marketingMail"
                      checked={marketingMails}
                      onChange={(e) => setMarketingMails(e.target.checked)}
                    />
                    <label htmlFor="marketingMail">
                      <strong>Exclusive Deals</strong>
                      <span>Receive announcements of member-only deals and coupon codes.</span>
                    </label>
                  </div>
                </div>

                <button type="submit" className="profile-save-btn">
                  Save Settings
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
