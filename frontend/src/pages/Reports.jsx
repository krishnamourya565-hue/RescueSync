import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { AuthContext } from '../context/AuthContext';
import './Reports.css';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newReport, setNewReport] = useState({ content: '', imageUrl: '' });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`*, ngo_profile:profiles!reports_ngo_id_fkey(name)`)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Failed to fetch reports', error.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('reports').insert([{
        content: newReport.content,
        image_url: newReport.imageUrl,
        ngo_id: user.id
      }]);
      
      if (error) throw error;
      setShowModal(false);
      setNewReport({ content: '', imageUrl: '' });
      fetchReports();
    } catch (error) {
      console.error('Failed to create report', error.message);
    }
  };

  return (
    <div className="reports-page">
      <div className="page-header">
        <h2 className="page-title">Field Reports</h2>
        {user?.role !== 'Volunteer' && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ Submit Report</button>
        )}
      </div>

      <div className="reports-grid">
        {reports.map(report => (
          <div key={report.id} className="report-card glass-panel">
            <div className="report-header">
              <h4>{report.ngo_profile?.name}</h4>
              <small>{new Date(report.created_at).toLocaleString()}</small>
            </div>
            <p className="report-content">{report.content}</p>
            {report.image_url && (
              <div className="report-image">
                <img src={report.image_url} alt="Field report" />
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h3>Submit Field Report</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Report Content</label>
                <textarea className="form-control" rows="5" value={newReport.content} onChange={e => setNewReport({...newReport, content: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Image URL (Optional)</label>
                <input type="text" className="form-control" value={newReport.imageUrl} onChange={e => setNewReport({...newReport, imageUrl: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
