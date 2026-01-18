// src/artisan/ArtisanLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import "./artisan.css";

const ArtisanLayout = () => {
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisanData = async () => {
      try {
        const artisanId = 1; // In real app, get from auth
        const response = await fetch(
          `http://localhost:5000/api/users/${artisanId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setArtisan(data);
      } catch (error) {
        console.error("Error fetching artisan data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisanData();
  }, []);

  if (loading) {
    return (
      <div className="artisan-dashboard">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="artisan-dashboard">
      <Sidebar artisan={artisan} />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default ArtisanLayout;
