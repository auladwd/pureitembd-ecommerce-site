# MiniShop - Grocery E-Commerce Platform

A production-ready grocery e-commerce platform built with Next.js 14,
TypeScript, MongoDB, and Firebase. Features exactly 16 grocery products
including rice, oil, spices, vegetables, dairy, and more. Complete with manual
payment processing and admin panel.

## Features

### Customer Features

- Home page with banner slider (grocery-themed)
- Product listing (16 grocery products)
- Product details with image gallery
- Shopping cart with localStorage persistence
- Checkout with shipping information
- Manual payment slip submission (Bkash/Nagad/Bank/Cash/Other)
- Order tracking and history
- Google authentication via Firebase
- Responsive mobile-first design

### Admin Features

- Protected admin panel (role-based access)
- Dashboard with analytics (total orders, revenue, pending slips)
- Product management (CRUD operations)
- Banner management (CRUD operations)
- Order management with status updates
- Payment slip review
- One-click demo data seeding (16 grocery products + banners)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: MongoDB with Mongoose
- **Authentication**: Firebase Authentication (Google Login)
- **Storage**: Firebase Storage (payment slips & banners)
- **Deployment**: Vercel-ready

## Prerequisites

- Node.js 18+ and npm
- MongoDB database (MongoDB Atlas recommended)
- Firebase project with Authentication and Storage enabled
- Google OAuth credentials configured in Firebase

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd minishop-ecommerce
npm install
```

### 2. MongoDB Setup

1. Create a MongoDB database (use
   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for free hosting)
2. Get your connection string (format:
   `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

### 3. Firebase Setup

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Google Authentication:
   - Go to Authentication → Sign-in method
   - Enable Google provider
   - Add authorized domains (localhost and your Vercel domain)

#### Get Firebase Config

1. Go to Project Settings → General
2. Scroll to "Your apps" → Web app
3. Copy the config values

#### Setup Firebase Admin

1. Go to Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely
4. Extract these values:
   - `project_id`
   - `client_email`
   - `private_key`

#### Enable Firebase Storage

1. Go to Storage in Firebase Console
2. Click "Get Started"
3. Set up security rules (for production, restrict access):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /payment-slips/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/minishop?retryWrites=true&w=majority

# Firebase Client (Public - from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Firebase Admin (from Service Account JSON)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n"

# Admin Emails (comma-separated, these users will have admin access)
ADMIN_EMAILS=admin@example.com,admin2@example.com

# Site Configuration
NEXT_PUBLIC_SITE_NAME=MiniShop
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important Notes:**

- The `FIREBASE_ADMIN_PRIVATE_KEY` must include the quotes and `\n` characters
- Replace `\n` in the private key with actual newlines or keep as `\n` (the code
  handles both)
- Add your email to `ADMIN_EMAILS` to access the admin panel

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Seed Demo Data

1. Sign in with Google using an admin email
2. Navigate to `/admin`
3. Click "Seed Demo Data" button
4. This will create 16 grocery products and 3 sample banners

#### 🛒 Grocery Products Included

The seed data includes 16 authentic Bangladeshi grocery items:

**Rice & Grains (3 items)**

- Miniket Rice - 5kg (৳350)
- Pran Chinigura Rice - 1kg (৳180)
- Fresh Atta - 2kg (৳120)

**Cooking Oil (2 items)**

- Teer Soybean Oil - 5 Liter (৳850)
- Pran Mustard Oil - 1 Liter (৳280)

**Spices (3 items)**

- Radhuni Turmeric Powder - 200g (৳85)
- Radhuni Chili Powder - 200g (৳95)
- ACI Pure Salt - 1kg (৳35)

**Pulses & Lentils (1 item)**

- Red Lentils (Masoor Dal) - 1kg (৳140)

**Vegetables (3 items)**

- Fresh Potatoes - 2kg (৳60)
- Fresh Onions - 2kg (৳80)
- Fresh Tomatoes - 1kg (৳50)

**Meat & Fish (1 item)**

- Broiler Chicken - 1kg (৳180)

**Dairy (3 items)**

- Fresh Milk - 1 Liter (৳75)
- Farm Fresh Eggs - 12 pcs (৳120)
- Pran Ghee - 500g (৳550)

## How to Make an Admin

To grant admin access to a user:

1. Add their email to the `ADMIN_EMAILS` environment variable:

   ```env
   ADMIN_EMAILS=admin@example.com,newadmin@example.com
   ```

2. Restart the development server or redeploy

3. The user must sign in with Google using that email

4. They will automatically be assigned the admin role

5. Access admin panel at `/admin`

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - Add all variables from your `.env` file
   - Make sure to add your production domain to Firebase authorized domains
5. Click "Deploy"

### 3. Post-Deployment

1. Update `NEXT_PUBLIC_SITE_URL` in Vercel environment variables to your
   production URL
2. Add your Vercel domain to Firebase authorized domains:
   - Firebase Console → Authentication → Settings → Authorized domains
3. Update Firebase Storage CORS if needed

## Project Structure

```
├── app/
│   ├── admin/              # Admin pages
│   │   ├── page.tsx        # Dashboard
│   │   ├── products/       # Product management
│   │   ├── banners/        # Banner management
│   │   └── orders/         # Order management
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── products/       # Product endpoints
│   │   ├── orders/         # Order endpoints
│   │   ├── banners/        # Banner endpoints
│   │   ├── payment-slips/  # Payment slip endpoints
│   │   └── admin/          # Admin endpoints
│   ├── cart/               # Cart page
│   ├── checkout/           # Checkout page
│   ├── orders/             # User orders page
│   ├── pay-slip/           # Payment slip submission
│   ├── products/[id]/      # Product details
│   ├── thank-you/          # Order confirmation
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/             # React components
├── context/                # React contexts (Auth, Cart)
├── lib/                    # Utilities and configs
├── models/                 # Mongoose models
├── types/                  # TypeScript types
└── public/                 # Static assets
```

## API Endpoints

### Public

- `GET /api/products` - Get active products
- `GET /api/products/[id]` - Get product details
- `GET /api/banners` - Get active banners

### Authenticated

- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/[id]` - Get order details
- `POST /api/payment-slips` - Submit payment slip

### Admin Only

- `POST /api/admin/seed` - Seed demo data
- `GET /api/admin/analytics` - Get dashboard stats
- `GET/POST/PUT/DELETE /api/admin/products` - Manage products
- `GET/POST/PUT/DELETE /api/admin/banners` - Manage banners
- `GET /api/admin/orders` - Get all orders
- `PATCH /api/admin/orders/[id]` - Update order status

## Features in Detail

### Cart System

- Persisted in localStorage
- Real-time quantity updates
- Stock validation
- Automatic shipping calculation (free over ৳1000)

### Payment Flow

1. User adds items to cart
2. Proceeds to checkout (requires login)
3. Enters shipping information
4. Creates order
5. Submits payment slip with:
   - Payment method selection
   - Transaction ID (min 5 characters)
   - Optional screenshot upload
6. Admin reviews and updates order status

### Order Statuses

- **Pending**: Order created, awaiting payment
- **Paid**: Payment verified by admin
- **Shipped**: Order dispatched
- **Delivered**: Order completed
- **Cancelled**: Order cancelled

## Security Features

- Firebase ID token verification on all protected routes
- Role-based access control for admin
- Server-side validation
- Secure file uploads to Firebase Storage
- Environment variable protection

## Troubleshooting

### Firebase Admin Error

If you see "Firebase Admin initialization error":

- Check that `FIREBASE_ADMIN_PRIVATE_KEY` includes quotes and proper newlines
- Verify all three admin env variables are set correctly

### MongoDB Connection Error

- Verify connection string format
- Check network access in MongoDB Atlas (allow your IP)
- Ensure database user has proper permissions

### Admin Access Denied

- Confirm your email is in `ADMIN_EMAILS`
- Sign out and sign in again after adding email
- Check browser console for errors

### Image Upload Issues

- Verify Firebase Storage is enabled
- Check storage security rules
- Ensure user is authenticated

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
