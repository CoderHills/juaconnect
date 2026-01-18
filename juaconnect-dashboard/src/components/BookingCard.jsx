import React, { useState } from 'react';
import { Check, X, Clock } from 'lucide-react';
import api from '../services/api';

const BookingCard = ({ booking, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#27ae60';
      case 'accepted': return '#3498db';
      case 'pending': return '#f39c12';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleCancelRequest = async () => {
    if (!window.confirm('Cancel this booking request?')) return;
    
    setLoading(true);
    try {
      const response = await api.cancelRequest(booking.id);
      if (response.success && onUpdate) {
        onUpdate();
      }
    } catch (err) {
      alert('Error cancelling request');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const contentStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  };

  const infoStyle = {
    display: 'flex',
    flexDirection: 'column',
  };

  const titleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2c3e50',
    margin: 0,
  };

  const descStyle = {
    fontSize: '13px',
    color: '#7f8c8d',
    margin: '4px 0 0 0',
  };

  const detailsStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
  };

  const priceStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2c3e50',
    margin: 0,
  };

  const dateStyle = {
    fontSize: '12px',
    color: '#7f8c8d',
    margin: 0,
  };

  const statusStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '6px',
    backgroundColor: getStatusColor(booking.status),
    color: '#fff',
    fontSize: '12px',
    fontWeight: '500',
  };

  const actionsStyle = {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  };

  const buttonStyle = {
    flex: 1,
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    transition: 'all 0.3s',
  };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: getStatusColor(booking.status), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          {booking.service_category && booking.service_category[0].toUpperCase()}
        </div>
        <div style={infoStyle}>
          <p style={titleStyle}>{booking.service_category || 'Service Request'}</p>
          <p style={descStyle}>{booking.description}</p>
          <p style={descStyle}>📍 {booking.location || 'Location TBD'}</p>
        </div>
      </div>

      <div style={contentStyle}>
        <div style={detailsStyle}>
          {booking.budget && <p style={priceStyle}>Ksh {booking.budget}</p>}
          <p style={dateStyle}>{new Date(booking.created_at).toLocaleDateString()}</p>
        </div>
        <div style={statusStyle}>
          {booking.status === 'completed' && <Check size={14} />}
          {booking.status === 'pending' && <Clock size={14} />}
          {getStatusText(booking.status)}
        </div>
      </div>

      {booking.status === 'pending' && (
        <div style={actionsStyle}>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: '#e74c3c',
              color: '#fff'
            }}
            onClick={handleCancelRequest}
            disabled={loading}
          >
            {loading ? 'Cancelling...' : 'Cancel'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingCard;

