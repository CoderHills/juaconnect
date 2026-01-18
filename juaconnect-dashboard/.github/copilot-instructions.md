# Copilot Instructions for Juaconnect Dashboard

## Overview
Juaconnect Dashboard is a **dual-interface React+Vite application** serving two user types: **clients** (who book services) and **artisans** (service providers). The app uses React Router for multi-tenant routing, Tailwind CSS 4.1 for styling, and connects to a backend API at `http://localhost:5000/v1`.

## Architecture: Two User Flows

### 1. Client Dashboard (`src/App.jsx` + components/)
- **Entry**: `App.jsx` renders `<Sidebar>` + `<MainContent>`
- **Key Components**: `UpcomingBookings.jsx`, `Payments.jsx`, `BookingCard.jsx`, `PaymentCard.jsx`
- **Flow**: Sidebar navigation (dashboard/bookings/payments/notifications) → MainContent displays selected section
- **Data**: Mock data in `src/data/mockData.js` (MOCK_BOOKINGS, MOCK_USER)

### 2. Artisan Dashboard (`src/components/artisan/`)
- **Entry**: `router.jsx` defines route structure with React Router
- **Layout**: `ArtisanLayout.jsx` fetches artisan data from backend, wraps nested routes
- **Pages**: `Dashboard.jsx`, `Bookings.jsx`, `Availability.jsx`, `Reviews.jsx`, `Verification.jsx`, `Notifications.jsx`
- **Pattern**: Each page is self-contained, fetches own data, uses Tailwind for styling

### 3. Auth Flow (`src/components/auth/`, `src/main.jsx`)
- Routes: `/` (Home), `/signin` (SignIn.jsx), `/signup` (SignUp.jsx)
- Token-based auth: `api.login()` and `api.register()` store JWT in localStorage
- User type stored: `localStorage.user_type` determines client vs artisan redirect

## Critical Files & Patterns

| File | Purpose | Pattern |
|------|---------|---------|
| `src/services/api.js` | All backend calls | Fetch wrapper with Bearer token auth, token management via localStorage |
| `src/components/auth/` | Auth UI | Form state with `useState`, `localStorage` for tokens/user_type |
| `src/components/artisan/` | Artisan routing | React Router nested routes, `useEffect` data fetching in layout |
| `src/data/mockData.js` | Client-side test data | Export constants for components to import |
| `tailwind.config.js` | Tailwind customization | Uses Tailwind CSS 4.1 with `@tailwindcss/vite` plugin |

## Developer Workflows

### Setup & Running
```bash
npm install           # Install dependencies
npm run dev          # Start Vite dev server (http://localhost:5000)
npm run build        # Production build → dist/
npm run lint         # ESLint check
npm run preview      # Preview production build locally
```

### State Management
- **Local State**: `useState` for UI (search, active nav, modals)
- **Persistence**: `localStorage` for auth tokens, user_type
- **Data Fetching**: Direct `fetch()` in `useEffect()` (see ArtisanLayout.jsx), results stored in component state
- **Cross-Component**: Props drilling (parent → child) for search query, activeNav

### Component Patterns
1. **Controlled Inputs** (SignIn.jsx): `useState` + `onChange` handlers
2. **Conditional Rendering** (Sidebar.jsx): Active nav state determines CSS classes
3. **Icon Library**: `lucide-react` for icons (Home, Calendar, CreditCard, Bell, User, LogOut)
4. **Modal Components**: `BookingModal.jsx` likely uses state + overlay div

## API Integration

**Base URL**: `http://localhost:5000/v1`  
**Auth Header**: `Authorization: Bearer ${token}` (from `api.js` helper)

### Key Endpoints (from api.js)
- `POST /auth/register` - Returns `{ success, data: { token, user: { user_type } } }`
- `POST /auth/login` - Same response structure
- `GET /users/profile` - Requires Bearer token
- `PUT /users/profile` - Requires Bearer token + JSON body
- Artisan data: Direct fetch to `http://localhost:5000/api/users/{artisanId}` (from ArtisanLayout)

**Error Handling**: Always check `response.ok` or `data.success` before processing.

## Styling Convention

- **Tailwind 4.1**: Direct class names in JSX (`className="w-64 bg-gray-800 flex flex-col"`)
- **Dark Theme**: Client dashboard uses gray-800 sidebar + white text
- **Components**: Card layouts with padding (p-6), spacing (space-y-8), responsive flex
- **Colors**: emerald-500 for primary accent, gray palette for UI
- **CSS Files**: Reserved for artisan-specific styles (artisan.css)

## Routing Structure

**Main Routes** (`src/main.jsx`):
```
/         → Home.jsx
/signin   → SignIn.jsx  
/signup   → SignUp.jsx
```

**Artisan Routes** (via artisan/router.jsx):
```
/artisan                → ArtisanLayout (wrapper)
  /artisan/dashboard    → Dashboard.jsx
  /artisan/bookings     → Bookings.jsx
  /artisan/availability → Availability.jsx
  /artisan/reviews      → Reviews.jsx
  /artisan/verification → Verification.jsx
  /artisan/notifications → Notifications.jsx
```

## Key Conventions & Gotchas

1. **Two Router Instances**: Main app uses `createBrowserRouter` in main.jsx; artisan uses `BrowserRouter` + `<Routes>` in router.jsx. Avoid mixing patterns.
2. **Token Management**: Always check `api.getToken()` exists before making authenticated requests.
3. **Mock vs Real Data**: Client dashboard uses mockData.js; artisan dashboard fetches from backend. Align when switching.
4. **Component Colocation**: Sub-components live in artisan/, auth/, layout/, ui/ folders. Import paths use relative imports.
5. **Tailwind 4.1**: Uses new plugin system. See `vite.config.js` for `@tailwindcss/vite` plugin.

## External Dependencies

- **React 19.2.0**: Latest React
- **React Router 7.12.0**: Client-side routing
- **Tailwind CSS 4.1.18**: Styling with Vite plugin
- **Lucide React 0.562.0**: Icon library
- **Material-UI 7.3.7**: UI components (check if used in production)
- **@emotion**: CSS-in-JS (paired with MUI)

## For New Features
- **Client Feature**: Add component to `src/components/`, update MainContent routing/state
- **Artisan Feature**: Add page to `src/components/artisan/pages/`, register route in router.jsx
- **Auth Change**: Update `src/services/api.js` + token logic in auth components
- **Styling**: Use Tailwind classes; avoid custom CSS unless artisan-specific