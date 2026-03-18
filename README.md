# BranchTracker

A modern branch tracking application built with React, Vite, and TailwindCSS.

## About

BranchTracker is a web application for managing and tracking git branches across your development team. This project has been migrated away from the Base44 backend and is ready for custom backend API integration.

## Getting Started

### Prerequisites

1. Node.js (v16 or higher)
2. npm or yarn package manager

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Run the development server: `npm run dev`

The app will be available at `http://localhost:8000`

## Backend Integration

**Important:** This project currently has placeholder API calls. You need to implement your own backend API to make the application functional.

### API Endpoints to Implement

The following API endpoints need to be implemented in your custom backend:

#### Authentication
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user information

#### Branches
- `GET /api/branches` - List all branches (admin only)
- `GET /api/branches/my` - List branches created by current user
- `POST /api/branches` - Create a new branch
- `PUT /api/branches/:id` - Update a branch
- `DELETE /api/branches/:id` - Delete a branch

### Updating the API Client

Edit `src/api/base44Client.js` to implement your custom API client that calls your backend endpoints. Replace the placeholder functions with actual API calls.

## Project Structure

```
src/
├── api/              # API client (needs custom implementation)
├── components/       # React components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and context
├── pages/           # Page components
└── App.jsx          # Main app component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run preview` - Preview production build

## Technologies Used

- React 18
- Vite
- TailwindCSS
- React Router
- TanStack React Query
- Radix UI Components
- Lucide Icons

## Next Steps

1. Set up your custom backend API
2. Update `src/api/base44Client.js` with your API endpoints
3. Update `src/lib/AuthContext.jsx` to use your custom authentication flow
4. Test all features with your backend
# Branch-Tracker
# Branch-Tracker
