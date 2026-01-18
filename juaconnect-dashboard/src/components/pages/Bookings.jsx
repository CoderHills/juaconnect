// src/artisan/pages/Bookings.jsx
import React, { useState, useEffect } from "react";
import "../artisan.css";

const Bookings = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBooking, setExpandedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const artisanId = 1;
        const response = await fetch(
          `http://localhost:5000/api/artisan/${artisanId}/bookings`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch bookings`);
        }

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filters = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "active", label: "Active" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  const filteredBookings =
    selectedFilter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === selectedFilter);

  const formatPrice = (price) => {
    return `$${price ? price.toFixed(2) : "0.00"}`;
  };

  const toggleBookingDetails = (bookingId) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        setBookings(
          bookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: newStatus }
              : booking
          )
        );
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  if (loading) {
    return (
      <div className="bookings-page">
        <header className="page-header">
          <h1 className="page-title">Bookings</h1>
        </header>
        <div className="page-content">
          <div className="loading">Loading bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bookings-page">
      <header className="page-header">
        <h1 className="page-title">Bookings</h1>
      </header>

      <div className="page-content">
        <div className="bookings-header">
          <div className="bookings-title">
            <div className="week-filter">
              <span>This Week</span>
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>

          <div className="booking-filters">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`filter-btn ${
                  selectedFilter === filter.id ? "active" : ""
                }`}
                onClick={() => setSelectedFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bookings-list">
          {filteredBookings.length === 0 ? (
            <div className="no-bookings">
              {bookings.length === 0
                ? "No bookings yet."
                : `No ${selectedFilter} bookings found.`}
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <h3 className="booking-service">
                    {booking.service_title || "Service"}
                  </h3>
                  <span className={`booking-status ${booking.status}`}>
                    {booking.status_display || "Pending"}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="client-info">
                    <span className="client-name">
                      {booking.client_name || "Client"}
                    </span>
                    <span className="service-description">
                      {booking.description || ""}
                    </span>
                  </div>

                  <div className="booking-meta">
                    <div className="booking-date">
                      <span className="date-label">Date:</span>
                      <span className="date-value">
                        {booking.formatted_date || ""}
                      </span>
                    </div>
                    <div className="booking-price">
                      <span className="price-label">Price:</span>
                      <span className="price-value">
                        {formatPrice(booking.price)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="booking-actions">
                  <button
                    className="action-btn details-btn"
                    onClick={() => toggleBookingDetails(booking.id)}
                  >
                    {expandedBooking === booking.id
                      ? "Hide Details ▲"
                      : "Show Details ▼"}
                  </button>

                  {booking.status === "pending" && (
                    <div className="status-actions">
                      <button
                        className="action-btn accept-btn"
                        onClick={() => handleStatusUpdate(booking.id, "active")}
                      >
                        Accept
                      </button>
                      <button
                        className="action-btn decline-btn"
                        onClick={() =>
                          handleStatusUpdate(booking.id, "cancelled")
                        }
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>

                {expandedBooking === booking.id && (
                  <div className="booking-details-expanded">
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Location:</span>
                        <span className="detail-value">
                          {booking.location || "Not specified"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Duration:</span>
                        <span className="detail-value">
                          {booking.duration || ""}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Client Email:</span>
                        <span className="detail-value">
                          {booking.client_email || ""}
                        </span>
                      </div>
                      <div className="detail-item full-width">
                        <span className="detail-label">
                          Special Instructions:
                        </span>
                        <span className="detail-value">
                          {booking.special_instructions || "None"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
