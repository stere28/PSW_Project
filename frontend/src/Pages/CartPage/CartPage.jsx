import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ApiService } from '../../services/ApiService';

const CartPage = () => {
    const { isAuthenticated, hasRole, user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCartItems = async () => {
            setLoading(true);
            setError(null);
            try {
                const items = await ApiService.getCart(user.id);
                setCartItems(items);
            } catch (err) {
                console.error('Errore:', err);
                setError(err.message || 'Errore imprevisto');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated && hasRole('user')) {
            fetchCartItems();
        }
    }, [isAuthenticated, user?.id]);

    const handleRemove = async (productId) => {
        try {
            const updatedCart = await ApiService.removeFromCart(user.id, productId);
            setCartItems(updatedCart);
        } catch (err) {
            console.error('Errore rimozione:', err);
            alert(err.message);
        }
    };

    const handleCheckout = async () => {
        try {
            await ApiService.checkoutCart(user.id);
            alert('Checkout completato con successo.');
            setCartItems([]);
        } catch (err) {
            console.error('Errore checkout:', err);
            alert(`Errore: ${err.message}`);
        }
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

            {error && <p className="error">Errore: {error}</p>}

            {loading ? (
                <p>Caricamento...</p>
            ) : cartItems.length > 0 ? (
                <>
                    <div className="cart-list">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <h2>{item.name}</h2>
                                <p>Prezzo: €{item.price}</p>
                                <button onClick={() => handleRemove(item.id)}>Rimuovi</button>
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
