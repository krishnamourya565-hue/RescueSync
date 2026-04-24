import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <h2>RescueSync</h2>
      </div>
      <ul className="sidebar-nav">
        <li><Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link></li>
        <li><Link to="/tasks" className={isActive('/tasks')}>Tasks</Link></li>
        <li><Link to="/map" className={isActive('/map')}>Live Map</Link></li>
        <li><Link to="/resources" className={isActive('/resources')}>Resources</Link></li>
        <li><Link to="/reports" className={isActive('/reports')}>Reports</Link></li>
        {user?.role !== 'Volunteer' && (
          <li><Link to="/volunteers" className={isActive('/volunteers')}>Volunteers</Link></li>
        )}
      </ul>
      <div className="sidebar-footer">
        <div className="user-info">
          <p>{user?.name}</p>
          <small>{user?.role}</small>
        </div>
        <button className="btn-logout" onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
