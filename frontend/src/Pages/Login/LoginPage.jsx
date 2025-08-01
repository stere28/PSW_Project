import React, { useEffect } from 'react';
import {useAuth} from "../../Context/AuthContext.jsx";

const LoginPage = () => {
    const { login, loading, error, clearError } = useAuth();

    useEffect(() => {
        // Pulisce gli errori quando la pagina si monta
        clearError();
    }, [clearError]);

    const handleLogin = () => {
        login();
    };

    if (loading) {
        return (
            <div className="login-container">
                <div className="login-card">
                    <div className="loading-spinner"></div>
                    <p>Caricamento...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>MormannoShop</h1>
                    <p>Accedi al tuo account</p>
                </div>

                {error && (
                    <div className="error-message">
                        <span>{error}</span>
                        <button onClick={clearError} className="close-btn">×</button>
                    </div>
                )}

                <div className="login-content">
                    <div className="login-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>

                    <p className="login-description">
                        Clicca sul pulsante qui sotto per accedere in modo sicuro tramite Keycloak
                    </p>

                    <button
                        onClick={handleLogin}
                        className="login-button"
                        disabled={loading}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                            <polyline points="10,17 15,12 10,7"></polyline>
                            <line x1="15" y1="12" x2="3" y2="12"></line>
                        </svg>
                        Accedi con Keycloak
                    </button>
                </div>

                <div className="login-footer">
                    <p>Accesso sicuro protetto da Keycloak</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;