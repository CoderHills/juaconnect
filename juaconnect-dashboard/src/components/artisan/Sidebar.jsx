// src/artisan/Sidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./artisan.css";

const Sidebar = ({ artisan }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", path: "/artisan", icon: "📊" },
    {
      id: "bookings",
      label: "Bookings",
      path: "/artisan/bookings",
      icon: "📅",
    },
    {
      id: "availability",
      label: "Availability",
      path: "/artisan/availability",
      icon: "⏰",
    },
    { id: "reviews", label: "Reviews", path: "/artisan/reviews", icon: "⭐" },
    {
      id: "verification",
      label: "Verification",
      path: "/artisan/verification",
      icon: "✅",
    },
    {
      id: "notifications",
      label: "Notifications",
      path: "/artisan/notifications",
      icon: "🔔",
    },
  ];

  const handleLogout = () => {
    // Implement logout logic
    console.log("Logging out...");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-logo">ArtisanSidebar</h2>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? "active" : ""}`
                }
                end={item.path === "/artisan"}
              >
                <span className="menu-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {artisan?.name ? artisan.name.charAt(0) : "A"}
          </div>
          <div className="user-details">
            <span className="user-name">{artisan?.name || "Artisan"}</span>
            <span className="user-role">Artisan</span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

