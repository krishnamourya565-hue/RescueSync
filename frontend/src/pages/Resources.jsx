import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { AuthContext } from '../context/AuthContext';
import './Resources.css';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newRes, setNewRes] = useState({ type: 'Food', quantity: '', unit: '', location: '' });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select(`*, added_by_profile:profiles!resources_added_by_fkey(name)`)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Failed to fetch resources', error.message);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('resources').insert([{
        ...newRes,
        added_by: user.id
      }]);
      
      if (error) throw error;
      setShowModal(false);
      setNewRes({ type: 'Food', quantity: '', unit: '', location: '' });
      fetchResources();
    } catch (error) {
      console.error('Failed to add resource', error.message);
    }
  };

  return (
    <div className="resources-page">
      <div className="page-header">
        <h2 className="page-title">Resource Inventory</h2>
        {(user?.role === 'Admin' || user?.role === 'NGO') && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Resource</button>
        )}
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Quantity</th>
              <th>Location</th>
              <th>Added By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {resources.map(res => (
              <tr key={res.id}>
                <td><strong>{res.type}</strong></td>
                <td>{res.quantity} {res.unit}</td>
                <td>{res.location}</td>
                <td>{res.added_by_profile?.name}</td>
                <td>{new Date(res.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {resources.length === 0 && (
              <tr><td colSpan="5" style={{textAlign: 'center'}}>No resources found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h3>Add New Resource</h3>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label>Resource Type</label>
                <select className="form-control" value={newRes.type} onChange={e => setNewRes({...newRes, type: e.target.value})}>
                  <option value="Food">Food</option>
                  <option value="Water">Water</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Funds">Funds</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input type="number" className="form-control" value={newRes.quantity} onChange={e => setNewRes({...newRes, quantity: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Unit (e.g., boxes, liters)</label>
                <input type="text" className="form-control" value={newRes.unit} onChange={e => setNewRes({...newRes, unit: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Location / Hub</label>
                <input type="text" className="form-control" value={newRes.location} onChange={e => setNewRes({...newRes, location: e.target.value})} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Resource</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
