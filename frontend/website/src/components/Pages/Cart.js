import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCart, removeFromCart, clearCart } from "../../store/slice/cartSlice";
import './cart.css';
import { MdDelete } from "react-icons/md";
import no from '../images/no.jpg';



const Cart = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems) || [];
    console.log(cartItems);
    const token = localStorage.getItem("token");

    const handleQuantityChange = (item, newQuantity) => {
        if (newQuantity > 0) {
            dispatch(updateCart({ token, itemId: item.pId, quantity: newQuantity }));
        }
    };

    const handleRemoveItem = (pId) => {
        dispatch(removeFromCart({ token, pId }));
    };

    const handleClearCart = () => {
        dispatch(clearCart(token));
    };

    return (
        <div className="cart-container">
            <h2 className="cart-title">Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p className="cart-empty">Your cart is empty.</p>
            ) : (
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div key={item.pId} className="cart-item">
                            <img
                                src={
                                    item.productImage?.startsWith('http')
                                        ? item.productImage
                                        : `${process.env.REACT_APP_API_URL}/${item.productImage || ''}`
                                }
                                alt={item.name}
                                className="searchbar-product-image"
                                onError={(e) => (e.target.src = no)}
                            />
                            <div className="cart-item-details">
                                <h3 className="cart-item-name">{item.name}</h3>
                                <p className="cart-item-category">Category: {item.category}</p>
                                <p className="cart-item-price">Price: ₹{item.price}</p>
                                <div className="cart-item-quantity">
                                    <button 
                                        className="cart-quantity-btn" 
                                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                    >
                                        -
                                    </button>
                                    <span className="cart-quantity-text">{item.quantity}</span>
                                    <button 
                                        className="cart-quantity-btn" 
                                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button 
                                    className="cart-remove-btn" 
                                    onClick={() => handleRemoveItem(item.pId)}
                                >
                                    <MdDelete />
                                </button>
                        </div>
                    ))}
                    <button className="cart-clear-btn" onClick={handleClearCart}>Clear Cart</button>
                </div>
            )}
        </div>
    );
};

export default Cart;
