import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { login, user } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Find redirect destination if redirected by ProtectedRoute middleware
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    document.title = 'Sign In - E-Commerce';
    
    // If already logged in, redirect away
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    // Simulate login lag
    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.message);
      }
    }, 800);
  };

  return (
    <div className="auth-page-container animate-fade-in">
      <div className="auth-card">
        <h2>Sign In</h2>
        <p className="auth-subtitle">Access your orders, profile settings, and checkout items.</p>
        
        {error && <div className="auth-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. tim@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer-text">
          Don't have an account? <Link to="/register" state={{ from: location.state?.from }}>Register here</Link>
        </div>

        {/* Guest credentials helper card */}
        <div className="auth-credentials-tip">
          <strong>💡 Developer Testing Account:</strong>
          <p>Email: <code>tim@example.com</code></p>
          <p>Password: <code>123456</code></p>
        </div>
      </div>
    </div>
  );
}
