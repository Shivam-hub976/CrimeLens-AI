import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import CrimeMap from './pages/CrimeMap';
import Network from './pages/Network';
import Reports from './pages/Reports';
import './App.css'; 

function App() {
  const [crimes, setCrimes] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/server/api/all-crimes')
      .then(response => response.json())
      .then(data => {
        setCrimes(data.data || []);
        setAiInsights(data.ai_insights || null);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/app/" element={<Dashboard crimes={crimes} aiInsights={aiInsights} loading={loading} />} />
            <Route path="/app/analytics" element={<Analytics crimes={crimes} loading={loading} />} />
            <Route path="/app/map" element={<CrimeMap crimes={crimes} loading={loading} />} />
            <Route path="/app/network" element={<Network crimes={crimes} loading={loading} />} />
            <Route path="/app/reports" element={<Reports crimes={crimes} aiInsights={aiInsights} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;