import React, { createContext, useEffect, useState, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;

    // Supabase Realtime Subscription for Tasks
    const taskSub = supabase
      .channel('public:tasks')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tasks' }, payload => {
        const newTask = payload.new;
        setNotifications(prev => [{ id: Date.now(), message: `New task available: ${newTask.title}` }, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tasks' }, payload => {
        const updatedTask = payload.new;
        if (updatedTask.assigned_to === user.id) {
          setNotifications(prev => [{ id: Date.now(), message: `You have an updated task: ${updatedTask.title}` }, ...prev]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(taskSub);
    };
  }, [user]);

  const clearNotifications = () => setNotifications([]);

  return (
    <SocketContext.Provider value={{ notifications, clearNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};
