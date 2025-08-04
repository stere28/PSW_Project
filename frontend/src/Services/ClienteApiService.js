import apiClient from './BaseApiService.js';

export const ClienteApiService = {
    /**
     * Crea un nuovo cliente (richiede ruolo 'user')
     * @returns {Promise<string>} Messaggio di conferma
     */
    creaCliente: async () => {
        try {
            const response = await apiClient.post('/cliente');
            return response.data;
        } catch (error) {
            console.error('Error creating client:', error);
            throw error;
        }
    },

    /**
     * Ottiene il contenuto del carrello (richiede ruolo 'user')
     * @returns {Promise<Array>} Lista prodotti nel carrello
     */
    getCarrello: async () => {
        try {
            const response = await apiClient.get('/carrello');
            return response.data;
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw error;
        }
    },

    /**
     * Aggiunge un prodotto al carrello (richiede ruolo 'user')
     * @param {number} idProdotto - ID del prodotto da aggiungere
     * @returns {Promise<Array>} Carrello aggiornato
     */
    aggiungiAlCarrello: async (idProdotto) => {
        try {
            if (!idProdotto) {
                throw new Error('ID prodotto è richiesto');
            }

            const response = await apiClient.post('/carrello/add', null, {
                params: { idProdotto }
            });
            return response.data;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    },

    /**
     * Rimuove un prodotto dal carrello (richiede ruolo 'user')
     * @param {number} idProdotto - ID del prodotto da rimuovere
     * @returns {Promise<Array>} Carrello aggiornato
     */
    rimuoviDalCarrello: async (idProdotto) => {
        try {
            if (!idProdotto) {
                throw new Error('ID prodotto è richiesto');
            }

            const response = await apiClient.delete('/carrello/remove', {
                params: { idProdotto }
            });
            return response.data;
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    },

    /**
     * Esegue il checkout del carrello (richiede ruolo 'user')
     * @returns {Promise<string>} Messaggio di conferma
     */
    checkout: async () => {
        try {
            const response = await apiClient.post('/carrello/checkout');
            return response.data;
        } catch (error) {
            console.error('Error during checkout:', error);
            throw error;
        }
    }
};