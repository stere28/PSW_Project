import React, { useState } from 'react';
import './Vendor.css';

const Vendor = ({
                    prodottiInVendita = [],
                    prodottiVenduti = [],
                    notifiche = [],
                    loading = false,
                    error = '',
                    success = '',
                    onAddProduct,
                    onDeleteProduct,
                    onRefreshNotifiche,
                    onClearMessages
                }) => {
    const [activeTab, setActiveTab] = useState('in-vendita');
    const [newProduct, setNewProduct] = useState({
        nome: '',
        descrizione: '',
        prezzo: ''
    });

    const validateForm = () => {
        if (!newProduct.nome.trim()) return 'Il nome del prodotto è obbligatorio';
        if (!newProduct.descrizione.trim()) return 'La descrizione è obbligatoria';
        if (!newProduct.prezzo || parseFloat(newProduct.prezzo) <= 0) return 'Prezzo non valido';
        return null;
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            onClearMessages();
            onAddProduct(null, validationError);
            return;
        }

        await onAddProduct({
            nome: newProduct.nome,
            descrizione: newProduct.descrizione,
            prezzo: parseFloat(newProduct.prezzo)
        });

        // Reset form solo se successo
        if (!error) {
            setNewProduct({
                nome: '',
                descrizione: '',
                prezzo: ''
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <div className="vendor-loading">
                <div className="spinner"></div>
                <p>Caricamento in corso...</p>
            </div>
        );
    }

    return (
        <div className="vendor-container">
            <header className="vendor-header">
                <h1>Dashboard Venditore</h1>
                <div className="vendor-stats">
                    <div>Prodotti attivi: {prodottiInVendita.length}</div>
                    <div>Prodotti venduti: {prodottiVenduti.length}</div>
                    <div>Notifiche: {notifiche.length}</div>
                </div>
            </header>

            {/* Messaggi di stato */}
            <div className="vendor-messages">
                {error && (
                    <div className="error-message">
                        {error}
                        <button onClick={onClearMessages} className="close-btn">×</button>
                    </div>
                )}
                {success && (
                    <div className="success-message">
                        {success}
                        <button onClick={onClearMessages} className="close-btn">×</button>
                    </div>
                )}
            </div>

            {/* Form aggiunta prodotto */}
            <section className="add-product-section">
                <h2>Aggiungi Nuovo Prodotto</h2>
                <form onSubmit={handleAddProduct} className="product-form">
                    <div className="form-row">
                        <label>
                            Nome Prodotto*
                            <input
                                type="text"
                                name="nome"
                                value={newProduct.nome}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                    </div>

                    <div className="form-row">
                        <label>
                            Prezzo (€)*
                            <input
                                type="number"
                                name="prezzo"
                                value={newProduct.prezzo}
                                onChange={handleInputChange}
                                min="0.01"
                                step="0.01"
                                required
                            />
                        </label>
                    </div>

                    <label>
                        Descrizione*
                        <textarea
                            name="descrizione"
                            value={newProduct.descrizione}
                            onChange={handleInputChange}
                            rows="3"
                            required
                        />
                    </label>

                    <button type="submit" className="submit-btn">
                        Aggiungi Prodotto
                    </button>
                </form>
            </section>

            {/* Tab Navigation */}
            <div className="vendor-tabs">
                <button
                    className={`tab ${activeTab === 'in-vendita' ? 'active' : ''}`}
                    onClick={() => setActiveTab('in-vendita')}
                >
                    In Vendita ({prodottiInVendita.length})
                </button>
                <button
                    className={`tab ${activeTab === 'venduti' ? 'active' : ''}`}
                    onClick={() => setActiveTab('venduti')}
                >
                    Venduti ({prodottiVenduti.length})
                </button>
                <button
                    className={`tab ${activeTab === 'notifiche' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('notifiche');
                        onRefreshNotifiche();
                    }}
                >
                    Notifiche ({notifiche.length})
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'in-vendita' && (
                    <ProductList
                        products={prodottiInVendita}
                        onDelete={onDeleteProduct}
                        type="active"
                    />
                )}

                {activeTab === 'venduti' && (
                    <ProductList
                        products={prodottiVenduti}
                        type="sold"
                    />
                )}

                {activeTab === 'notifiche' && (
                    <NotificationList notifications={notifiche} />
                )}
            </div>
        </div>
    );
};

// Componente per la lista prodotti
const ProductList = ({ products, onDelete, type }) => {
    if (products.length === 0) {
        return (
            <div className="empty-state">
                <p>Nessun prodotto {type === 'active' ? 'in vendita' : 'venduto'}</p>
            </div>
        );
    }

    return (
        <div className="product-grid">
            {products.map(product => (
                <div key={product.id} className={`product-card ${type}`}>
                    <div className="product-info">
                        <h3>{product.nome}</h3>
                        <p className="description">{product.descrizione}</p>
                        {type === 'active' && onDelete && (
                            <button
                                onClick={() => onDelete(product.id)}
                                className="delete-btn"
                            >
                                Elimina
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

// Componente per le notifiche
const NotificationList = ({ notifications }) => {
    if (notifications.length === 0) {
        return (
            <div className="empty-state">
                <p>Nessuna notifica presente</p>
            </div>
        );
    }

    return (
        <div className="notification-list">
            {notifications.map((notification, index) => (
                <div key={index} className="notification-item">
                    <p className="notification-message">
                        {typeof notification === 'string' ? notification : notification.testo}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default Vendor;