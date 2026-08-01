# URGENT: Add Admin Credentials to Vercel Environment Variables

## Action Required

You need to add these two environment variables to your Vercel project:

### Steps:

1. **Go to Vercel Dashboard:** https://vercel.com
2. **Open your project:** `mrcoco-bakery`
3. **Click:** Settings → Environment Variables
4. **Add these 2 variables:**

#### Variable 1:
- **Key:** `NEXT_PUBLIC_ADMIN_USERNAME`
- **Value:** `mrcocoadmin`
- **Environments:** Production, Preview, Development

#### Variable 2:
- **Key:** `NEXT_PUBLIC_ADMIN_PASSWORD`
- **Value:** `MrCoco@2025#Secure`
- **Environments:** Production, Preview, Development

5. **Save** both variables
6. **Redeploy** your website (Vercel will prompt you, or go to Deployments and click Redeploy)

---

## Your New Admin Login Credentials:

**Username:** `mrcocoadmin`
**Password:** `MrCoco@2025#Secure`

⚠️ **Important:** Keep these credentials safe and don't share them publicly!

---

## Changes Made:

✅ Removed all FAQ page links from the website
✅ Removed demo credentials display from admin login page
✅ Updated admin authentication to use secure environment variables
✅ Created proper credentials documentation

Once you add the environment variables to Vercel and redeploy, you'll be able to log in with the new secure credentials!
