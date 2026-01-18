// src/artisan/pages/Notifications.jsx
import React, { useState, useEffect } from "react";
import "../artisan.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const artisanId = 1;
        const response = await fetch(
          `http://localhost:5000/api/artisan/${artisanId}/notifications`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch notifications`);
        }

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const filteredNotifications =
    filter === "all"
      ? notifications
      : filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.read);

  const markAsRead = (id) => {
    // Implement with backend API
    console.log("Mark as read:", id);
  };

  const markAllAsRead = () => {
    // Implement with backend API
    console.log("Mark all as read");
  };

  const deleteNotification = (id) => {
    // Implement with backend API
    console.log("Delete notification:", id);
  };

  const getIconForType = (type) => {
    const icons = {
      booking: "📅",
      payment: "💰",
      review: "⭐",
      system: "⚙️",
      verification: "✅",
      message: "💬",
    };
    return icons[type] || "📢";
  };

  if (loading) {
    return (
      <div className="notifications-page">
        <header className="page-header">
          <h1 className="page-title">Notifications</h1>
        </header>
        <div className="page-content">
          <div className="loading">Loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <header className="page-header">
        <h1 className="page-title">Notifications</h1>
        <div className="notification-actions-top">
          <button className="mark-all-btn" onClick={markAllAsRead}>
            Mark all as read
          </button>
        </div>
      </header>
      <div className="page-content">
        <div className="notifications-container">
          <div className="notifications-main">
            <div className="vertical-filters">
              <button
                className={`filter-btn ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                <span className="filter-label">All</span>
                <span className="filter-count">{notifications.length}</span>
              </button>
              <button
                className={`filter-btn ${filter === "unread" ? "active" : ""}`}
                onClick={() => setFilter("unread")}
              >
                <span className="filter-label">Unread</span>
                <span className="filter-count">
                  {notifications.filter((n) => !n.read).length}
                </span>
              </button>
              <button
                className={`filter-btn ${filter === "read" ? "active" : ""}`}
                onClick={() => setFilter("read")}
              >
                <span className="filter-label">Read</span>
                <span className="filter-count">
                  {notifications.filter((n) => n.read).length}
                </span>
              </button>
            </div>

            <div className="notifications-list">
              {filteredNotifications.length === 0 ? (
                <div className="no-notifications">
                  <div className="empty-icon">📭</div>
                  <h3>No notifications</h3>
                  <p>You're all caught up!</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-card ${
                      !notification.read ? "unread" : ""
                    }`}
                  >
                    <div className="notification-icon">
                      {getIconForType(notification.type)}
                    </div>

                    <div className="notification-content">
                      <div className="notification-header">
                        <h4 className="notification-title">
                          {notification.title}
                        </h4>
                        <span className="notification-time">
                          {notification.time}
                        </span>
                      </div>

                      <p className="notification-message">
                        {notification.message}
                      </p>
                    </div>

                    <div className="notification-actions">
                      {!notification.read && (
                        <button
                          className="read-btn"
                          onClick={() => markAsRead(notification.id)}
                          title="Mark as read"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        className="delete-btn"
                        onClick={() => deleteNotification(notification.id)}
                        title="Delete notification"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
