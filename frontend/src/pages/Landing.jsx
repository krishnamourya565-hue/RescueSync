import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="hero-section glass-panel">
        <h1>RescueSync</h1>
        <p className="subtitle">Smart Disaster Rehabilitation Platform</p>
        <p className="description">
          Coordinate efforts, track resources, and manage tasks efficiently during post-disaster rehabilitation. 
          Join the network of government agencies, NGOs, and dedicated volunteers.
        </p>
        <div className="hero-buttons">
          <Link to="/login" className="btn-primary">Login / Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
