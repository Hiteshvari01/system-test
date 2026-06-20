import React from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  const {
    products,
    loading,
    error,
    searchQuery,
    selectedCategory,
    sortBy,
  } = useApp();

  // Filter products by category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low-high') {
      return a.price - b.price;
    }
    if (sortBy === 'price-high-low') {
      return b.price - a.price;
    }
    if (sortBy === 'rating-high-low') {
      return b.rating.rate - a.rating.rate;
    }
    return 0; // Default featured order
  });

  // Render skeleton screens while loading
  if (loading) {
    return (
      <section className="products-grid-section">
        <div className="grid-header">
          <div className="skeleton skeleton-title"></div>
        </div>
        <div className="products-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="product-card skeleton-card" key={index}>
              <div className="skeleton skeleton-image"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text-short"></div>
              <div className="skeleton skeleton-button"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Render error message
  if (error) {
    return (
      <section className="products-grid-section error-section">
        <div className="error-card">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ff4d4f"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="products-grid-section">
      <div className="grid-header">
        <h2 className="grid-title">Special Products For You</h2>
        <span className="grid-subtitle">
          Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
        </span>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="empty-results">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8c8c8c"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <h3>No Products Found</h3>
          <p>We couldn't find any products matching your filters or search.</p>
          <button
            className="clear-filters-btn"
            onClick={() => {
              // Trigger clear filters in context
              window.location.reload();
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
