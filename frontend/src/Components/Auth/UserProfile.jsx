import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from "../../Context/AuthContext.jsx";
import { FiUser, FiLogOut, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './UserProfile.css';

const UserProfile = () => {
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    // Chiudi il dropdown quando si clicca fuori
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="user-profile" ref={dropdownRef}>
            <div
                className="profile-trigger"
                onClick={toggleDropdown}
                aria-haspopup="true"
                aria-expanded={showDropdown}
            >
                <div className="avatar">
                    {user?.username?.charAt(0).toUpperCase() || <FiUser />}
                </div>
                <span className="username">{user?.username}</span>
                {showDropdown ? <FiChevronUp className="dropdown-icon" /> : <FiChevronDown className="dropdown-icon" />}
            </div>

            {showDropdown && (
                <div className="profile-dropdown">
                    <div className="dropdown-header">
                        <div className="avatar-large">
                            {user?.username?.charAt(0).toUpperCase() || <FiUser />}
                        </div>
                        <div className="user-info">
                            <h3 className="user-name">{user?.username}</h3>
                            <p className="user-email">{user?.email}</p>
                        </div>
                    </div>

                    <div className="dropdown-section">
                        <h4 className="section-title">Ruoli</h4>
                        <div className="roles-list">
                            {user?.roles?.length > 0 ? (
                                user.roles
                                    .filter(role => role === 'user' || role === 'venditore')
                                    .map(role => (
                                        <span key={role} className={`role-badge ${role}`}>
                                            {role}
                                        </span>
                                    ))
                            ) : (
                                <span className="no-roles">Nessun ruolo assegnato</span>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="logout-button"
                        aria-label="Logout"
                    >
                        <FiLogOut className="logout-icon" />
                        <span>Esci dall'account</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;