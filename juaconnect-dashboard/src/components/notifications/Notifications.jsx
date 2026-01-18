import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, CheckCheck } from 'lucide-react';
import api from '../../services/api';

const Notifications = ({ userType = 'client', onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.getNotifications();
      if (response.success) {
        setNotifications(response.data || []);
        setUnreadCount(response.unread_count || 0);
      } else {
        setError(response.message || 'Failed to load notifications');
      }
    } catch (err) {
      setError(err.message || 'Error loading notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await api.markNotificationAsRead(notificationId);
      if (response.success) {
        setNotifications(notifications.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await api.markAllNotificationsAsRead();
      if (response.success) {
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      const response = await api.deleteNotification(notificationId);
      if (response.success) {
        const deleted = notifications.find(n => n.id === notificationId);
        setNotifications(notifications.filter(n => n.id !== notificationId));
        if (deleted && !deleted.is_read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking':
        return '📋';
      case 'payment':
        return '💰';
      default:
        return '🔔';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return '#27ae60';
      case 'rejected':
      case 'cancelled':
        return '#e74c3c';
      case 'pending':
        return '#f39c12';
      case 'completed':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  };

  const containerStyle = {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '400px',
    maxWidth: '100vw',
    height: '100vh',
    backgroundColor: '#fff',
    boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideIn 0.3s ease-out',
  };

  const headerStyle = {
    padding: '20px',
    borderBottom: '1px solid #ecf0f1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3498db',
    color: '#fff',
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
  };

  const actionsStyle = {
    padding: '12px 20px',
    borderBottom: '1px solid #ecf0f1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const markAllReadStyle = {
    background: 'none',
    border: 'none',
    color: '#3498db',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: '500',
  };

  const countBadgeStyle = {
    backgroundColor: '#e74c3c',
    color: '#fff',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  };

  const listStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '0',
  };

  const emptyStyle = {
    padding: '40px 20px',
    textAlign: 'center',
    color: '#7f8c8d',
  };

  const notificationItemStyle = (isRead) => ({
    padding: '16px 20px',
    borderBottom: '1px solid #ecf0f1',
    backgroundColor: isRead ? '#fff' : '#f8f9fa',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  });

  const notificationContentStyle = {
    display: 'flex',
    gap: '12px',
  };

  const iconStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#ecf0f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    flexShrink: 0,
  };

  const textStyle = {
    flex: 1,
  };

  const titleTextStyle = {
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '4px',
    fontSize: '14px',
  };

  const messageStyle = {
    color: '#7f8c8d',
    fontSize: '13px',
    lineHeight: '1.4',
    marginBottom: '6px',
  };

  const timeStyle = {
    color: '#95a5a6',
    fontSize: '11px',
  };

  const actionsRowStyle = {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  };

  const actionButtonStyle = (color) => ({
    background: 'none',
    border: 'none',
    color: color,
    cursor: 'pointer',
    padding: '4px 8px',
    fontSize: '12px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  });

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}
      </style>
      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={titleStyle}>
            <Bell size={20} />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span style={countBadgeStyle}>{unreadCount}</span>
            )}
          </div>
          <button style={closeButtonStyle} onClick={onClose}>×</button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div style={actionsStyle}>
            <span style={{ color: '#7f8c8d', fontSize: '13px' }}>
              {unreadCount > 0 ? `${unreadCount} unread` : 'All read'}
            </span>
            {unreadCount > 0 && (
              <button style={markAllReadStyle} onClick={handleMarkAllAsRead}>
                <CheckCheck size={16} />
                Mark all as read
              </button>
            )}
          </div>
        )}

        {/* Notification List */}
        <div style={listStyle}>
          {loading ? (
            <div style={emptyStyle}>Loading notifications...</div>
          ) : error ? (
            <div style={{ ...emptyStyle, color: '#e74c3c' }}>{error}</div>
          ) : notifications.length === 0 ? (
            <div style={emptyStyle}>
              <Bell size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <p>No notifications yet</p>
              <p style={{ fontSize: '13px', marginTop: '8px' }}>
                We'll notify you when something happens
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                style={notificationItemStyle(notification.is_read)}
                onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
              >
                <div style={notificationContentStyle}>
                  <div style={iconStyle}>
                    {getNotificationIcon(notification.notification_type)}
                  </div>
                  <div style={textStyle}>
                    <div style={titleTextStyle}>{notification.title}</div>
                    <div style={messageStyle}>{notification.message}</div>
                    <div style={timeStyle}>{formatTime(notification.created_at)}</div>
                    
                    <div style={actionsRowStyle}>
                      {!notification.is_read && (
                        <button
                          style={actionButtonStyle('#27ae60')}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                        >
                          <Check size={14} />
                          Mark read
                        </button>
                      )}
                      <button
                        style={actionButtonStyle('#e74c3c')}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                  {!notification.is_read && (
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#3498db',
                        flexShrink: 0,
                        marginTop: '6px',
                      }}
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;

