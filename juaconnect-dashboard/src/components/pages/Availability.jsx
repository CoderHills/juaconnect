// src/artisan/pages/Availability.jsx
import React, { useState, useEffect } from "react";
import "../artisan.css";

const Availability = () => {
  const [availability, setAvailability] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBlockedDate, setNewBlockedDate] = useState({
    date: "",
    reason: "",
  });

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const artisanId = 1;
        const response = await fetch(
          `http://localhost:5000/api/artisan/${artisanId}/availability`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch availability`);
        }

        const data = await response.json();
        setAvailability(data.availability || {});
        setBlockedDates(data.blocked_dates || []);
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const handleDayChange = (day, field, value) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        [field]: value,
      },
    });
  };

  const handleToggleAvailability = (day) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        available: !availability[day].available,
      },
    });
  };

  const handleAddBlockedDate = () => {
    if (newBlockedDate.date && newBlockedDate.reason) {
      const newDate = {
        id: Date.now(), // Temporary ID
        date: newBlockedDate.date,
        reason: newBlockedDate.reason,
      };
      setBlockedDates([...blockedDates, newDate]);
      setNewBlockedDate({ date: "", reason: "" });
    }
  };

  const handleRemoveBlockedDate = (id) => {
    setBlockedDates(blockedDates.filter((date) => date.id !== id));
  };

  const handleSaveSchedule = async () => {
    try {
      const artisanId = 1;
      const response = await fetch(
        `http://localhost:5000/api/artisan/${artisanId}/availability`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ availability, blockedDates }),
        }
      );

      if (response.ok) {
        console.log("Schedule saved successfully");
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  };

  if (loading) {
    return (
      <div className="availability-page">
        <header className="page-header">
          <h1 className="page-title">Availability</h1>
        </header>
        <div className="page-content">
          <div className="loading">Loading availability...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="availability-page">
      <header className="page-header">
        <h1 className="page-title">Availability</h1>
      </header>
      <div className="page-content">
        <div className="availability-container">
          <div className="availability-section">
            <h3 className="section-title">Weekly Schedule</h3>
            <p className="section-subtitle">
              Set your regular working hours for each day
            </p>

            {availability ? (
              <div className="days-grid">
                {Object.entries(availability).map(([day, schedule]) => (
                  <div key={day} className="day-card">
                    <div className="day-header">
                      <span className="day-name">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </span>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={schedule.available}
                          onChange={() => handleToggleAvailability(day)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    {schedule.available ? (
                      <div className="time-inputs">
                        <div className="time-input-group">
                          <label>Start</label>
                          <input
                            type="time"
                            value={schedule.start}
                            onChange={(e) =>
                              handleDayChange(day, "start", e.target.value)
                            }
                            className="time-input"
                          />
                        </div>
                        <div className="time-input-group">
                          <label>End</label>
                          <input
                            type="time"
                            value={schedule.end}
                            onChange={(e) =>
                              handleDayChange(day, "end", e.target.value)
                            }
                            className="time-input"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="day-off">
                        <span className="day-off-text">Day Off</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No availability data found.</p>
            )}
          </div>

          <div className="availability-section">
            <h3 className="section-title">Blocked Dates</h3>
            <p className="section-subtitle">
              Add specific dates when you're not available
            </p>

            <div className="blocked-dates-form">
              <div className="form-group">
                <input
                  type="date"
                  value={newBlockedDate.date}
                  onChange={(e) =>
                    setNewBlockedDate({
                      ...newBlockedDate,
                      date: e.target.value,
                    })
                  }
                  className="date-input"
                  min={new Date().toISOString().split("T")[0]}
                />
                <input
                  type="text"
                  value={newBlockedDate.reason}
                  onChange={(e) =>
                    setNewBlockedDate({
                      ...newBlockedDate,
                      reason: e.target.value,
                    })
                  }
                  placeholder="Reason (e.g., Vacation, Maintenance)"
                  className="reason-input"
                />
                <button
                  className="add-btn"
                  onClick={handleAddBlockedDate}
                  disabled={!newBlockedDate.date || !newBlockedDate.reason}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="blocked-dates-list">
              {blockedDates.length > 0 ? (
                blockedDates.map((blockedDate) => (
                  <div key={blockedDate.id} className="blocked-date-item">
                    <div className="blocked-date-info">
                      <span className="blocked-date">
                        {new Date(blockedDate.date).toLocaleDateString()}
                      </span>
                      <span className="blocked-reason">
                        {blockedDate.reason}
                      </span>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveBlockedDate(blockedDate.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p>No blocked dates scheduled.</p>
              )}
            </div>
          </div>

          <div className="availability-actions">
            <button className="save-btn" onClick={handleSaveSchedule}>
              Save Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Availability;