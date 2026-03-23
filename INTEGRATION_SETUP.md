# Backend-Frontend Integration Setup Guide

## Overview
This guide explains the complete integration between the BranchTracker backend and frontend, including authentication with access/refresh tokens and branch management.

## Architecture

### Authentication Flow
1. **Signup/Login**: User credentials are sent to backend
2. **Token Generation**: Backend returns `accessToken` (15m expiry) and `refreshToken` (7d expiry)
3. **Token Storage**: Tokens are stored in localStorage
4. **Token Refresh**: When accessToken expires, refreshToken is used to get new tokens
5. **Auto-logout**: If refreshToken is invalid, user is redirected to login

### API Client
The `APIClient` class (`frontend/src/api/client.js`) handles:
- All HTTP requests with automatic token management
- Token refresh on 401 responses
- Error handling and token clearing on auth failure

## Backend Setup

### 1. Environment Variables
Create/update `.env` file in the backend directory:

```bash
MONGODB_URI=mongodb://localhost:27017/branch-tracker
PORT=5000
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_REFRESH_SECRET=your_secure_jwt_refresh_secret_key_here
NODE_ENV=development
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Start MongoDB
Ensure MongoDB is running on `localhost:27017`

### 4. Start Backend Server
```bash
npm start
```
Server will run on `http://localhost:5000`

## Frontend Setup

### 1. Environment Variables
Create `.env` file in the frontend directory:

```bash
VITE_API_URL=http://localhost:5000/api
```

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Start Frontend Development Server
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication Endpoints

#### Register
- **POST** `/api/auth/register`
- **Body**: `{ email, password, name }`
- **Response**: `{ accessToken, refreshToken, user }`

#### Login
- **POST** `/api/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ accessToken, refreshToken, user }`

#### Refresh Token
- **POST** `/api/auth/refresh`
- **Body**: `{ refreshToken }`
- **Response**: `{ accessToken, refreshToken }`

#### Get Current User
- **GET** `/api/auth/me`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response**: `{ _id, email, name, createdAt, updatedAt }`

#### Logout
- **POST** `/api/auth/logout`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response**: `{ message: "Logout successful" }`

### Branch Endpoints

#### Get All User's Branches
- **GET** `/api/branches`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response**: `[{ _id, userId, name, description, status, createdDate, lastModified }]`

#### Get Single Branch
- **GET** `/api/branches/:id`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response**: `{ _id, userId, name, description, status, createdDate, lastModified }`

#### Create Branch
- **POST** `/api/branches`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Body**: `{ name, description, status }`
- **Response**: `{ _id, userId, name, description, status, createdDate, lastModified }`

#### Update Branch
- **PUT** `/api/branches/:id`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Body**: `{ name, description, status }`
- **Response**: `{ _id, userId, name, description, status, createdDate, lastModified }`

#### Delete Branch
- **DELETE** `/api/branches/:id`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response**: `{ message: "Branch deleted successfully" }`

## Frontend Integration Details

### AuthContext (`frontend/src/lib/AuthContext.jsx`)
Provides authentication state and methods:
- `user`: Current user object
- `isAuthenticated`: Boolean flag
- `login(email, password)`: Login user
- `register(email, password, name)`: Register new user
- `logout()`: Logout user
- `isLoadingAuth`: Loading state during auth checks

### API Client (`frontend/src/api/client.js`)
Centralized API communication:
- Automatic token injection in headers
- Automatic token refresh on 401
- Error handling and token cleanup
- Methods for all endpoints

### Pages Integration

#### Login Page (`frontend/src/pages/Login.jsx`)
- Uses `useAuth().login()` to authenticate
- Stores tokens via `apiClient.setTokens()`
- Redirects to Dashboard on success

#### SignUp Page (`frontend/src/pages/SignUp.jsx`)
- Uses `useAuth().register()` to create account
- Stores tokens via `apiClient.setTokens()`
- Redirects to Dashboard on success

#### Dashboard Page (`frontend/src/pages/Dashboard.jsx`)
- Fetches user's branches via `apiClient.getBranches()`
- Uses React Query for caching and refetching
- Supports update and delete operations
- Real-time error handling with toast notifications

#### AddBranch Page (`frontend/src/pages/AddBranch.jsx`)
- Creates new branch via `apiClient.createBranch()`
- Form data is transformed to match backend schema
- Redirects to Dashboard on success

#### AdminView Page (`frontend/src/pages/AdminView.jsx`)
- Fetches all branches (same endpoint as Dashboard)
- Supports update and delete operations
- Shows all developers' branches

## Data Mapping

The frontend form uses different field names than the backend API. The APIClient automatically maps:

| Frontend Form | Backend API |
|---|---|
| `branch_name` | `name` |
| `changes_description` | `description` |
| `status` | `status` |
| `developer_name` | (not stored in DB, frontend only) |
| `parent_branch` | (not stored in DB, frontend only) |
| `has_jira_task` | (not stored in DB, frontend only) |
| `jira_link` | (not stored in DB, frontend only) |
| `merged_with_*` | (not stored in DB, frontend only) |

## Testing the Integration

### 1. Test Signup
1. Navigate to `http://localhost:5173/signup`
2. Fill in name, email, password
3. Click "Sign Up"
4. Should redirect to Dashboard
5. Check browser localStorage for `accessToken` and `refreshToken`

### 2. Test Login
1. Navigate to `http://localhost:5173/login`
2. Enter registered email and password
3. Click "Login"
4. Should redirect to Dashboard
5. Should display current user info

### 3. Test Create Branch
1. Navigate to `/AddBranch`
2. Fill in branch details
3. Click "Create Branch"
4. Should appear in Dashboard

### 4. Test Update Branch
1. In Dashboard, click edit on a branch
2. Modify details
3. Click "Update Branch"
4. Changes should be reflected

### 5. Test Delete Branch
1. In Dashboard, click delete on a branch
2. Confirm deletion
3. Branch should be removed from list

### 6. Test Token Refresh
1. Login to get tokens
2. Wait for accessToken to expire (15 minutes)
3. Make any API call
4. Should automatically refresh token
5. Request should succeed with new token

### 7. Test Logout
1. Click logout button
2. Should redirect to login
3. localStorage should be cleared
4. Tokens should be removed

## Troubleshooting

### CORS Errors
- Ensure backend has CORS enabled: `app.use(cors())`
- Check that frontend API URL matches backend URL

### 401 Unauthorized
- Check if accessToken is valid
- Verify token is being sent in Authorization header
- Check if JWT_SECRET matches between requests

### Token Not Refreshing
- Ensure JWT_REFRESH_SECRET is set in backend .env
- Check if refreshToken is stored in localStorage
- Verify refreshToken endpoint is working

### Branches Not Loading
- Ensure user is authenticated
- Check if accessToken is valid
- Verify MongoDB is running and connected
- Check browser console for error messages

## Security Notes

1. **Token Storage**: Tokens are stored in localStorage (consider using httpOnly cookies for production)
2. **Token Expiry**: AccessToken expires in 15 minutes, refreshToken in 7 days
3. **Password Hashing**: Passwords are hashed using bcryptjs before storage
4. **Authorization**: All branch endpoints require valid accessToken
5. **User Isolation**: Users can only access their own branches

## Next Steps

1. Add role-based access control (admin vs user)
2. Implement token rotation on refresh
3. Add request/response logging
4. Add rate limiting
5. Implement email verification
6. Add password reset functionality
7. Move tokens to httpOnly cookies
8. Add comprehensive error handling
