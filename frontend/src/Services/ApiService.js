// Façade
import { ProdottiApiService } from './ProdottiApiService.js';
import { ClienteApiService } from './ClienteApiService.js';
import { VenditoreApiService } from './VenditoreApiService.js';

export const ApiService = {
    // === PRODOTTI (pubblici - nessuna autenticazione richiesta) ===

    getProducts: ProdottiApiService.getAll,

    getProductPaged: ProdottiApiService.getPaged,

    getProductsByFilter: (filters) => {
        // Converte il formato dal vecchio API al nuovo
        const convertedFilters = {
            text: filters.search,
            categoria: filters.category,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            sortBy: convertSortFormat(filters.sort),
            pageNumber: filters.pageNumber || 0,
            pageSize: filters.pageSize || 50
        };

        return ProdottiApiService.filterProducts(convertedFilters);
    },

    // === CARRELLO (richiede autenticazione) ===

    getCart: ClienteApiService.getCarrello,

    addToCart: ClienteApiService.aggiungiAlCarrello,

    removeFromCart: ClienteApiService.rimuoviDalCarrello,

    checkoutCart: ClienteApiService.checkout,

    // === CLIENTE ===

    createClient: ClienteApiService.creaCliente,

    // === VENDITORE ===

    createSeller: VenditoreApiService.getProfilo, // Richiama getProfilo che fa getOrCreate

    addProduct: VenditoreApiService.aggiungiProdotto,

    getSellerProducts: VenditoreApiService.getProdottiInVendita,

    getSellerSoldProducts: VenditoreApiService.getProdottiVenduti,

    getSellerNotifications: VenditoreApiService.getNotifiche,

    // === GESTIONE PRODOTTI VENDITORE ===

    updateProduct: async (productId, product) => {
        throw new Error('Update product non implementato nel backend. Usa eliminaProdotto e aggiungiProdotto.');
    },

    deleteProduct: VenditoreApiService.eliminaProdotto
};

// Funzione helper per convertire il formato di ordinamento
function convertSortFormat(sort = 'price-asc') {
    const sortMap = {
        'price-asc': 'prezzo',
        'price-desc': 'prezzo',
        'name-asc': 'nome',
        'name-desc': 'nome',
        'rating-asc': 'rating',
        'rating-desc': 'rating'
    };

    return sortMap[sort] || 'id';
}