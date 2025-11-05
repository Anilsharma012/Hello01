# TathaGat Admin Panel - Complete Documentation

This document provides a complete guide to the admin panel implementation with MongoDB integration.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Quick Start](#quick-start)
4. [Architecture](#architecture)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Admin Panel Pages](#admin-panel-pages)
8. [Authentication](#authentication)
9. [Troubleshooting](#troubleshooting)

## 📊 Overview

The TathaGat Admin Panel is a comprehensive management system built with:
- **Frontend**: React with Modern UI
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Authentication**: JWT

All login/signup records are automatically stored in MongoDB and accessible through the admin dashboard.

## ✨ Features

### Dashboard
- Real-time metrics showing:
  - Total Users (all sign-ups)
  - Total Students
  - Total Teachers
  - Total Courses
  - New Enrollments (last 7 days)
  - Revenue (last 7 days)
- Recent payments table
- Quick action buttons

### Student Management
- View all registered students (all signup records)
- Search students by name, email, or phone
- Edit student information
- Delete student accounts
- Pagination support
- Filter and sort capabilities

### Teacher Management
- View all registered teachers
- Create new teacher accounts
- Edit teacher information
- Delete teacher accounts
- Search and filter

### User Management
- View all users by role (student, teacher, admin)
- Filter by role
- Search by name or email
- View signup/login records

### Course Management
- Create courses
- View all courses
- Manage course details
- Track course enrollment

### Mock Test Management
- Manage mock test series
- Create and edit tests
- Track test attempts
- Manage questions

### Announcements
- Create announcements
- Manage announcements
- Set priorities and audiences
- Filter by type

### Study Materials
- Upload study materials
- Organize by subject
- Filter by subject and type

### Discussions
- Manage forum discussions
- Approve/reject discussions
- Manage discussion statuses

### Payments
- Track all payments
- Filter by status
- View payment history
- Revenue analytics

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run install:all
```

Or install separately:

```bash
# Frontend dependencies (already installed)
npm install

# Backend dependencies
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
```

### Step 2: Start Backend Server

Open a terminal and run:

```bash
# Option 1: Run backend alone
node server.js

# Option 2: Run with auto-reload (development)
npx nodemon server.js
```

Backend will start on: **http://localhost:5000**

### Step 3: Start Frontend Server

Open another terminal and run:

```bash
npm start
# OR
npm run start:frontend
```

Frontend will start on: **http://localhost:3003**

### Step 4: Run Both Concurrently

```bash
npm run dev:full
```

This starts both frontend and backend in parallel.

### Step 5: Access Admin Panel

1. Open browser: `http://localhost:3003`
2. Navigate to: `/admin/dashboard`
3. Use admin login credentials

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│         React Frontend              │
│      (Port: 3003)                   │
│  - Admin Dashboard                  │
│  - User Management                  │
│  - Course Management                │
│  - Content Management               │
└────────────┬────────────────────────┘
             │ HTTP/REST API
             │ (axios)
             │
┌────────────▼────────────────────────┐
│      Node.js/Express Backend        │
│      (Port: 5000)                   │
│  - API Routes                       │
│  - JWT Authentication               │
│  - Data Validation                  │
│  - Business Logic                   │
└────────────┬────────────────────────┘
             │ MongoDB Driver
             │
┌────────────▼────────────────────────┐
│      MongoDB Atlas Cloud            │
│  - User Collections                 │
│  - Course Data                      │
│  - Enrollment Records               │
│  - Payment Tracking                 │
└─────────────────────────────────────┘
```

## 🗄️ Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  phoneNumber: String,
  password: String (hashed, bcryptjs),
  selectedCategory: String,
  selectedExam: String,
  role: String (enum: 'student', 'teacher', 'admin'),
  isActive: Boolean (default: true),
  lastLogin: Date,
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

### Courses Collection

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  instructor: ObjectId (reference to User),
  price: Number,
  published: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Enrollments Collection

```javascript
{
  _id: ObjectId,
  studentId: ObjectId (reference to User),
  courseId: ObjectId (reference to Course),
  enrolledAt: Date,
  expiresAt: Date,
  status: String (enum: 'active', 'expired', 'completed'),
  progress: Number (0-100)
}
```

### Payments Collection

```javascript
{
  _id: ObjectId,
  studentId: ObjectId (reference to User),
  courseId: ObjectId (reference to Course),
  amount: Number,
  status: String (enum: 'pending', 'paid', 'failed'),
  transactionId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Announcements Collection

```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  type: String,
  priority: String,
  audience: String,
  isActive: Boolean (default: true),
  createdBy: ObjectId (reference to User),
  createdAt: Date
}
```

### StudyMaterials Collection

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  subject: String,
  type: String,
  fileUrl: String,
  uploadedBy: ObjectId (reference to User),
  createdAt: Date
}
```

### Discussions Collection

```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  category: String,
  authorId: ObjectId (reference to User),
  replies: Array<{userId, content, createdAt}>,
  status: String (enum: 'pending', 'approved', 'rejected'),
  createdAt: Date
}
```

## 📡 API Documentation

### Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

### Dashboard

#### Get Dashboard Metrics
```
GET /api/admin/dashboard
Headers: Authorization: Bearer <token>

Response:
{
  success: true,
  metrics: {
    users: 150,
    students: 120,
    teachers: 15,
    courses: 8,
    enroll7: 12,
    rev7: 50000
  }
}
```

### Students

#### Get All Students
```
GET /api/admin/students?page=1&search=&limit=20
Headers: Authorization: Bearer <token>

Response:
{
  success: true,
  students: [...],
  total: 120,
  page: 1,
  pages: 6
}
```

#### Update Student
```
PUT /api/admin/students/:id
Headers: Authorization: Bearer <token>

Body:
{
  name: "John Doe",
  email: "john@example.com",
  phoneNumber: "9876543210",
  selectedCategory: "CAT",
  selectedExam: "CAT 2024"
}

Response:
{
  success: true,
  student: {...}
}
```

#### Delete Student
```
DELETE /api/admin/students/:id
Headers: Authorization: Bearer <token>

Response:
{
  success: true,
  message: "Student deleted"
}
```

### Teachers

#### Get All Teachers
```
GET /api/admin/teachers?page=1&search=&limit=20
Headers: Authorization: Bearer <token>

Response:
{
  success: true,
  teachers: [...],
  total: 15,
  page: 1,
  pages: 1
}
```

#### Create Teacher
```
POST /api/admin/teachers
Headers: Authorization: Bearer <token>

Body:
{
  name: "Teacher Name",
  email: "teacher@example.com",
  password: "securepassword123"
}

Response:
{
  success: true,
  teacher: {...}
}
```

#### Update Teacher
```
PUT /api/admin/teachers/:id
Headers: Authorization: Bearer <token>

Body:
{
  name: "Updated Name",
  email: "newemail@example.com"
}

Response:
{
  success: true,
  teacher: {...}
}
```

#### Delete Teacher
```
DELETE /api/admin/teachers/:id
Headers: Authorization: Bearer <token>

Response:
{
  success: true,
  message: "Teacher deleted"
}
```

### Users

#### Get All Users
```
GET /api/admin/users?page=1&search=&role=&limit=20
Headers: Authorization: Bearer <token>

Response:
{
  success: true,
  users: [...],
  total: 150,
  page: 1,
  pages: 8
}
```

### Courses

#### Get All Courses
```
GET /api/admin/courses?page=1&search=&limit=20
Headers: Authorization: Bearer <token>

Response:
{
  success: true,
  courses: [...],
  total: 8,
  page: 1,
  pages: 1
}
```

#### Create Course
```
POST /api/admin/courses
Headers: Authorization: Bearer <token>

Body:
{
  name: "CAT 2024 Complete",
  description: "Complete CAT preparation course",
  price: 9999,
  published: true
}

Response:
{
  success: true,
  course: {...}
}
```

### Payments

#### Get All Payments
```
GET /api/admin/payments?page=1&status=&limit=20
Headers: Authorization: Bearer <token>

Response:
{
  success: true,
  payments: [...],
  total: 150,
  page: 1,
  pages: 8
}
```

### Announcements

#### Get All Announcements
```
GET /api/admin/announcements?page=1&type=&limit=20
Headers: Authorization: Bearer <token>

Response:
{
  success: true,
  announcements: [...],
  total: 25,
  page: 1,
  pages: 2
}
```

#### Create Announcement
```
POST /api/admin/announcements
Headers: Authorization: Bearer <token>

Body:
{
  title: "New Course Available",
  content: "Check out our new CAT course",
  type: "course",
  priority: "high",
  audience: "all"
}

Response:
{
  success: true,
  announcement: {...}
}
```

### Study Materials

#### Get Study Materials
```
GET /api/admin/study-materials?page=1&subject=&limit=20
Headers: Authorization: Bearer <token>

Response:
{
  success: true,
  materials: [...],
  total: 50,
  page: 1,
  pages: 3
}
```

### Discussions

#### Get Discussions
```
GET /api/admin/discussions?page=1&status=&limit=20
Headers: Authorization: Bearer <token>

Response:
{
  success: true,
  discussions: [...],
  total: 100,
  page: 1,
  pages: 5
}
```

## 📄 Admin Panel Pages

### 1. Dashboard (`/admin/dashboard`)
Real-time overview of system metrics and recent activity.

### 2. All Users (`/admin/all-users`)
View all registered users with filtering by role.

### 3. All Students (`/admin/all-students`)
Complete list of student signups with search and pagination.

### 4. All Teachers (`/admin/all-teachers`)
Manage teacher accounts with create/edit/delete functionality.

### 5. Courses (`/admin/view-courses`)
View and manage courses.

### 6. Mock Tests (`/admin/mock-tests`)
Manage mock test series and tests.

### 7. Study Materials (`/admin/study-materials`)
Upload and manage study materials.

### 8. Announcements (`/admin/announcements`)
Create and manage announcements.

### 9. Discussions (`/admin/discussions`)
Moderate forum discussions.

### 10. Payments (`/admin/payments`)
Track payment history and analytics.

### 11. CRM Leads (`/admin/crm/leads`)
Manage CRM leads and pipeline.

## 🔐 Authentication

### Admin Login Process

1. Admin navigates to `/admin` or `/admin/login`
2. Provides email and password
3. Backend validates credentials against User collection (role: 'admin')
4. JWT token is generated and stored in localStorage
5. Token is sent with every subsequent API request

### Token Storage

```javascript
localStorage.adminToken = jwt_token
localStorage.user = JSON.stringify(admin_user_object)
```

### JWT Structure

```
Header: {alg: "HS256", typ: "JWT"}
Payload: {
  id: "user_id",
  iat: timestamp,
  exp: timestamp (24 hours)
}
```

## 🔧 Troubleshooting

### Issue: Backend connection error

**Solution**:
1. Check if backend server is running on port 5000
2. Verify MongoDB URI in `.env.backend`
3. Check internet connection
4. Restart the backend server

### Issue: "Admin access required" error

**Solution**:
1. Verify user role is set to 'admin' in database
2. Check token expiration (24 hours)
3. Clear localStorage and login again
4. Verify JWT_SECRET matches on backend

### Issue: CORS errors

**Solution**:
- Backend has CORS enabled by default
- Check that frontend is running on port 3003
- Restart backend server

### Issue: Port conflicts

**Solution**:
```bash
# Change backend port
PORT=5001 node server.js

# Change frontend port
PORT=3004 npm start
```

### Issue: MongoDB connection fails

**Solution**:
1. Verify MongoDB Atlas account is active
2. Check IP whitelist in MongoDB Atlas
3. Verify network connectivity
4. Test URI separately with mongosh

### Issue: Data not showing in admin panel

**Solution**:
1. Verify data exists in MongoDB
2. Check API endpoints are correct
3. Verify admin token is valid
4. Check browser console for errors
5. Check backend server logs

## 📱 Responsive Design

The admin panel is fully responsive and works on:
- Desktop browsers (1920px and above)
- Tablets (768px - 1024px)
- Mobile phones (below 768px)

## 🎨 Styling

- Uses modern CSS with flexbox and grid
- Dark theme optimized for long admin sessions
- Consistent color scheme across panels
- Accessible contrast ratios
- Smooth transitions and animations

## 🔄 Data Sync

All data is synced in real-time:
- Dashboard refreshes every 30 seconds
- User lists load from backend on page visit
- Changes apply immediately after submission
- Pagination and search work in real-time

## 📝 Logs and Monitoring

Backend logs all:
- Database connections
- API requests
- Errors and exceptions
- Authentication attempts
- Data modifications

Check logs in terminal where backend is running.

## 🚀 Production Deployment

Before deploying to production:

1. **Security**:
   - Change JWT_SECRET to random string
   - Enable HTTPS
   - Set strong MongoDB password
   - Implement rate limiting

2. **Database**:
   - Set NODE_ENV=production
   - Configure backup schedule
   - Enable MongoDB encryption
   - Whitelist production IP addresses

3. **Monitoring**:
   - Set up error logging service
   - Configure performance monitoring
   - Set up automated backups
   - Configure alerts for errors

4. **Performance**:
   - Enable database indexing
   - Implement caching
   - Use CDN for static assets
   - Optimize API responses

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [JWT Handbook](https://auth0.com/resources/ebooks/jwt-handbook)

## ✅ Checklist

Before going live:

- [ ] Backend server running
- [ ] MongoDB connection verified
- [ ] Admin user created in database
- [ ] JWT_SECRET configured
- [ ] CORS configured
- [ ] All API endpoints tested
- [ ] Frontend and backend connected
- [ ] Admin login working
- [ ] All dashboard metrics displaying
- [ ] Student records visible
- [ ] Create/Edit/Delete operations working
- [ ] Search and pagination functional
- [ ] Error handling implemented
- [ ] Logs configured
- [ ] Security measures in place

## 📞 Support

For issues or questions, refer to:
1. Server logs for backend errors
2. Browser console for frontend errors
3. MongoDB Atlas dashboard for data issues
4. This documentation for API reference

---

**Last Updated**: 2024
**Version**: 1.0.0
