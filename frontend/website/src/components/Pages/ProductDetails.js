    import React, { useEffect, useState } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { useSelector, useDispatch } from 'react-redux';
    import axios from 'axios';
    import { FaEdit, FaSyncAlt,FaBan } from 'react-icons/fa';
    import { FaTruckFast, FaIndianRupeeSign } from 'react-icons/fa6';
    import './ProductDetails.css';
    import no from '../images/no.jpg';
    import { updateProduct, deleteProduct } from '../../store/slice/productSlice';
    import { addToCart } from '../../store/slice/cartSlice';
    import ProductSlider from './ProductSlider';

    const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { products } = useSelector(state => state.products);
    const product = products?.find(p => String(p._id) === String(id));

    const sameBrandProducts = product? products.filter((p) =>
        p.brand?.toLowerCase().replace(/\s+/g, '') ===
          product.brand?.toLowerCase().replace(/\s+/g, '') &&
        p._id !== product._id
    )
  : [];

    console.log(sameBrandProducts);
    console.log("id from params" + id);

    const token = localStorage.getItem("token");
    const [quantity, setQuantity] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProduct, setEditedProduct] = useState(product || {});
    const [isEditingQuantity, setIsEditingQuantity] = useState(false);

    useEffect(() => {
        if (product) {
        setEditedProduct(product);
        }
    }, [product]);

    const handleOrderNow = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
        alert('Please log in to place an order.');
        navigate('/auth');
        return;
        }

        if (quantity < 1 || Number(quantity) > product.quantity) {
        alert('Invalid quantity selected.');
        return;
        }

        try {
        await axios.post(`${process.env.REACT_APP_API_URL}/orders/`,
            { quantity, id: product._id },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Order placed successfully!');
        navigate('/orders');
        } catch (err) {
        alert('Failed to place order. Please try again.');
        }
    };

    const handleAddToCart = () => {
        dispatch(addToCart({
        token,
        pId: product._id,
        quantity: 1,
        name: product.name,
        price: product.price
        }));
        alert(`${product.name} added to cart!`);
    };

    const handleEditToggle = () => setIsEditing(!isEditing);
    const handleQuantityEditToggle = () => setIsEditingQuantity(!isEditingQuantity);

    const handleSaveChanges = async () => {
        try {
        const token = localStorage.getItem('token');
        await axios.patch(`${process.env.REACT_APP_API_URL}/products/${id}`, editedProduct, {
            headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(updateProduct(editedProduct));
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
            await axios.delete(`${process.env.REACT_APP_API_URL}/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            });

            dispatch(deleteProduct(id));
            alert('Product deleted successfully!');
            navigate('/');
        } catch (err) {
            alert('Failed to delete product. Please try again.');
        }
        }
    };

    if (!product) return <p className="product-details-loading">Loading...</p>;

    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const discountedPrice = Number((product.price * 0.9).toFixed(2));

    return (
        <div className="product-details-page">
        <div className="product-details-container">
            <div className="product-details-layout">
            <div className="product-details-image">
                <img
                src={product.productImage && product.productImage.startsWith("http") ? product.productImage : no}
                alt={product.name}
                />
            </div>
            <div className="product-details-info">
                <p className="product-details-brand">
                {isEditing ? (
                    <input
                    type="text"
                    className="product-details-input"
                    value={editedProduct.brand}
                    onChange={(e) => setEditedProduct({ ...editedProduct, brand: e.target.value })}
                    />
                ) : (
                    product.brand
                )}
                </p>
                <div className="product-details-name-container">
                    <h3 className="product-details-name">
                    {isEditing ? (
                        <input
                        type="text"
                        className="product-details-input"
                        value={editedProduct.name}
                        onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                        />
                    ) : (
                        product.name
                    )}
                    </h3>
                    <p>(pack of {product.packOf})</p>
                </div>
                

                <div className="product-details-middle-container">
                    <div className="product-details-prices-quantity-container">
                        <div >
                            {isEditing ?(
                               <input
                               type="number"
                               className="product-details-input"
                               value={editedProduct.price}
                               onChange={(e) => setEditedProduct({ ...editedProduct, price: Number(e.target.value) })}
                               min="0"
                               placeholder="price"
                                />
                            ):(
                                <div className="product-details-prices">
                                    <span className="product-details-original-price">₹{product.price}</span>
                                    <span className="product-details-discounted-price">₹{discountedPrice}</span>
                                </div>
                            )}
                        </div>
                        <div className="product-details-quantity">
                            <p>
                                {isEditingQuantity || isEditing ? (
                                <>
                                    <input
                                    type="number"
                                    className="product-details-input"
                                    value={editedProduct.quantity}
                                    min="0"
                                    placeholder='quantity'
                                    onChange={(e) => setEditedProduct({ ...editedProduct, quantity: Number(e.target.value) })}
                                    />
                                    {isEditingQuantity ? (
                                    <div className="product-details-button-container">
                                        <button onClick={handleSaveChanges} className="product-details-save-changes">Save Changes</button>
                                        <button onClick={handleQuantityEditToggle} className="product-details-cancel-edit">Cancel</button>
                                    </div>
                                    ) : null}
                                </>
                                ) : (
                                    ` ${product.quantity}  left`
                                )}
                                {isAdmin && (!isEditing && !isEditingQuantity) && (
                                <FaEdit onClick={handleQuantityEditToggle} className="product-details-edit-quantity-icon" />
                                )}
                            </p>
                        </div>
                    </div>
                    
                </div>
                <div className="product-details-conditions">
                        <div className="product-details-condition">
                                <FaTruckFast className="product-details-condition-icon" />
                                <p>Secure Delivery</p>
                            </div>
                            <div className="product-details-condition">
                                <FaIndianRupeeSign className="product-details-condition-icon" />
                                <p>Lowest Price in the market</p>
                            </div>
                            <div className="product-details-condition">
                                <FaSyncAlt className="product-details-condition-icon" />
                                <p>Exchangable</p>
                            </div>
                            <div className="product-details-condition">
                                <FaBan className="product-details-condition-icon" />
                                <p>Non-refundable</p>
                            </div>
                    </div>

               

                {isAdmin && (
                isEditing ? (
                    <div className="product-details-button-container">
                    <button onClick={handleSaveChanges} className="product-details-save-changes">Save Changes</button>
                    <button onClick={handleEditToggle} className="product-details-cancel-edit">Cancel</button>
                    </div>
                ) : (
                    <div className="product-details-button-container">
                    <button onClick={handleEditToggle} className="product-details-edit-button">Edit</button>
                    <button onClick={handleDelete} className="product-details-delete-button">Delete</button>
                    </div>
                )
                )}

                <div className="product-details-description">
                    {isEditing ? (
                        <textarea
                        className="product-details-textarea"
                        value={editedProduct.description}
                        onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                        />
                    ) : (
                        <p>{product.description}</p>
                    )}
                </div>

                {!isAdmin ? (
                    <div className="product-details-buttons-section">
                    <div className="product-details-quantity-section">
                    <button
                    className="product-details-quantity-decrement-btn"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    >−</button>

                    <input
                    className="product-details-quantity-input"
                    value={quantity}
                    min="1"
                    max={product.quantity}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= 1 && value <= product.quantity) {
                        setQuantity(value);
                        }
                    }}
                    />

                    <button
                    className="product-details-quantity-increment-btn"
                    onClick={() => setQuantity(prev => Math.min(product.quantity, prev + 1))}
                    disabled={quantity >= product.quantity}
                    >+</button>
                </div>
                <div className="product-details-button-container">
                    <button
                    className="product-details-buy-now"
                    onClick={handleOrderNow}
                    disabled={product.quantity === 0}
                    >
                    {product.quantity > 0 ? "Order Now" : "Out of Stock"}
                    </button>
                    <button
                    className="product-details-add-to-cart"
                    onClick={handleAddToCart}
                    disabled={product.quantity === 0}
                    >
                    Add to Cart
                    </button>
                </div>
                </div>
                ) : null}

                
            </div>
            </div>
        </div>
        <div className="product-details-more-slider">
            <ProductSlider
                key={product.brand}
                title={product.brand}
                products={sameBrandProducts}
                onAddToCart={handleAddToCart}
            />
        </div>
        </div>
    );
    };

    export default ProductDetails;
