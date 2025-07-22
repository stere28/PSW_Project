import keycloak from "../config/keycloak.js";

export class AuthService {
    // Inizializza Keycloak
    static async initKeycloak() {
        try {
            const authenticated = await keycloak.init({
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
                pkceMethod: 'S256',
                checkLoginIframe: false
            });

            console.log('Keycloak initialized, authenticated:', authenticated);
            return authenticated;
        } catch (error) {
            console.error('Keycloak initialization failed:', error);
            throw error;
        }
    }

    // Login
    static login() {
        return keycloak.login({
            redirectUri: window.location.origin
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
        return keycloak.authenticated;
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
    static async refreshToken() {
        try {
            return await keycloak.updateToken(30);
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
}