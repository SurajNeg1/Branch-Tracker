# Quick Start Guide

## Prerequisites
- Node.js (v14+)
- MongoDB running locally on port 27017
- npm or yarn

## Setup Steps

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with the following content:
MONGODB_URI=mongodb://localhost:27017/branch-tracker
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_12345
JWT_REFRESH_SECRET=your_super_secret_refresh_key_12345
NODE_ENV=development

# Start the backend server
npm start
```

Backend will be available at `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file with the following content:
VITE_API_URL=http://localhost:5000/api

# Start the development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Testing the Application

### 1. Create an Account
1. Go to `http://localhost:5173/signup`
2. Fill in your details (name, email, password)
3. Click "Sign Up"
4. You'll be automatically logged in and redirected to Dashboard

### 2. Create a Branch
1. Click "Add Branch" in the navigation
2. Fill in the branch details:
   - Branch Name: e.g., `feature/user-auth`
   - Parent Branch: e.g., `dev`
   - Changes Description: Describe your changes
3. Click "Create Branch"
4. You'll be redirected to Dashboard where you can see your new branch

### 3. Manage Branches
- **View**: All your branches appear in the Dashboard
- **Edit**: Click the edit icon on any branch to modify it
- **Delete**: Click the delete icon to remove a branch
- **Filter**: Use the search and merge status filters

### 4. Logout
- Click the logout button in the top navigation
- You'll be redirected to the login page

## Key Features Implemented

✅ **Authentication**
- User signup with email and password
- User login with credentials
- Access token (15 min expiry) and refresh token (7 day expiry)
- Automatic token refresh on expiry
- Secure logout

✅ **Branch Management**
- Create branches with name, description, and status
- View all user's branches
- Edit branch details
- Delete branches
- Real-time error handling with toast notifications

✅ **User Experience**
- Protected routes (redirect to login if not authenticated)
- Loading states during API calls
- Error messages for failed operations
- Success notifications for completed actions
- Responsive design

## API Integration Summary

All frontend pages now use the backend API:

| Page | Functionality |
|---|---|
| **Login** | Authenticates user, stores tokens |
| **SignUp** | Creates new account, stores tokens |
| **Dashboard** | Fetches and displays user's branches |
| **AddBranch** | Creates new branch via API |
| **AdminView** | Displays all branches (same endpoint) |

## Token Management

The application automatically handles:
- Storing tokens in localStorage
- Injecting tokens in API requests
- Refreshing expired access tokens
- Clearing tokens on logout
- Redirecting to login on auth failure

## Troubleshooting

**Backend won't start?**
- Check if MongoDB is running: `mongod`
- Verify port 5000 is not in use
- Check .env file has correct values

**Frontend can't connect to backend?**
- Verify backend is running on port 5000
- Check VITE_API_URL in frontend .env
- Check browser console for CORS errors

**Login/Signup not working?**
- Check backend console for errors
- Verify MongoDB is connected
- Check network tab in browser DevTools

**Branches not loading?**
- Ensure you're logged in
- Check if accessToken is valid
- Verify backend is running

## Next Steps

1. Customize the UI theme if needed
2. Add more branch fields to the database schema
3. Implement role-based access control
4. Add email verification
5. Deploy to production

## Support

For detailed information, see `INTEGRATION_SETUP.md`
