import React from 'react';
import { useApp } from '../context/AppContext';

export default function Filters() {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
  } = useApp();

  // Helper to format category name nicely for UI
  const formatCategory = (cat) => {
    if (!cat) return '';
    if (cat.toLowerCase() === 'all') return 'All Products';
    return cat
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="filters-container">
      <div className="filters-wrapper">
        {/* Categories Pills */}
        <div className="categories-pills-container">
          <span className="filter-label">Categories:</span>
          <div className="categories-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {formatCategory(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Sorting Dropdown */}
        <div className="sort-section">
          <label htmlFor="sort-select" className="sort-label">
            Sort By:
          </label>
          <div className="select-wrapper">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="">Default (Featured)</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="rating-high-low">Rating: High to Low</option>
            </select>
            <span className="select-arrow">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
