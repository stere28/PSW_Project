import {AuthService} from "./AuthService.js";

const BASE_URL = "http://localhost:9090/API/venditore";

export const VenditoreApiService = {

    aggiungiProdotto: async (prodotto) => {
        const idVenditore = AuthService.getUserId();
        const response = await fetch(`${BASE_URL}/${idVenditore}/prodotti/aggiunta`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(prodotto)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    getProdottiInVendita: async () => {
        const idVenditore = AuthService.getUserId();
        const response = await fetch(`${BASE_URL}/${idVenditore}/prodotti/in-vendita`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    getProdottiVenduti: async () => {
        const idVenditore = AuthService.getUserId();
        const response = await fetch(`${BASE_URL}/${idVenditore}/prodotti/venduti`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    getNotifiche: async () => {
        const idVenditore = AuthService.getUserId();
        const response = await fetch(`${BASE_URL}/${idVenditore}/notifiche`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
};