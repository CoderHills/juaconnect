import React from 'react';
import { Home, Calendar, CreditCard, Bell, User, LogOut } from 'lucide-react';
import { MOCK_USER } from '../data/mockData';

const Sidebar = ({ activeNav, setActiveNav, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const sidebarStyle = {
    width: '250px',
    backgroundColor: '#2c3e50',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  };

  const headerStyle = {
    padding: '24px',
    borderBottom: '1px solid #34495e',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const navStyle = {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const navButtonStyle = (isActive) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: isActive ? '#3498db' : 'transparent',
    color: isActive ? '#fff' : '#bdc3c7',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  });

  const footerStyle = {
    padding: '16px',
    borderTop: '1px solid #34495e',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const userStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  return (
    <aside style={sidebarStyle}>
      <div style={headerStyle}>
        <Home size={28} color="#3498db" />
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>JuaConnect</span>
      </div>

      <nav style={navStyle}>
        {navItems.map(item => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              style={navButtonStyle(activeNav === item.id)}
              onMouseEnter={(e) => {
                if (activeNav !== item.id) {
                  e.target.style.backgroundColor = '#34495e';
                }
              }}
              onMouseLeave={(e) => {
                if (activeNav !== item.id) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <IconComponent size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={footerStyle}>
        <div style={userStyle}>
          <img src={MOCK_USER.avatar} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>{MOCK_USER.name}</span>
        </div>
        <button
          onClick={onLogout}
          style={{...navButtonStyle(false), color: '#e74c3c'}}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

