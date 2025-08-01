import React from 'react';
import {useAuth} from "../../Context/AuthContext.jsx";
import LoginPage from "../../Pages/Login/LoginPage.jsx";

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { isAuthenticated, hasRole, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Verificando autenticazione...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return (
            <div className="access-denied">
                <h2>Accesso Negato</h2>
                <p>Non hai i permessi necessari per accedere a questa pagina.</p>
                <p>Ruolo richiesto: {requiredRole}</p>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;