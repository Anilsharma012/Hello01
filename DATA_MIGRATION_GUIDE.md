# Data Migration Guide

This guide explains how to migrate your existing login/signup data to the new MongoDB database and display it in the admin panel.

## 📋 Overview

You already have user signup/login data somewhere. We need to migrate this to MongoDB so it appears in the admin panel.

## Where is Your Existing Data?

### Check These Locations:

1. **Browser LocalStorage**
   - User data stored in browser
   - Lost when browser is cleared
   - Not suitable for admin panel

2. **Backend Database** (if you have one)
   - Existing user collection
   - Need to export and import

3. **Firebase/Third-party Service**
   - User auth system
   - Need to export user data

4. **CSV/JSON File**
   - If you exported data
   - Can be imported directly

## Migration Steps

### Step 1: Export Your Current User Data

#### From LocalStorage (Browser):

Open browser console (F12) and run:

```javascript
// Get all users from localStorage
const users = localStorage.getItem('users');
console.log(users);

// Or copy to clipboard
copy(JSON.parse(users));
```

This gives you all user data currently in localStorage.

#### From Backend (if you have existing one):

```bash
# Export from existing database
mongodump --uri "your_existing_mongodb_uri" --db yourDatabaseName --collection users --out ./backup
```

#### From CSV File:

```bash
# If you have users.csv, convert to JSON
npm install csv-parse
node convertCSV.js
```

**convertCSV.js:**
```javascript
const fs = require('fs');
const parse = require('csv-parse/lib/sync');

const input = fs.readFileSync('users.csv');
const records = parse(input, {columns: true});
console.log(JSON.stringify(records, null, 2));
```

### Step 2: Prepare Data in Correct Format

Your data should look like this:

```javascript
[
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "9876543210",
    "selectedCategory": "CAT",
    "selectedExam": "CAT 2024",
    "role": "student",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phoneNumber": "9876543211",
    "selectedCategory": "IPMAT",
    "selectedExam": "IPMAT 2024",
    "role": "student",
    "isActive": true,
    "createdAt": "2024-01-16T10:30:00Z"
  }
]
```

**Important Fields:**
- `name` - User's full name (required)
- `email` - User's email (required, must be unique)
- `phoneNumber` - Contact number (optional)
- `role` - 'student', 'teacher', or 'admin' (required)
- `selectedCategory` - Course category (optional)
- `selectedExam` - Exam name (optional)
- `createdAt` - Signup date (ISO format)

### Step 3: Hash Passwords (If You Have Them)

Before importing, hash all passwords:

```javascript
const bcrypt = require('bcryptjs');

function hashPassword(plainPassword) {
  return bcrypt.hashSync(plainPassword, 10);
}

// Add hashed passwords to your data
userData.forEach(user => {
  if (user.password) {
    user.password = hashPassword(user.password);
  }
});
```

### Step 4: Create Migration Script

Create `migrate.js` in your project root:

```javascript
const mongoose = require('mongoose');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// MongoDB Connection
const mongoUri = 'mongodb+srv://tathagat:Tathagat123@cluster0.8adckmm.mongodb.net/tathagat';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: String,
  password: String,
  selectedCategory: String,
  selectedExam: String,
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Migration Function
async function migrateUsers() {
  try {
    // Read your exported user data
    const userDataJSON = fs.readFileSync('./users.json', 'utf8');
    const users = JSON.parse(userDataJSON);

    console.log(`📥 Starting migration of ${users.length} users...`);

    for (const userData of users) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        // Hash password if it exists
        if (userData.password && userData.password.length < 60) {
          userData.password = bcrypt.hashSync(userData.password, 10);
        }

        // Create user in MongoDB
        const newUser = new User({
          name: userData.name || 'Unknown',
          email: userData.email,
          phoneNumber: userData.phoneNumber || '',
          password: userData.password || '',
          selectedCategory: userData.selectedCategory || '',
          selectedExam: userData.selectedExam || '',
          role: userData.role || 'student',
          isActive: userData.isActive !== false,
          createdAt: new Date(userData.createdAt) || new Date(),
          updatedAt: new Date()
        });

        await newUser.save();
        console.log(`✅ Migrated: ${userData.email}`);
      } else {
        console.log(`⏭️  Skipped: ${userData.email} (already exists)`);
      }
    }

    console.log('✅ Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

// Run migration
migrateUsers();
```

### Step 5: Prepare Your Data File

1. Save your exported users data as `users.json` in project root
2. File should be JSON array format (as shown in Step 2)

### Step 6: Run Migration

```bash
node migrate.js
```

You should see:
```
✅ Connected to MongoDB
📥 Starting migration of 150 users...
✅ Migrated: john@example.com
✅ Migrated: jane@example.com
...
✅ Migration complete!
```

### Step 7: Verify Migration

After migration completes:

1. Go to MongoDB Atlas dashboard
2. Navigate to your database
3. Go to "Browse Collections"
4. Click on "users" collection
5. You should see all your migrated users

### Step 8: Start Admin Panel

Now that data is migrated:

```bash
# Terminal 1
node server.js

# Terminal 2
npm start
```

Go to `/admin/all-students` and you should see all your migrated users!

## Handling Different Data Formats

### If You Have Firebase Users:

```javascript
// Export from Firebase
const admin = require('firebase-admin');

async function exportFirebaseUsers() {
  const users = [];
  let nextPageToken;

  do {
    const listUsersResult = await admin.auth().listUsers(100, nextPageToken);
    
    listUsersResult.users.forEach((user) => {
      users.push({
        name: user.displayName || 'Unknown',
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        role: 'student',
        isActive: !user.disabled,
        createdAt: user.metadata.creationTime,
        updatedAt: new Date()
      });
    });

    nextPageToken = listUsersResult.pageToken;
  } while (nextPageToken);

  return users;
}

// Export and save
const firebaseUsers = await exportFirebaseUsers();
const fs = require('fs');
fs.writeFileSync('./users.json', JSON.stringify(firebaseUsers, null, 2));
```

### If You Have CSV:

```bash
# Using a CSV to JSON tool online, or:
npm install csvtojson

node -e "
const csvToJson = require('csvtojson');
csvToJson()
 .fromFile('./users.csv')
 .then(jsonArray => {
   console.log(JSON.stringify(jsonArray, null, 2));
 })
"
```

## Common Issues During Migration

### Issue: Duplicate Email Error

**Cause**: Users already exist in MongoDB

**Solution**:
```javascript
// In migrate.js, skip existing users (already handled)
const existingUser = await User.findOne({ email: userData.email });
if (existingUser) {
  console.log(`Skipping ${userData.email} - already exists`);
  return;
}
```

### Issue: Invalid Date Format

**Cause**: Date format not recognized

**Solution**:
```javascript
// Convert different date formats
const convertDate = (dateString) => {
  try {
    return new Date(dateString);
  } catch {
    return new Date();
  }
};

userData.createdAt = convertDate(userData.createdAt);
```

### Issue: Missing Email Field

**Cause**: Email is required but not provided

**Solution**:
```javascript
// Generate email if missing
if (!userData.email) {
  userData.email = `user_${Date.now()}@tathagat.local`;
}
```

### Issue: Special Characters in Name

**Cause**: Name contains special characters

**Solution**: MongoDB handles special characters fine. No conversion needed.

## Verification Checklist

After migration, verify:

```
[ ] All users imported without errors
[ ] No duplicate emails in MongoDB
[ ] Passwords are hashed (start with $2a$)
[ ] Created dates are correct
[ ] Roles are set properly
[ ] Email is unique for each user
[ ] Name field is populated
[ ] Admin dashboard shows correct user count
[ ] Search functionality works
[ ] Pagination works
```

## Rollback (If Something Goes Wrong)

If migration failed or you want to rollback:

```javascript
// Delete all migrated users (careful!)
async function rollback() {
  const result = await User.deleteMany({
    email: { $regex: '@tathagat.local' } // Or another identifier
  });
  console.log(`Deleted ${result.deletedCount} users`);
}

rollback();
```

## Best Practices

1. **Always backup**: Export your data before migration
2. **Test with sample**: Migrate a few users first, verify, then do all
3. **Check duplicates**: Ensure no duplicate emails
4. **Verify after**: Check MongoDB dashboard after migration
5. **Keep original**: Keep original data backup for 30 days

## Next Steps

After successful migration:

1. ✅ All login/signup records are in MongoDB
2. ✅ Admin dashboard shows all users
3. ✅ Can search, filter, edit, delete users
4. ✅ Can track new signups in real-time

Enjoy your new admin panel! 🎉

---

**Questions? Check SETUP_GUIDE.md and ADMIN_PANEL_README.md for more info.**
