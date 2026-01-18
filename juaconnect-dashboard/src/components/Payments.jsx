import React from 'react';
import PaymentCard from './PaymentCard';
import { MOCK_BOOKINGS } from '../data/mockData';

const Payments = () => {
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

  return (
    <section style={sectionStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Payments</h2>
        <button style={buttonStyle}>View All →</button>
      </div>

      <div style={containerStyle}>
        {MOCK_BOOKINGS.slice(0, 2).map((booking) => (
          <PaymentCard key={booking.id} booking={booking} />
        ))}
      </div>
    </section>
  );
};

export default Payments;

