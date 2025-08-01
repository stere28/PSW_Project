import React, { useState, useEffect } from 'react';
import {useAuth} from "../../Context/AuthContext.jsx";
import { ApiService } from '../../services/ApiService';
import './CartPage.css';

const CartPage = () => {
    const { isAuthenticated, hasRole, user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [removeLoading, setRemoveLoading] = useState({});
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    useEffect(() => {
        const fetchCartItems = async () => {
            if (!isAuthenticated || !hasRole('user')) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const items = await ApiService.getCart();
                setCartItems(Array.isArray(items) ? items : []);
            } catch (err) {
                console.error('Errore nel caricamento carrello:', err);
                setError(err.message || 'Errore nel caricamento del carrello');
                setCartItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [isAuthenticated, user?.id, hasRole]);

    const handleRemove = async (productId) => {
        setRemoveLoading(prev => ({ ...prev, [productId]: true }));
        setError(null);
        setSuccess(null);

        try {
            const updatedCart = await ApiService.removeFromCart(productId);
            setCartItems(Array.isArray(updatedCart) ? updatedCart : []);
            setSuccess('Prodotto rimosso dal carrello');
            // Auto-hide success message
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Errore rimozione:', err);
            setError(err.message || 'Errore nella rimozione del prodotto');
        } finally {
            setRemoveLoading(prev => ({ ...prev, [productId]: false }));
        }
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            setError('Il carrello è vuoto');
            return;
        }

        setCheckoutLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await ApiService.checkoutCart();
            setSuccess('Checkout completato con successo! Grazie per il tuo acquisto.');
            setCartItems([]);
        } catch (err) {
            console.error('Errore checkout:', err);
            setError(err.message || 'Errore durante il checkout');
        } finally {
            setCheckoutLoading(false);
        }
    };

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    // Check authentication and roles
    if (!isAuthenticated) {
        return (
            <div className="cart-page-container">
                <div className="auth-message">
                    <div className="auth-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12l2 2 4-4"></path>
                            <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                            <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                        </svg>
                    </div>
                    <h2>Accesso Richiesto</h2>
                    <p>Devi effettuare il login per accedere al tuo carrello.</p>
                </div>
            </div>
        );
    }

    if (!hasRole('user')) {
        return (
            <div className="cart-page-container">
                <div className="auth-message">
                    <div className="auth-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                            <path d="M9 9h.01"></path>
                            <path d="M15 9h.01"></path>
                        </svg>
                    </div>
                    <h2>Accesso Limitato</h2>
                    <p>Solo gli utenti con ruolo "user" possono visualizzare il carrello.</p>
                </div>
            </div>
        );
    }

    const total = cartItems.reduce((sum, item) => {
        const price = item.price || item.prezzo || 0;
        return sum + price;
    }, 0);

    return (
        <div className="cart-page-container">
            <div className="cart-header">
                <h1>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="m1 1 4 0 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Il tuo Carrello
                </h1>
                <p className="cart-subtitle">Benvenuto, <span>{user?.username}</span></p>
            </div>

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

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Caricamento carrello...</p>
                </div>
            ) : cartItems.length > 0 ? (
                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="item-info">
                                    <h3>{item.name || item.nome}</h3>
                                    <p className="item-description">
                                        {item.description || item.descrizione}
                                    </p>
                                    <div className="item-details">
                                        <span className="item-price">
                                            €{(item.price || item.prezzo)?.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemove(item.id)}
                                    disabled={removeLoading[item.id]}
                                    title="Rimuovi dal carrello"
                                >
                                    {removeLoading[item.id] ? (
                                        <div className="btn-spinner"></div>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3,6 5,6 21,6"></polyline>
                                            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <div className="summary-content">
                            <div className="summary-row">
                                <span>Articoli nel carrello:</span>
                                <span>{cartItems.length}</span>
                            </div>
                            <div className="summary-row total-row">
                                <span>Totale:</span>
                                <span>€{total.toFixed(2)}</span>
                            </div>
                            <button
                                className="checkout-btn"
                                onClick={handleCheckout}
                                disabled={checkoutLoading || cartItems.length === 0}
                            >
                                {checkoutLoading ? (
                                    <>
                                        <div className="btn-spinner"></div>
                                        Elaborazione...
                                    </>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="1" y="3" width="15" height="13"></rect>
                                            <polygon points="16,8 20,8 23,11 23,16 16,16 16,8"></polygon>
                                            <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                            <circle cx="18.5" cy="18.5" r="2.5"></circle>
                                        </svg>
                                        Procedi all'acquisto
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="empty-cart">
                    <div className="empty-cart-icon">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="m1 1 4 0 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </div>
                    <h2>Il tuo carrello è vuoto</h2>
                    <p>Sembra che tu non abbia ancora aggiunto nessun prodotto al carrello.</p>
                    <button
                        className="continue-shopping-btn"
                        onClick={() => window.history.back()}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="15,18 9,12 15,6"></polyline>
                        </svg>
                        Continua gli acquisti
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartPage;