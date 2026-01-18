import React from 'react';
import { getStatusColor, getStatusText } from '../utils/statusHelpers';

const PaymentCard = ({ booking }) => {
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
    alignItems: 'center',
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

  const priceStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2c3e50',
  };

  const statusStyle = {
    padding: '6px 12px',
    borderRadius: '6px',
    backgroundColor: booking.status === 'active' ? '#27ae60' : booking.status === 'paid' ? '#3498db' : '#e67e22',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '500',
  };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.artisan}`}
          alt={booking.artisan}
          style={{ width: '48px', height: '48px', borderRadius: '50%' }}
        />
        <div style={infoStyle}>
          <p style={titleStyle}>{booking.service}</p>
          <p style={descStyle}>{booking.artisan} · {booking.description}</p>
        </div>
      </div>

      <div style={contentStyle}>
        <p style={priceStyle}>${booking.price}</p>
        <div style={statusStyle}>
          {getStatusText(booking.status)}
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;

