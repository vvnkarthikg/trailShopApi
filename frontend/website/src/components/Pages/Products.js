import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import './Products.css';
import no from '../images/no.jpg';
import bannerImage from '../images/minibanner6.png';
import brand1 from '../images/kinderjoy.png';
import brand2 from '../images/parle.svg';
import brand3 from '../images/tictac.png';
import { addToCart } from '../../store/slice/cartSlice';
import ProductSlider from './ProductSlider';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

import Slider from "react-slick";
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
  

  const CustomNextArrow = ({ onClick }) => {
    return (
      <div className="prod-custom-arrow prod-next-arrow" onClick={onClick}>
        <FaArrowRight />
      </div>
    );
  };
  
  const CustomPrevArrow = ({ onClick }) => {
    return (
      <div className="prod-custom-arrow prod-prev-arrow" onClick={onClick}>
        <FaArrowLeft />
      </div>
    );
  };
  

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    pauseOnHover: true,
    slidesToShow: 5,
    slidesToScroll:3,
    nextArrow: <CustomNextArrow />,
  prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024, // Large screens
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768, // Medium screens (tablets)
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480, // Small screens (mobile)
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1
        }
      }
    ],
    
    accessibility: true,
    centerMode: false
  };
  

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
