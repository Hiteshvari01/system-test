import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

export default function AdminDashboard() {
  const {
    products,
    tickets,
    suppliers,
    orders,
    updateProductStock,
    updateProductPrice,
    replyToTicket,
    updateSupplierStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'inventory', 'tickets', 'suppliers'

  // Inventory Search & Edit states
  const [invSearch, setInvSearch] = useState('');
  const [editedPrices, setEditedPrices] = useState({});
  const [editedStocks, setEditedStocks] = useState({});

  // Ticket reply states
  const [ticketReplies, setTicketReplies] = useState({});

  // Set Page Title
  useEffect(() => {
    document.title = 'Ops Cockpit - E-Commerce Administration';
  }, []);

  // 1. CALCULATE ANALYTICS
  // Sum up actual customer orders total
  const customerSalesTotal = orders.reduce((sum, order) => sum + order.total, 0);
  const baseSalesRevenue = 12450.00; // Mock historical base
  const totalSalesRevenue = baseSalesRevenue + customerSalesTotal;

  const totalOrdersCount = 94 + orders.length; // Base + current session
  const averageOrderValue = totalSalesRevenue / totalOrdersCount;
  const pendingTicketsCount = tickets.filter(t => t.status === 'Pending').length;
  const pendingSuppliersCount = suppliers.filter(s => s.status === 'Pending').length;

  // Inventory Search filter
  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(invSearch.toLowerCase()) || 
    p.category.toLowerCase().includes(invSearch.toLowerCase())
  );

  // Price handler
  const handlePriceUpdate = (productId) => {
    const newPrice = editedPrices[productId];
    if (!newPrice || isNaN(newPrice) || parseFloat(newPrice) <= 0) {
      alert('Please enter a valid positive price.');
      return;
    }
    updateProductPrice(productId, newPrice);
    alert('Price updated successfully in catalog!');
  };

  // Stock handler
  const handleStockUpdate = (productId) => {
    const newStock = editedStocks[productId];
    if (newStock === undefined || isNaN(newStock) || parseInt(newStock) < 0) {
      alert('Please enter a valid stock integer.');
      return;
    }
    updateProductStock(productId, newStock);
    alert('Inventory stock updated!');
  };

  // Ticket Reply handler
  const handleSendTicketReply = (ticketId) => {
    const replyText = ticketReplies[ticketId];
    if (!replyText || !replyText.trim()) {
      alert('Please write a reply before resolving.');
      return;
    }
    replyToTicket(ticketId, replyText);
    setTicketReplies(prev => ({ ...prev, [ticketId]: '' }));
    alert('Response dispatched. Ticket resolved!');
  };

  // Render Rating stars
  const renderPriorityBadge = (prio) => {
    const classes = { High: 'badge-danger', Medium: 'badge-warning', Low: 'badge-info' };
    return <span className={`prio-badge ${classes[prio] || 'badge-info'}`}>{prio}</span>;
  };

  return (
    <div className="admin-dashboard-container animate-fade-in">
      <div className="dashboard-header">
        <div>
          <h1>Merchant Operations Center</h1>
          <p className="sub-title">Monitor platform metrics, manage inventories, resolve tickets, and audit suppliers.</p>
        </div>
        <div className="sys-status">
          <span className="dot pulse"></span> Live System Sync Active
        </div>
      </div>

      {/* Dashboard Sub-navigation Tabs */}
      <div className="dashboard-tab-bar">
        <button 
          className={`dash-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Operations & Analytics
        </button>
        <button 
          className={`dash-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          📦 Inventory & Pricing Control ({products.length})
        </button>
        <button 
          className={`dash-tab-btn ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          🎫 Support Desk Help ({pendingTicketsCount} pending)
        </button>
        <button 
          className={`dash-tab-btn ${activeTab === 'suppliers' ? 'active' : ''}`}
          onClick={() => setActiveTab('suppliers')}
        >
          🤝 Supplier Verifications ({pendingSuppliersCount} pending)
        </button>
      </div>

      <div className="dashboard-content-card">
        
        {/* TAB 1: ANALYTICS & TRENDS */}
        {activeTab === 'analytics' && (
          <div className="tab-panel-ops animate-fade-in">
            {/* KPI Counter Cards */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <span className="kpi-icon">💰</span>
                <div className="kpi-meta">
                  <span className="kpi-lbl">Total Sales Revenue</span>
                  <h3>${totalSalesRevenue.toFixed(2)}</h3>
                  <span className="kpi-trend positive">↑ 14.2% from last month</span>
                </div>
              </div>
              <div className="kpi-card">
                <span className="kpi-icon">🛒</span>
                <div className="kpi-meta">
                  <span className="kpi-lbl">Orders Fulfilled</span>
                  <h3>{totalOrdersCount}</h3>
                  <span className="kpi-trend positive">↑ 8.3% this session</span>
                </div>
              </div>
              <div className="kpi-card">
                <span className="kpi-icon">📈</span>
                <div className="kpi-meta">
                  <span className="kpi-lbl">Average Order Value (AOV)</span>
                  <h3>${averageOrderValue.toFixed(2)}</h3>
                  <span className="kpi-trend neutral">Stable conversion velocity</span>
                </div>
              </div>
              <div className="kpi-card">
                <span className="kpi-icon">⚡</span>
                <div className="kpi-meta">
                  <span className="kpi-lbl">Conversion Efficiency</span>
                  <h3>3.4%</h3>
                  <span className="kpi-trend positive">↑ 0.4% checkout recovery</span>
                </div>
              </div>
            </div>

            {/* SVG Visual Sales Line Chart */}
            <div className="analytics-visual-section">
              <div className="chart-header">
                <h3>Sales Revenue Trend (USD)</h3>
                <span>Q2 Performance Metrics</span>
              </div>
              <div className="chart-wrapper">
                <svg viewBox="0 0 800 220" className="revenue-trend-svg">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255, 159, 67, 0.4)"/>
                      <stop offset="100%" stopColor="rgba(255, 159, 67, 0.0)"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="50" y1="20" x2="750" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="50" y1="70" x2="750" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="50" y1="120" x2="750" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="50" y1="170" x2="750" y2="170" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="50" y1="200" x2="750" y2="200" stroke="#cbd5e1" strokeWidth="1.5" />
                  
                  {/* Axes labels */}
                  <text x="15" y="25" fill="#94a3b8" fontSize="10">16k</text>
                  <text x="15" y="75" fill="#94a3b8" fontSize="10">12k</text>
                  <text x="15" y="125" fill="#94a3b8" fontSize="10">8k</text>
                  <text x="15" y="175" fill="#94a3b8" fontSize="10">4k</text>
                  
                  <text x="50" y="215" fill="#64748b" fontSize="11" textAnchor="middle">Jan</text>
                  <text x="190" y="215" fill="#64748b" fontSize="11" textAnchor="middle">Feb</text>
                  <text x="330" y="215" fill="#64748b" fontSize="11" textAnchor="middle">Mar</text>
                  <text x="470" y="215" fill="#64748b" fontSize="11" textAnchor="middle">Apr</text>
                  <text x="610" y="215" fill="#64748b" fontSize="11" textAnchor="middle">May</text>
                  <text x="750" y="215" fill="#64748b" fontSize="11" textAnchor="middle">Jun</text>

                  {/* Gradient Area Fill */}
                  <path 
                    d="M 50 160 Q 120 140, 190 120 T 330 90 T 470 70 T 610 50 T 750 30 L 750 200 L 50 200 Z" 
                    fill="url(#chartGrad)" 
                  />

                  {/* Curved Trend Line */}
                  <path 
                    d="M 50 160 Q 120 140, 190 120 T 330 90 T 470 70 T 610 50 T 750 30" 
                    fill="none" 
                    stroke="var(--primary)" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                  />
                  
                  {/* Interactive node dots */}
                  <circle cx="50" cy="160" r="5" fill="#fff" stroke="var(--primary)" strokeWidth="2.5" />
                  <circle cx="190" cy="120" r="5" fill="#fff" stroke="var(--primary)" strokeWidth="2.5" />
                  <circle cx="330" cy="90" r="5" fill="#fff" stroke="var(--primary)" strokeWidth="2.5" />
                  <circle cx="470" cy="70" r="5" fill="#fff" stroke="var(--primary)" strokeWidth="2.5" />
                  <circle cx="610" cy="50" r="5" fill="#fff" stroke="var(--primary)" strokeWidth="2.5" />
                  <circle cx="750" cy="30" r="5" fill="#fff" stroke="var(--primary)" strokeWidth="2.5" />
                </svg>
              </div>
              <div className="chart-legend">
                <span>🟠 Active Revenue Growth Trend (Enriched locally)</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY & PRICING CONTROLS */}
        {activeTab === 'inventory' && (
          <div className="tab-panel-ops animate-fade-in">
            <div className="ops-search-bar">
              <input
                type="text"
                placeholder="Search products by title or category..."
                value={invSearch}
                onChange={(e) => setInvSearch(e.target.value)}
                className="inv-search-input"
              />
            </div>

            <div className="table-responsive">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Stock Level</th>
                    <th>Price Modifier</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => {
                    const tempPrice = editedPrices[p.id] !== undefined ? editedPrices[p.id] : p.price;
                    const tempStock = editedStocks[p.id] !== undefined ? editedStocks[p.id] : p.stock;
                    
                    const isLowStock = p.stock < 5;
                    const isOutOfStock = p.stock === 0;

                    return (
                      <tr key={p.id}>
                        {/* Title & Img */}
                        <td>
                          <div className="tbl-product-meta">
                            <img src={p.image} alt={p.title} className="tbl-thumbnail" />
                            <span className="tbl-title" title={p.title}>{p.title}</span>
                          </div>
                        </td>
                        
                        {/* Category */}
                        <td className="tbl-cat">{p.category}</td>
                        
                        {/* Stock */}
                        <td>
                          <div className="tbl-stock-adjuster">
                            <input
                              type="number"
                              className={`stock-edit-input ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : ''}`}
                              value={tempStock}
                              onChange={(e) => setEditedStocks({ ...editedStocks, [p.id]: parseInt(e.target.value) })}
                              min="0"
                            />
                            {isOutOfStock ? (
                              <span className="stock-alert out">🔴 Out</span>
                            ) : isLowStock ? (
                              <span className="stock-alert low">⚠️ Low ({p.stock})</span>
                            ) : (
                              <span className="stock-alert ok">🟢 OK</span>
                            )}
                          </div>
                        </td>

                        {/* Price */}
                        <td>
                          <div className="tbl-price-adjuster">
                            <span className="currency-symbol">$</span>
                            <input
                              type="number"
                              step="0.01"
                              className="price-edit-input"
                              value={tempPrice}
                              onChange={(e) => setEditedPrices({ ...editedPrices, [p.id]: e.target.value })}
                            />
                          </div>
                        </td>

                        {/* Save Actions */}
                        <td>
                          <div className="tbl-actions">
                            <button onClick={() => handlePriceUpdate(p.id)} className="tbl-save-btn price-btn">
                              Update Price
                            </button>
                            <button onClick={() => handleStockUpdate(p.id)} className="tbl-save-btn stock-btn">
                              Update Stock
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: HELPDESK TICKET RESOLVER */}
        {activeTab === 'tickets' && (
          <div className="tab-panel-ops animate-fade-in">
            <h3>Support Resolution Center</h3>
            <p className="section-subtext">Address customer queries. Answering support requests updates the customer profile ticket state dynamically.</p>
            
            <div className="tickets-ops-list">
              {tickets.map((t) => {
                const isResolved = t.status === 'Resolved';
                const replyVal = ticketReplies[t.id] || '';

                return (
                  <div className={`ticket-ops-card ${isResolved ? 'resolved' : 'pending'}`} key={t.id}>
                    <div className="ticket-card-header">
                      <div className="ticket-meta-tags">
                        <span className={`status-badge-ops ${t.status.toLowerCase()}`}>{t.status}</span>
                        {renderPriorityBadge(t.priority)}
                        <span className="ticket-date">{t.date}</span>
                      </div>
                      <span className="ticket-id-tag">Ref: {t.id}</span>
                    </div>

                    <div className="ticket-card-body">
                      <h4>Subject: {t.subject}</h4>
                      <p className="ticket-sender">Submitted by: <strong>{t.user}</strong> {t.orderId && `| Associated Order: ${t.orderId}`}</p>
                      <p className="ticket-msg-text">"{t.msg}"</p>
                    </div>

                    <div className="ticket-card-footer">
                      {isResolved ? (
                        <div className="ticket-reply-display">
                          <strong>Response dispatched:</strong>
                          <p>"{t.reply}"</p>
                        </div>
                      ) : (
                        <div className="ticket-reply-form">
                          <textarea
                            rows="2"
                            placeholder="Type support response to resolve this query..."
                            value={replyVal}
                            onChange={(e) => setTicketReplies({ ...ticketReplies, [t.id]: e.target.value })}
                          />
                          <button onClick={() => handleSendTicketReply(t.id)} className="ticket-resolve-btn">
                            Dispatch Reply & Resolve
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: SUPPLIER VERIFICATION */}
        {activeTab === 'suppliers' && (
          <div className="tab-panel-ops animate-fade-in">
            <h3>Supplier Applications</h3>
            <p className="section-subtext">Review business classification requests. Approving lists brands as authenticated retail suppliers.</p>

            <div className="suppliers-ops-grid">
              {suppliers.map((s) => {
                const statusLower = s.status.toLowerCase();
                return (
                  <div className={`supplier-ops-card ${statusLower}`} key={s.id}>
                    <div className="supplier-card-header">
                      <h4>{s.company}</h4>
                      <span className={`supplier-status-badge ${statusLower}`}>{s.status}</span>
                    </div>
                    
                    <div className="supplier-card-body">
                      <p><strong>Classification:</strong> {s.classification}</p>
                      <p><strong>Contact Phone:</strong> {s.phone}</p>
                      <p><strong>Applied Date:</strong> {s.date}</p>
                    </div>

                    {s.status === 'Pending' && (
                      <div className="supplier-card-actions">
                        <button 
                          onClick={() => updateSupplierStatus(s.id, 'Approved')} 
                          className="supplier-btn-ops approve"
                        >
                          Approve Partner
                        </button>
                        <button 
                          onClick={() => updateSupplierStatus(s.id, 'Rejected')} 
                          className="supplier-btn-ops reject"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
