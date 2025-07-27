import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import UserProfile from './components/Auth/UserProfile';
import Navbar from './Components/Navbar/Navbar.jsx';
import Cart from './Pages/CartPage/CartPage.jsx';
import Login from './Pages/Login/LoginPage.jsx';
import Home from './Pages/Home/Home.jsx';
import VendorDashboard from './Pages/VendorDashboard/VendorDashboard.jsx';
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
                {isAuthenticated && (
                    <header className="app-header">
                        <h1>MormannoShop</h1>
                        <UserProfile />
                    </header>
                )}
                <Navbar />
                <main className="app-main">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/cart"
                            element={
                                <ProtectedRoute>
                                    <Cart />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/vendor-dashboard"
                            element={
                                <ProtectedRoute requiredRole="venditore">
                                    <VendorDashboard />
                                </ProtectedRoute>
                            }
                        />
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