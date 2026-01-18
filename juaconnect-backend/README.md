# Backend Configuration

## Prerequisites
- Python 3.8+
- PostgreSQL

## Setup Instructions

### 1. Create a PostgreSQL database:
```bash
createdb juaconnect
```

### 2. Install dependencies:
```bash
pip install -r requirements.txt
```

### 3. Create a .env file:
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/juaconnect
JWT_SECRET_KEY=your-secret-key-change-this-in-production
FLASK_DEBUG=True
PORT=5000
```

### 4. Run the backend:
```bash
python run.py
```

The API will be available at `http://localhost:5000/v1`

## API Endpoints

### Authentication (`/v1/auth`)
- `POST /signup` - Register new user (client or artisan)
- `POST /signin` - Login user
- `GET /profile` - Get current user profile (requires token)
- `PUT /profile` - Update user profile (requires token)

### Client (`/v1/client`)
- `POST /requests` - Create service request
- `GET /requests` - Get all user's requests
- `GET /requests/<id>` - Get specific request
- `PUT /requests/<id>` - Cancel request
- `GET /bookings` - Get all bookings

### Artisan (`/v1/artisan`)
- `GET /available-requests` - View available requests
- `GET /accepted-requests` - View accepted requests
- `POST /requests/<id>/accept` - Accept a request
- `POST /requests/<id>/start` - Start work (create booking)
- `POST /requests/<id>/complete` - Complete work
- `GET /profile` - Get artisan profile
- `GET /search?service_category=X&location=Y` - Search artisans

## Example Request

### Sign Up (Client)
```bash
curl -X POST http://localhost:5000/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_client",
    "email": "john@example.com",
    "password": "securepass123",
    "user_type": "client",
    "phone": "0712345678",
    "location": "Nairobi"
  }'
```

### Sign Up (Artisan)
```bash
curl -X POST http://localhost:5000/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jane_plumber",
    "email": "jane@example.com",
    "password": "securepass123",
    "user_type": "artisan",
    "phone": "0709876543",
    "location": "Nairobi",
    "service_category": "Plumbing",
    "experience_years": 5,
    "bio": "Expert plumber with 5 years experience"
  }'
```

### Create Service Request (Client)
```bash
curl -X POST http://localhost:5000/v1/client/requests \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "service_category": "Plumbing",
    "description": "Fix leaking kitchen tap",
    "location": "Westlands, Nairobi",
    "budget": 2000
  }'
```

### Accept Request (Artisan)
```bash
curl -X POST http://localhost:5000/v1/artisan/requests/1/accept \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Start Work (Artisan)
```bash
curl -X POST http://localhost:5000/v1/artisan/requests/1/start \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"total_amount": 2000}'
```
