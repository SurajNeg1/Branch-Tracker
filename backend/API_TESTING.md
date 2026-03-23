# API Testing Guide

This document contains curl commands for testing all APIs locally.

## Base URL
```
http://localhost:5000
```

## Health Check

### Check if server is running
```bash
curl -X GET http://localhost:5000/api/health
```

---

## Authentication APIs

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

### 2. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

## Branch APIs

**Note:** All branch endpoints require authentication. Replace `YOUR_JWT_TOKEN` with the token received from login/register.

### 3. Get All Branches
```bash
curl -X GET http://localhost:5000/api/branches \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "name": "main",
    "description": "Main production branch",
    "status": "active",
    "createdDate": "2024-03-23T10:00:00.000Z",
    "lastModified": "2024-03-23T10:00:00.000Z",
    "createdAt": "2024-03-23T10:00:00.000Z",
    "updatedAt": "2024-03-23T10:00:00.000Z"
  }
]
```

---

### 4. Create a New Branch
```bash
curl -X POST http://localhost:5000/api/branches \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "feature/new-feature",
    "description": "New feature branch",
    "status": "active"
  }'
```

**Expected Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "name": "feature/new-feature",
  "description": "New feature branch",
  "status": "active",
  "createdDate": "2024-03-23T10:00:00.000Z",
  "lastModified": "2024-03-23T10:00:00.000Z",
  "createdAt": "2024-03-23T10:00:00.000Z",
  "updatedAt": "2024-03-23T10:00:00.000Z"
}
```

---

### 5. Get a Specific Branch
```bash
curl -X GET http://localhost:5000/api/branches/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "name": "feature/new-feature",
  "description": "New feature branch",
  "status": "active",
  "createdDate": "2024-03-23T10:00:00.000Z",
  "lastModified": "2024-03-23T10:00:00.000Z",
  "createdAt": "2024-03-23T10:00:00.000Z",
  "updatedAt": "2024-03-23T10:00:00.000Z"
}
```

---

### 6. Update a Branch
```bash
curl -X PUT http://localhost:5000/api/branches/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "feature/updated-feature",
    "description": "Updated feature branch",
    "status": "inactive"
  }'
```

**Expected Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "name": "feature/updated-feature",
  "description": "Updated feature branch",
  "status": "inactive",
  "createdDate": "2024-03-23T10:00:00.000Z",
  "lastModified": "2024-03-23T10:05:00.000Z",
  "createdAt": "2024-03-23T10:00:00.000Z",
  "updatedAt": "2024-03-23T10:05:00.000Z"
}
```

---

### 7. Delete a Branch
```bash
curl -X DELETE http://localhost:5000/api/branches/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "message": "Branch deleted successfully"
}
```

---

## Testing Workflow

1. **Register a new user** (Step 1)
2. **Copy the token** from the response
3. **Create a branch** (Step 4) using the token
4. **Get all branches** (Step 3) to verify creation
5. **Update the branch** (Step 6) with new data
6. **Get the specific branch** (Step 5) to verify update
7. **Delete the branch** (Step 7)
8. **Get all branches** again to verify deletion

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "All fields are required"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```

### 404 Not Found
```json
{
  "message": "Branch not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "Error details"
}
```
