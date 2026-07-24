import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart2, Map as MapIcon, Share2, FileText } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/app/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/app/analytics', name: 'Analytics', icon: <BarChart2 size={20} /> },
    { path: '/app/map', name: 'Crime Map', icon: <MapIcon size={20} /> },
    { path: '/app/network', name: 'Network', icon: <Share2 size={20} /> },
    { path: '/app/reports', name: 'Reports', icon: <FileText size={20} /> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon">C</div>
        <h2 className="brand-title">CrimeLens AI</h2>
      </div>
      
      <nav className="nav-list">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || (currentPath === '/app' && item.path === '/app/');
          return (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <div className="nav-icon">{item.icon}</div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}