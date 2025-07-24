import React, { useState, useEffect } from 'react';
import Vendor from "../../Components/Vendor/Vendor.jsx";
import { VenditoreApiService } from '../../Services/VenditoreApiService.js';

const VendorDashboard = () => {

    //TODO implementare il servizio di login per prendere l'id
    const [idVenditore] = useState(1);
    const [prodottiInVendita, setProdottiInVendita] = useState([]);
    const [prodottiVenduti, setProdottiVenduti] = useState([]);
    const [notifiche, setNotifiche] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Caricamento dati
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [inVendita, venduti, notif] = await Promise.all([
                    VenditoreApiService.getProdottiInVendita(idVenditore),
                    VenditoreApiService.getProdottiVenduti(idVenditore),
                    VenditoreApiService.getNotifiche(idVenditore)
                ]);
                setProdottiInVendita(inVendita);
                setProdottiVenduti(venduti);
                setNotifiche(notif);
            } catch (err) {
                setError('Errore nel caricamento: ' + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [idVenditore]);

    const handleAddProduct = async (newProduct) => {
        try {
            await VenditoreApiService.aggiungiProdotto(newProduct);
            const updated = await VenditoreApiService.getProdottiInVendita(idVenditore);
            setProdottiInVendita(updated);
            setSuccess('Prodotto aggiunto!');
        } catch (err) {
            setError('Errore: ' + err.message);
        }
    };

    const refreshNotifiche = async () => {
        const updated = await VenditoreApiService.getNotifiche(idVenditore);
        setNotifiche(updated);
    };

    if (loading) return <div>Caricamento...</div>;

    return (
        <Vendor
            prodottiInVendita={prodottiInVendita}
            prodottiVenduti={prodottiVenduti}
            notifiche={notifiche}
            loading={loading}
            error={error}
            success={success}
            onAddProduct={handleAddProduct}
            onRefreshNotifiche={refreshNotifiche}
            />

    );
};

export default VendorDashboard;