import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Analytics({ crimes, loading }) {
  if (loading) return <p>Loading analytics...</p>;

  const districtCounts = crimes.reduce((acc, curr) => {
    const dist = curr.Locations?.district || 'Unknown';
    acc[dist] = (acc[dist] || 0) + 1;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(districtCounts),
    datasets: [{
      label: 'Recorded Incidents',
      data: Object.values(districtCounts),
      backgroundColor: '#3b82f6',
      borderRadius: 4,
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Incident Distribution by District', font: { size: 16 } }
    }
  };

  const typeCounts = crimes.reduce((acc, curr) => {
    const type = curr.Crimes?.crime_type || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const crimeTypes = Object.keys(typeCounts);
  
  const dynamicColors = crimeTypes.map((_, index) => {
    const hue = (index * (360 / crimeTypes.length)) % 360;
    return `hsl(${hue}, 70%, 55%)`; 
  });

  const doughnutData = {
    labels: crimeTypes,
    datasets: [{
      data: Object.values(typeCounts),
      backgroundColor: dynamicColors,
      borderWidth: 0,
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Breakdown by Crime Category', font: { size: 16 } }
    }
  };

  return (
    <div>
      <h2 className="page-title">Crime Analytics</h2>
      <div className="analytics-grid">
        <div className="chart-card">
          <Bar data={barData} options={barOptions} />
        </div>
        <div className="chart-card">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>
    </div>
  );
}