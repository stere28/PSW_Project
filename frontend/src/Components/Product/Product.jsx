import React from 'react';
import './Product.css';

const Product = ({ name, description, price, onAddToCart, onEdit, onDelete }) => {
    return (
        <div className="product-container">
            <h2>{name}</h2>
            <p>{description}</p>
            <p>Price: ${price}</p>
            <div className="product-actions">
                {onAddToCart && (
                    <button className="product-button" onClick={onAddToCart}>
                        Add to Cart
                    </button>
                )}
                {onEdit && (
                    <button className="product-button" onClick={onEdit}>
                        Edit
                    </button>
                )}
                {onDelete && (
                    <button className="product-button delete-button" onClick={onDelete}>
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export default Product;