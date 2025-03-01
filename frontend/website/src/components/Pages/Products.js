import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Products.css';
import no from '../images/no.jpg';
import bannerImage from '../images/minibanner5.png';
import brand1 from '../images/kinderjoy.png';
import brand2 from '../images/parle.svg';
import brand3 from '../images/tictac.png';
import { FaShoppingCart } from 'react-icons/fa';

const Products = () => {
  const { products, error } = useSelector(state => state.products); // Get products from Redux

  // Group products by category
  const categories = products.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <>
      <div className="banner-image">
        <img src={bannerImage} alt="Banner" className="banner-img" />
      </div>

      {/* Brand Logos Section */}
      <div className="brand-section">
        <h2 className="brand-heading">Brands We Sell</h2>
        <div className="brand-logos">
          <img src={brand1} alt="Brand 1" className="brand-logo" />
          <img src={brand2} alt="Brand 2" className="brand-logo" />
          <img src={brand3} alt="Brand 3" className="brand-logo" />
        </div>
      </div>

      <div className="home-container">
        {error && <p className="error-text">{error}</p>}
        
        {products.length === 0 ? (
          <p>No products available</p>
        ) : (
          Object.keys(categories).map(category => (
            <div key={category} className="category-section">
              <h3 className="category-title">
                {category} 
              </h3>
              
              <div className="prod-list">
                {categories[category].map(product => {
                  const discountedPrice = (product.price * 0.9).toFixed(2); // 10% discount
                  return (
                    <Link key={product._id} to={`/products/${product.productId}`} style={{ textDecoration: 'none' }}>
                      <div className="prod-card">
                        <div className="prod-image">
                          <img
                            src={product.productImage && product.productImage.startsWith("http")
                             ? product.productImage 
                              : no}
                            alt={product.name}
                            className="product-image"
                          />

                          {/* Add to Cart Button */}
                          {/* <button className="add-to-cart-btn">Add to Cart</button> */}

                          {/* Cart Icon */}
                          <div className="cart-icon-container">
                            <FaShoppingCart className="cart-icon"/>
                          </div>

                          {/* Add to Cart Text */}
                          <p className="add-to-cart-text">Add to Cart</p>

                          {/* Product Details */}
                          {/* <p className="prod-details">{product.description}</p> */}

                          {/* Product Rating */}
                        </div>
                        <div className="prod-details">
                          <div className="prod-category-container">
                          <p className='prod-category'>{product.category}</p>
                          <div className="prod-add-to-cart">
                            <FaShoppingCart className="cart-icon"/>
                             <p>Add to cart</p> 
                            </div>
                          </div>
                          
                          <h2>{product.name}</h2>
                          <div className="prod-price-container">
                            <p className="prod-price">₹{discountedPrice}</p>
                            <p className="prod-mrp-price">
                              ₹{product.price}
                            </p>
                            
                            

                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Products;
