import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'Volunteer')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setVolunteers(data || []);
      } catch (error) {
        console.error('Failed to fetch volunteers', error.message);
      }
    };
    fetchVolunteers();
  }, []);

  return (
    <div className="volunteers-page">
      <div className="page-header">
        <h2 className="page-title">Volunteer Network</h2>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Skills</th>
              <th>Location</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map(vol => (
              <tr key={vol.id}>
                <td><strong>{vol.name}</strong></td>
                <td>{vol.email}</td>
                <td>{vol.skills && vol.skills.length > 0 ? vol.skills.join(', ') : 'General'}</td>
                <td>{vol.location || 'Not specified'}</td>
                <td>{new Date(vol.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {volunteers.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No volunteers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Volunteers;
