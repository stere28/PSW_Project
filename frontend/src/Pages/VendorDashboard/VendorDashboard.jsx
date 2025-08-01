import React, { useState, useEffect } from 'react';
import Vendor from "../../Components/Vendor/Vendor.jsx";
import { VenditoreApiService } from '../../Services/VenditoreApiService.js';
import { useAuth } from "../../Context/AuthContext.jsx";
import './VendorDashboard.css';
import { FiAlertCircle, FiCheckCircle, FiLoader, FiPackage, FiDollarSign, FiBell } from 'react-icons/fi';

//TODO migliorare l'ui
const VendorDashboard = () => {
    const { user, isAuthenticated, hasRole } = useAuth();
    const [prodottiInVendita, setProdottiInVendita] = useState([]);
    const [prodottiVenduti, setProdottiVenduti] = useState([]);
    const [notifiche, setNotifiche] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('inVendita');

    // Caricamento dati
    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthenticated || !hasRole('venditore')) {
                setError('Accesso non autorizzato. È necessario il ruolo venditore.');
                setLoading(false);
                return;
            }

            if (!user?.id) {
                setError('Impossibile ottenere l\'ID utente.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError('');

                const [inVendita, venduti, notif] = await Promise.all([
                    VenditoreApiService.getProdottiInVendita(),
                    VenditoreApiService.getProdottiVenduti(),
                    VenditoreApiService.getNotifiche()
                ]);

                setProdottiInVendita(inVendita);
                setProdottiVenduti(venduti);
                setNotifiche(notif);
            } catch (err) {
                console.error('Errore nel caricamento dati venditore:', err);
                setError('Errore nel caricamento: ' + (err.message || 'Si è verificato un errore'));
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [isAuthenticated, hasRole, user]);

    const handleAddProduct = async (newProduct, validationError = null) => {
        if (validationError) {
            setError(validationError);
            setSuccess('');
            return;
        }

        try {
            setError('');
            setSuccess('');
            setLoading(true);

            await VenditoreApiService.aggiungiProdotto(newProduct);
            const updated = await VenditoreApiService.getProdottiInVendita();
            setProdottiInVendita(updated);
            setSuccess('Prodotto aggiunto con successo!');
        } catch (err) {
            console.error('Errore aggiunta prodotto:', err);
            setError('Errore nell\'aggiunta del prodotto: ' + (err.message || 'Si è verificato un errore'));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            setError('');
            setSuccess('');
            setLoading(true);

            await VenditoreApiService.eliminaProdotto(productId);
            const updated = await VenditoreApiService.getProdottiInVendita();
            setProdottiInVendita(updated);
            setSuccess('Prodotto eliminato con successo!');
        } catch (err) {
            console.error('Errore eliminazione prodotto:', err);
            setError('Errore nell\'eliminazione del prodotto: ' + (err.message || 'Si è verificato un errore'));
        } finally {
            setLoading(false);
        }
    };

    const refreshNotifiche = async () => {
        try {
            setLoading(true);
            const updated = await VenditoreApiService.getNotifiche();
            setNotifiche(updated);
        } catch (err) {
            console.error('Errore refresh notifiche:', err);
            setError('Errore nel caricamento delle notifiche: ' + (err.message || 'Si è verificato un errore'));
        } finally {
            setLoading(false);
        }
    };

    const clearMessages = () => {
        setError('');
        setSuccess('');
    };

    // Se non autenticato o senza ruolo appropriato
    if (!isAuthenticated) {
        return (
            <div className="vendor-dashboard auth-error">
                <div className="error-card">
                    <FiAlertCircle className="error-icon" />
                    <h2>Accesso negato</h2>
                    <p>Effettua il login per accedere alla dashboard venditore.</p>
                </div>
            </div>
        );
    }

    if (!hasRole('venditore')) {
        return (
            <div className="vendor-dashboard auth-error">
                <div className="error-card">
                    <FiAlertCircle className="error-icon" />
                    <h2>Accesso negato</h2>
                    <p>È necessario il ruolo "venditore" per accedere a questa sezione.</p>
                    <p className="user-roles">Ruoli attuali: {user?.roles?.join(', ') || 'Nessun ruolo'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="vendor-dashboard">
            <header className="dashboard-header">
                <h1>Dashboard Venditore</h1>
                <div className="user-info">
                    <span className="welcome">Benvenuto, {user?.username || 'Venditore'}</span>
                </div>
            </header>

            <div className="dashboard-content">
                {loading && (
                    <div className="loading-overlay">
                        <FiLoader className="spinner" />
                        <span>Caricamento...</span>
                    </div>
                )}

                {(error || success) && (
                    <div className={`alert-message ${error ? 'error' : 'success'}`}>
                        {error ? <FiAlertCircle /> : <FiCheckCircle />}
                        <span>{error || success}</span>
                        <button onClick={clearMessages} className="close-btn">&times;</button>
                    </div>
                )}

                <div className="stats-cards">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <FiPackage />
                        </div>
                        <div className="stat-info">
                            <h3>Prodotti in vendita</h3>
                            <p>{prodottiInVendita.length}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <FiDollarSign />
                        </div>
                        <div className="stat-info">
                            <h3>Prodotti venduti</h3>
                            <p>{prodottiVenduti.length}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <FiBell />
                        </div>
                        <div className="stat-info">
                            <h3>Notifiche</h3>
                            <p>{notifiche.length}</p>
                        </div>
                    </div>
                </div>

                <div className="main-content">
                    <div className="tabs">
                        <button
                            className={`tab-btn ${activeTab === 'inVendita' ? 'active' : ''}`}
                            onClick={() => setActiveTab('inVendita')}
                        >
                            Prodotti in vendita
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'venduti' ? 'active' : ''}`}
                            onClick={() => setActiveTab('venduti')}
                        >
                            Prodotti venduti
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'notifiche' ? 'active' : ''}`}
                            onClick={() => setActiveTab('notifiche')}
                        >
                            Notifiche
                        </button>
                    </div>

                    <div className="tab-content">
                        <Vendor
                            prodottiInVendita={prodottiInVendita}
                            prodottiVenduti={prodottiVenduti}
                            notifiche={notifiche}
                            loading={loading}
                            error={error}
                            success={success}
                            onAddProduct={handleAddProduct}
                            onDeleteProduct={handleDeleteProduct}
                            onRefreshNotifiche={refreshNotifiche}
                            onClearMessages={clearMessages}
                            activeTab={activeTab}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;