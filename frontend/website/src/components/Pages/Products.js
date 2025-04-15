import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Products.css';
import bannerImage from '../images/minibanner6.png';
import brand1 from '../images/kinderjoy.png';
import brand2 from '../images/parle.svg';
import brand3 from '../images/tictac.png';
import { addToCart } from '../../store/slice/cartSlice';
import ProductSlider from './ProductSlider';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Products = () => {
  const dispatch = useDispatch();
  const { products, error } = useSelector(state => state.products);
  const token = localStorage.getItem("token");

  // Group products by category
  const categories = products.reduce((acc, product) => {
    const category = product.category.toLowerCase(); // Normalize to lowercase
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});
  



  const handleAddToCart = (product) => {
    dispatch(addToCart({
      token,
      pId: product._id,
      quantity: 1, // Default quantity (adjust if needed)
      name: product.name,
      price: product.price
    }));
    alert(`${product.name} added to cart!`);
  };

  return (
    <>
      <div className="prod-banner-image">
        <img src={bannerImage} alt="Banner" className="prod-banner-img" />
      </div>

      {/* Brand Logos Section */}
      <div className="prod-brand-section">
        <h2 className="prod-brand-heading">Brands We Sell</h2>
        <div className="prod-brand-logos">
          <img src={brand1} alt="Brand 1" className="prod-brand-logo" />
          <img src={brand2} alt="Brand 2" className="prod-brand-logo" />
          <img src={brand3} alt="Brand 3" className="prod-brand-logo" />
        </div>
      </div>

      <div className="prod-home-container">
        {error && <p className="error-text">{error}</p>}

        {products.length === 0 ? (
  <p>No products available</p>
) : (
  Object.keys(categories).map(category => (
    <ProductSlider
      key={category}
      title={category}
      products={categories[category]}
      onAddToCart={handleAddToCart}
    />
  ))
)}

      </div>
    </>
  );
};

export default Products;
