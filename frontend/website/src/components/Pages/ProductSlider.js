// src/components/ProductSlider.js
import React from 'react';
import Slider from "react-slick";
import { Link } from 'react-router-dom';
import { FaChevronLeft,FaChevronRight } from "react-icons/fa";
import './ProductSlider.css'; // Optional CSS specific to this component
import noImage from '../images/no.jpg';

const CustomNextArrow = ({ onClick }) => (
  <div className="prod-custom-arrow prod-next-arrow" onClick={onClick}>
    <FaChevronRight />
  </div>
);

const CustomPrevArrow = ({ onClick }) => (
  <div className="prod-custom-arrow prod-prev-arrow" onClick={onClick}>
    <FaChevronLeft />
  </div>
);

const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  pauseOnHover: true,
  slidesToShow: 5,
    slidesToScroll: 3,
    centerMode: false,
  nextArrow: <CustomNextArrow />,
  prevArrow: <CustomPrevArrow />,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 5, slidesToScroll: 3,variableWidth: true    } },
    { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2, initialSlide: 2,variableWidth: true    } },
    { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1,variableWidth: true    } }
  ]
};

const ProductSlider = ({ title, products, onAddToCart }) => {
  const dynamicSettings = {
    ...sliderSettings,
    slidesToShow: Math.min(products.length, 5), // adapt to number of products
    slidesToScroll: Math.min(products.length, 3), // scroll only available items
    infinite: products.length > 5, // loop only if enough items
  };
  return (
    <div className="prod-slider-category-section">
      <h3 className="prod-slider-category-title">{title}</h3>
      <div className="prod-slider-list">
        <Slider {...dynamicSettings}>
          {products.map((product) => {
            const discountedPrice = (product.price * 0.9).toFixed(2);
            return (
              <div key={product._id} className="prod-slider-card">
                
                <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                  <div className="prod-slider-card-image">
                    <img
                      src={product.productImage && product.productImage.startsWith("http")
                        ? product.productImage
                        : noImage}
                      alt={product.name}
                    />
                  </div>
                </Link>
                <div className="prod-slider-card-details">
                  <div className="prod-slider-card-category-container">
                    <p className='prod-slider-card-category'>{product.category}</p>
                    <div className="prod-slider-card-add-to-cart" onClick={() => onAddToCart(product)}>
                      <p>Add to cart</p>
                    </div>
                  </div>
                  <div className="prod-slider-card-title-pack">
                    <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                      <h2>{product.name}</h2>
                    </Link>
                    {product.packOf > 1 && (
                    <p className="prod-slider-pack-info">(pack of {product.packOf})</p>
                      )}
                  </div>
                  
                  <div className="prod-slider-card-price-container">
                    <p className="prod-slider-card-price">₹{discountedPrice}</p>
                    <p className="prod-slider-card-mrp-price">₹{product.price}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default ProductSlider;
