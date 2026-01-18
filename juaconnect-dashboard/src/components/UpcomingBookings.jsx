import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingCard from './BookingCard';
import api from '../services/api';

const UpcomingBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.getMyBookings();
      if (response.success) {
        // Filter for upcoming bookings only
        const upcoming = response.data.filter(b => b.status === 'pending' || b.status === 'accepted');
        setBookings(upcoming);
      } else {
        setError(response.message || 'Failed to load bookings');
      }
    } catch (err) {
      setError(err.message || 'Error loading bookings');
    } finally {
      setLoading(false);
    }
  };

  const sectionStyle = {
    marginBottom: '32px',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2c3e50',
  };

  const buttonStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#3498db',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
  };

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  };

  const emptyStyle = {
    padding: '40px 20px',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: '8px',
    color: '#7f8c8d',
  };

  if (loading) {
    return <div style={{ ...sectionStyle, ...emptyStyle }}>Loading bookings...</div>;
  }

  if (error) {
    return <div style={{ ...sectionStyle, ...emptyStyle, color: '#e74c3c' }}>Error: {error}</div>;
  }

  return (
    <section style={sectionStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Upcoming Bookings ({bookings.length})</h2>
        <button style={buttonStyle} onClick={fetchBookings}>Refresh ↻</button>
      </div>

      <div style={containerStyle}>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        ) : (
          <div style={emptyStyle}>
            No upcoming bookings. <button 
              onClick={() => navigate('/client-dashboard-alt')}
              style={{ color: '#3498db', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}
            >
              Browse Artisans
            </button> to get started!
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingBookings;

