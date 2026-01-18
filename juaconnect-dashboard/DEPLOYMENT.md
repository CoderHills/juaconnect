# JuaConnect Deployment Guide

## Quick Deploy to Render (Recommended)

### Backend (Flask API)

1. **Push code to GitHub**
   ```bash
   cd juaconnect-backend
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create PostgreSQL Database on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "PostgreSQL"
   - Select free tier
   - Note the connection string (DATABASE_URL)

3. **Deploy Backend**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Settings:
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `gunicorn --workers 4 --bind 0.0.0.0:$PORT app:app`
   - Environment Variables:
     - `DATABASE_URL`: (from step 2)
     - `JWT_SECRET_KEY`: Generate with `openssl rand -hex 32`
     - `FLASK_ENV`: `production`
     - `SECRET_KEY`: (same as JWT_SECRET_KEY)

### Frontend (React)

1. **Deploy to Render Static Site**
   - Click "New" → "Static Site"
   - Connect your GitHub repository (juaconnect-dashboard)
   - Settings:
     - Build Command: `npm install && npm run build`
     - Publish Directory: `dist`
   - Environment Variables:
     - `VITE_API_URL`: `https://your-backend-service.onrender.com`

2. **Or Deploy to Netlify**
   ```bash
   cd juaconnect-dashboard
   npm run build
   # Drag and drop the dist folder to Netlify
   ```
   - Set environment variable in Netlify dashboard:
     - `VITE_API_URL`: `https://your-backend-service.onrender.com`

## Environment Variables

### Backend (.env file for local testing)
```
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET_KEY=your-super-secret-key-min-32-characters
FLASK_ENV=production
SECRET_KEY=your-super-secret-key
```

### Frontend (.env for local development)
```
VITE_API_URL=http://localhost:5000
```

## Deployment Checklist

- [ ] Push all code to GitHub
- [ ] Create Render PostgreSQL database
- [ ] Deploy backend with proper start command
- [ ] Set all environment variables
- [ ] Deploy frontend
- [ ] Update frontend VITE_API_URL to point to production backend
- [ ] Test the deployed application

## Production URL Structure

- **Backend API**: `https://juaconnect-api.onrender.com`
- **Frontend**: `https://your-frontend.onrender.com` or Netlify URL

## Troubleshooting

### CORS Issues
Ensure CORS is configured to allow your frontend domain in production.

### Database Migrations
Run database migrations after deployment:
```bash
flask db upgrade
```

### Build Errors
- Ensure all dependencies are in requirements.txt
- Check that build commands run without errors locally first

