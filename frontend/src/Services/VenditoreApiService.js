import apiClient from './BaseApiService.js';

export const VenditoreApiService = {
    /**
     * Ottiene il profilo del venditore (richiede ruolo 'venditore')
     * @returns {Promise<Object>} Informazioni venditore
     */
    getProfilo: async () => {
        try {
            const response = await apiClient.get('/venditore/me');
            return response.data;
        } catch (error) {
            console.error('Error fetching vendor profile:', error);
            throw error;
        }
    },

    /**
     * Aggiunge un nuovo prodotto (richiede ruolo 'venditore')
     * @param {Object} prodotto - Dati del prodotto
     * @param {string} prodotto.nome - Nome del prodotto
     * @param {string} prodotto.descrizione - Descrizione del prodotto
     * @param {number} prodotto.prezzo - Prezzo del prodotto
     * @param {string} [prodotto.categoria] - Categoria del prodotto
     * @returns {Promise<Object>} Risposta con ID del prodotto creato
     */
    aggiungiProdotto: async (prodotto) => {
        try {
            // Validazione base
            if (!prodotto.nome || !prodotto.descrizione || !prodotto.prezzo) {
                throw new Error('Nome, descrizione e prezzo sono obbligatori');
            }

            if (prodotto.prezzo <= 0) {
                throw new Error('Il prezzo deve essere maggiore di 0');
            }

            const response = await apiClient.post('/venditore/prodotti/aggiunta', prodotto);
            return response.data;
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    },

    /**
     * Ottiene i prodotti in vendita del venditore (richiede ruolo 'venditore')
     * @returns {Promise<Array>} Lista prodotti in vendita
     */
    getProdottiInVendita: async () => {
        try {
            const response = await apiClient.get('/venditore/prodotti/in-vendita');
            return response.data;
        } catch (error) {
            console.error('Error fetching products in sale:', error);
            throw error;
        }
    },

    /**
     * Ottiene i prodotti venduti dal venditore (richiede ruolo 'venditore')
     * @returns {Promise<Array>} Lista prodotti venduti
     */
    getProdottiVenduti: async () => {
        try {
            const response = await apiClient.get('/venditore/prodotti/venduti');
            return response.data;
        } catch (error) {
            console.error('Error fetching sold products:', error);
            throw error;
        }
    },

    /**
     * Ottiene le notifiche del venditore (richiede ruolo 'venditore')
     * @returns {Promise<Array>} Lista notifiche
     */
    getNotifiche: async () => {
        try {
            const response = await apiClient.get('/venditore/notifiche');
            return response.data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },

    /**
     * Elimina un prodotto del venditore (richiede ruolo 'venditore')
     * @param {number} idProdotto - ID del prodotto da eliminare
     * @returns {Promise<string>} Messaggio di conferma
     */
    eliminaProdotto: async (idProdotto) => {
        try {
            if (!idProdotto) {
                throw new Error('ID prodotto è richiesto');
            }

            const response = await apiClient.delete(`/venditore/prodotti/${idProdotto}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }
};