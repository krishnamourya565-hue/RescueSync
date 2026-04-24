import React, { useContext, useState } from 'react';
import { SocketContext } from '../context/SocketContext';
import './Navbar.css';

const Navbar = () => {
  const { notifications, clearNotifications } = useContext(SocketContext);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>Dashboard</h2>
      </div>
      <div className="navbar-right">
        <div className="notification-bell" onClick={() => setShowDropdown(!showDropdown)}>
          <span className="bell-icon">🔔</span>
          {notifications.length > 0 && <span className="badge-count">{notifications.length}</span>}
          
          {showDropdown && (
            <div className="notification-dropdown glass-panel">
              <div className="dropdown-header">
                <h4>Notifications</h4>
                <button onClick={clearNotifications} className="btn-clear">Clear</button>
              </div>
              <ul className="notification-list">
                {notifications.length === 0 ? (
                  <li className="empty">No new notifications</li>
                ) : (
                  notifications.map(notif => (
                    <li key={notif.id}>{notif.message}</li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
