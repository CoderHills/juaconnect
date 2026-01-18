# Booking System Implementation Plan

## Backend Changes

### Step 1: Add Notification Model
- [ ] Create Notification model in models.py
- [ ] Add relationship to User model

### Step 2: Add Notification Routes
- [ ] Create notification_routes.py
- [ ] GET /v1/notifications - Get user notifications
- [ ] POST /v1/notifications/:id/read - Mark as read
- [ ] DELETE /v1/notifications/:id - Delete notification

### Step 3: Update Artisan Routes
- [ ] Add rejectRequest endpoint (POST /v1/artisan/requests/:id/reject)
- [ ] Update acceptRequest to create notification for client

### Step 4: Register Notification Routes
- [ ] Update app/__init__.py to register notification blueprint

---

## Frontend Changes

### Step 5: Update API Service
- [ ] Add rejectRequest API function
- [ ] Add getNotifications API function
- [ ] Add markNotificationRead API function
- [ ] Update mock API with notification support
- [ ] Update mock data for service requests

### Step 6: Create Artisan Request Manager
- [ ] Create ArtisanRequestManager.jsx component
- [ ] Show pending requests for artisan to accept/reject
- [ ] Add Accept/Reject buttons

### Step 7: Create Notifications Component
- [ ] Create Notifications.jsx for both clients and artisans
- [ ] Show booking status notifications
- [ ] Add mark as read functionality

### Step 8: Create Booking Form
- [ ] Create BookingForm.jsx component
- [ ] Better form with location, date, description, budget

### Step 9: Update Client Dashboard
- [ ] Show service requests with status
- [ ] Add "View Details" for each request
- [ ] Link to Notifications

### Step 10: Update Artisan Dashboard
- [ ] Add "Available Requests" section
- [ ] Add "Active Jobs" section
- [ ] Link to Notifications

---

## File Changes Summary

### Backend Files:
1. `/Users/coderhillary/Documents/projo/juaconnect-backend/app/models/models.py` - Add Notification model
2. `/Users/coderhillary/Documents/projo/juaconnect-backend/app/routes/notification_routes.py` - NEW FILE
3. `/Users/coderhillary/Documents/projo/juaconnect-backend/app/routes/artisan_routes.py` - Add reject endpoint
4. `/Users/coderhillary/Documents/projo/juaconnect-backend/app/__init__.py` - Register notification blueprint

### Frontend Files:
1. `/Users/coderhillary/Documents/projo/juaconnect-dashboard/src/services/api.js` - Add new endpoints
2. `/Users/coderhillary/Documents/projo/juaconnect-dashboard/src/components/bookings/ArtisanRequestManager.jsx` - NEW
3. `/Users/coderhillary/Documents/projo/juaconnect-dashboard/src/components/bookings/BookingForm.jsx` - NEW
4. `/Users/coderhillary/Documents/projo/juaconnect-dashboard/src/components/notifications/Notifications.jsx` - NEW
5. `/Users/coderhillary/Documents/projo/juaconnect-dashboard/src/components/pages/ClientDashboard.jsx` - Update
6. `/Users/coderhillary/Documents/projo/juaconnect-dashboard/src/components/pages/ArtisanDashboard.jsx` - Update

