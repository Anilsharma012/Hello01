const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://tathagat:Tathagat123@cluster0.8adckmm.mongodb.net/';

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

const User = mongoose.model('User', userSchema);

async function seedAdmin() {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@tathagat.com', role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('Admin@123456', 10);

    // Create admin user
    const admin = new User({
      name: 'Admin',
      email: 'admin@tathagat.com',
      phoneNumber: '9999999999',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@tathagat.com');
    console.log('🔑 Password: Admin@123456');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
