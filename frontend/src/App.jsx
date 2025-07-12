import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar.jsx';
import Cart from './Components/Cart/Cart.jsx';
import Login from './Pages/Login/Login.jsx';
import Home from './Pages/Home/Home.jsx';
import VendorDashboard from "./Pages/VendorDashboard/VendorDashboard.jsx";


const App = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;