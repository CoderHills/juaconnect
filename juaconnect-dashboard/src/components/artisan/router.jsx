// src/artisan/router.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ArtisanLayout from "./ArtisanLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Bookings from "./pages/Bookings.jsx";
import Availability from "./pages/Availability.jsx";
import Reviews from "./pages/Reviews.jsx";
import Verification from "./pages/Verification.jsx";
import Notifications from "./pages/Notifications.jsx";

const ArtisanRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/artisan" replace />} />

        <Route path="/artisan" element={<ArtisanLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="availability" element={<Availability />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="verification" element={<Verification />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default ArtisanRouter;
