# Mr. COCO Bakery - Environment Variables for Production

## Required Environment Variables for Vercel Deployment

Copy these to Vercel Dashboard → Settings → Environment Variables

### Database
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/bakery?retryWrites=true&w=majority
```
**Note**: You'll need to set up MongoDB Atlas (FREE) or use your existing MongoDB

### JWT Secret
```
JWT_SECRET=mrcoco-bakery-production-secret-key-2025-change-this
```

### Razorpay (Test Keys for now)
```
RAZORPAY_KEY_ID=rzp_test_TJeZUPvsEWiIsG
RAZORPAY_KEY_SECRET=sHTi0EN16hsmqm8u3BCcYb7o
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_TJeZUPvsEWiIsG
```

### Base URL (Will be your Vercel URL)
```
NEXT_PUBLIC_BASE_URL=https://your-app-name.vercel.app
```

### SMTP Email (Optional - for now you can skip)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=mrcocobakery@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM_EMAIL=mrcocobakery@gmail.com
SMTP_FROM_NAME=Mr. COCO Bakery
```

---

## MongoDB Atlas Setup (FREE Database)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create FREE account
3. Create FREE M0 cluster (512MB - enough for you)
4. Database Access → Add User (username & password)
5. Network Access → Add IP (0.0.0.0/0 for Vercel)
6. Connect → Get connection string
7. Replace username, password in connection string

**Connection String Format:**
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bakery
```

---

## Quick Setup Checklist

### Before Deploying:
- [ ] MongoDB Atlas account created
- [ ] Database connection string ready
- [ ] Environment variables noted down
- [ ] GitHub account ready
- [ ] Vercel account created

### During Deployment:
- [ ] Push code to GitHub
- [ ] Import project to Vercel
- [ ] Add environment variables
- [ ] Deploy

### After Deployment:
- [ ] Test website functionality
- [ ] Update NEXT_PUBLIC_BASE_URL
- [ ] Test order placement
- [ ] Share your live URL!
