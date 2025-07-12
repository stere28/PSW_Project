import React, { useState } from 'react';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);

    const handleCheckout = () => {
        alert('Checkout functionality to be implemented.');
    };

    return (
        <div>
            <h1>Cart</h1>
            <div className="cart-list">
                {cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                        <div key={index} className="cart-item">
                            <h2>{item.name}</h2>
                            <p>Price: ${item.price}</p>
                        </div>
                    ))
                ) : (
                    <p>Your cart is empty.</p>
                )}
            </div>
            <button onClick={handleCheckout}>Checkout</button>
        </div>
    );
};

export default CartPage;