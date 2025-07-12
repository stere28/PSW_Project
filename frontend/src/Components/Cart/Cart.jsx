import React, { useState } from 'react';
import './Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Product 1', price: 10 },
        { id: 2, name: 'Product 2', price: 20 },
    ]);

    const handleCheckout = () => {
        alert('Checkout functionality to be implemented.');
    };

    return (
        <div className="cart-container">
            <h1>Your Cart</h1>
            <div className="cart-items">
                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <h2>{item.name}</h2>
                            <p>Price: ${item.price}</p>
                        </div>
                    ))
                ) : (
                    <p>Your cart is empty.</p>
                )}
            </div>
            <button className="checkout-button" onClick={handleCheckout}>
                Checkout
            </button>
        </div>
    );
};

export default Cart;