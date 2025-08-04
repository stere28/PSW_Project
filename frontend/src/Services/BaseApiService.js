import axios from 'axios';
import { AuthService } from './AuthService.js';

const BASE_URL = "http://localhost:9090/API";

// Crea un'istanza di axios con configurazione base
const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor per aggiungere automaticamente il token di autenticazione
apiClient.interceptors.request.use(
    (config) => {
        const token = AuthService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor per gestire le risposte e i refresh token
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Se è un errore 401 e non è già un retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                console.log('401 Unauthorized - attempting token refresh');
                await AuthService.refreshToken();

                // Riprova la richiesta originale con il nuovo token
                const newToken = AuthService.getToken();
                if (newToken) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                console.error('Token refresh failed, logging out');
                await AuthService.logout();
                throw new Error('Sessione scaduta. Effettua nuovamente il login.');
            }
        }

        // Gestione errori personalizzata
        if (error.response?.data) {
            const errorData = error.response.data;

            // Se il backend restituisce un messaggio di errore strutturato
            if (errorData.message) {
                throw new Error(errorData.message);
            }

            // Se è una stringa semplice
            if (typeof errorData === 'string') {
                throw new Error(errorData);
            }
        }

        // Fallback per altri tipi di errore
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            `Errore HTTP: ${error.response?.status || 'Sconosciuto'}`
        );
    }
);

export default apiClient;