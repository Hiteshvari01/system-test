import React from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import ProductSlider from './components/ProductSlider';
import Filters from './components/Filters';
import ProductGrid from './components/ProductGrid';
import CartModal from './components/CartModal';
import WishlistModal from './components/WishlistModal';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <AppProvider>
      <div className="app-container">
        <Header />
        
        <main className="main-content">
          <ProductSlider />
          <Filters />
          <ProductGrid />
          <Newsletter />
        </main>
        
        <Footer />

        {/* Sliding Modals / Side Drawers */}
        <CartModal />
        <WishlistModal />
      </div>
    </AppProvider>
  );
}

export default App;