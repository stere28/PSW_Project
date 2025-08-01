import React, { useEffect, useState } from 'react';
import { ApiService } from '../../services/ApiService';
import {useAuth} from "../../Context/AuthContext.jsx";
import './Home.css';

export const Home = () => {
    const { isAuthenticated, hasRole, user } = useAuth();
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({});
    const [sortOrder, setSortOrder] = useState("price-asc");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [cartLoading, setCartLoading] = useState({});
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await ApiService.getProductPaged(page - 1, 50);
                setProducts(data);
                setError("");
            } catch (err) {
                setError("Errore nel caricamento dei prodotti: " + err.message);
            } finally {
                setLoading(false);
            }
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
        setSuccess("");
        setPage(1);
        setLoading(true);

        try {
            const data = await ApiService.getProductsByFilter({
                ...filters,
                sort: sortOrder,
            });
            setProducts(data);
        } catch (err) {
            setError("Errore nel filtraggio: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId) => {
        if (!isAuthenticated) {
            setError("Devi effettuare il login per aggiungere prodotti al carrello.");
            return;
        }

        if (!hasRole('user')) {
            setError("Solo gli utenti possono aggiungere prodotti al carrello.");
            return;
        }

        setCartLoading(prev => ({ ...prev, [productId]: true }));

        try {
            await ApiService.addToCart(productId);
            setSuccess("Prodotto aggiunto al carrello!");
            setError("");
            // Auto-hide success message after 3 seconds
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError("Errore nell'aggiunta al carrello: " + err.message);
        } finally {
            setCartLoading(prev => ({ ...prev, [productId]: false }));
        }
    };

    const clearMessages = () => {
        setError("");
        setSuccess("");
    };

    return (
        <div className="container">
            <h1>Catalogo Prodotti</h1>

            {/* Messages */}
            {error && (
                <div className="message-container error-message">
                    <span>{error}</span>
                    <button onClick={clearMessages} className="close-btn">×</button>
                </div>
            )}

            {success && (
                <div className="message-container success-message">
                    <span>{success}</span>
                    <button onClick={clearMessages} className="close-btn">×</button>
                </div>
            )}

            <div className="filters-container">
                <div className="filter-group">
                    <div>
                        <label className="filter-label">Cerca</label>
                        <input
                            type="text"
                            className="filter-input"
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            placeholder="Cerca prodotti..."
                        />
                    </div>

                    <div>
                        <label className="filter-label">Categoria</label>
                        <select
                            className="filter-select"
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        >
                            <option value="">Tutte le Categorie</option>
                            <option value="electronics">Elettronica</option>
                            <option value="fashion">Moda</option>
                            <option value="home">Casa</option>
                            <option value="books">Libri</option>
                            <option value="sports">Sport</option>
                        </select>
                    </div>

                    <div>
                        <label className="filter-label">Range Prezzo</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="number"
                                className="filter-input"
                                placeholder="Min €"
                                min="0"
                                step="0.01"
                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                style={{ flex: 1 }}
                            />
                            <input
                                type="number"
                                className="filter-input"
                                placeholder="Max €"
                                min="0"
                                step="0.01"
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                style={{ flex: 1 }}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="filter-label">Valutazione Minima</label>
                        <select
                            className="filter-select"
                            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                        >
                            <option value="">Tutte le Valutazioni</option>
                            <option value="1">⭐ 1+ Stelle</option>
                            <option value="2">⭐⭐ 2+ Stelle</option>
                            <option value="3">⭐⭐⭐ 3+ Stelle</option>
                            <option value="4">⭐⭐⭐⭐ 4+ Stelle</option>
                            <option value="5">⭐⭐⭐⭐⭐ 5 Stelle</option>
                        </select>
                    </div>

                    <div>
                        <label className="filter-label">Ordina per</label>
                        <select
                            className="filter-select"
                            onChange={(e) => setSortOrder(e.target.value)}
                            value={sortOrder}
                        >
                            <option value="price-asc">Prezzo: Dal più basso</option>
                            <option value="price-desc">Prezzo: Dal più alto</option>
                            <option value="name-asc">Nome: A-Z</option>
                            <option value="name-desc">Nome: Z-A</option>
                            <option value="rating-asc">Valutazione: Dal più basso</option>
                            <option value="rating-desc">Valutazione: Dal più alto</option>
                        </select>
                    </div>
                </div>

                <button
                    className="apply-btn"
                    onClick={applyFiltersAndSort}
                    disabled={loading}
                >
                    {loading ? 'Caricamento...' : 'Applica Filtri'}
                </button>
            </div>

            <div className="pagination">
                <button
                    className="page-btn"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1 || loading}
                >
                    Pagina Precedente
                </button>
                <span className="page-info">Pagina: {page}</span>
                <button
                    className="page-btn"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={loading}
                >
                    Pagina Successiva
                </button>
            </div>

            {loading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Caricamento prodotti...</p>
                </div>
            )}

            <div className="product-list">
                {!loading && products.length === 0 ? (
                    <div className="empty-state">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>Nessun prodotto trovato con i criteri selezionati</p>
                    </div>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="product-item">
                            <div className="product-content">
                                <h2>{product.name || product.nome}</h2>
                                <p className="product-description">
                                    {product.description || product.descrizione}
                                </p>
                                <p className="product-price">
                                    €{(product.price || product.prezzo)?.toFixed(2)}
                                </p>
                                <div className="product-details">
                                    <span className="product-rating">
                                        {product.rating} {Array.from({ length: 5 }).map((_, i) => (
                                        <span key={i}>
                                                {i < Math.floor(product.rating) ? '★' : '☆'}
                                            </span>
                                    ))}
                                    </span>
                                </div>

                                {isAuthenticated && hasRole('user') && (
                                    <button
                                        className="add-to-cart-btn"
                                        onClick={() => addToCart(product.id)}
                                        disabled={cartLoading[product.id]}
                                    >
                                        {cartLoading[product.id] ? (
                                            <>
                                                <div className="btn-spinner"></div>
                                                Aggiungendo...
                                            </>
                                        ) : (
                                            <>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="9" cy="21" r="1"></circle>
                                                    <circle cx="20" cy="21" r="1"></circle>
                                                    <path d="m1 1 4 0 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                                </svg>
                                                Aggiungi al Carrello
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isAuthenticated && (
                <div className="user-info">
                    <p>Benvenuto, {user?.username}!</p>
                </div>
            )}
        </div>
    )}