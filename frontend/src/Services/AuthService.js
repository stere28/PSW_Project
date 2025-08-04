// frontend/src/services/AuthService.js
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
        // Refresh token ogni minuto se l'utente è autenticato
        setInterval(() => {
            if (keycloak.authenticated && this.isTokenValid()) {
                // Aggiorna il token se scade entro 2 minuti
                keycloak.updateToken(120).catch((error) => {
                    console.error('Failed to refresh token:', error);
                });
            }
        }, 60000);
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
        return keycloak.authenticated && keycloak.token && this.isTokenValid();
    }

    // Ottieni token di accesso
    static getToken() {
        return keycloak.token;
    }

    // Ottieni refresh token
    static getRefreshToken() {
        return keycloak.refreshToken;
    }

    // Ottieni informazioni utente dal token
    static getUserInfo() {
        return keycloak.tokenParsed;
    }

    // Ottieni ID utente (subject)
    static getUserId() {
        return keycloak.tokenParsed?.sub;
    }

    // Ottieni username
    static getUsername() {
        return keycloak.tokenParsed?.preferred_username;
    }

    // Ottieni nome completo
    static getFullName() {
        const tokenParsed = keycloak.tokenParsed;
        if (tokenParsed?.given_name && tokenParsed?.family_name) {
            return `${tokenParsed.given_name} ${tokenParsed.family_name}`;
        }
        return tokenParsed?.name || this.getUsername();
    }

    // Ottieni email
    static getEmail() {
        return keycloak.tokenParsed?.email;
    }

    // Ottieni ruoli del realm
    static getRoles() {
        return keycloak.tokenParsed?.realm_access?.roles || [];
    }

    // Ottieni ruoli delle risorse (client roles)
    static getResourceRoles(clientId = null) {
        const resourceAccess = keycloak.tokenParsed?.resource_access;
        if (!resourceAccess) return [];

        if (clientId) {
            return resourceAccess[clientId]?.roles || [];
        }

        // Restituisce tutti i ruoli delle risorse
        const allRoles = [];
        Object.values(resourceAccess).forEach(resource => {
            if (resource.roles) {
                allRoles.push(...resource.roles);
            }
        });
        return allRoles;
    }

    // Verifica se l'utente ha un ruolo specifico
    static hasRole(role) {
        const realmRoles = this.getRoles();
        const resourceRoles = this.getResourceRoles();

        return realmRoles.includes(role) || resourceRoles.includes(role);
    }

    // Verifica se l'utente ha almeno uno dei ruoli specificati
    static hasAnyRole(roles) {
        return roles.some(role => this.hasRole(role));
    }

    // Verifica se l'utente ha tutti i ruoli specificati
    static hasAllRoles(roles) {
        return roles.every(role => this.hasRole(role));
    }

    // Refresh token
    static async refreshToken(minValidity = 30) {
        try {
            if (!keycloak.authenticated) {
                throw new Error('User not authenticated');
            }

            const refreshed = await keycloak.updateToken(minValidity);
            if (refreshed) {
                console.log('Token refreshed successfully');
            } else {
                console.log('Token is still valid');
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
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token && this.isTokenValid()) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    // Verifica se il token è valido (non scaduto)
    static isTokenValid() {
        if (!keycloak.token || !keycloak.tokenParsed) return false;

        // Verifica se il token è scaduto
        return !keycloak.isTokenExpired();
    }

    // Ottieni tempo rimanente del token in secondi
    static getTokenTimeLeft() {
        if (!keycloak.tokenParsed) return 0;
        const now = Math.ceil(Date.now() / 1000);
        return Math.max(0, keycloak.tokenParsed.exp - now);
    }

    // Ottieni tempo di scadenza del token
    static getTokenExpiration() {
        if (!keycloak.tokenParsed) return null;
        return new Date(keycloak.tokenParsed.exp * 1000);
    }

    // Debug: ottieni informazioni complete sul token
    static getTokenDebugInfo() {
        if (!keycloak.tokenParsed) return null;

        return {
            userId: this.getUserId(),
            username: this.getUsername(),
            email: this.getEmail(),
            fullName: this.getFullName(),
            roles: this.getRoles(),
            resourceRoles: this.getResourceRoles(),
            isValid: this.isTokenValid(),
            timeLeft: this.getTokenTimeLeft(),
            expiration: this.getTokenExpiration(),
            tokenParsed: keycloak.tokenParsed
        };
    }

    // Forza il logout se necessario
    static async forceLogoutIfInvalid() {
        if (keycloak.authenticated && !this.isTokenValid()) {
            console.warn('Token invalid, forcing logout');
            await this.logout();
            return true;
        }
        return false;
    }
}