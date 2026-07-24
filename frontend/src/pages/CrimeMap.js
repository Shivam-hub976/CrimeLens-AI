import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default Leaflet marker icons not showing in React
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function CrimeMap({ crimes, loading }) {
  if (loading) return <p>Loading geospatial data...</p>;

  // Calculate dynamic center coordinates based on incoming data
  let mapCenter = [12.9716, 77.5946]; // Default fallback (Bangalore)
  const validCoords = crimes.filter(c => c.Locations?.latitude && c.Locations?.longitude);

  if (validCoords.length > 0) {
    const avgLat = validCoords.reduce((sum, c) => sum + parseFloat(c.Locations.latitude), 0) / validCoords.length;
    const avgLng = validCoords.reduce((sum, c) => sum + parseFloat(c.Locations.longitude), 0) / validCoords.length;
    mapCenter = [avgLat, avgLng];
  }

  return (
    <div>
      <h2 className="page-title">Geospatial Intelligence Map</h2>
      
      <div className="map-wrapper">
        <MapContainer center={mapCenter} zoom={11} className="map-inner">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {crimes.map((record, index) => {
            const lat = record.Locations?.latitude;
            const lng = record.Locations?.longitude;
            if (lat && lng) {
              return (
                <Marker key={index} position={[lat, lng]}>
                  <Popup>
                    <strong>{record.Crimes?.crime_type}</strong><br/>
                    {record.Locations?.district}<br/>
                    <em>{record.Crimes?.date_reported}</em>
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
        </MapContainer>
      </div>
      
      <div className="table-container">
        <h3 className="card-heading">Recent Incident Logs</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Crime Type</th>
              <th>Suspect Alias</th>
              <th>District</th>
              <th>Date Reported</th>
            </tr>
          </thead>
          <tbody>
            {crimes.map((record, index) => (
              <tr key={index}>
                <td><strong>{record.Crimes?.crime_type || 'N/A'}</strong></td>
                <td>{record.Suspects?.alias || 'Unknown'}</td>
                <td>{record.Locations?.district || 'N/A'}</td>
                <td>{record.Crimes?.date_reported || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}