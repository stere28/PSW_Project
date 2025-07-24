import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { AuthService } from '../services/AuthService';

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        try {
            setLoading(true);
            setError(null);

            const authenticated = await AuthService.initKeycloak();
            setIsAuthenticated(authenticated);

            if (authenticated) {
                const userInfo = AuthService.getUserInfo();
                setUser({
                    id: AuthService.getUserId(),
                    username: AuthService.getUsername(),
                    email: AuthService.getEmail(),
                    roles: AuthService.getRoles(),
                    fullInfo: userInfo
                });
            }
        } catch (err) {
            setError('Errore durante l\'inizializzazione dell\'autenticazione');
            console.error('Auth initialization error:', err);
        } finally {
            setLoading(false);
        }
    };

    const login = async () => {
        try {
            await AuthService.login();
        } catch (err) {
            setError('Errore durante il login');
            console.error('Login error:', err);
        }
    };

    const logout = async () => {
        try {
            await AuthService.logout();
            setIsAuthenticated(false);
            setUser(null);
        } catch (err) {
            setError('Errore durante il logout');
            console.error('Logout error:', err);
        }
    };

    const refreshToken = async () => {
        try {
            await AuthService.refreshToken();
            return true;
        } catch (err) {
            setError('Errore durante il refresh del token');
            console.error('Token refresh error:', err);
            return false;
        }
    };

    const hasRole = (role) => {
        return user?.roles?.includes(role) || false;
    };

    const value = {
        isAuthenticated,
        user,
        loading,
        error,
        login,
        logout,
        refreshToken,
        hasRole,
        clearError: () => setError(null)
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};