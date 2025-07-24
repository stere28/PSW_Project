import React from 'react';
import 'NotificationList.css'

const NotificationList = ({ notifications = [], onRefresh }) => {

    return (
        <div className="notifications-container">
            <div className="notifications-header">
                <h3>Notifiche ({notifications.length})</h3>
                <button
                    onClick={onRefresh}
                    className="refresh-btn"
                    aria-label="Aggiorna notifiche"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M23 4v6h-6M1 20v-6h6" />
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                </button>
            </div>

            {notifications.length === 0 ? (
                <div className="empty-notifications">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <p>Nessuna notifica disponibile</p>
                </div>
            ) : (
                <ul className="notifications-list">
                    {notifications.map((notification, index) => (
                        <li key={index} className="notification-item">
                            <div className="notification-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </div>
                            <div className="notification-content">
                                <p className="notification-text">{notification.testo || notification}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotificationList;