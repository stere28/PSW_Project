import React from 'react';
import './Product.css';

const Product = ({ name, description, price, onAddToCart, disabled }) => {
    return (
        <div className="product-container">
            <h2>{name}</h2>
            <p>{description}</p>
            <p className="product-price">€{price?.toFixed(2)}</p>
            {onAddToCart && (
                <button
                    className="add-to-cart-btn"
                    onClick={onAddToCart}
                    disabled={disabled}
                >
                    {disabled ? "Aggiungendo..." : "Aggiungi al Carrello"}
                </button>
            )}
        </div>
    );
};

export default Product;
