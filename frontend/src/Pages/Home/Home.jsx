import React, { useEffect, useState } from 'react';
import { ApiService } from '../../Services/ApiService';

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
        <div>
            <h1>Prodotti</h1>
            <div>
                <label>
                    Search:
                    <input
                        type="text"
                        onChange={(e) =>
                            setFilters({ ...filters, search: e.target.value })
                        }
                    />
                </label>

                <label>
                    Category:
                    <select
                        onChange={(e) =>
                            setFilters({ ...filters, category: e.target.value })
                        }
                    >
                        <option value="">All</option>
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion</option>
                        <option value="home">Home</option>
                    </select>
                </label>

                <label>
                    Price Range:
                    <input
                        type="number"
                        placeholder="Min"
                        onChange={(e) =>
                            setFilters({ ...filters, minPrice: e.target.value })
                        }
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        onChange={(e) =>
                            setFilters({ ...filters, maxPrice: e.target.value })
                        }
                    />
                </label>

                <label>
                    Rating:
                    <select
                        onChange={(e) =>
                            setFilters({ ...filters, rating: e.target.value })
                        }
                    >
                        <option value="">All</option>
                        <option value="1">1 Star</option>
                        <option value="2">2 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="5">5 Stars</option>
                    </select>
                </label>

                <label>
                    Sort By:
                    <select
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
                </label>

                <button onClick={applyFiltersAndSort}>Apply Filters & Sort</button>

                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>

            <div>
                <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
                    Previous Page
                </button>
                <span style={{ margin: '0 10px' }}>Page: {page}</span>
                <button onClick={() => setPage((prev) => prev + 1)}>
                    Next Page
                </button>
            </div>

            <div className="product-list" style={{ marginTop: '20px' }}>
                {products.length === 0 ? (
                    <p>No products found.</p>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="product-item" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                            <h2>{product.name}</h2>
                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                            <p>Rating: {product.rating} ⭐</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;
