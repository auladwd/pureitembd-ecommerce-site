# 🚀 Quick Start Guide - MiniShop Grocery Store

## সমস্যা সমাধান / Problem: "No products showing"

যদি UI তে কোন পণ্য বা ব্যানার না দেখায়, তাহলে নিচের ধাপগুলো অনুসরণ করুন:

## ✅ Step-by-Step Setup

### 1️⃣ MongoDB সেটআপ চেক করুন

`.env` ফাইলে MongoDB connection string আছে কিনা দেখুন:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/minishop?retryWrites=true&w=majority
```

**Test করুন:**

- MongoDB Atlas এ লগইন করুন
- Database Access চেক করুন
- Network Access এ আপনার IP whitelisted আছে কিনা দেখুন

### 2️⃣ Firebase সেটআপ চেক করুন

`.env` ফাইলে সব Firebase credentials আছে কিনা:

```env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourKey\n-----END PRIVATE KEY-----\n"
```

### 3️⃣ Admin Email সেট করুন

`.env` ফাইলে আপনার Google email যোগ করুন:

```env
ADMIN_EMAILS=your.email@gmail.com
```

⚠️ **Important**: এই email দিয়েই Google login করতে হবে!

### 4️⃣ Development Server চালান

```bash
npm install
npm run dev
```

Server চলছে কিনা দেখুন: http://localhost:3000

### 5️⃣ Google দিয়ে Sign In করুন

1. Home page এ "Sign In" বাটনে ক্লিক করুন
2. আপনার admin email দিয়ে Google login করুন
3. Login সফল হলে আপনার নাম/ছবি navbar এ দেখাবে

### 6️⃣ Admin Panel এ যান

Browser এ টাইপ করুন: `http://localhost:3000/admin`

যদি সঠিকভাবে admin হিসেবে login করে থাকেন, তাহলে admin dashboard দেখতে পাবেন।

### 7️⃣ Seed Demo Data

Admin dashboard এ:

1. **"Seed Demo Data"** বাটনে ক্লিক করুন
2. Confirm করুন
3. সফল হলে success message দেখাবে

### 8️⃣ Home Page Refresh করুন

`http://localhost:3000` এ ফিরে যান এবং refresh করুন।

এখন আপনি দেখতে পাবেন:

- ✅ 3টি ব্যানার slider এ
- ✅ 16টি গ্রোসারি পণ্য grid এ

---

## 🔍 Troubleshooting

### সমস্যা: "No products available"

**কারণ:**

- Database এ এখনও কোন পণ্য নেই
- Seed data চালানো হয়নি

**সমাধান:**

- Admin হিসেবে login করুন
- `/admin` পেজে যান
- "Seed Demo Data" ক্লিক করুন

### সমস্যা: "Cannot access /admin"

**কারণ:**

- আপনি admin নন
- ADMIN_EMAILS এ আপনার email নেই

**সমাধান:**

1. `.env` ফাইল খুলুন
2. `ADMIN_EMAILS` এ আপনার Google email যোগ করুন
3. Server restart করুন (`Ctrl+C` তারপর `npm run dev`)
4. Sign out করুন এবং আবার sign in করুন

### সমস্যা: "Firebase error" বা "Authentication failed"

**কারণ:**

- Firebase credentials ভুল
- Firebase Authentication enable করা নেই

**সমাধান:**

1. Firebase Console এ যান
2. Authentication → Sign-in method
3. Google provider enable করুন
4. Authorized domains এ `localhost` যোগ করুন

### সমস্যা: "MongoDB connection failed"

**কারণ:**

- Connection string ভুল
- IP whitelist করা নেই
- Database user এর permission নেই

**সমাধান:**

1. MongoDB Atlas এ যান
2. Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
3. Database Access → User এর Read/Write permission আছে কিনা চেক করুন
4. Connection string copy করে `.env` এ paste করুন

---

## 📊 Verify Everything is Working

### ✅ Checklist:

- [ ] `npm run dev` চলছে কোন error ছাড়া
- [ ] http://localhost:3000 খুলছে
- [ ] Google login কাজ করছে
- [ ] `/admin` পেজ access করতে পারছি
- [ ] "Seed Demo Data" সফল হয়েছে
- [ ] Home page এ 16টি পণ্য দেখাচ্ছে
- [ ] Banner slider কাজ করছে
- [ ] Product card এ ক্লিক করলে details page খুলছে

---

## 🎯 Next Steps

সব কিছু কাজ করলে:

1. **Products Manage করুন:**
   - `/admin/products` এ যান
   - Edit, Delete, বা নতুন product যোগ করুন

2. **Banners Manage করুন:**
   - `/admin/banners` এ যান
   - নতুন banner যোগ করুন বা edit করুন

3. **Test Shopping Flow:**
   - Home page থেকে product select করুন
   - Cart এ add করুন
   - Checkout করুন
   - Payment slip submit করুন

4. **Orders Manage করুন:**
   - `/admin/orders` এ যান
   - Order status update করুন

---

## 💡 Pro Tips

1. **Development এ MongoDB Atlas ব্যবহার করুন** - Local MongoDB setup করার দরকার
   নেই

2. **Firebase Emulator দরকার নেই** - Direct Firebase project ব্যবহার করুন

3. **Browser Console দেখুন** - যদি কোন error হয়, F12 চেপে Console tab দেখুন

4. **Network Tab চেক করুন** - API calls সফল হচ্ছে কিনা দেখুন

5. **Server Logs দেখুন** - Terminal এ error messages দেখুন

---

## 📞 Still Having Issues?

যদি এখনও সমস্যা হয়:

1. `.env` ফাইল আবার চেক করুন
2. `node_modules` delete করে আবার `npm install` করুন
3. Browser cache clear করুন
4. Different browser try করুন
5. Terminal এর error message screenshot নিন

---

**Happy Coding! 🎉**
