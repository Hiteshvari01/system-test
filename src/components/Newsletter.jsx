import React, { useState } from 'react';
import newsletterBg from '../assets/newslatter.jpg';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    alert(`Thank you for subscribing with: ${email}`);
    setEmail('');
  };

  return (
    <section
      className="newsletter-section"
      style={{ backgroundImage: `url(${newsletterBg})` }}
    >
      <div className="newsletter-overlay">
        <div className="newsletter-content">
          <h3 className="newsletter-title">Join Our Newsletter</h3>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <div className="newsletter-input-wrapper">
              <span className="newsletter-mail-icon">
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
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              <input
                type="email"
                placeholder="Enter Your Email"
                className="newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="newsletter-submit-btn">
              Subscribe &rarr;
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
