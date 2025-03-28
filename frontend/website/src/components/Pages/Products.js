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
import { FaShoppingCart } from 'react-icons/fa';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Products = () => {
  const dispatch = useDispatch();
  const { products, error } = useSelector(state => state.products);
  const token = localStorage.getItem("token");

  // Group products by category
  const categories = products.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});

    // Custom Next Arrow Component
    const CustomNextArrow = (props) => {
      const { className, style, onClick } = props;
      return (
        <div
          className={className}
          style={{ 
            ...style, 
            display: "block", 
            background: "rgba(0,0,0,0.5)", 
            borderRadius: "50%"
          }}
          onClick={onClick}
        />
      );
    };
    
    // Custom Previous Arrow Component
    const CustomPrevArrow = (props) => {
      const { className, style, onClick } = props;
      return (
        <div
          className={className}
          style={{ 
            ...style, 
            display: "block", 
            background: "rgba(0,0,0,0.5)", 
            borderRadius: "50%"
          }}
          onClick={onClick}
        />
      );
    };
  

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    pauseOnHover: true,
    slidesToShow: 5,
    slidesToScroll:3,
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
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
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
            <div key={category} className="prod-category-section">
              <h3 className="prod-category-title">{category}</h3> 
              <div className="prod-list">
                <Slider {...settings}>
                  {categories[category].map(product => {
                    const discountedPrice = (product.price * 0.9).toFixed(2); // 10% discount
                    return (
                      <div key={product._id} className="prod-card">
                        <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                          <div className="prod-image">
                            <img
                              src={product.productImage && product.productImage.startsWith("http")
                                ? product.productImage
                                : no}
                              alt={product.name}
                            />
                          </div>
                        </Link>
                        <div className="prod-details">
                          <div className="prod-category-container">
                            <p className='prod-category'>{product.category}</p>
                            <div className="prod-add-to-cart" onClick={(e) => handleAddToCart(product)}>
                              <FaShoppingCart className="prod-cart-icon" />
                              <p>Add to cart</p>
                            </div>
                          </div>
                          <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                            <h2>{product.name}</h2>
                          </Link>
                          <div className="prod-price-container">
                            <p className="prod-price">₹{discountedPrice}</p>
                            <p className="prod-mrp-price">₹{product.price}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </Slider>
                </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Products;
