import React, { useEffect, useState, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ tasks: 0, resources: 0, volunteers: 0, completedTasks: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: tasksCount } = await supabase.from('tasks').select('*', { count: 'exact', head: true });
        const { count: resCount } = await supabase.from('resources').select('*', { count: 'exact', head: true });
        const { count: volCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'Volunteer');
        const { count: compCount } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'Completed');
        
        setStats({
          tasks: tasksCount || 0,
          resources: resCount || 0,
          volunteers: volCount || 0,
          completedTasks: compCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error.message);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <h2 className="page-title">Welcome back, {user?.name}</h2>
      
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>Total Tasks</h3>
            <p className="stat-number">{stats.tasks}</p>
          </div>
        </div>
        
        <div className="stat-card glass-panel">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Completed Tasks</h3>
            <p className="stat-number">{stats.completedTasks}</p>
          </div>
        </div>
        
        <div className="stat-card glass-panel">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Resources Logged</h3>
            <p className="stat-number">{stats.resources}</p>
          </div>
        </div>
        
        <div className="stat-card glass-panel">
          <div className="stat-icon">🤝</div>
          <div className="stat-info">
            <h3>Active Volunteers</h3>
            <p className="stat-number">{stats.volunteers}</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="recent-activity glass-panel">
          <h3>Recent Activity</h3>
          <p className="text-muted">Activity feed is managed by Supabase Realtime.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
