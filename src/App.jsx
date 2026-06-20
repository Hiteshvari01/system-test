import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import WishlistModal from './components/WishlistModal';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import InfoPage from './pages/InfoPage';
import AdminDashboard from './pages/AdminDashboard';

// Middleware
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <div className="app-container">
          <Header />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              
              {/* Protected Routes */}
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Informational Pages */}
              <Route path="/info/:pageId" element={<InfoPage />} />
            </Routes>
          </main>
          
          <Footer />

          {/* Sliding Modals / Side Drawers */}
          <CartModal />
          <WishlistModal />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;