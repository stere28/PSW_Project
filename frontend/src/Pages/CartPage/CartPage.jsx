import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const CartPage = () => {
    const { isAuthenticated, hasRole, user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCartItems = async () => {
            setLoading(true);
            try {
                // Simula fetch da API
                const items = [
                    { id: 1, name: 'Product 1', price: 10 },
                    { id: 2, name: 'Product 2', price: 20 },
                ];
                setCartItems(items);
            } catch (error) {
                console.error('Errore durante il recupero del carrello:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated && hasRole('user')) {
            fetchCartItems();
        }
    }, [isAuthenticated, user?.roles]); // evita funzioni come dipendenze

    const handleCheckout = () => {
        alert('Funzionalità di checkout da implementare.');
    };

    if (!isAuthenticated) {
        return <p>Accesso negato. Effettua il login per accedere al carrello.</p>;
    }

    if (!hasRole('user')) {
        return <p>Accesso negato. Solo gli utenti con ruolo "user" possono visualizzare il carrello.</p>;
    }

    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="cart-page">
            <h1>Carrello di {user?.username}</h1>

            {loading ? (
                <p>Caricamento...</p>
            ) : cartItems.length > 0 ? (
                <>
                    <div className="cart-list">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <h2>{item.name}</h2>
                                <p>Prezzo: €{item.price}</p>
                            </div>
                        ))}
                    </div>
                    <hr />
                    <p><strong>Totale:</strong> €{total}</p>
                    <button onClick={handleCheckout}>Procedi all'acquisto</button>
                </>
            ) : (
                <p>Il carrello è vuoto.</p>
            )}
        </div>
    );
};

export default CartPage;
