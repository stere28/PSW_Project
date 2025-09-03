import React, { useEffect, useState } from 'react';
import { ApiService } from '../../services/ApiService';
import { useAuth } from "../../Context/AuthContext.jsx";
import Product from '../../Components/Product/Product';
import './Home.css';

export const Home = () => {
    const { isAuthenticated, hasRole, user } = useAuth();

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({});
    const [sortOrder, setSortOrder] = useState("price-asc");
    const [loading, setLoading] = useState(false);
    const [cartLoading, setCartLoading] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch prodotti paginati
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

    // Applica filtri e ordinamento
    const applyFiltersAndSort = async () => {
        const min = parseFloat(filters.minPrice);
        const max = parseFloat(filters.maxPrice);

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

    // Aggiungi prodotto al carrello
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

            {/* Filtri */}
            <div className="filters-container">
                <input
                    type="text"
                    placeholder="Cerca prodotti..."
                    onChange={e => setFilters({ ...filters, search: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Prezzo Min"
                    onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Prezzo Max"
                    onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
                />
                <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                    <option value="price-asc">Prezzo: dal più basso</option>
                    <option value="name-asc">Nome: A-Z</option>
                </select>
                <button onClick={applyFiltersAndSort} disabled={loading}>
                    {loading ? "Caricamento..." : "Applica filtri"}
                </button>
            </div>

            {/* Lista prodotti */}
            <div className="product-list">
                {loading ? (
                    <p>Caricamento prodotti...</p>
                ) : products.length === 0 ? (
                    <p>Nessun prodotto trovato</p>
                ) : (
                    products.map(product => (
                        <Product
                            key={product.id}
                            name={product.name || product.nome}
                            description={product.description || product.descrizione}
                            price={product.price || product.prezzo}
                            onAddToCart={() => addToCart(product.id)}
                            disabled={cartLoading[product.id]}
                        />
                    ))
                )}
            </div>

            {isAuthenticated && <p>Benvenuto, {user?.username}!</p>}
        </div>
    );
};
