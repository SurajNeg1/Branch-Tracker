# Branch Tracker Backend

Express.js + MongoDB backend API for the Branch Tracker application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB connection string and JWT secret:
```
MONGODB_URI=mongodb://localhost:27017/branch-tracker
PORT=5000
JWT_SECRET=your_secure_secret_key
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Branches
- `GET /api/branches` - Get all branches for authenticated user
- `POST /api/branches` - Create a new branch
- `GET /api/branches/:id` - Get a specific branch
- `PUT /api/branches/:id` - Update a branch
- `DELETE /api/branches/:id` - Delete a branch

## Requirements

- Node.js 16+
- MongoDB 4.0+
- npm or yarn

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
