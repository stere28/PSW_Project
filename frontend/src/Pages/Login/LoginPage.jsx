import React, { useEffect } from 'react';
import {useAuth} from "../../Context/AuthContext.jsx";
import './LoginPage.css';

const LoginPage = () => {
    const { login, loading, error, clearError, isAuthenticated, user } = useAuth();

    useEffect(() => {
        // Pulisce gli errori quando la pagina si monta
        clearError();
    }, [clearError]);

    // Se l'utente è già autenticato, mostra un messaggio di benvenuto
    if (isAuthenticated) {
        return (
            <div className="login-container">
                <div className="login-card welcome-card">
                    <div className="welcome-icon">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12l2 2 4-4"></path>
                            <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                    </div>
                    <div className="welcome-content">
                        <h1>Benvenuto!</h1>
                        <p>Sei già autenticato come <strong>{user?.username}</strong></p>
                        <button
                            onClick={() => window.history.back()}
                            className="back-btn"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="15,18 9,12 15,6"></polyline>
                            </svg>
                            Torna alla pagina precedente
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleLogin = () => {
        clearError();
        login();
    };

    if (loading) {
        return (
            <div className="login-container">
                <div className="login-card loading-card">
                    <div className="loading-content">
                        <div className="loading-spinner"></div>
                        <h2>Caricamento...</h2>
                        <p>Stiamo inizializzando l'autenticazione</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="m1 1 4 0 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </div>
                    <h1>MormannoShop</h1>
                    <p>Accedi al tuo account per iniziare a fare shopping</p>
                </div>

                {error && (
                    <div className="error-message">
                        <div className="error-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                        </div>
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

                    <div className="login-description">
                        <h2>Accesso Sicuro</h2>
                        <p>
                            Utilizza il sistema di autenticazione Keycloak per accedere in modo sicuro
                            alla tua area personale e gestire i tuoi acquisti.
                        </p>
                    </div>

                    <button
                        onClick={handleLogin}
                        className="login-button"
                        disabled={loading}
                    >
                        <div className="button-content">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                <polyline points="10,17 15,12 10,7"></polyline>
                                <line x1="15" y1="12" x2="3" y2="12"></line>
                            </svg>
                            <span>Accedi con Keycloak</span>
                        </div>
                        <div className="button-glow"></div>
                    </button>

                    <div className="features-list">
                        <div className="feature-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 12l2 2 4-4"></path>
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                            <span>Autenticazione sicura</span>
                        </div>
                        <div className="feature-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 12l2 2 4-4"></path>
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                            <span>Gestione carrello personale</span>
                        </div>
                        <div className="feature-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 12l2 2 4-4"></path>
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                            <span>Cronologia acquisti</span>
                        </div>
                    </div>
                </div>

                <div className="login-footer">
                    <div className="security-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                        <span>Protetto da Keycloak</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;