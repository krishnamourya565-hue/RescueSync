import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { supabase } from '../supabaseClient';
import './MapPage.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPage = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .not('lat', 'is', null)
          .not('lng', 'is', null);
          
        if (error) throw error;
        setTasks(data || []);
      } catch (error) {
        console.error('Failed to fetch tasks', error.message);
      }
    };
    fetchTasks();
  }, []);

  const defaultCenter = [40.7128, -74.0060];

  return (
    <div className="map-page">
      <h2 className="page-title">Live Response Map</h2>
      <div className="map-container glass-panel">
        <MapContainer center={defaultCenter} zoom={11} scrollWheelZoom={true} style={{ height: '100%', width: '100%', borderRadius: '12px' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {tasks.map(task => (
            <Marker key={task.id} position={[task.lat, task.lng]}>
              <Popup>
                <strong>{task.title}</strong><br />
                Status: {task.status}<br />
                {task.address}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
