import React, { useState, useEffect, useRef } from 'react';
import banner1 from '../assets/banner-1.jpg';
import banner2 from '../assets/banner-2.jpg';

const SLIDES = [
  {
    id: 1,
    image: banner1,
    title: 'New Sale Up To 50% Off',
    subtitle: 'Shop the best electronic and fashion deals',
  },
  {
    id: 2,
    image: banner2,
    title: 'Premium Collection',
    subtitle: 'Elevate your lifestyle with our curated catalog',
  },
];

export default function ProductSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoplayRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + SLIDES.length) % SLIDES.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Autoplay setup
  useEffect(() => {
    if (!isHovered) {
      autoplayRef.current = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [isHovered]);

  return (
    <section
      className="slider-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="slider-wrapper">
        {/* Slides */}
        <div
          className="slider-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {SLIDES.map((slide) => (
            <div className="slide" key={slide.id}>
              <img src={slide.image} alt={slide.title} className="slide-image" />
              <div className="slide-overlay">
                <div className="slide-content">
                  <span className="slide-tag">Limited Offer</span>
                  <h2 className="slide-title">{slide.title}</h2>
                  <p className="slide-subtitle">{slide.subtitle}</p>
                  <button className="slide-cta">Shop Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          className="slider-nav prev-btn"
          onClick={prevSlide}
          aria-label="Previous Slide"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button
          className="slider-nav next-btn"
          onClick={nextSlide}
          aria-label="Next Slide"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        {/* Pagination Dots */}
        <div className="slider-dots">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              className={`dot-btn ${currentIndex === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
