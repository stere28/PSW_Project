import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import { useAuth } from './Context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import UserProfile from './components/Auth/UserProfile';
import Navbar from './Components/Navbar/Navbar.jsx';
import Cart from './Components/Cart/Cart.jsx';
import Login from './Pages/Login/LoginPage.jsx';
import Home from './Pages/Home/Home.jsx';
import VendorDashboard from "./Pages/VendorDashboard/VendorDashboard.jsx";
import Vendor from './components/Vendor/Vendor';
import './App.css';

const AppContent = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="app-loading">
                <div className="loading-spinner"></div>
                <p>Caricamento applicazione...</p>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <div className="app">
                {/* Header che mostra solo quando l'utente è autenticato */}
                {isAuthenticated && (
                    <header className="app-header">
                        <h1>MormannoShop</h1>
                        <UserProfile />
                    </header>
                )}

                {/* Navbar sempre visibile */}
                <Navbar />

                <main className="app-main">
                    <Routes>
                        {/* Route pubbliche */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />

                        {/* Route protette che richiedono autenticazione */}
                        <Route
                            path="/cart"
                            element={
                                <ProtectedRoute>
                                    <Cart />
                                </ProtectedRoute>
                            }
                        />

                        {/* Route protette per venditori */}
                        <Route
                            path="/vendor-dashboard"
                            element={
                                <ProtectedRoute requiredRole="venditore">
                                    <VendorDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Route per il componente Vendor */}
                        <Route
                            path="/vendor"
                            element={
                                <ProtectedRoute requiredRole="venditore">
                                    <Vendor />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;