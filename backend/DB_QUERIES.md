# Database Queries Documentation

This document tracks all MongoDB queries used in each API endpoint.

---

## Authentication APIs

### 1. Register User
**Endpoint:** `POST /api/auth/register`  
**File:** `routes/auth.js`

**Queries:**
```javascript
// Check if user already exists
User.findOne({ email })

// Create new user (password is hashed before saving)
new User({ email, password, name }).save()
```

**Database Operations:**
- **Read:** 1 query (findOne)
- **Write:** 1 query (save/insert)

---

### 2. Login User
**Endpoint:** `POST /api/auth/login`  
**File:** `routes/auth.js`

**Queries:**
```javascript
// Find user by email
User.findOne({ email })

// Compare password (in-memory operation, not a DB query)
user.comparePassword(password)
```

**Database Operations:**
- **Read:** 1 query (findOne)
- **Write:** 0 queries

---

## Branch APIs

### 3. Get All Branches
**Endpoint:** `GET /api/branches`  
**File:** `routes/branches.js`  
**Auth Required:** Yes

**Queries:**
```javascript
// Find all branches for authenticated user
Branch.find({ userId: req.userId })
```

**Database Operations:**
- **Read:** 1 query (find)
- **Write:** 0 queries

---

### 4. Create a New Branch
**Endpoint:** `POST /api/branches`  
**File:** `routes/branches.js`  
**Auth Required:** Yes

**Queries:**
```javascript
// Create new branch
new Branch({
  userId: req.userId,
  name,
  description,
  status: status || 'active',
}).save()
```

**Database Operations:**
- **Read:** 0 queries
- **Write:** 1 query (save/insert)

---

### 5. Get a Specific Branch
**Endpoint:** `GET /api/branches/:id`  
**File:** `routes/branches.js`  
**Auth Required:** Yes

**Queries:**
```javascript
// Find branch by ID and verify ownership
Branch.findOne({
  _id: req.params.id,
  userId: req.userId,
})
```

**Database Operations:**
- **Read:** 1 query (findOne with two conditions)
- **Write:** 0 queries

---

### 6. Update a Branch
**Endpoint:** `PUT /api/branches/:id`  
**File:** `routes/branches.js`  
**Auth Required:** Yes

**Queries:**
```javascript
// Find and update branch
Branch.findOneAndUpdate(
  { _id: req.params.id, userId: req.userId },
  { name, description, status, lastModified: Date.now() },
  { new: true }
)
```

**Database Operations:**
- **Read:** 1 query (findOneAndUpdate - atomic operation)
- **Write:** 1 query (update)

---

### 7. Delete a Branch
**Endpoint:** `DELETE /api/branches/:id`  
**File:** `routes/branches.js`  
**Auth Required:** Yes

**Queries:**
```javascript
// Find and delete branch
Branch.findOneAndDelete({
  _id: req.params.id,
  userId: req.userId,
})
```

**Database Operations:**
- **Read:** 1 query (findOneAndDelete - atomic operation)
- **Write:** 1 query (delete)

---

## Query Summary Table

| Endpoint | Method | Auth | Reads | Writes | Key Conditions |
|----------|--------|------|-------|--------|-----------------|
| /auth/register | POST | No | 1 | 1 | email (unique) |
| /auth/login | POST | No | 1 | 0 | email |
| /branches | GET | Yes | 1 | 0 | userId |
| /branches | POST | Yes | 0 | 1 | userId |
| /branches/:id | GET | Yes | 1 | 0 | _id, userId |
| /branches/:id | PUT | Yes | 1 | 1 | _id, userId |
| /branches/:id | DELETE | Yes | 1 | 1 | _id, userId |

---

## Indexes Recommended

For optimal query performance, create these indexes in MongoDB:

```javascript
// User collection
db.users.createIndex({ email: 1 }, { unique: true })

// Branch collection
db.branches.createIndex({ userId: 1 })
db.branches.createIndex({ userId: 1, _id: 1 })
```

---

## Query Optimization Notes

1. **User Registration:** Checks for duplicate email before inserting - prevents duplicate entries
2. **Branch Operations:** All queries filter by `userId` to ensure data isolation between users
3. **Atomic Operations:** `findOneAndUpdate` and `findOneAndDelete` are atomic, preventing race conditions
4. **Password Hashing:** Done in-memory using bcryptjs, not in database
5. **JWT Verification:** Done in middleware, not in database

---

## Future Query Considerations

- Add pagination to `GET /branches` for large datasets
- Add filtering/sorting options to branch queries
- Consider caching frequently accessed branches
- Add transaction support if multi-document operations are needed
