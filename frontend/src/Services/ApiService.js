import { AuthService } from './AuthService.js';

const BASE_URL = "http://localhost:9090/API";

// Funzione helper per ottenere gli headers con autenticazione
const getAuthHeaders = () => {
    return AuthService.getAuthHeaders();
};

// Funzione helper per gestire le risposte con errori di autenticazione
const handleResponse = async (response, retryCallback = null) => {
    if (response.status === 401) {
        console.log('401 Unauthorized - attempting token refresh');
        try {
            await AuthService.refreshToken();
            if (retryCallback) {
                console.log('Retrying request with new token');
                return await retryCallback();
            }
        } catch (error) {
            console.error('Token refresh failed, logging out');
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
    // === PRODOTTI (pubblici - nessuna autenticazione richiesta) ===

    getProducts: async () => {
        try {
            const response = await fetch(`${BASE_URL}/prodotti`);
            await handleResponse(response);
            return response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    getProductPaged: async (pageNumber = 0, pageSize = 10, sortBy = 'id') => {
        try {
            const response = await fetch(`${BASE_URL}/prodotti/paged?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}`);
            await handleResponse(response);
            return response.json();
        } catch (error) {
            console.error('Error fetching paged products:', error);
            throw error;
        }
    },

    getProductsByFilter: async (filters) => {
        try {
            const {
                search,
                category,
                minPrice,
                maxPrice,
                rating,
                sort = 'price-asc',
                pageNumber = 0,
                pageSize = 50
            } = filters;

            const params = new URLSearchParams();
            if (search) params.append('text', search);
            if (category) params.append('categoria', category);
            if (minPrice !== undefined && minPrice !== '') params.append('minPrice', minPrice);
            if (maxPrice !== undefined && maxPrice !== '') params.append('maxPrice', maxPrice);
            if (rating) params.append('rating', rating);

            // Convert sort format
            let sortBy = 'id';
            if (sort.includes('price')) sortBy = 'prezzo';
            else if (sort.includes('name')) sortBy = 'nome';
            else if (sort.includes('rating')) sortBy = 'rating';

            params.append('sortBy', sortBy);
            params.append('pageNumber', pageNumber);
            params.append('pageSize', pageSize);

            const response = await fetch(`${BASE_URL}/prodotti/filter?${params.toString()}`);
            await handleResponse(response);
            return response.json();
        } catch (error) {
            console.error('Error fetching filtered products:', error);
            throw error;
        }
    },

    // === CARRELLO (richiede autenticazione) ===

    getCart: async () => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/carrello`, {
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        try {
            const response = await makeRequest();
            return response.json();
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw error;
        }
    },

    addToCart: async (idProdotto) => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/carrello/add?idProdotto=${idProdotto}`, {
                method: "POST",
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        try {
            const response = await makeRequest();
            return response.json();
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    },

    removeFromCart: async (idProdotto) => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/carrello/remove?idProdotto=${idProdotto}`, {
                method: "DELETE",
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        try {
            const response = await makeRequest();
            return response.json();
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    },

    checkoutCart: async () => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/carrello/checkout`, {
                method: "POST",
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        try {
            const response = await makeRequest();
            return response.text();
        } catch (error) {
            console.error('Error during checkout:', error);
            throw error;
        }
    },

    // === CLIENTE ===

    createClient: async () => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/cliente`, {
                method: "POST",
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        try {
            const response = await makeRequest();
            return response.text();
        } catch (error) {
            console.error('Error creating client:', error);
            throw error;
        }
    },

    // === VENDITORE ===

    createSeller: async () => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/venditore`, {
                method: "POST",
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        try {
            const response = await makeRequest();
            return response.text();
        } catch (error) {
            console.error('Error creating seller:', error);
            throw error;
        }
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

        try {
            const response = await makeRequest();
            return response.json();
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    },

    getSellerProducts: async () => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/venditore/prodotti/in-vendita`, {
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        try {
            const response = await makeRequest();
            return response.json();
        } catch (error) {
            console.error('Error fetching seller products:', error);
            throw error;
        }
    },

    getSellerSoldProducts: async () => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/venditore/prodotti/venduti`, {
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        try {
            const response = await makeRequest();
            return response.json();
        } catch (error) {
            console.error('Error fetching sold products:', error);
            throw error;
        }
    },

    getSellerNotifications: async () => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/venditore/notifiche`, {
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        try {
            const response = await makeRequest();
            return response.json();
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },

    // === GESTIONE PRODOTTI VENDITORE (UPDATE/DELETE) ===

    updateProduct: async (productId, product) => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/venditore/prodotti/${productId}`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify(product),
            });
            return await handleResponse(response, makeRequest);
        };

        try {
            const response = await makeRequest();
            return response.json();
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    deleteProduct: async (productId) => {
        const makeRequest = async () => {
            const response = await fetch(`${BASE_URL}/venditore/prodotti/${productId}`, {
                method: "DELETE",
                headers: getAuthHeaders()
            });
            return await handleResponse(response, makeRequest);
        };

        try {
            const response = await makeRequest();
            return response.text();
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }
};