const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// MongoDB Connection
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://tathagat:Tathagat123@cluster0.8adckmm.mongodb.net/';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// User Schema
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
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin already exists with email: admin@gmail.com');
      console.log('   You can login with:');
      console.log('   Email: admin@gmail.com');
      console.log('   Password: Admin@12345');
      mongoose.connection.close();
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('Admin@12345', 10);

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@gmail.com',
      phoneNumber: '+91-9999999999',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      selectedCategory: 'CAT',
      selectedExam: 'CAT 2026'
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('   Email: admin@gmail.com');
    console.log('   Password: Admin@12345');
    console.log('\nYou can now login to the admin panel with these credentials.');

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

seedAdmin();
