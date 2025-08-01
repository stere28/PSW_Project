import keycloak from "../config/keycloak.js";

export class AuthService {
    // Inizializza Keycloak
    static async initKeycloak() {
        try {
            const authenticated = await keycloak.init({
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
                pkceMethod: 'S256',
                checkLoginIframe: false,
                enableLogging: true
            });

            // Setup automatic token refresh
            if (authenticated) {
                this.setupTokenRefresh();

                // Setup event listeners
                keycloak.onTokenExpired = () => {
                    console.log('Token expired, refreshing...');
                    this.refreshToken();
                };

                keycloak.onAuthRefreshError = () => {
                    console.error('Auth refresh error, logging out...');
                    this.logout();
                };
            }

            console.log('Keycloak initialized, authenticated:', authenticated);
            return authenticated;
        } catch (error) {
            console.error('Keycloak initialization failed:', error);
            throw error;
        }
    }

    // Setup automatic token refresh
    static setupTokenRefresh() {
        setInterval(() => {
            if (keycloak.authenticated) {
                keycloak.updateToken(70).catch(() => {
                    console.error('Failed to refresh token');
                });
            }
        }, 60000); // Refresh every minute
    }

    // Login
    static login() {
        const currentUrl = window.location.href;
        return keycloak.login({
            redirectUri: currentUrl
        });
    }

    // Logout
    static logout() {
        return keycloak.logout({
            redirectUri: window.location.origin
        });
    }

    // Verifica se l'utente è autenticato
    static isAuthenticated() {
        return keycloak.authenticated && keycloak.token;
    }

    // Ottieni token di accesso
    static getToken() {
        return keycloak.token;
    }

    // Ottieni informazioni utente
    static getUserInfo() {
        return keycloak.tokenParsed;
    }

    // Ottieni ID utente
    static getUserId() {
        return keycloak.tokenParsed?.sub;
    }

    // Ottieni username
    static getUsername() {
        return keycloak.tokenParsed?.preferred_username;
    }

    // Ottieni email
    static getEmail() {
        return keycloak.tokenParsed?.email;
    }

    // Ottieni ruoli
    static getRoles() {
        return keycloak.tokenParsed?.realm_access?.roles || [];
    }

    // Verifica se l'utente ha un ruolo specifico
    static hasRole(role) {
        const roles = this.getRoles();
        return roles.includes(role);
    }

    // Refresh token
    static async refreshToken(minValidity = 30) {
        try {
            const refreshed = await keycloak.updateToken(minValidity);
            if (refreshed) {
                console.log('Token refreshed successfully');
            }
            return refreshed;
        } catch (error) {
            console.error('Token refresh failed:', error);
            throw error;
        }
    }

    // Ottieni headers per le richieste API
    static getAuthHeaders() {
        const token = this.getToken();
        return token ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        } : {
            'Content-Type': 'application/json'
        };
    }

    // Verifica se il token è valido (non scaduto)
    static isTokenValid() {
        if (!keycloak.token) return false;
        return keycloak.isTokenExpired() === false;
    }

    // Ottieni tempo rimanente del token in secondi
    static getTokenTimeLeft() {
        if (!keycloak.tokenParsed) return 0;
        const now = Math.ceil(Date.now() / 1000);
        return keycloak.tokenParsed.exp - now;
    }
}