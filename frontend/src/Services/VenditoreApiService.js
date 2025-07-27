import { AuthService } from "./AuthService.js";

const BASE_URL = "http://localhost:9090/API/venditore";

// Funzione helper per ottenere gli headers con autenticazione
const getAuthHeaders = () => {
    return AuthService.getAuthHeaders();
};

// Funzione helper per gestire le risposte con errori di autenticazione
const handleResponse = async (response, retryCallback = null) => {
    if (response.status === 401) {
        // Token scaduto, prova a fare refresh
        try {
            await AuthService.refreshToken();
            // Ritenta la richiesta se è stata fornita una callback
            if (retryCallback) {
                return await retryCallback();
            }
        } catch (error) {
            // Se il refresh fallisce, reindirizza al login
            await AuthService.logout();
            throw new Error('Sessione scaduta. Effettua nuovamente il login.');
        }
    }

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Errore HTTP: ${response.status}`);
    }

    return response;
};

export const VenditoreApiService = {

    // Crea un nuovo venditore
    creaVenditore: async () => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}`, {
                method: "POST",
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        const response = await makeRequest();
        return response.text();
    },

    // Aggiunge un nuovo prodotto
    aggiungiProdotto: async (prodotto) => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/prodotti/aggiunta`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(prodotto)
            });
            return await handleResponse(response, makeRequest);
        };

        const response = await makeRequest();
        return response.json();
    },

    // Ottiene i prodotti in vendita del venditore
    getProdottiInVendita: async () => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/prodotti/in-vendita`, {
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        const response = await makeRequest();
        return response.json();
    },

    // Ottiene i prodotti venduti dal venditore
    getProdottiVenduti: async () => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/prodotti/venduti`, {
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        const response = await makeRequest();
        return response.json();
    },

    // Ottiene le notifiche del venditore
    getNotifiche: async () => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/notifiche`, {
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        const response = await makeRequest();
        return response.json();
    },

    // Elimina un prodotto
    eliminaProdotto: async (idProdotto) => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/prodotti/${idProdotto}`, {
                method: "DELETE",
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        const response = await makeRequest();
        return response.text();
    }
};