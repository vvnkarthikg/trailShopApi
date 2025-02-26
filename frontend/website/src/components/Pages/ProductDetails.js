import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import QuantityModal from './QuantityModal';
import './ProductDetails.css';
import no from '../images/no.jpg';

const ProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { products, error } = useSelector(state => state.products); // Get products from Redux 
    console.log(products);  
    const product = products?.find(p => productId === productId);
    
    const [showModal, setShowModal] = useState(false);
    const [quantityInputValue, setQuantityInputValue] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProduct, setEditedProduct] = useState({ ...product });

    useEffect(() => {
        if (product) {
            setEditedProduct({ ...product });
        }
    }, [product]);

    const handleOrderNow = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to place an order.');
            navigate('/auth');
        } else {
            setShowModal(true);
        }
    };

    const handleQuantityConfirm = async (quantity) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${process.env.REACT_APP_API_URL}/orders/`, { quantity, id: product._id }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Order placed successfully!');
            navigate('/orders');
        } catch (err) {
            alert('Failed to place order. Please try again.');
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveChanges = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${process.env.REACT_APP_API_URL}/products/${productId}`, editedProduct, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Product updated successfully!');
            setIsEditing(false);
        } catch (err) {
            alert('Failed to update product. Please try again.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert('Product deleted successfully!');
                navigate('/products');
            } catch (err) {
                alert('Failed to delete product. Please try again.');
            }
        }
    };

    if (!product) return <p className="loading">Loading...</p>;

    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const discountedPrice = (product.price * 0.9).toFixed(2);

    return (
        <div className="product-details-container">
            <div className="product-layout">
                <img
                    src={product.productImage ? `${process.env.REACT_APP_API_URL}/${product.productImage}` : no}
                    alt={product.name}
                    className="product-image"
                />
                <div className="product-info">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedProduct.category}
                            onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
                        />
                    ) : (
                        <p className="product-category">{product.category}</p>
                    )}
                    <h3 className="product-name">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editedProduct.name}
                                onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                            />
                        ) : (
                            product.name
                        )}
                    </h3>
                    <div className="price-container">
                        {isEditing ? (
                            <input
                                type="number"
                                value={editedProduct.price}
                                onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                                min="0"
                            />
                        ) : (
                            <div className="product-prices">
                                <span className="product-original-price">₹{product.price}</span>
                                <span className="product-discounted-price">₹{discountedPrice}</span>
                            </div>
                        )}
                    </div>
                    <p className="product-quantity">
                        {isEditing ? (
                            <input
                                type="number"
                                value={editedProduct.quantity}
                                onChange={(e) => setEditedProduct({ ...editedProduct, quantity: e.target.value })}
                                min="0"
                            />
                        ) : (
                            `${product.quantity} left`
                        )}
                    </p>
                    <div className="product-description">
                        <h4>About this item</h4>
                        {isEditing ? (
                            <textarea
                                value={editedProduct.description}
                                onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                            />
                        ) : (
                            <p>{product.description}</p>
                        )}
                    </div>
                    {!isAdmin && (
                        <button className="buy-now" onClick={handleOrderNow}>Order Now</button>
                    )}
                    {isAdmin && (
                        isEditing ? (
                            <div className="button-container">
                                <button onClick={handleSaveChanges} className="save-changes">Save Changes</button>
                                <button onClick={handleEditToggle} className="cancel-edit">Cancel</button>
                            </div>
                        ) : (
                            <div className="button-container">
                                <button onClick={handleEditToggle} className="edit-button">Edit</button>
                                <button onClick={handleDelete} className="delete-button">Delete</button>
                            </div>
                        )
                    )}
                </div>
            </div>
            <QuantityModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleQuantityConfirm}
                quantityInputValue={quantityInputValue}
                setQuantityInputValue={setQuantityInputValue}
            />
        </div>
    );
};

export default ProductDetails;
