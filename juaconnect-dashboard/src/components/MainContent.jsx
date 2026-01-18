import React from 'react';
import UpcomingBookings from './UpcomingBookings';
import Payments from './Payments';

const MainContent = ({ searchQuery, setSearchQuery, activeNav }) => {
  const mainStyle = {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: '#f5f5f5',
  };

  const contentStyle = {
    padding: '24px',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    backgroundColor: '#fff',
    padding: '16px 24px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2c3e50',
  };

  const searchStyle = {
    padding: '8px 12px',
    border: '1px solid #bdc3c7',
    borderRadius: '6px',
    minWidth: '200px',
    fontSize: '14px',
  };

  return (
    <main style={mainStyle}>
      <div style={contentStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            {activeNav === 'dashboard' && 'Dashboard'}
            {activeNav === 'bookings' && 'Bookings'}
            {activeNav === 'payments' && 'Payments'}
            {activeNav === 'notifications' && 'Notifications'}
            {activeNav === 'profile' && 'Profile'}
          </h1>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchStyle}
          />
        </div>

        {(activeNav === 'dashboard' || activeNav === '') && (
          <>
            <UpcomingBookings />
            <Payments />
          </>
        )}
        {activeNav === 'bookings' && <UpcomingBookings />}
        {activeNav === 'payments' && <Payments />}
      </div>
    </main>
  );
};

export default MainContent;

