# JuaConnect - Complete Setup Guide

## Prerequisites
- Node.js 20+ (for frontend)
- Python 3.8+ (for backend)
- PostgreSQL 12+ (database)

## Part 1: Backend Setup (Flask + PostgreSQL)

### 1. Create PostgreSQL Database
```bash
# On macOS with Homebrew
brew services start postgresql

# Create database
createdb juaconnect
```

### 2. Set Up Backend
```bash
cd /Users/coderhillary/Documents/projo/juaconnect-backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Update `.env` file
The `.env` file is already created. Update PostgreSQL credentials if needed:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/juaconnect
JWT_SECRET_KEY=your-secret-key-change-in-production
FLASK_DEBUG=True
PORT=5000
```

### 4. Run Backend
```bash
python run.py
```

Backend will start on `http://localhost:5000`

---

## Part 2: Frontend Setup (React + Vite)

### 1. Set Up Frontend
```bash
cd /Users/coderhillary/Documents/projo/juaconnect-dashboard

# Install dependencies (if not already done)
npm install

# Start dev server
npm run dev
```

Frontend will start on `http://localhost:5173`

---

## Part 3: Test the Complete Flow

### 1. Create a Client Account
- Go to http://localhost:5173
- Click "Sign Up" or "Hire an Artisan" (scrolls to signup form)
- Fill in: username, email, password, phone, location
- Click "Sign Up" → Redirected to client dashboard

### 2. Client Request Service
- In client dashboard, click "Request an Artisan"
- Fill in request details
- Click "Request Artisan" → Request created in database

### 3. Create an Artisan Account
- Go to http://localhost:5173
- Click "Register as Artisan"
- Fill in: username, email, password, phone, service category, experience, location, bio
- Click "Create Artisan Profile" → Redirected to artisan dashboard

### 4. Artisan Views & Accepts Requests
- In artisan dashboard, you can view available requests
- Click "Accept" on a request
- Request status changes from "pending" to "accepted"

### 5. Artisan Starts Work
- After accepting, click "Start Work"
- Booking created with start date
- Request status changes to "in_progress"

### 6. Complete Work
- Click "Complete" to mark work as done
- Booking end date set
- Request status changes to "completed"

---

## API Endpoints Summary

### Authentication (`/v1/auth`)
```
POST   /signup      - Register new user
POST   /signin      - Login
GET    /profile     - Get user profile
PUT    /profile     - Update profile
```

### Client (`/v1/client`)
```
POST   /requests              - Create service request
GET    /requests              - List user's requests
GET    /requests/<id>         - Get request details
PUT    /requests/<id>         - Cancel request
GET    /bookings              - Get bookings
```

### Artisan (`/v1/artisan`)
```
GET    /available-requests    - View available requests
GET    /accepted-requests     - View accepted requests
POST   /requests/<id>/accept  - Accept a request
POST   /requests/<id>/start   - Start work (create booking)
POST   /requests/<id>/complete - Complete work
GET    /profile               - Get artisan profile
GET    /search?service_category=X&location=Y - Search artisans
```

---

## Database Schema

### Users Table
- id, username, email, password_hash, user_type (client/artisan)
- phone, location, created_at
- Artisan fields: service_category, experience_years, bio, rating, is_verified

### ServiceRequests Table
- id, client_id, artisan_id, service_category, description
- status (pending/accepted/in_progress/completed/cancelled)
- location, budget, created_at, updated_at

### Bookings Table
- id, request_id, start_date, end_date, total_amount, status

### Reviews Table
- id, booking_id, reviewer_id, rating (1-5), comment

### Payments Table
- id, booking_id, amount, status, payment_method

---

## Troubleshooting

### Backend Won't Start
```bash
# Check if PostgreSQL is running
brew services list

# If not, start it
brew services start postgresql

# Check if port 5000 is in use
lsof -i :5000

# Kill process if needed
kill -9 <PID>
```

### Frontend Can't Connect to Backend
- Make sure backend is running on http://localhost:5000
- Check CORS settings in Flask app (already enabled)
- Clear browser cache and localStorage
- Check browser console for errors

### PostgreSQL Connection Issues
```bash
# Verify connection
psql juaconnect

# List databases
\l

# Connect to database
\c juaconnect

# List tables
\dt
```

### Reset Database
```bash
# Drop and recreate database
dropdb juaconnect
createdb juaconnect

# Backend will recreate tables on next run
```

---

## Next Steps

1. **Payment Integration** - Add payment processing (M-Pesa, card payments)
2. **Ratings & Reviews** - Clients rate artisans after completion
3. **Chat System** - Real-time messaging between clients and artisans
4. **Notifications** - Email/SMS alerts for new requests
5. **Analytics Dashboard** - Track metrics for both user types
6. **Admin Panel** - Manage users, disputes, verifications
7. **Mobile App** - React Native version

---

## Key Features Implemented

✅ Dual authentication (client & artisan)
✅ Service request workflow
✅ Request acceptance workflow
✅ Booking creation and management
✅ JWT token-based auth
✅ PostgreSQL database
✅ Error handling and validation
✅ CORS enabled for frontend
✅ RESTful API design
✅ State management with localStorage

---

## File Structure

```
juaconnect-backend/
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── models/
│   │   ├── models.py        # Database models
│   │   └── __init__.py
│   └── routes/
│       ├── auth_routes.py   # Auth endpoints
│       ├── client_routes.py # Client endpoints
│       ├── artisan_routes.py # Artisan endpoints
│       └── __init__.py
├── run.py                   # Entry point
├── config.py                # Configuration
├── requirements.txt         # Python dependencies
├── .env                     # Environment variables
└── README.md

juaconnect-dashboard/
├── src/
│   ├── services/
│   │   └── api.js          # API client
│   ├── components/
│   │   ├── auth/           # Auth components
│   │   ├── pages/          # Page components
│   │   └── artisan/        # Artisan components
│   ├── main.jsx            # Routes
│   └── App.jsx             # App entry
├── package.json
└── vite.config.js
```

Happy coding! 🚀
