import apiClient from './BaseApiService.js';

export const ProdottiApiService = {
    /**
     * Ottiene tutti i prodotti (pubblico - nessuna autenticazione richiesta)
     * @returns {Promise<Array>} Lista di tutti i prodotti
     */
    getAll: async () => {
        try {
            const response = await apiClient.get('/prodotti');
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    /**
     * Ottiene i prodotti con paginazione (pubblico)
     * @param {number} pageNumber - Numero pagina (default: 0)
     * @param {number} pageSize - Dimensione pagina (default: 10)
     * @param {string} sortBy - Campo per ordinamento (default: 'id')
     * @returns {Promise<Array>} Lista prodotti paginata
     */
    getPaged: async (pageNumber = 0, pageSize = 10, sortBy = 'id') => {
        try {
            const response = await apiClient.get('/prodotti/paged', {
                params: {
                    pageNumber,
                    pageSize,
                    sortBy
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching paged products:', error);
            throw error;
        }
    },

    /**
     * Filtra i prodotti con vari criteri (pubblico)
     * @param {Object} filters - Oggetto contenente i filtri
     * @param {string} filters.text - Testo per ricerca
     * @param {string} filters.categoria - Categoria prodotto
     * @param {number} filters.minPrice - Prezzo minimo
     * @param {number} filters.maxPrice - Prezzo massimo
     * @param {string} filters.sortBy - Campo ordinamento (default: 'id')
     * @param {number} filters.pageNumber - Numero pagina (default: 0)
     * @param {number} filters.pageSize - Dimensione pagina (default: 10)
     * @returns {Promise<Array>} Lista prodotti filtrata
     */
    filterProducts: async (filters = {}) => {
        try {
            const {
                text,
                categoria,
                minPrice,
                maxPrice,
                sortBy = 'id',
                pageNumber = 0,
                pageSize = 10
            } = filters;

            const params = {
                sortBy,
                pageNumber,
                pageSize
            };

            // Aggiungi solo i parametri definiti
            if (text) params.text = text;
            if (categoria) params.categoria = categoria;
            if (minPrice !== undefined && minPrice !== null) params.minPrice = minPrice;
            if (maxPrice !== undefined && maxPrice !== null) params.maxPrice = maxPrice;

            const response = await apiClient.get('/prodotti/filter', { params });
            return response.data;
        } catch (error) {
            console.error('Error filtering products:', error);
            throw error;
        }
    }
};