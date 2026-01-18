import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingForm from "../bookings/BookingForm";
import Notifications from "../notifications/Notifications";
import ArtisanDirectory from "./ArtisanDirectory";
import api from "../../services/api";

const ClientDashboard = () => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/signin");
    } else {
      setUser(JSON.parse(userData));
      fetchRequests();
    }
  }, [navigate]);

  const fetchRequests = async () => {
    try {
      const response = await api.getMyRequests();
      console.log('Client fetchRequests - API Response:', response);
      if (response.success) {
        setRequests(response.data || []);
        console.log('Client requests loaded:', response.data);
      }
      const notifResponse = await api.getUnreadNotificationCount();
      if (notifResponse.success) {
        setUnreadCount(notifResponse.data?.count || 0);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#27ae60';
      case 'accepted': return '#27ae60';
      case 'confirmed': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'in_progress': return '#9b59b6';
      case 'cancelled': return '#e74c3c';
      case 'rejected': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✓';
      case 'accepted': return '✓';
      case 'confirmed': return '✓';
      case 'pending': return '⏳';
      case 'in_progress': return '🔧';
      case 'cancelled': return '✕';
      case 'rejected': return '✕';
      default: return '•';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'accepted': return 'Accepted';
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'in_progress': return 'In Progress';
      case 'cancelled': return 'Cancelled';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const handlePay = (request) => {
    // For now, mark as completed when pay is clicked
    alert(`Payment processing for ${request.service_category} - Ksh ${request.budget || 'TBD'}`);
  };

  if (!user) {
    navigate("/signin", { replace: true });
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{ 
        background: '#fff', 
        padding: '16px 24px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {activeSection === 'browse' && (
            <button
              onClick={() => setActiveSection('dashboard')}
              style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '8px' }}
            >
              ←
            </button>
          )}
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
            {activeSection === 'browse' ? 'Browse Artisans' : 'My Dashboard'}
          </h1>
        </div>
        <button
          onClick={() => setShowNotifications(true)}
          style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
        >
          <span style={{ fontSize: '24px' }}>🔔</span>
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: 0,
              right: 0,
              backgroundColor: '#e74c3c',
              color: '#fff',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Artisan Directory */}
      {activeSection === 'browse' ? (
        <ArtisanDirectory
          onBookArtisan={() => {
            setActiveSection('dashboard');
            fetchRequests();
          }}
        />
      ) : (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
          {/* User Info Card */}
          <div style={{ 
            background: '#fff', 
            borderRadius: '16px', 
            padding: '24px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>
              Welcome back, {user.name}! 👋
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 4px' }}>Email</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', margin: 0 }}>{user.email}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 4px' }}>Phone</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', margin: 0 }}>{user.phone || 'Not set'}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 4px' }}>Location</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', margin: 0 }}>{user.location || 'Not set'}</p>
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 4px' }}>Active Requests</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#6366f1', margin: 0 }}>
                  {requests.filter(r => ['pending', 'accepted', 'confirmed', 'in_progress'].includes(r.status)).length}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ 
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
            borderRadius: '16px', 
            padding: '24px', 
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>Quick Actions</h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowBookingForm(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  background: '#fff',
                  color: '#6366f1',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                📋 Request Service
              </button>
              <button
                onClick={() => setActiveSection('browse')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  background: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                🔍 Browse Artisans
              </button>
            </div>
          </div>

          {/* My Service Requests */}
          <div style={{ 
            background: '#fff', 
            borderRadius: '16px', 
            padding: '24px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>My Service Requests</h2>
              <button
                onClick={fetchRequests}
                style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
              >
                Refresh ↻
              </button>
            </div>
            
            {loading ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>Loading requests...</p>
            ) : requests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <p style={{ fontSize: '48px', marginBottom: '12px' }}>📋</p>
                <p style={{ fontSize: '16px', marginBottom: '8px', color: '#1e293b' }}>No service requests yet</p>
                <p style={{ fontSize: '14px', marginBottom: '20px' }}>Request a service to get started!</p>
                <button
                  onClick={() => setActiveSection('browse')}
                  style={{
                    padding: '12px 24px',
                    background: '#6366f1',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Browse Artisans
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {requests.map((request) => (
                  <div
                    key={request.id}
                    style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      padding: '20px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '10px',
                      backgroundColor: getStatusColor(request.status),
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      flexShrink: 0,
                    }}>
                      {getStatusIcon(request.status)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 4px' }}>
                            {request.service_category}
                          </h3>
                          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                            {request.artisan ? `Artisan: ${request.artisan.username}` : 'Waiting for artisan response...'}
                          </p>
                        </div>
                        <span style={{
                          padding: '6px 14px',
                          borderRadius: '20px',
                          backgroundColor: getStatusColor(request.status),
                          color: '#fff',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'capitalize',
                        }}>
                          {getStatusLabel(request.status)}
                        </span>
                      </div>
                      <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 12px', lineHeight: '1.5' }}>
                        {request.description}
                      </p>
                      <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#64748b', flexWrap: 'wrap' }}>
                        <span>📍 {request.location || 'TBD'}</span>
                        {request.budget && <span>💰 Ksh {request.budget}</span>}
                        <span>📅 {new Date(request.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      {/* Action Buttons based on status */}
                      {(request.status === 'accepted' || request.status === 'confirmed') && (
                        <button
                          onClick={() => handlePay(request)}
                          style={{
                            marginTop: '16px',
                            padding: '10px 20px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          💳 Pay Now - Ksh {request.budget || '0'}
                        </button>
                      )}
                      
                      {request.status === 'pending' && (
                        <div style={{ marginTop: '12px', padding: '10px', background: '#fef3c7', borderRadius: '8px', fontSize: '13px', color: '#92400e' }}>
                          ⏳ Waiting for artisan to accept your request...
                        </div>
                      )}
                      
                      {request.status === 'rejected' && (
                        <div style={{ marginTop: '12px', padding: '10px', background: '#fee2e2', borderRadius: '8px', fontSize: '13px', color: '#991b1b' }}>
                          ❌ This request was rejected. You can try booking another artisan.
                        </div>
                      )}
                      
                      {request.status === 'completed' && (
                        <div style={{ marginTop: '12px', padding: '10px', background: '#d1fae5', borderRadius: '8px', fontSize: '13px', color: '#065f46' }}>
                          ✅ Job completed! Thank you for using JuaConnect.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{ position: 'relative', maxHeight: '90vh', overflowY: 'auto', maxWidth: '500px', width: '100%' }}>
            <button
              onClick={() => setShowBookingForm(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#64748b',
                zIndex: 1,
              }}
            >
              ×
            </button>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px' }}>
              <BookingForm
                onSuccess={() => {
                  setShowBookingForm(false);
                  fetchRequests();
                }}
                onCancel={() => setShowBookingForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <Notifications
          userType="client"
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};

export default ClientDashboard;

