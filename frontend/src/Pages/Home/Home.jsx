import React, { useEffect, useState } from 'react';
import { ApiService } from '../../Services/ApiService';
import './Home.css'

const Home = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({});
    const [sortOrder, setSortOrder] = useState("price-asc");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await ApiService.getProductPaged(page, 50);
            setProducts(data);
        };
        fetchProducts();
    }, [page]);

    const applyFiltersAndSort = async () => {
        const min = parseFloat(filters.minPrice);
        const max = parseFloat(filters.maxPrice);

        // Validazione range prezzo
        if (!isNaN(min) && !isNaN(max) && min > max) {
            setError("Il prezzo minimo non può essere maggiore del prezzo massimo.");
            return;
        }

        setError("");
        setPage(1); // Reset della pagina

        const data = await ApiService.getProductsByFilter({
            ...filters,
            sort: sortOrder,
        });
        setProducts(data);
    };

    return (
        <div className="container">
            <h1>Prodotti</h1>

            <div className="filters-container">
                <div className="filter-group">
                    <div>
                        <label className="filter-label">Search</label>
                        <input
                            type="text"
                            className="filter-input"
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            placeholder="Search products..."
                        />
                    </div>

                    <div>
                        <label className="filter-label">Category</label>
                        <select
                            className="filter-select"
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        >
                            <option value="">All Categories</option>
                            <option value="electronics">Electronics</option>
                            <option value="fashion">Fashion</option>
                            <option value="home">Home</option>
                        </select>
                    </div>

                    <div>
                        <label className="filter-label">Price Range</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="number"
                                className="filter-input"
                                placeholder="Min"
                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                style={{ flex: 1 }}
                            />
                            <input
                                type="number"
                                className="filter-input"
                                placeholder="Max"
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                style={{ flex: 1 }}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="filter-label">Minimum Rating</label>
                        <select
                            className="filter-select"
                            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                        >
                            <option value="">All Ratings</option>
                            <option value="1">⭐ 1+ Stars</option>
                            <option value="2">⭐⭐ 2+ Stars</option>
                            <option value="3">⭐⭐⭐ 3+ Stars</option>
                            <option value="4">⭐⭐⭐⭐ 4+ Stars</option>
                            <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                        </select>
                    </div>

                    <div>
                        <label className="filter-label">Sort By</label>
                        <select
                            className="filter-select"
                            onChange={(e) => setSortOrder(e.target.value)}
                            value={sortOrder}
                        >
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name-asc">Name: A to Z</option>
                            <option value="name-desc">Name: Z to A</option>
                            <option value="rating-asc">Rating: Low to High</option>
                            <option value="rating-desc">Rating: High to Low</option>
                        </select>
                    </div>
                </div>

                <button className="apply-btn" onClick={applyFiltersAndSort}>
                    Apply Filters & Sort
                </button>

                {error && <p className="error-message">{error}</p>}
            </div>

            <div className="pagination">
                <button
                    className="page-btn"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Previous Page
                </button>
                <span className="page-info">Page: {page}</span>
                <button
                    className="page-btn"
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    Next Page
                </button>
            </div>

            <div className="product-list">
                {products.length === 0 ? (
                    <div className="empty-state">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>No products found matching your criteria</p>
                    </div>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="product-item">
                            <div className="product-content">
                                <h2>{product.name}</h2>
                                <p>{product.description}</p>
                                <p className="product-price">Price: ${product.price}</p>
                                <span className="product-rating">
                {product.rating} {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i}>{i < Math.floor(product.rating) ? '★' : '☆'}</span>
                                ))}
              </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;
