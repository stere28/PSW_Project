import React, { useState, useEffect, useCallback } from 'react';
import Vendor from "../../Components/Vendor/Vendor.jsx";
import { VenditoreApiService } from '../../Services/VenditoreApiService.js';
import { useAuth } from "../../Context/AuthContext.jsx";
import './VendorDashboard.css';
import { FiAlertCircle, FiCheckCircle, FiLoader, FiPackage, FiDollarSign, FiBell } from 'react-icons/fi';

// Piccolo componente riutilizzabile per i messaggi
const AlertMessage = ({ type, message, onClose }) => {
  if (!message) return null;
  const Icon = type === 'error' ? FiAlertCircle : FiCheckCircle;
  return (
    <div className={`alert-message ${type}`}>
      <Icon />
      <span>{message}</span>
      <button onClick={onClose} className="close-btn">&times;</button>
    </div>
  );
};

// Piccolo componente per statistiche
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="stat-card">
    <div className="stat-icon">
      <Icon />
    </div>
    <div className="stat-info">
      <h3>{label}</h3>
      <p>{value}</p>
    </div>
  </div>
);

const VendorDashboard = () => {
  const { user, isAuthenticated, hasRole } = useAuth();
  const [prodottiInVendita, setProdottiInVendita] = useState([]);
  const [prodottiVenduti, setProdottiVenduti] = useState([]);
  const [notifiche, setNotifiche] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('inVendita');

  // 🔹 Funzione per pulire messaggi
  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  // 🔹 Fetch dati
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !hasRole('venditore')) {
        setError('Accesso non autorizzato. È necessario il ruolo venditore.');
        return;
      }

      if (!user?.id) {
        setError('Impossibile ottenere l\'ID utente.');
        return;
      }

      try {
        setLoading(true);
        clearMessages();

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

    if (user) fetchData();
  }, [isAuthenticated, hasRole, user, clearMessages]);

  // 🔹 Handlers principali
  const handleAddProduct = useCallback(async (newProduct, validationError = null) => {
    if (validationError) {
      setError(validationError);
      setSuccess('');
      return;
    }

    try {
      setLoading(true);
      clearMessages();

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
  }, [clearMessages]);

  const handleDeleteProduct = useCallback(async (productId) => {
    try {
      setLoading(true);
      clearMessages();

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
  }, [clearMessages]);

  const refreshNotifiche = useCallback(async () => {
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
  }, []);

  // 🔹 Access Control
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

        <AlertMessage type="error" message={error} onClose={clearMessages} />
        <AlertMessage type="success" message={success} onClose={clearMessages} />

        <div className="stats-cards">
          <StatCard icon={FiPackage} label="Prodotti in vendita" value={prodottiInVendita.length} />
          <StatCard icon={FiDollarSign} label="Prodotti venduti" value={prodottiVenduti.length} />
          <StatCard icon={FiBell} label="Notifiche" value={notifiche.length} />
        </div>

        <div className="main-content">
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
            setActiveTab={setActiveTab}
          />
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
