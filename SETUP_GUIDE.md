# TathaGat Admin Panel Setup Guide

This guide explains how to set up and run the complete admin panel with MongoDB integration.

## Prerequisites

- Node.js (v14+)
- MongoDB Atlas Account (already configured with provided URI)
- npm or yarn package manager

## Project Structure

```
project-root/
├── src/                          # Frontend React code
├── server.js                      # Backend Express server
├── package.json                   # Frontend dependencies
├── package-backend.json           # Backend dependencies
├── .env.backend                   # Backend environment variables
└── SETUP_GUIDE.md                # This file
```

## Step 1: Backend Setup

### 1.1 Install Backend Dependencies

First, install the required packages for the backend server.

```bash
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
# OR if you want to run backend in development with auto-reload:
npm install --save-dev nodemon
```

The dependencies are:
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **cors**: Enable cross-origin requests
- **dotenv**: Load environment variables
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **nodemon** (dev): Auto-reload on file changes

### 1.2 Create Backend Environment File

Create a `.env.backend` file in the project root:

```env
MONGO_URI=mongodb+srv://tathagat:Tathagat123@cluster0.8adckmm.mongodb.net/tathagat
PORT=5000
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

Or if you prefer using the default (without .env file):
The backend will use the MONGO_URI from package.json scripts or system environment.

## Step 2: Frontend Setup

### 2.1 Update Frontend Configuration

The frontend is already configured to use the backend. No changes needed unless you want to change the backend URL.

### 2.2 Frontend Environment (Optional)

Create a `.env` file in the root if you need custom API URL:

```env
REACT_APP_API_URL=http://localhost:5000
```

## Step 3: Running the Application

### Option A: Run Frontend and Backend Separately

**Terminal 1 - Backend:**
```bash
node server.js
# OR with auto-reload in development:
npx nodemon server.js
```

Backend will start on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm start
# OR
npm run start:frontend
```

Frontend will start on: `http://localhost:3003`

### Option B: Run Both Concurrently

If you have `concurrently` installed (already in package.json):

```bash
npm run dev:full
```

This will start both frontend and backend in parallel.

## Step 4: Database Initialization

The MongoDB database will be created automatically when the server starts and receives the first request.

### Collections Created:
- **users**: Stores all user data (students, teachers, admins)
- **courses**: Course information
- **enrollments**: Student course enrollments
- **mock_tests**: Mock test series and tests
- **payments**: Payment records
- **announcements**: Admin announcements
- **study_materials**: Study material uploads
- **discussions**: Forum discussions

## Step 5: Admin Panel Access

1. Open `http://localhost:3003` in your browser
2. Navigate to the admin panel at `/admin/dashboard`
3. Use the admin login to access features

## API Endpoints

### Dashboard
- `GET /api/admin/dashboard` - Get dashboard metrics

### Students (Login Records)
- `GET /api/admin/students?page=1&search=&limit=20` - List all students
- `PUT /api/admin/students/:id` - Update student
- `DELETE /api/admin/students/:id` - Delete student

### Teachers
- `GET /api/admin/teachers?page=1&limit=20` - List all teachers

### All Users
- `GET /api/admin/users?role=&search=&page=1&limit=20` - List all users by role

### Courses
- `GET /api/admin/courses?search=&page=1&limit=20` - List courses
- `POST /api/admin/courses` - Create course

### Mock Tests
- `GET /api/admin/mock-tests?category=&page=1&limit=20` - List mock tests

### Announcements
- `GET /api/admin/announcements?type=&page=1&limit=20` - List announcements
- `POST /api/admin/announcements` - Create announcement

### Study Materials
- `GET /api/admin/study-materials?subject=&page=1&limit=20` - List materials

### Discussions
- `GET /api/admin/discussions?status=&page=1&limit=20` - List discussions

### Payments
- `GET /api/admin/payments?status=&page=1&limit=20` - List payments

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Token is obtained from admin login and stored in `localStorage.adminToken`.

## Common Issues and Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution**: 
- Verify MongoDB URI in `.env.backend`
- Check MongoDB Atlas network access (whitelist your IP)
- Ensure internet connection is stable

### Issue: "CORS errors"
**Solution**: Backend already has CORS enabled, but if you see errors:
- Check that backend is running on port 5000
- Verify frontend is calling correct API URL

### Issue: "Admin token not working"
**Solution**:
- Clear browser localStorage and login again
- Check that JWT_SECRET in backend matches the one used to generate token
- Verify token hasn't expired (24 hours)

### Issue: "Port already in use"
**Solution**:
- Backend port 5000: `PORT=5001 npm run dev` (change port)
- Frontend port 3003: Check `package.json` for PORT setting

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  phoneNumber: String,
  password: String (hashed),
  selectedCategory: String,
  selectedExam: String,
  role: 'student' | 'teacher' | 'admin',
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Course
```javascript
{
  name: String,
  description: String,
  instructor: ObjectId,
  price: Number,
  published: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Enrollment
```javascript
{
  studentId: ObjectId,
  courseId: ObjectId,
  enrolledAt: Date,
  expiresAt: Date,
  status: 'active' | 'expired' | 'completed',
  progress: Number (0-100)
}
```

### Payment
```javascript
{
  studentId: ObjectId,
  courseId: ObjectId,
  amount: Number,
  status: 'pending' | 'paid' | 'failed',
  transactionId: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Features Implemented

✅ Admin Dashboard with key metrics
✅ All Students view with search and pagination
✅ All Teachers view
✅ All Users view
✅ Edit/Delete student functionality
✅ Course management
✅ Mock test management
✅ Announcements management
✅ Study materials management
✅ Discussion forum management
✅ Payment tracking
✅ JWT authentication
✅ Admin role verification

## Next Steps

1. Update the seed data or manually add users through API
2. Implement more admin features as needed
3. Add file upload functionality for study materials
4. Implement email notifications
5. Add advanced analytics and reporting
6. Set up automated backups for MongoDB

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review MongoDB Atlas documentation
3. Check Express and Mongoose documentation
4. Review server.js for API implementation details

## Production Deployment

Before deploying to production:

1. Change JWT_SECRET to a strong random string
2. Set NODE_ENV=production
3. Use HTTPS
4. Implement rate limiting
5. Add request validation
6. Set up proper error logging
7. Configure CORS for production domain
8. Use environment variables for all sensitive data
9. Set up MongoDB Atlas IP whitelist for production server
10. Implement database backups

## Database Backup

MongoDB Atlas provides automated backups. To restore:
1. Go to MongoDB Atlas Dashboard
2. Navigate to Backups
3. Select restore point
4. Choose restore method

For manual backups using mongodump:
```bash
mongodump --uri "mongodb+srv://tathagat:Tathagat123@cluster0.8adckmm.mongodb.net/tathagat"
```
