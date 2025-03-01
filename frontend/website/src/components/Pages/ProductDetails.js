import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import './ProductDetails.css';
import no from '../images/no.jpg';

const ProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { products } = useSelector(state => state.products);
    const product = products?.find(p => p.productId === Number(productId));
    
    const [quantity, setQuantity] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingQuantity, setIsEditingQuantity] = useState(false);
    const [editedProduct, setEditedProduct] = useState({ ...product });
    const [editedQuantity, setEditedQuantity] = useState(product?.quantity || 0);

    useEffect(() => {
        if (product) {
            setEditedProduct({ ...product });
            setEditedQuantity(product.quantity);
        }
    }, [product]);

    const handleOrderNow = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to place an order.');
            navigate('/auth');
        } else {
            try {
                await axios.post(`${process.env.REACT_APP_API_URL}/orders/`, { quantity, id: product._id }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert('Order placed successfully!');
                navigate('/orders');
            } catch (err) {
                alert('Failed to place order. Please try again.');
            }
        }
    };

    const handleEditToggle = () => setIsEditing(!isEditing);
    const handleQuantityEditToggle = () => setIsEditingQuantity(!isEditingQuantity);

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

    const handleSaveQuantity = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${process.env.REACT_APP_API_URL}/products/${productId}`, { quantity: editedQuantity }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Quantity updated successfully!');
            setIsEditingQuantity(false);
        } catch (err) {
            alert('Failed to update quantity. Please try again.');
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
                    <h3 className="product-name">{product.name}</h3>
                    <div className="price-container">
                        <div className="product-prices">
                            <span className="product-original-price">₹{product.price}</span>
                            <span className="product-discounted-price">₹{discountedPrice}</span>
                        </div>
                    </div>
                    <p className="product-quantity">
                        {isEditingQuantity ? (
                            <>
                                <div className="stepper">
                                    <button onClick={() => setEditedQuantity(prev => Math.max(0, prev - 1))} className = "save-quantity">−</button>
                                    <span>{editedQuantity}</span>
                                    <button onClick={() => setEditedQuantity(prev => prev + 1)} className='cancel-edit'>+</button>
                                </div>
                                <button onClick={handleSaveQuantity} className="save-changes">Save</button>
                                <button onClick={handleQuantityEditToggle} className="cancel-edit">Cancel</button>
                            </>
                        ) : (
                            `${product.quantity} left`
                        )}
                        {isAdmin && !isEditingQuantity && (
                            <FaEdit onClick={handleQuantityEditToggle} className="edit-quantity-icon" />
                        )}
                    </p>
                    <div className="product-description">
                        <h4>About this item</h4>
                        <p>{product.description}</p>
                    </div>
                    {!isAdmin && (
                        <div className="order-section">
                            <input
                                type="number"
                                value={quantity}
                                min="1"
                                max={product.quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                            <button className="buy-now" onClick={handleOrderNow}>Order Now</button>
                        </div>
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
        </div>
    );
};

export default ProductDetails;
