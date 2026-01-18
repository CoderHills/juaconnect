// src/components/dashboards/ArtisanDashboard.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ArtisanDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/signin');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Artisan Dashboard</h1>
      <p><strong>Welcome, {user.name}!</strong></p>
      <p><strong>Business:</strong> {user.business_name || 'Not set'}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Hourly Rate:</strong> ${user.hourly_rate || 'Not set'}</p>
      <p><strong>Experience:</strong> {user.experience_years ? `${user.experience_years} years` : 'Not set'}</p>
      <p><strong>Skills:</strong> {user.skills || 'Not set'}</p>

      <h2>Services Offered</h2>
      <p>You haven't added any services yet.</p> {/* To be populated from API */}

      <h2>Recent Reviews</h2>
      <p>No reviews yet.</p>

      <div style={{ marginTop: '2rem' }}>
        <button style={{ marginRight: '1rem' }}>Add Service</button>
        <button>Edit Profile</button>
      </div>
    </div>
  );
};

export default ArtisanDashboard;   