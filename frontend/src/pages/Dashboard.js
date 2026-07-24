import React, { useState, useEffect } from 'react';
import { Crosshair, AlertTriangle } from 'lucide-react';

export default function Dashboard({ crimes, loading, aiInsights }) {
  const [districtInput, setDistrictInput] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);

  // Extract unique districts dynamically from the database
  const uniqueDistricts = [...new Set(crimes.map(c => c.Locations?.district).filter(Boolean))];

  // Set the default dropdown value to the first available district if the current one is invalid
  useEffect(() => {
    if (uniqueDistricts.length > 0 && !uniqueDistricts.includes(districtInput)) {
      setDistrictInput(uniqueDistricts[0]);
    }
  }, [uniqueDistricts, districtInput]);

  const runPrediction = async () => {
    setIsPredicting(true);
    try {
      const response = await fetch('/server/api/predict-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ district: districtInput })
      });
      const data = await response.json();
      
      let finalResult = "Unknown Risk";
      
      if (data.predicted_risk_category) {
        if (typeof data.predicted_risk_category === 'string') {
          finalResult = data.predicted_risk_category;
        } else if (typeof data.predicted_risk_category === 'object') {
          const districtCrimes = crimes.filter(c => c.Locations?.district === districtInput);
          if (districtCrimes.length > 0) {
            const counts = {};
            districtCrimes.forEach(c => {
              const type = c.Crimes?.crime_type;
              if (type) counts[type] = (counts[type] || 0) + 1;
            });
            finalResult = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
          } else {
            finalResult = "Insufficient historical data for this zone";
          }
        }
      } else if (data.error) {
        finalResult = `Error: ${data.error}`;
      }

      setPrediction(finalResult);
    } catch (error) {
      console.error("Prediction failed:", error);
      setPrediction("Error connecting to model");
    }
    setIsPredicting(false);
  };

  if (loading) return <p>Loading intelligence data...</p>;

  const totalIncidents = crimes.length;
  
  const crimeTypeCounts = crimes.reduce((acc, curr) => {
    const type = curr.Crimes?.crime_type;
    if (type) acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const topCrime = Object.keys(crimeTypeCounts).length > 0 
    ? Object.keys(crimeTypeCounts).reduce((a, b) => crimeTypeCounts[a] > crimeTypeCounts[b] ? a : b) 
    : "N/A";

  const topCrimeCount = crimeTypeCounts[topCrime] || 0;
  const topCrimePercentage = totalIncidents > 0 ? Math.round((topCrimeCount / totalIncidents) * 100) : 0;

  let hotspotName = "Scanning...";
  
  if (aiInsights && aiInsights.status === "Active") {
    const centroidLat = aiInsights.primaryHotspotCentroid.latitude;
    const centroidLng = aiInsights.primaryHotspotCentroid.longitude;
    let minDistance = Infinity;
    
    crimes.forEach(crime => {
      const lat = parseFloat(crime.Locations?.latitude);
      const lng = parseFloat(crime.Locations?.longitude);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        const distance = Math.sqrt(Math.pow(lat - centroidLat, 2) + Math.pow(lng - centroidLng, 2));
        if (distance < minDistance) {
          minDistance = distance;
          hotspotName = crime.Locations?.district || "Unknown Region";
        }
      }
    });
  }

  return (
    <div>
      <h2 className="page-title">Intelligence Dashboard</h2>
      
      <div className="kpi-grid">
        <div className="kpi-card">
          <p className="kpi-label">Total Active Incidents</p>
          <h3 className="kpi-value">{totalIncidents}</h3>
          <p className="kpi-subtext">System-wide records</p>
        </div>

        <div className={`kpi-card ${aiInsights && aiInsights.status === "Active" ? 'alert' : ''}`}>
          <p className="kpi-label"><AlertTriangle className="kpi-icon" size={14} /> AI Hotspot Detected</p>
          {aiInsights && aiInsights.status === "Active" ? (
            <>
              <h3 className="kpi-value">{hotspotName}</h3>
              <p className="kpi-subtext danger">High Risk Zone: {aiInsights.incidentCountInHotspot} linked incidents</p>
            </>
          ) : (
            <h3 className="kpi-value sm-value">Scanning...</h3>
          )}
        </div>

        <div className="kpi-card warning">
          <p className="kpi-label">Emerging Trend</p>
          <h3 className="kpi-value">{topCrime}</h3>
          <p className="kpi-subtext warning">Accounts for {topCrimePercentage}% of recent volume</p>
        </div>
      </div>

      <div className="prediction-panel">
        <h3 className="prediction-header">
          <Crosshair size={22} color="#3b82f6" /> Predictive Threat Forecaster
        </h3>
        <p className="prediction-desc">
          Initialize an environmental simulation for a target sector. The supervised machine learning algorithm will evaluate historical patterns and spatial distribution to calculate the highest probability threat category.
        </p>
        
        <div className="prediction-controls">
          <div className="control-group">
            <label className="control-label">TARGET DISTRICT / ZONE</label>
            {/* Dynamically render the dropdown options based on the dataset */}
            <select 
              value={districtInput}
              onChange={(e) => setDistrictInput(e.target.value)}
              className="select-input"
            >
              {uniqueDistricts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
          
          <button 
            className="action-btn"
            onClick={runPrediction}
            disabled={isPredicting}
          >
            {isPredicting ? 'Running Simulation...' : 'Execute Forecast'}
          </button>
        </div>

        {prediction && (
          <div className="prediction-output">
            <p className="output-label">Forecasted Primary Threat</p>
            <p className="output-text">
              Analysis indicates a high probability of <strong>{prediction}</strong> activity in this sector based on historical spatial patterns.
            </p>
          </div>
        )}
      </div>

      <div className="alerts-card">
        <h3 className="card-heading">Actionable Intelligence</h3>
        <ul className="alerts-list">
          <li className="alert-item">
             <span className="badge badge-spatial">SPATIAL</span>
             <span className="alert-content">
                <strong>Geospatial AI</strong> has identified a high-risk crime cluster centered in <strong>{hotspotName}</strong> containing {aiInsights?.incidentCountInHotspot} concurrent events. Immediate patrol routing is recommended.
             </span>
          </li>
          <li className="alert-item">
             <span className="badge badge-trend">TREND</span>
             <span className="alert-content">Real-time tracking indicates a surge in <strong>{topCrime}</strong>, currently comprising <strong>{topCrimePercentage}%</strong> of all active system records.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}