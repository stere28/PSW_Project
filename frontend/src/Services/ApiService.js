import { AuthService } from './AuthService.js';

const BASE_URL = "http://localhost:9090/API";

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

export const ApiService = {
    // Prodotti (pubblici - nessuna autenticazione richiesta)
    getProducts: async () => {
        const response = await fetch(`${BASE_URL}/prodotti`);
        await handleResponse(response);
        return response.json();
    },

    getProductPaged: async (page, size, sortBy = 'id') => {
        const response = await fetch(`${BASE_URL}/prodotti/paged?page=${page}&size=${size}&sortBy=${sortBy}`);
        await handleResponse(response);
        return response.json();
    },

    getProductsByFilter: async (filters) => {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${BASE_URL}/prodotti/filter?${queryParams}`);
        await handleResponse(response);
        return response.json();
    },

    getCart: async () => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/carrello`, {
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        const response = await makeRequest();
        return response.json();
    },

    addToCart: async (productId) => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/carrello/add?idProdotto=${productId}`, {
                method: "POST",
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        const response = await makeRequest();
        return response.json();
    },

    removeFromCart: async (productId) => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/carrello/remove?idProdotto=${productId}`, {
                method: "DELETE",
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        const response = await makeRequest();
        return response.json();
    },

    checkoutCart: async () => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/carrello/checkout`, {
                method: "POST",
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        const response = await makeRequest();
        return response.text();
    },


    addProduct: async (product) => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/venditore/prodotti/aggiunta`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(product),
            });
            return await handleResponse(response, makeRequest);
        };

        const response = await makeRequest();
        return response.json();
    },

    getSellerProducts: async () => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/venditore/prodotti/in-vendita`, {
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        const response = await makeRequest();
        return response.json();
    },

    getSellerSoldProducts: async () => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/venditore/prodotti/venduti`, {
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        const response = await makeRequest();
        return response.json();
    },

    getSellerNotifications: async () => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/venditore/notifiche`, {
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        const response = await makeRequest();
        return response.json();
    },

    // Metodi generici per operazioni CRUD sui prodotti (deprecati - sostituiti da metodi specifici)
    updateProduct: async (productId, product) => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/venditore/prodotti/${productId}`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify(product),
            });
            return await handleResponse(response, makeRequest);
        };

        const response = await makeRequest();
        return response.json();
    },

    deleteProduct: async (productId) => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/venditore/prodotti/${productId}`, {
                method: "DELETE",
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        const response = await makeRequest();
        return response.json();
    }
};