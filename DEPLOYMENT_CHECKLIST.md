# Deployment Checklist

## Pre-Deployment Setup

### 1. MongoDB Setup ✓

- [ ] Create MongoDB Atlas account
- [ ] Create new cluster
- [ ] Create database user
- [ ] Whitelist IP addresses (0.0.0.0/0 for development)
- [ ] Get connection string
- [ ] Test connection

### 2. Firebase Setup ✓

- [ ] Create Firebase project
- [ ] Enable Google Authentication
- [ ] Configure OAuth consent screen
- [ ] Add authorized domains (localhost, vercel domain)
- [ ] Enable Firebase Storage
- [ ] Configure Storage security rules
- [ ] Get Firebase client config
- [ ] Generate service account key
- [ ] Save private key securely

### 3. Local Development ✓

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Create `.env` file with all variables
- [ ] Add your email to ADMIN_EMAILS
- [ ] Run `npm run dev`
- [ ] Test Google login
- [ ] Access admin panel at /admin
- [ ] Click "Seed Demo Data"
- [ ] Verify 16 products appear
- [ ] Test complete purchase flow

### 4. Vercel Deployment ✓

- [ ] Push code to GitHub
- [ ] Connect repository to Vercel
- [ ] Add all environment variables
- [ ] Set NEXT_PUBLIC_SITE_URL to production URL
- [ ] Deploy
- [ ] Add Vercel domain to Firebase authorized domains
- [ ] Test production deployment
- [ ] Verify admin access works
- [ ] Test payment slip upload

## Post-Deployment

### Security

- [ ] Review Firebase Storage rules
- [ ] Verify admin emails are correct
- [ ] Test unauthorized access attempts
- [ ] Enable MongoDB IP whitelist (remove 0.0.0.0/0)

### Testing

- [ ] Test all customer flows
- [ ] Test admin operations
- [ ] Test on mobile devices
- [ ] Verify email notifications (if added)

### Monitoring

- [ ] Set up Vercel analytics
- [ ] Monitor MongoDB usage
- [ ] Monitor Firebase Storage usage
- [ ] Check error logs

## Environment Variables Reference

```env
# Required for all environments
MONGODB_URI=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
ADMIN_EMAILS=
NEXT_PUBLIC_SITE_NAME=
NEXT_PUBLIC_SITE_URL=
```

## Quick Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Common Issues & Solutions

### Issue: "Firebase Admin initialization error"

**Solution**: Check FIREBASE_ADMIN_PRIVATE_KEY format. Must include quotes and
\n characters.

### Issue: "Cannot connect to MongoDB"

**Solution**: Verify connection string, check IP whitelist, ensure user has
permissions.

### Issue: "Not authorized to access admin panel"

**Solution**: Add your email to ADMIN_EMAILS, sign out and sign in again.

### Issue: "Image upload fails"

**Solution**: Verify Firebase Storage is enabled and security rules allow
authenticated uploads.

### Issue: "Products not showing on home page"

**Solution**: Run seed data from admin panel, verify products are marked as
active.

## Support Contacts

- MongoDB Atlas: https://www.mongodb.com/cloud/atlas/support
- Firebase: https://firebase.google.com/support
- Vercel: https://vercel.com/support
- Next.js: https://nextjs.org/docs

## Success Criteria

Your deployment is successful when:

- ✓ Home page loads with banners and 16 products
- ✓ Users can sign in with Google
- ✓ Users can add products to cart
- ✓ Users can complete checkout
- ✓ Users can submit payment slips
- ✓ Admin can access /admin panel
- ✓ Admin can manage products, banners, and orders
- ✓ All pages are responsive on mobile
- ✓ No console errors in production
