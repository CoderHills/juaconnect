// src/artisan/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import '../artisan.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const artisanId = 1;
        const response = await fetch(`http://localhost:5000/api/artisan/${artisanId}/dashboard`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard data`);
        }
        
        const data = await response.json();
        setStats(data.stats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <header className="page-header">
          <h1 className="page-title">Dashboard</h1>
        </header>
        <div className="page-content">
          <div className="loading">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </header>
      <div className="page-content">
        <div className="welcome-card">
          <h2>Welcome Back!</h2>
          <p>Here's an overview of your artisan activities</p>
        </div>
        
        {stats ? (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Bookings</h3>
              <p className="stat-number">{stats.total_bookings || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Pending</h3>
              <p className="stat-number">{stats.pending || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Earnings</h3>
              <p className="stat-number">${stats.earnings ? stats.earnings.toFixed(2) : '0.00'}</p>
            </div>
            <div className="stat-card">
              <h3>Rating</h3>
              <p className="stat-number">{stats.rating ? `${stats.rating} ★` : 'N/A'}</p>
            </div>
          </div>
        ) : (
          <div className="no-data">
            <p>No statistics available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;