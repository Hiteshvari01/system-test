import React from 'react';
import logo from '../assets/logo.png';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="footer-container">
      <div className="footer-top">
        {/* Branding & Contact Column */}
        <div className="footer-col branding-col">
          <img src={logo} alt="e-commerce logo" className="footer-logo" />
          <p className="contact-info address">69 Selous Ave, Harare, Zimbabwe</p>
          <p className="contact-info phone">Support: (+263) 03 0000052</p>
          <p className="contact-info email">Email: info@demo.com</p>
        </div>

        {/* Help Center Column */}
        <div className="footer-col">
          <h4 className="footer-col-title">Help Center</h4>
          <ul className="footer-links">
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#about">About E-Commerce</a></li>
            <li><a href="#tickets">Support Tickets</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>

        {/* Quick Links Column */}
        <div className="footer-col">
          <h4 className="footer-col-title">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="#supplier">Become A Supplier</a></li>
            <li><a href="#track">Track Order</a></li>
            <li><a href="#services">Services & Membership</a></li>
            <li><a href="#community">Help & Community</a></li>
          </ul>
        </div>

        {/* Buy On E-Commerce Column */}
        <div className="footer-col">
          <h4 className="footer-col-title">Buy On E-Commerce</h4>
          <ul className="footer-links">
            <li><a href="#terms">Terms & Conditions</a></li>
            <li><a href="#privacy">Privacy & Rules</a></li>
          </ul>
        </div>

        {/* Download App Column */}
        <div className="footer-col app-download-col">
          <h4 className="footer-col-title">Download App</h4>
          <div className="app-buttons">
            {/* Google Play Button */}
            <a href="#playstore" className="app-btn play-store-btn" aria-label="Get it on Google Play">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.25 3.125a1.375 1.375 0 0 0-.583 1.118v15.514c0 .484.254.912.639 1.14l10.15-10.15L5.25 3.125zm11.238 8.013l-3.238 3.238 3.238 3.238 4.296-2.435c.783-.444.783-1.636 0-2.08l-4.296-2.435c-.01-.005-.02-.008-.03-.012-.027-.008-.052-.016-.07-.012zm-3.21 3.208l3.197 3.197 1.09-1.09-4.287-2.107zm-7.61 7.61a1.365 1.365 0 0 0 1.258.077l10.37-5.875-3.69-3.69L5.25 21.95z" />
              </svg>
              <div className="app-btn-text">
                <span className="app-btn-subtitle">GET IT ON</span>
                <span className="app-btn-title">Google Play</span>
              </div>
            </a>

            {/* App Store Button */}
            <a href="#appstore" className="app-btn app-store-btn" aria-label="Download on the App Store">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.82M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39" />
              </svg>
              <div className="app-btn-text">
                <span className="app-btn-subtitle">Download on the</span>
                <span className="app-btn-title">App Store</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">&copy; {new Date().getFullYear()} E-Commerce. All Rights Reserved</p>

        {/* Social Connected */}
        <div className="social-connected">
          <span className="social-label">Stay Connected:</span>
          <div className="social-icons">
            <a href="#facebook" className="social-link" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h2.9V1.5h-4c-4.4 0-5.4 3.2-5.4 5.2v2.26H6.66v3.7h2.33v9.84h4.5v-9.84h3.58l.7-3.7z" />
              </svg>
            </a>
            <a href="#twitter" className="social-link" aria-label="Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.986 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
            <a href="#instagram" className="social-link" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#pinterest" className="social-link" aria-label="Pinterest">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.16-.1-.95-.19-2.4.04-3.43.21-.92 1.34-5.67 1.34-5.67s-.34-.68-.34-1.69c0-1.58.92-2.76 2.06-2.76.97 0 1.44.73 1.44 1.61 0 .98-.62 2.44-.94 3.8-.27 1.13.56 2.05 1.67 2.05 2 0 3.55-2.11 3.55-5.16 0-2.7-1.94-4.58-4.7-4.58-3.2 0-5.08 2.4-5.08 4.88 0 .97.37 2.01.84 2.58.09.11.1.21.07.32-.08.33-.26 1.06-.3 1.2-.05.21-.17.26-.39.16-1.45-.67-2.35-2.79-2.35-4.49 0-3.66 2.66-7.02 7.67-7.02 4.03 0 7.16 2.87 7.16 6.7 0 4-2.52 7.22-6.02 7.22-1.18 0-2.28-.61-2.66-1.33l-.73 2.76c-.26 1.01-1 2.28-1.5 3.09C10.12 23.82 11.04 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          className="back-to-top-btn"
          onClick={scrollToTop}
          aria-label="Back to Top"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
      </div>
    </footer>
  );
}
