# 🌐 Domain Configuration & Redirect Setup

## ✅ What's Been Done:

### 1. **Domain Redirect Configured**
- Added automatic redirect in `next.config.js`
- **Effect:** `mrcocobakery.in` → `https://www.mrcocobakery.in`
- **Type:** Permanent redirect (301)
- **Applies to:** All pages and paths

### 2. **Current Status:**
- ✅ **www.mrcocobakery.in** - WORKING
- ⏳ **mrcocobakery.in** - DNS propagating (will redirect to www when ready)

---

## 🔄 How the Redirect Works:

When someone visits:
- `mrcocobakery.in` → Automatically goes to `www.mrcocobakery.in`
- `mrcocobakery.in/products` → Goes to `www.mrcocobakery.in/products`
- `mrcocobakery.in/cart` → Goes to `www.mrcocobakery.in/cart`

**Benefits:**
- SEO-friendly (301 permanent redirect)
- Users always see www version
- Consistent branding
- Both domains work, but www is primary

---

## 📋 DNS Configuration (GoDaddy):

### Records Set:
1. **A Record:**
   - Type: A
   - Name: @
   - Value: 216.198.79.1
   - Purpose: Points root domain to Vercel

2. **CNAME Record:**
   - Type: CNAME
   - Name: www
   - Value: b729a4cf1092736d.vercel-dns-017.com
   - Purpose: Points www subdomain to Vercel

---

## ⏰ Timeline:

- **Now:** Redirect code deployed ✅
- **10-30 mins:** DNS fully propagates
- **Once DNS works:** mrcocobakery.in will automatically redirect to www.mrcocobakery.in
- **SSL:** Vercel will automatically issue certificate for both domains

---

## 🧪 Testing After DNS Propagates:

### Test 1: Root Domain Redirect
1. Open browser (incognito mode)
2. Go to: `http://mrcocobakery.in`
3. **Expected:** Automatically redirects to `https://www.mrcocobakery.in`

### Test 2: WWW Domain
1. Go to: `http://www.mrcocobakery.in`
2. **Expected:** Loads your website with HTTPS

### Test 3: Deep Links
1. Go to: `http://mrcocobakery.in/products`
2. **Expected:** Redirects to `https://www.mrcocobakery.in/products`

---

## 🔍 Troubleshooting:

### If Root Domain Still Doesn't Work After 30 Minutes:

**Check GoDaddy A Record:**
1. Go to GoDaddy DNS management
2. Verify A record with @ is pointing to 216.198.79.1
3. Make sure there are NO other A records with @ (delete old ones)

**Check DNS Propagation:**
- Visit: https://dnschecker.org
- Enter: mrcocobakery.in
- Check if A record shows 216.198.79.1 globally

**Check Vercel:**
- Go to Vercel → Domains
- Click "Refresh" on mrcocobakery.in
- Should show valid configuration

---

## 📞 Support Info:

If issues persist after 1 hour:
- GoDaddy DNS changes can take up to 48 hours (rare)
- Most cases resolve in 15-30 minutes
- Try from different network/device (to bypass local DNS cache)

---

**Current Status:** ✅ Configuration complete, waiting for DNS propagation!
**Primary Domain:** www.mrcocobakery.in (LIVE & WORKING)
**Secondary Domain:** mrcocobakery.in (Will redirect to www once DNS propagates)
