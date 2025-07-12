import React, { useState, useEffect } from 'react';
import './Vendor.css';
import { ApiService } from '../../Services/ApiService';

const Vendor = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '' });

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await ApiService.getProducts();
            setProducts(data);
        };
        fetchProducts();
    }, []);

    const handleAddProduct = async () => {
        const addedProduct = await ApiService.addProduct(newProduct);
        setProducts([...products, addedProduct]);
        setNewProduct({ name: '', description: '', price: '' });
    };

    const handleDeleteProduct = async (productId) => {
        await ApiService.deleteProduct(productId);
        setProducts(products.filter((product) => product.id !== productId));
    };

    return (
        <div className="vendor-container">
            <h1>Vendor Dashboard</h1>
            <div className="add-product-form">
                <h2>Add Product</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
                <button onClick={handleAddProduct}>Add Product</button>
            </div>
            <div className="product-list">
                <h2>Products</h2>
                {products.map((product) => (
                    <div key={product.id} className="product-item">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                        <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Vendor;