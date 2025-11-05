# TathaGat Admin Panel - Quick Start Guide

**Yeh guide aapko step-by-step batayega ki admin panel ko kaise setup aur run karna hai.**

## 🎯 Pehle Samajh Lo (Overview)

Aapke paas 3 cheezon ko run karna padega:

1. **Frontend** (React) - User interface jo aap dekh sakte ho
2. **Backend** (Node.js) - Server jo database se data handle karta hai
3. **Database** (MongoDB) - Jo aapka sabhi data store karta hai

MongoDB pehle se hi setup hai, hume sirf frontend aur backend run karna hai.

## 📦 Step 1: Dependencies Install Karo

Terminal kholo aur yeh command run karo:

```bash
npm run install:all
```

Ya agar yeh kaam nahi aaye to:

```bash
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
```

Yeh packages download hoga. 2-3 minute lag sakta hai.

## 🚀 Step 2: Backend Server Shuru Karo

**New Terminal kholo** (Pehla terminal close mat karo) aur yeh likho:

```bash
node server.js
```

Aapko yeh message dikhai dena chahiye:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

Agar ye message aaaye to aapka backend theek se chal raha hai. **Isse running state mein rakhna hai.**

## 🖥️ Step 3: Frontend Server Shuru Karo

**Doosra new Terminal kholo** aur likho:

```bash
npm start
```

Ya:

```bash
npm run start:frontend
```

Frontend khud-se browser mein khul jayega `http://localhost:3003` pe.

Agar browser nahi khula to manually yeh URL type karo:
```
http://localhost:3003
```

## 📊 Step 4: Admin Panel Access Karo

1. Browser mein jao: `http://localhost:3003`
2. Admin section mein jao
3. Login karo (pehle admin user create karna padega - next section mein)

## 👤 Step 5: Admin User Create Karo (First Time)

Database mein pehla admin user create karna padega. Ye MongoDB mein direct add karna padega:

### Option A: MongoDB Atlas Web Portal Se

1. https://www.mongodb.com/cloud/atlas pe jao
2. Apna account login karo
3. "Browse Collections" click karo
4. **users** collection dhundho
5. "Insert Document" click karo
6. Yeh data paste karo:

```json
{
  "name": "Admin",
  "email": "admin@tathagat.com",
  "password": "$2a$10$your_hashed_password_here",
  "role": "admin",
  "isActive": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

**Password hash generate karne ke liye online tool use karo:**
- https://bcrypt.online
- "Password" field mein likho: `admin123`
- "Bcrypt" button click karo
- Generated hash ko copy karo
- Upar ke code mein paste karo

### Option B: Terminal se (Advanced)

Agar aapko Node.js ka knowledge hai:

```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 10))"
```

Yeh hash copy karke MongoDB mein paste karo.

## ✅ Step 6: Login Karo

Ab admin panel kholo aur login karo:
- **Email**: admin@tathagat.com
- **Password**: admin123

## 📋 Kya-Kya Dekh Sakte Ho Admin Panel Mein

### 1. **Dashboard** (`/admin/dashboard`)
   - Kitne users signup kiye
   - Kitne students, teachers, courses
   - Last 7 days mein kitni enrollments
   - Recent payments

### 2. **All Users** (`/admin/all-users`)
   - Sabhi students, teachers, admin dekho
   - Search karo (name, email se)
   - Filter karo (role se)

### 3. **All Students** (`/admin/all-students`)
   - Sabhi signup kiye hue students dekho
   - Unhe edit karo
   - Delete karo
   - Search aur paginate karo

### 4. **All Teachers** (`/admin/all-teachers`)
   - Teachers dekho
   - Naye teachers add karo
   - Edit/Delete karo

### 5. **Courses** 
   - Courses manage karo
   - Naye courses add karo

### 6. **Payments**
   - Payment history dekho
   - Revenue track karo

### 7. **More Features**
   - Mock Tests
   - Study Materials
   - Announcements
   - Discussions

## 🛑 Agar Kuch Problem Ho

### Problem: Backend port pe error aaaye

```
Error: EADDRINUSE: address already in use :::5000
```

**Solution**:
```bash
PORT=5001 node server.js
```

Yeh port 5001 pe server run karega.

### Problem: "Cannot connect to MongoDB"

1. Check karo internet connection theek hai
2. Apna MongoDB Atlas account kholo
3. Database URI verify karo yeh hai: `mongodb+srv://tathagat:Tathagat123@cluster0.8adckmm.mongodb.net/tathagat`

### Problem: Frontend aur backend se connection error

1. **Backend run ho raha hai?** Check karo http://localhost:5000 pe
2. **Frontend port 3003 pe khul raha hai?** Check karo http://localhost:3003 pe
3. Dono windows mein errors dekho

### Problem: Login ke baad admin page blank hai

1. Browser ka cache clear karo (Ctrl+Shift+Delete)
2. Terminal mein backend ke logs dekho
3. Backend ko restart karo

## 🎯 Sabhi Commands Ek Jagah

Agar aap dono Frontend aur Backend ek saath run karna chahte ho:

```bash
npm run dev:full
```

Yeh command ek saath dono start kar dega (agar `concurrently` install hai).

## 🔄 Har Din Kaise Use Karo

Har baar jab aap admin panel use karna chahte ho:

**Terminal 1:**
```bash
node server.js
```

**Terminal 2:**
```bash
npm start
```

**Browser:**
```
http://localhost:3003/admin/dashboard
```

## 📱 Features Explain Karte Hain

### **Dashboard**
Yeh home page hai. Yaha aapko sabhi stats dikhai dega:
- Total users (sab sign-ups)
- Students (sirf students)
- Teachers 
- Courses
- New enrollments (last 7 days)
- Revenue (last 7 days)

### **All Students** 
Yaha aap dekh sakte ho:
- Sabhi students jo sign-up kiye
- Search bar mein naam likho, wo filter ho jayega
- Next/Previous buttons se pagination
- Edit button se update karo
- Delete button se remove karo

### **Payments**
- Kaun sab payment kiye
- Kitna amount
- Pending ya Paid status

## 🔐 Security Tips

1. **Password change karo** - admin123 se different password set karo
2. **MongoDB password change karo** - MongoDB Atlas mein
3. **JWT_SECRET change karo** - `.env.backend` file mein

## 📞 Additional Help

- **Logs dekho** - Terminal mein jo error dikh rahe ho
- **Browser Console** - F12 daba kar errors dekho
- **MongoDB Atlas** - Database dekho collections mein
- **Documentation** - ADMIN_PANEL_README.md aur SETUP_GUIDE.md files dekho

## ✅ Checklist

```
[ ] Backend installed
[ ] Frontend installed
[ ] MongoDB URI check kiya
[ ] Backend server chalu hai
[ ] Frontend server chalu hai
[ ] MongoDB connection successful
[ ] Admin user created
[ ] Login successful
[ ] Dashboard load ho raha hai
[ ] Students dekh raha hain
```

---

**Aur koi problem ho to error messages dekho aur samajhne ki koshish karo. Zyada tar problems network ya port ke hote hain.**

**Happy Admin Panel usage! 🎉**
