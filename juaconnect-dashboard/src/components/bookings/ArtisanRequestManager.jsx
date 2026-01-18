import React, { useState, useEffect } from 'react';
import { Check, X, Clock, MapPin, DollarSign, Calendar } from 'lucide-react';
import api from '../../services/api';

const ArtisanRequestManager = () => {
  const [availableRequests, setAvailableRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('available');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [availableRes, acceptedRes] = await Promise.all([
        api.getAvailableRequests(),
        api.getAcceptedRequests()
      ]);

      if (availableRes.success) {
        setAvailableRequests(availableRes.data || []);
      }
      if (acceptedRes.success) {
        setAcceptedRequests(acceptedRes.data || []);
      }
    } catch (err) {
      setError(err.message || 'Error loading requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    if (!window.confirm('Accept this service request?')) return;
    
    setActionLoading(requestId);
    try {
      const response = await api.acceptRequest(requestId);
      if (response.success) {
        // Move from available to accepted
        const request = availableRequests.find(r => r.id === requestId);
        setAvailableRequests(availableRequests.filter(r => r.id !== requestId));
        if (request) {
          setAcceptedRequests([...acceptedRequests, { ...request, status: 'accepted' }]);
        }
        setActiveTab('accepted');
        alert('Request accepted! The client has been notified.');
      } else {
        alert(response.message || 'Failed to accept request');
      }
    } catch (err) {
      alert('Error accepting request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId) => {
    if (!window.confirm('Reject this service request? This will notify the client.')) return;
    
    setActionLoading(requestId);
    try {
      const response = await api.rejectRequest(requestId);
      if (response.success) {
        setAvailableRequests(availableRequests.filter(r => r.id !== requestId));
        alert('Request rejected. The client has been notified.');
      } else {
        alert(response.message || 'Failed to reject request');
      }
    } catch (err) {
      alert('Error rejecting request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleStartWork = async (requestId) => {
    const amount = prompt('Enter total amount for this job (Ksh):');
    if (!amount || isNaN(amount)) return;
    
    setActionLoading(requestId);
    try {
      const response = await api.startWork(requestId, parseFloat(amount));
      if (response.success) {
        alert('Work started! A booking has been created.');
        fetchRequests();
      } else {
        alert(response.message || 'Failed to start work');
      }
    } catch (err) {
      alert('Error starting work');
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (requestId) => {
    if (!window.confirm('Mark this job as completed?')) return;
    
    setActionLoading(requestId);
    try {
      const response = await api.completeWork(requestId);
      if (response.success) {
        setAcceptedRequests(acceptedRequests.filter(r => r.id !== requestId));
        alert('Job completed! The client has been notified.');
      } else {
        alert(response.message || 'Failed to complete job');
      }
    } catch (err) {
      alert('Error completing job');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#27ae60';
      case 'accepted': return '#3498db';
      case 'pending': return '#f39c12';
      case 'in_progress': return '#9b59b6';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const containerStyle = {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const tabsStyle = {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    borderBottom: '2px solid #ecf0f1',
    paddingBottom: '12px',
  };

  const tabStyle = (isActive) => ({
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px 6px 0 0',
    backgroundColor: isActive ? '#3498db' : 'transparent',
    color: isActive ? '#fff' : '#7f8c8d',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  });

  const countBadgeStyle = (count) => ({
    backgroundColor: count > 0 ? '#e74c3c' : '#95a5a6',
    color: '#fff',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    marginLeft: '8px',
  });

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #ecf0f1',
  };

  const cardHeaderStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    marginBottom: '16px',
  };

  const avatarStyle = (status) => ({
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    backgroundColor: getStatusColor(status),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '20px',
    fontWeight: 'bold',
    flexShrink: 0,
  });

  const serviceTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '4px',
  };

  const clientInfoStyle = {
    fontSize: '13px',
    color: '#7f8c8d',
  };

  const statusBadgeStyle = (status) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    backgroundColor: getStatusColor(status),
    color: '#fff',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'capitalize',
  });

  const detailsStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '16px',
  };

  const detailItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#7f8c8d',
  };

  const descriptionStyle = {
    fontSize: '14px',
    color: '#2c3e50',
    lineHeight: '1.6',
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  };

  const actionsStyle = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  };

  const buttonStyle = (variant, disabled) => ({
    flex: 1,
    minWidth: '100px',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    opacity: disabled ? 0.6 : 1,
    backgroundColor: variant === 'accept' ? '#27ae60' : 
                     variant === 'reject' ? '#e74c3c' : 
                     variant === 'start' ? '#9b59b6' : 
                     variant === 'complete' ? '#3498db' : '#95a5a6',
    color: '#fff',
  });

  const emptyStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#7f8c8d',
  };

  const renderRequestCard = (request, showActions = false) => (
    <div key={request.id} style={cardStyle}>
      <div style={cardHeaderStyle}>
        <div style={avatarStyle(request.status)}>
          {request.service_category ? request.service_category[0].toUpperCase() : '?'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={serviceTitleStyle}>{request.service_category || 'Service Request'}</div>
          <div style={clientInfoStyle}>
            {request.client ? `Client: ${request.client.username}` : 'Client: Unknown'}
          </div>
        </div>
        <span style={statusBadgeStyle(request.status)}>
          {request.status === 'in_progress' ? 'In Progress' : request.status}
        </span>
      </div>

      <div style={detailsStyle}>
        <div style={detailItemStyle}>
          <MapPin size={16} />
          <span>{request.location || 'Location TBD'}</span>
        </div>
        {request.budget && (
          <div style={detailItemStyle}>
            <DollarSign size={16} />
            <span>Ksh {request.budget}</span>
          </div>
        )}
        <div style={detailItemStyle}>
          <Calendar size={16} />
          <span>{new Date(request.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {request.description && (
        <div style={descriptionStyle}>{request.description}</div>
      )}

      {showActions && (
        <div style={actionsStyle}>
          {request.status === 'pending' && (
            <>
              <button
                style={buttonStyle('accept', actionLoading === request.id)}
                onClick={() => handleAccept(request.id)}
                disabled={actionLoading === request.id}
              >
                <Check size={18} />
                {actionLoading === request.id ? 'Accepting...' : 'Accept'}
              </button>
              <button
                style={buttonStyle('reject', actionLoading === request.id)}
                onClick={() => handleReject(request.id)}
                disabled={actionLoading === request.id}
              >
                <X size={18} />
                Reject
              </button>
            </>
          )}
          {request.status === 'accepted' && (
            <button
              style={buttonStyle('start', actionLoading === request.id)}
              onClick={() => handleStartWork(request.id)}
              disabled={actionLoading === request.id}
            >
              <Clock size={18} />
              {actionLoading === request.id ? 'Starting...' : 'Start Work'}
            </button>
          )}
          {request.status === 'in_progress' && (
            <button
              style={buttonStyle('complete', actionLoading === request.id)}
              onClick={() => handleComplete(request.id)}
              disabled={actionLoading === request.id}
            >
              <Check size={18} />
              {actionLoading === request.id ? 'Completing...' : 'Complete Job'}
            </button>
          )}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '60px', color: '#7f8c8d' }}>
          Loading requests...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#2c3e50', marginBottom: '24px' }}>
        Service Requests
      </h2>

      {/* Tabs */}
      <div style={tabsStyle}>
        <button
          style={tabStyle(activeTab === 'available')}
          onClick={() => setActiveTab('available')}
        >
          Available Requests
          {availableRequests.length > 0 && (
            <span style={countBadgeStyle(availableRequests.length)}>{availableRequests.length}</span>
          )}
        </button>
        <button
          style={tabStyle(activeTab === 'accepted')}
          onClick={() => setActiveTab('accepted')}
        >
          My Active Jobs
          {acceptedRequests.length > 0 && (
            <span style={countBadgeStyle(acceptedRequests.length)}>{acceptedRequests.length}</span>
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'available' && (
        <>
          {availableRequests.length === 0 ? (
            <div style={emptyStyle}>
              <Clock size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <h3 style={{ marginBottom: '8px', color: '#2c3e50' }}>No Available Requests</h3>
              <p>There are no pending service requests in your category right now.</p>
              <p style={{ fontSize: '13px', marginTop: '8px' }}>Check back later or make sure your service category is set correctly.</p>
            </div>
          ) : (
            <div style={gridStyle}>
              {availableRequests.map(req => renderRequestCard(req, true))}
            </div>
          )}
        </>
      )}

      {activeTab === 'accepted' && (
        <>
          {acceptedRequests.length === 0 ? (
            <div style={emptyStyle}>
              <Check size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <h3 style={{ marginBottom: '8px', color: '#2c3e50' }}>No Active Jobs</h3>
              <p>You haven't accepted any service requests yet.</p>
              <p style={{ fontSize: '13px', marginTop: '8px' }}>Switch to "Available Requests" to see jobs you can accept.</p>
            </div>
          ) : (
            <div style={gridStyle}>
              {acceptedRequests.map(req => renderRequestCard(req, true))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ArtisanRequestManager;

