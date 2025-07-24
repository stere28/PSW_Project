import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './UserProfile.css';

const UserProfile = () => {
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="user-profile">
            <div
                className="profile-trigger"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <div className="avatar">
                    {user?.username?.charAt(0).toUpperCase()}
                </div>
                <span className="username">{user?.username}</span>
                <svg
                    className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
            </div>

            {showDropdown && (
                <div className="profile-dropdown">
                    <div className="dropdown-header">
                        <div className="user-info">
                            <strong>{user?.username}</strong>
                            <span className="email">{user?.email}</span>
                        </div>
                    </div>

                    <div className="dropdown-divider"></div>

                    <div className="dropdown-section">
                        <h4>Ruolo:</h4>
                        <div className="roles-list">
                            {user?.roles
                                ?.filter(role => role === 'user' || role === 'venditore')
                                ?.map(role => (
                                    <span key={role} className="role-badge">{role}</span>
                                ))
                            }
                        </div>
                    </div>

                    <div className="dropdown-divider"></div>

                    <button onClick={handleLogout} className="logout-button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16,17 21,12 16,7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
