import React, { useEffect } from 'react';
import ProductSlider from '../components/ProductSlider';
import Filters from '../components/Filters';
import ProductGrid from '../components/ProductGrid';
import Newsletter from '../components/Newsletter';

export default function Home() {
  useEffect(() => {
    document.title = 'Premium Shop - Discover Deals';
  }, []);

  return (
    <div className="home-page animate-fade-in">
      <ProductSlider />
      <Filters />
      <ProductGrid />
      <Newsletter />
    </div>
  );
}
