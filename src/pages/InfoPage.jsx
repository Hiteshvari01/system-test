import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function InfoPage() {
  const { pageId } = useParams();
  const { orders, addTicket, addSupplier } = useApp();

  // Accordion FAQ states
  const [openFaq, setOpenFaq] = useState(null);

  // Track Order states
  const [trackId, setTrackId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackError, setTrackError] = useState('');

  // Support Ticket Form states
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketPriority, setTicketPriority] = useState('Medium');
  const [ticketOrderId, setTicketOrderId] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState('');

  // Supplier Form states
  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState('Retailer');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [supplierSubmitted, setSupplierSubmitted] = useState(false);

  // Set Page Title for SEO
  useEffect(() => {
    const titles = {
      faq: 'Frequently Asked Questions - Help Center',
      about: 'About Us - Our Story & Values',
      tickets: 'Support Tickets - Customer Care',
      contact: 'Contact Us - Get in Touch',
      supplier: 'Become a Partner - E-Commerce',
      track: 'Track Your Package - Live Courier Tracking',
      services: 'Services & Membership Tiers',
      community: 'Community Forum & Support',
      terms: 'Terms of Use & Conditions',
      privacy: 'Privacy Policy & Protection Rules',
    };
    document.title = titles[pageId] || 'Information Center - E-Commerce';
    
    // Reset forms when switching pageId
    setTicketSubmitted(false);
    setSupplierSubmitted(false);
    setTrackedOrder(null);
    setTrackError('');
    setTrackId('');
    setTicketSubject('');
    setTicketMsg('');
    setTicketOrderId('');
    setCompanyName('');
    setSupplierPhone('');
  }, [pageId]);

  // Track shipment lookup
  const handleTrackShipment = (e) => {
    e.preventDefault();
    setTrackError('');
    setTrackedOrder(null);

    if (!trackId.trim()) {
      setTrackError('Please enter a valid Order ID.');
      return;
    }

    const cleanedId = trackId.trim().toUpperCase();
    const foundOrder = orders.find((o) => o.id === cleanedId);
    
    if (foundOrder) {
      setTrackedOrder(foundOrder);
    } else {
      // Mock demonstration package if searching a generic test key
      if (cleanedId.startsWith('ORD-') || cleanedId.length > 5) {
        setTrackedOrder({
          id: cleanedId,
          date: new Date().toLocaleDateString(),
          status: 'In Transit',
          shipping: {
            name: 'Demo Customer',
            address: '123 Main Street',
            city: 'Harare',
            country: 'Zimbabwe',
          },
          items: [{ title: 'Sample E-Commerce Product', price: 99.99, quantity: 1 }],
          total: 99.99,
        });
      } else {
        setTrackError('Order ID not found. Ensure ID format matches "ORD-XXXXXX". You can copy one from your Order History.');
      }
    }
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMsg.trim()) return;
    
    const newT = addTicket(ticketSubject, ticketMsg, ticketPriority, ticketOrderId);
    setCreatedTicketId(newT.id);
    setTicketSubmitted(true);
    
    // Clean inputs
    setTicketSubject('');
    setTicketMsg('');
    setTicketOrderId('');
  };

  const handleSupplierSubmit = (e) => {
    e.preventDefault();
    if (!companyName.trim() || !supplierPhone.trim()) return;
    
    addSupplier(companyName, businessType, supplierPhone);
    setSupplierSubmitted(true);
    
    // Clean inputs
    setCompanyName('');
    setSupplierPhone('');
  };

  // 1. FAQ PAGE TEMPLATE
  const renderFaq = () => {
    const faqs = [
      { q: 'How long does delivery take?', a: 'Standard delivery takes between 2 to 5 business days depending on your location. Overnight delivery is available for orders placed before 1:00 PM.' },
      { q: 'What is your return policy?', a: 'We offer a 30-day easy return policy. Items must be in their original packaging, unused, and accompanied by the order invoice.' },
      { q: 'How can I change or cancel my order?', a: 'To edit shipping details or cancel an order, navigate to "Track Order" or contact support immediately. Once an order is marked as "Dispatched", cancellations are no longer possible.' },
      { q: 'What payment options do you support?', a: 'We support all major credit/debit cards (Visa, MasterCard, Amex) and local mobile payment systems. All checkout steps are secured with SSL encryption.' },
      { q: 'Is there a warranty on electronic goods?', a: 'Yes! All electronics products purchased on our store come with a complimentary 2-year warranty covering manufacturer defects.' }
    ];

    return (
      <div className="faq-layout">
        <h2>Frequently Asked Questions</h2>
        <p className="section-subtext">Find answers to commonly asked questions about shipping, payments, and product warranties.</p>
        <div className="faq-accordion-group">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className={`faq-accordion-item ${isOpen ? 'active' : ''}`}>
                <button className="faq-question-btn" onClick={() => setOpenFaq(isOpen ? null : index)}>
                  <span>{faq.q}</span>
                  <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="faq-answer-pane animate-fade-in">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 2. TRACK SHIPMENT TEMPLATE
  const renderTrack = () => {
    return (
      <div className="track-layout">
        <h2>Shipment Tracker</h2>
        <p className="section-subtext">Enter your Order ID below to view live dispatch milestones and courier status updates.</p>

        <form onSubmit={handleTrackShipment} className="track-form-box">
          <input
            type="text"
            placeholder="e.g. ORD-628491"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            className="track-input-field"
          />
          <button type="submit" className="track-submit-btn">Track Shipment</button>
        </form>

        {trackError && <div className="track-err-alert">{trackError}</div>}

        {trackedOrder && (
          <div className="tracked-order-result animate-fade-in">
            <div className="track-header-box">
              <div>
                <span className="lbl">Status</span>
                <h3>{trackedOrder.status === 'In Transit' ? '🚚 In Transit' : '📦 ' + trackedOrder.status}</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="lbl">Order ID</span>
                <p className="order-id-txt">{trackedOrder.id}</p>
              </div>
            </div>

            {/* Stepper tracker */}
            <div className="order-tracking-stepper" style={{ margin: '30px 0 20px' }}>
              <div className="step active">
                <div className="step-circle">✓</div>
                <span>Ordered</span>
              </div>
              <div className={`step ${['processing', 'in transit', 'dispatched', 'delivered'].some(s => trackedOrder.status.toLowerCase().includes(s)) ? 'active' : ''}`}>
                <div className="step-circle">✓</div>
                <span>Processing</span>
              </div>
              <div className={`step ${['in transit', 'dispatched', 'delivered'].some(s => trackedOrder.status.toLowerCase().includes(s)) ? 'active' : ''}`}>
                <div className="step-circle">✓</div>
                <span>In Transit</span>
              </div>
              <div className={`step ${trackedOrder.status.toLowerCase() === 'delivered' ? 'active' : ''}`}>
                <div className="step-circle">✓</div>
                <span>Delivered</span>
              </div>
            </div>

            <div className="track-shipping-meta">
              <div>
                <h4>Shipping Address</h4>
                <p>{trackedOrder.shipping.name}</p>
                <p>{trackedOrder.shipping.address}</p>
                <p>{trackedOrder.shipping.city}, {trackedOrder.shipping.country}</p>
              </div>
              <div>
                <h4>Courier Details</h4>
                <p>Courier: Express Post Services</p>
                <p>Estimated Delivery: 2-3 Business Days</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 3. SUPPORT TICKETS TEMPLATE
  const renderTickets = () => {
    if (ticketSubmitted) {
      return (
        <div className="ticket-success-card animate-fade-in">
          <div className="success-emoji">🎫</div>
          <h2>Ticket Created Successfully</h2>
          <p className="ticket-number">Ticket Reference: <strong>{createdTicketId}</strong></p>
          <p>We have successfully registered your inquiry in our system. You can verify and resolve this ticket from the <strong>Merchant Ops Center</strong>.</p>
          <button onClick={() => setTicketSubmitted(false)} className="return-btn">Open Another Ticket</button>
        </div>
      );
    }

    return (
      <div className="tickets-layout">
        <h2>Customer Support Tickets</h2>
        <p className="section-subtext">Have a question or facing an issue? Open a support ticket and our customer service team will reach out immediately.</p>

        <form onSubmit={handleTicketSubmit} className="ticket-form">
          <div className="form-group">
            <label>Subject / Issue Title</label>
            <input
              type="text"
              placeholder="e.g. Broken item received / Payment verification delay"
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              required
            />
          </div>

          <div className="form-row-two">
            <div className="form-group">
              <label>Associated Order ID (Optional)</label>
              <input
                type="text"
                placeholder="e.g. ORD-123456"
                value={ticketOrderId}
                onChange={(e) => setTicketOrderId(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Urgency Level</label>
              <select value={ticketPriority} onChange={(e) => setTicketPriority(e.target.value)}>
                <option value="Low">Low (General Inquiry)</option>
                <option value="Medium">Medium (Order updates)</option>
                <option value="High">High (Payment/Refund issues)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Detailed Explanation</label>
            <textarea
              rows="5"
              placeholder="Provide a detailed description of the issues you are experiencing..."
              value={ticketMsg}
              onChange={(e) => setTicketMsg(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="ticket-submit-btn">Open Support Ticket</button>
        </form>
      </div>
    );
  };

  // 4. BECOME A SUPPLIER TEMPLATE
  const renderSupplier = () => {
    if (supplierSubmitted) {
      return (
        <div className="ticket-success-card animate-fade-in">
          <div className="success-emoji">🤝</div>
          <h2>Application Received!</h2>
          <p>Thank you for applying to partner with us. Our supplier onboard team will review your application and contact you within 3 business days. You can approve this pending application in the <strong>Merchant Ops Center</strong>.</p>
          <button onClick={() => setSupplierSubmitted(false)} className="return-btn">Submit Another Business</button>
        </div>
      );
    }

    return (
      <div className="supplier-layout">
        <h2>Become A Partner Supplier</h2>
        <p className="section-subtext">Expand your market. Partner with us to list your brand products to millions of shoppers globally with 0% platform commissions for your first 3 months.</p>

        <div className="supplier-benefit-grid">
          <div className="benefit-card">
            <span>📈</span>
            <h4>Massive Reach</h4>
            <p>List your items in front of active global online consumers.</p>
          </div>
          <div className="benefit-card">
            <span>⚡</span>
            <h4>Fast Settlements</h4>
            <p>Receive payouts directly into your business bank account weekly.</p>
          </div>
          <div className="benefit-card">
            <span>🛠️</span>
            <h4>Dedicated Tools</h4>
            <p>Get complete analytics, sales dashboards, and logistics services.</p>
          </div>
        </div>

        <form onSubmit={handleSupplierSubmit} className="supplier-form">
          <h3>Supplier Application Form</h3>
          <div className="form-group">
            <label>Company / Brand Name</label>
            <input
              type="text"
              placeholder="e.g. Apex Electronics Ltd"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div className="form-row-two">
            <div className="form-group">
              <label>Business Classification</label>
              <select value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
                <option value="Manufacturer">Manufacturer</option>
                <option value="Authorized Distributor">Authorized Distributor</option>
                <option value="Retailer">Independent Retailer</option>
              </select>
            </div>
            <div className="form-group">
              <label>Contact Phone Number</label>
              <input
                type="text"
                placeholder="e.g. +263 77 000 0000"
                value={supplierPhone}
                onChange={(e) => setSupplierPhone(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="supplier-submit-btn">Submit Onboarding Form</button>
        </form>
      </div>
    );
  };

  // 5. MOCK COPY LAYOUTS
  const renderMockInfo = (title, subtitle, contentParagraphs) => {
    return (
      <div className="mock-info-layout">
        <h2>{title}</h2>
        <p className="section-subtext">{subtitle}</p>
        <div className="mock-content-body">
          {contentParagraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <Link to="/" className="info-home-btn">← Back to Shop</Link>
      </div>
    );
  };

  const getTemplate = () => {
    switch (pageId) {
      case 'faq':
        return renderFaq();
      case 'track':
        return renderTrack();
      case 'tickets':
      case 'contact':
        return renderTickets();
      case 'supplier':
        return renderSupplier();
      case 'about':
        return renderMockInfo(
          'About Our Platform',
          'Learn about our journey, vision, and core team values.',
          [
            'Founded in 2026, our platform started as a search application focused on delivering the best catalog curation for global electronics, gadgets, and general wear. We have grown to serve thousands of happy customers globally.',
            'Our core values are Speed, Security, and Customer Trust. We partner directly with verified suppliers to ensure every single product listed is authentic and backed by a comprehensive warranty policy.',
            'Thank you for selecting us for your shopping needs. We work continuously to refine our user interface, secure payments, and logistics workflows.'
          ]
        );
      case 'services':
        return renderMockInfo(
          'Services & Membership Tiers',
          'Explore exclusive platform loyalty tiers and membership benefits.',
          [
            'Standard Tier: Free registration. Includes basic shipment notifications, access to customer reviews, and standard support channels.',
            'Gold Tier: Achieved after making $500 in total purchases. Includes 5% discount on selected products and fast-tracked email ticket support.',
            'Platinum Tier: Achieved after making $1,500 in total purchases. Includes priority free shipping, 24/7 dedicated support lines, and early access to warehouse clearances.'
          ]
        );
      case 'community':
        return renderMockInfo(
          'Help & Community Hub',
          'Access forums, community guides, and resolve shopping queries.',
          [
            'Welcome to the Help Hub! Connect with other buyers and verified suppliers on our official message boards.',
            'Browse peer-reviewed guides on setting up gadgets, troubleshooting home appliances, and choosing sizing charts for outerwear collections.',
            'For technical service, click "Support Tickets" or reach out to our active community managers on the social connect handles in the footer.'
          ]
        );
      case 'terms':
        return renderMockInfo(
          'Terms & Conditions',
          'Please read these platform usage terms and conditions carefully.',
          [
            '1. Acceptance: By visiting this application or purchasing listed items, you agree to comply with our return rules, payment guidelines, and cookies policies.',
            '2. Account Security: Users are responsible for preserving password credentials confidential. Mock developer credentials should only be accessed for testing operations.',
            '3. Copyrights: All brand graphics, item catalogs, and design tokens remain the property of E-Commerce.'
          ]
        );
      case 'privacy':
        return renderMockInfo(
          'Privacy & Protection Rules',
          'Understand how we process and safeguard user data.',
          [
            'We value your digital privacy. All card credentials entered during checkout are client-validated and not stored on any servers.',
            'Session user details (Name, Address, Orders) are maintained locally in your browser storage (localStorage) and can be purged by signing out of your account.',
            'We do not sell, lease, or distribute marketing lists or contact emails to third-party providers.'
          ]
        );
      default:
        return (
          <div className="error-card text-center" style={{ padding: '40px' }}>
            <h3>Information Center</h3>
            <p>The informational page you are looking for is not configured.</p>
            <Link to="/" className="retry-btn">Return Home</Link>
          </div>
        );
    }
  };

  return (
    <div className="info-page-container animate-fade-in">
      <div className="info-page-card">
        {getTemplate()}
      </div>
    </div>
  );
}
