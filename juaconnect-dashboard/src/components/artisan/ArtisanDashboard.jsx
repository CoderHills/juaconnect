import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ArtisanDashboard = () => {
  const [user, setUser] = useState(null);
  const [availableRequests, setAvailableRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/signin");
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchRequests();
    }
  }, [navigate]);

  // Poll for new requests every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRequests();
    }, 3000);
    
    // Listen for broadcasts from other tabs
    const channel = new BroadcastChannel('juaconnect_channel');
    channel.onmessage = (event) => {
      if (event.data.type === 'data_update') {
        console.log('Received data update from another tab');
        fetchRequests();
      }
    };
    
    return () => {
      clearInterval(interval);
      channel.close();
    };
  }, []);

  const fetchRequests = async () => {
    try {
      const availableResponse = await api.getAvailableRequests();
      const acceptedResponse = await api.getAcceptedRequests();
      
      if (availableResponse.success) {
        setAvailableRequests(availableResponse.data || []);
      }
      if (acceptedResponse.success) {
        setMyRequests(acceptedResponse.data || []);
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const response = await api.acceptRequest(requestId);
      if (response.success) {
        alert('Request accepted! The client will be notified.');
        fetchRequests();
      } else {
        alert(response.message || 'Failed to accept request');
      }
    } catch (error) {
      alert('Error accepting request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await api.rejectRequest(requestId);
      if (response.success) {
        alert('Request rejected.');
        fetchRequests();
      } else {
        alert(response.message || 'Failed to reject request');
      }
    } catch (error) {
      alert('Error rejecting request');
    }
  };

  const handleStartWork = async (requestId) => {
    try {
      const response = await api.startWork(requestId);
      if (response.success) {
        alert('Work started!');
        fetchRequests();
      }
    } catch (error) {
      alert('Error starting work');
    }
  };

  const handleComplete = async (requestId) => {
    try {
      const response = await api.completeWork(requestId);
      if (response.success) {
        alert('Job completed! The client will be notified to pay.');
        fetchRequests();
      }
    } catch (error) {
      alert('Error completing job');
    }
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
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
            Artisan Dashboard
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#64748b' }}>{user.name}</span>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user_type');
                localStorage.removeItem('user');
                navigate('/');
              }}
              style={{
                padding: '8px 16px',
                background: '#fee2e2',
                color: '#dc2626',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Welcome Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
          borderRadius: '16px', 
          padding: '24px', 
          marginBottom: '24px',
          color: '#fff'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}>
            Welcome, {user.name}! 👨‍🔧
          </h2>
          <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>
            Accept service requests and grow your business
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px' }}>Available Requests</p>
            <p style={{ fontSize: '28px', fontWeight: '700', color: '#6366f1', margin: 0 }}>{availableRequests.length}</p>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px' }}>My Active Jobs</p>
            <p style={{ fontSize: '28px', fontWeight: '700', color: '#10b981', margin: 0 }}>{myRequests.filter(r => r.status === 'accepted' || r.status === 'in_progress').length}</p>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px' }}>Completed Jobs</p>
            <p style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{myRequests.filter(r => r.status === 'completed').length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('available')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'available' ? '#6366f1' : '#fff',
              color: activeTab === 'available' ? '#fff' : '#64748b',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: activeTab === 'available' ? '0 4px 12px rgba(99, 102, 241, 0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            📋 Available Requests ({availableRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('myjobs')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'myjobs' ? '#6366f1' : '#fff',
              color: activeTab === 'myjobs' ? '#fff' : '#64748b',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: activeTab === 'myjobs' ? '0 4px 12px rgba(99, 102, 241, 0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            🔧 My Jobs ({myRequests.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
            Loading requests...
          </div>
        ) : activeTab === 'available' ? (
          availableRequests.length === 0 ? (
            <div style={{ 
              background: '#fff', 
              borderRadius: '16px', 
              padding: '60px', 
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <p style={{ fontSize: '48px', marginBottom: '12px' }}>📭</p>
              <p style={{ fontSize: '18px', color: '#1e293b', marginBottom: '8px' }}>No available requests</p>
              <p style={{ fontSize: '14px', color: '#64748b' }}>Check back later for new service requests</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {availableRequests.map((request) => (
                <div
                  key={request.id}
                  style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0 0 4px' }}>
                        {request.service_category}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                        📍 {request.location || 'Location not specified'}
                      </p>
                    </div>
                    <span style={{
                      padding: '6px 14px',
                      background: '#fef3c7',
                      color: '#d97706',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}>
                      ⏳ Pending
                    </span>
                  </div>

                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: '0 0 16px' }}>
                    {request.description}
                  </p>

                  <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#64748b', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {request.budget && <span>💰 Budget: Ksh {request.budget}</span>}
                    <span>📅 {new Date(request.created_at).toLocaleDateString()}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => handleAccept(request.id)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      ✓ Accept Request
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      style={{
                        padding: '12px 24px',
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : myRequests.length === 0 ? (
          <div style={{ 
            background: '#fff', 
            borderRadius: '16px', 
            padding: '60px', 
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <p style={{ fontSize: '48px', marginBottom: '12px' }}>🔧</p>
            <p style={{ fontSize: '18px', color: '#1e293b', marginBottom: '8px' }}>No active jobs yet</p>
            <p style={{ fontSize: '14px', color: '#64748b' }}>Accept requests from the available tab to get started</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {myRequests.map((request) => (
              <div
                key={request.id}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0 0 4px' }}>
                      {request.service_category}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                      📍 {request.location || 'Location not specified'}
                    </p>
                    {request.client && (
                      <p style={{ fontSize: '13px', color: '#6366f1', margin: '8px 0 0' }}>
                        👤 Client: {request.client.username}
                      </p>
                    )}
                  </div>
                  <span style={{
                    padding: '6px 14px',
                    background: request.status === 'in_progress' ? '#dbeafe' : request.status === 'completed' ? '#d1fae5' : '#fef3c7',
                    color: request.status === 'in_progress' ? '#2563eb' : request.status === 'completed' ? '#059669' : '#d97706',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                  }}>
                    {request.status === 'in_progress' ? '🔧 In Progress' : request.status}
                  </span>
                </div>

                <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: '0 0 16px' }}>
                  {request.description}
                </p>

                <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#64748b', marginBottom: '20px', flexWrap: 'wrap' }}>
                  {request.budget && <span>💰 Budget: Ksh {request.budget}</span>}
                  <span>📅 {new Date(request.created_at).toLocaleDateString()}</span>
                </div>

                {request.status === 'accepted' && (
                  <button
                    onClick={() => handleStartWork(request.id)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    🔧 Start Work
                  </button>
                )}

                {request.status === 'in_progress' && (
                  <button
                    onClick={() => handleComplete(request.id)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    ✓ Mark as Completed (Awaiting Payment)
                  </button>
                )}

                {request.status === 'completed' && (
                  <div style={{
                    padding: '16px',
                    background: '#d1fae5',
                    borderRadius: '10px',
                    textAlign: 'center',
                    color: '#065f46',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}>
                    ✅ Job completed! Waiting for client payment.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisanDashboard;

