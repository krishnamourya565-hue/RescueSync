import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { AuthContext } from '../context/AuthContext';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', lat: '', lng: '', address: '' });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assigned_to_profile:profiles!tasks_assigned_to_fkey(name),
          created_by_profile:profiles!tasks_created_by_fkey(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Failed to fetch tasks', error.message);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('tasks').insert([{
        title: newTask.title,
        description: newTask.description,
        lat: newTask.lat ? parseFloat(newTask.lat) : null,
        lng: newTask.lng ? parseFloat(newTask.lng) : null,
        address: newTask.address,
        created_by: user.id
      }]);
      
      if (error) throw error;
      setShowModal(false);
      setNewTask({ title: '', description: '', lat: '', lng: '', address: '' });
      fetchTasks();
    } catch (error) {
      console.error('Failed to create task', error.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { error } = await supabase.from('tasks').update({ status }).eq('id', id);
      if (error) throw error;
      fetchTasks();
    } catch (error) {
      console.error('Failed to update status', error.message);
    }
  };

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h2 className="page-title">Task Management</h2>
        {(user?.role === 'Admin' || user?.role === 'NGO') && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ Create Task</button>
        )}
      </div>

      <div className="tasks-grid">
        {tasks.map(task => (
          <div key={task.id} className="task-card glass-panel">
            <div className="task-header">
              <h3>{task.title}</h3>
              <span className={`badge ${task.status === 'Pending' ? 'pending' : task.status === 'In Progress' ? 'progress' : 'completed'}`}>
                {task.status}
              </span>
            </div>
            <p className="task-desc">{task.description}</p>
            <div className="task-meta">
              <small>📍 {task.address || 'No location specified'}</small>
              <br />
              <small>👤 Assigned to: {task.assigned_to_profile?.name || 'Unassigned'}</small>
            </div>
            <div className="task-actions">
              {task.status !== 'Completed' && (user?.role === 'Admin' || user?.role === 'NGO' || task.assigned_to === user.id) && (
                <button 
                  className="btn-secondary btn-sm"
                  onClick={() => updateStatus(task.id, task.status === 'Pending' ? 'In Progress' : 'Completed')}
                >
                  Mark {task.status === 'Pending' ? 'In Progress' : 'Completed'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h3>Create New Task</h3>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" className="form-control" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" className="form-control" value={newTask.address} onChange={e => setNewTask({...newTask, address: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
