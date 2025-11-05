const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// MongoDB Connection
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://tathagat:Tathagat123@cluster0.8adckmm.mongodb.net/';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ============ Schemas ============

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  password: { type: String },
  selectedCategory: String,
  selectedExam: String,
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const courseSchema = new mongoose.Schema({
  name: String,
  description: String,
  instructor: mongoose.Schema.Types.ObjectId,
  price: Number,
  thumbnail: String,
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const enrollmentSchema = new mongoose.Schema({
  studentId: mongoose.Schema.Types.ObjectId,
  courseId: mongoose.Schema.Types.ObjectId,
  enrolledAt: { type: Date, default: Date.now },
  expiresAt: Date,
  status: { type: String, enum: ['active', 'expired', 'completed'], default: 'active' },
  progress: Number
});

const mockTestSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  duration: Number,
  totalQuestions: Number,
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const paymentSchema = new mongoose.Schema({
  studentId: mongoose.Schema.Types.ObjectId,
  courseId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  transactionId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const announcementSchema = new mongoose.Schema({
  title: String,
  content: String,
  type: String,
  priority: String,
  audience: String,
  isActive: { type: Boolean, default: true },
  createdBy: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now }
});

const studyMaterialSchema = new mongoose.Schema({
  title: String,
  description: String,
  subject: String,
  type: String,
  fileUrl: String,
  uploadedBy: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now }
});

const discussionSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  authorId: mongoose.Schema.Types.ObjectId,
  replies: [{ userId: mongoose.Schema.Types.ObjectId, content: String, createdAt: Date }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// Create models
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
const MockTest = mongoose.model('MockTest', mockTestSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const Announcement = mongoose.model('Announcement', announcementSchema);
const StudyMaterial = mongoose.model('StudyMaterial', studyMaterialSchema);
const Discussion = mongoose.model('Discussion', discussionSchema);

// ============ Middleware ============

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// ============ Routes ============

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API server is running' });
});

// ============ Student/Public Routes ============

// Get published courses for students
app.get('/api/courses/student/published-courses', async (req, res) => {
  try {
    const courses = await Course.find({ published: true })
      .select('name description price thumbnail instructor createdAt')
      .limit(20);

    res.json({
      success: true,
      courses: courses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Phone OTP endpoint
app.post('/api/auth/phone/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    // Generate a random OTP (in production, use a real SMS service like Twilio)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // For demo purposes, just return success
    // In production, send via SMS provider
    console.log(`OTP for ${phoneNumber}: ${otp}`);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      otp: otp // Remove in production!
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ Admin Routes ============

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'admin' });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
    
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ Dashboard Routes ============

app.get('/api/admin/dashboard', adminAuth, async (req, res) => {
  try {
    const now = new Date();
    const start7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalCourses = await Course.countDocuments({ published: true });
    const newEnrollments = await Enrollment.countDocuments({ enrolledAt: { $gte: start7 } });
    const recentPayments = await Payment.find({ createdAt: { $gte: start7 } }).limit(5);
    
    const revenue = recentPayments.reduce((sum, p) => sum + (p.status === 'paid' ? p.amount : 0), 0);

    res.json({
      success: true,
      metrics: {
        users: totalUsers,
        students: totalStudents,
        teachers: totalTeachers,
        courses: totalCourses,
        enroll7: newEnrollments,
        rev7: revenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ All Students Routes ============

app.get('/api/admin/students', adminAuth, async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const query = { role: 'student' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      students,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ All Teachers Routes ============

app.get('/api/admin/teachers', adminAuth, async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const query = { role: 'teacher' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const teachers = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      teachers,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create Teacher
app.post('/api/admin/teachers', adminAuth, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if teacher already exists
    const existingTeacher = await User.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = new User({
      name,
      email,
      password: hashedPassword,
      role: 'teacher'
    });

    await teacher.save();
    res.json({ success: true, teacher: teacher.toObject() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Teacher
app.put('/api/admin/teachers/:id', adminAuth, async (req, res) => {
  try {
    const { name, email, phoneNumber, selectedCategory, selectedExam } = req.body;

    const teacher = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phoneNumber, selectedCategory, selectedExam, updatedAt: Date.now() },
      { new: true }
    ).select('-password');

    res.json({ success: true, teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete Teacher
app.delete('/api/admin/teachers/:id', adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Teacher deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ All Users Routes ============

app.get('/api/admin/users', adminAuth, async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Student
app.put('/api/admin/students/:id', adminAuth, async (req, res) => {
  try {
    const { name, email, phoneNumber, selectedCategory, selectedExam } = req.body;
    
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phoneNumber, selectedCategory, selectedExam, updatedAt: Date.now() },
      { new: true }
    ).select('-password');

    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete Student
app.delete('/api/admin/students/:id', adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ Courses Routes ============

app.get('/api/admin/courses', adminAuth, async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const courses = await Course.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      courses,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/admin/courses', adminAuth, async (req, res) => {
  try {
    const { name, description, price, thumbnail } = req.body;

    const course = new Course({
      name,
      description,
      price,
      thumbnail,
      instructor: req.user._id
    });

    await course.save();
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle Publish Course (MUST come before generic :id route)
app.put('/api/admin/courses/:id/toggle-publish', adminAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    course.published = !course.published;
    course.updatedAt = Date.now();
    await course.save();

    res.json({
      success: true,
      message: course.published ? 'Course published' : 'Course unpublished',
      course
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Course
app.put('/api/admin/courses/:id', adminAuth, async (req, res) => {
  try {
    const { name, description, price, thumbnail } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { name, description, price, thumbnail, updatedAt: Date.now() },
      { new: true }
    );

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete Course
app.delete('/api/admin/courses/:id', adminAuth, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ Mock Tests Routes ============

app.get('/api/admin/mock-tests', adminAuth, async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (category) query.category = category;

    const mockTests = await MockTest.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await MockTest.countDocuments(query);

    res.json({
      success: true,
      mockTests,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ Announcements Routes ============

app.get('/api/admin/announcements', adminAuth, async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (type) query.type = type;

    const announcements = await Announcement.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Announcement.countDocuments(query);

    res.json({
      success: true,
      announcements,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/admin/announcements', adminAuth, async (req, res) => {
  try {
    const announcement = new Announcement({ ...req.body, createdBy: req.user._id });
    await announcement.save();
    res.json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ Study Materials Routes ============

app.get('/api/admin/study-materials', adminAuth, async (req, res) => {
  try {
    const { subject, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (subject) query.subject = subject;

    const materials = await StudyMaterial.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await StudyMaterial.countDocuments(query);

    res.json({
      success: true,
      materials,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ Discussions Routes ============

app.get('/api/admin/discussions', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) query.status = status;

    const discussions = await Discussion.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Discussion.countDocuments(query);

    res.json({
      success: true,
      discussions,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ Payments Routes ============

app.get('/api/admin/payments', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate('studentId', 'name email')
      .populate('courseId', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      payments,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ Start Server ============

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
