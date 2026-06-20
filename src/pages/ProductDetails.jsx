import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetails() {
  const { id } = useParams();
  const { products, loading, cart, addToCart, updateQuantity, wishlist, toggleWishlist } = useApp();
  const [product, setProduct] = useState(null);
  const [imgZoomStyle, setImgZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((p) => p.id === parseInt(id));
      if (found) {
        setProduct(found);
        document.title = `${found.title} - E-Commerce`;
      }
    }
  }, [id, products]);

  // Handle image zoom on hover
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setImgZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${product.image})`,
    });
  };

  const handleMouseLeave = () => {
    setImgZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };

  if (loading || !products.length) {
    return (
      <div className="product-details-page main-content skeleton-page">
        <div className="details-grid">
          <div className="skeleton skeleton-image-details"></div>
          <div className="skeleton-info-details">
            <div className="skeleton skeleton-text" style={{ width: '80%', height: '36px' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '40%', height: '24px', marginTop: '15px' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '20%', height: '32px', marginTop: '20px' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '100%', height: '80px', marginTop: '30px' }}></div>
            <div className="skeleton skeleton-button" style={{ width: '200px', height: '48px', marginTop: '30px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page error-details">
        <div className="error-card">
          <h3>Product Not Found</h3>
          <p>The product you are looking for does not exist or has been removed.</p>
          <Link to="/" className="retry-btn">Back to Shop</Link>
        </div>
      </div>
    );
  }

  // Related products (same category, excluding current product)
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Cart status
  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isWishlisted = wishlist.some((item) => item.id === product.id);

  // Render Rating Stars
  const renderStars = (rate) => {
    const stars = [];
    const fullStars = Math.floor(rate);
    const hasHalf = rate % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} className="star filled">★</span>
        );
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <span key={i} className="star half">★</span>
        );
      } else {
        stars.push(
          <span key={i} className="star empty">★</span>
        );
      }
    }
    return stars;
  };

  return (
    <div className="product-details-page animate-fade-in">
      <div className="breadcrumb">
        <Link to="/">Shop</Link> &gt; <span className="cat-breadcrumb">{product.category}</span> &gt; <span>{product.title}</span>
      </div>

      <div className="details-grid">
        {/* Product Images Column */}
        <div className="details-image-section">
          <div className="main-image-wrapper">
            <img
              src={product.image}
              alt={product.title}
              className="details-main-image"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
            {/* Magnifier zoom window */}
            <div className="zoom-preview" style={imgZoomStyle}></div>
          </div>
          
          <div className="image-assurance-badges">
            <div className="badge-item">
              <span className="badge-icon">🚚</span>
              <span>Free Worldwide Delivery</span>
            </div>
            <div className="badge-item">
              <span className="badge-icon">🛡️</span>
              <span>2 Year Official Warranty</span>
            </div>
            <div className="badge-item">
              <span className="badge-icon">🔄</span>
              <span>30 Day Easy Returns</span>
            </div>
          </div>
        </div>

        {/* Product Info Column */}
        <div className="details-info-section">
          <span className="details-category-tag">{product.category}</span>
          <h1 className="details-title">{product.title}</h1>
          
          {/* Rating */}
          {product.rating && (
            <div className="details-rating-wrapper">
              <div className="stars-container">{renderStars(product.rating.rate)}</div>
              <span className="rating-score">{product.rating.rate} / 5</span>
              <span className="rating-divider">|</span>
              <span className="rating-count">{product.rating.count} Customer Reviews</span>
            </div>
          )}

          <div className="details-price-card">
            <span className="details-price">${product.price.toFixed(2)}</span>
            <span className="in-stock-label">🟢 In Stock (Ready to Ship)</span>
          </div>

          <div className="details-divider"></div>

          <div className="details-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="details-divider"></div>

          {/* Action Row */}
          <div className="details-actions-row">
            {quantity === 0 ? (
              <button className="details-add-to-cart-btn" onClick={() => addToCart(product)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                  <path d="M13 2v9h9v2h-9v9h-2v-9H2v-2h9V2h2z"/>
                </svg>
                ADD TO CART
              </button>
            ) : (
              <div className="details-quantity-picker">
                <button className="details-qty-btn" onClick={() => updateQuantity(product.id, -1)}>
                  -
                </button>
                <span className="details-qty-val">{quantity}</span>
                <button className="details-qty-btn" onClick={() => updateQuantity(product.id, 1)}>
                  +
                </button>
              </div>
            )}

            <button
              className={`details-wishlist-btn ${isWishlisted ? 'active' : ''}`}
              onClick={() => toggleWishlist(product)}
              aria-label="Toggle Wishlist"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={isWishlisted ? '#ff4d4f' : 'none'}
                stroke={isWishlisted ? '#ff4d4f' : '#4a5568'}
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="related-products-section">
          <h2 className="related-title">You May Also Like</h2>
          <div className="products-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
