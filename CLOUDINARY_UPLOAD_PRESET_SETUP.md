# Cloudinary Upload Preset Setup Guide

## Problem
The Cloudinary upload widget shows "Drag and Drop" but browse/upload doesn't work because it needs an "Upload Preset" configured in your Cloudinary account.

## Solution - Create Upload Preset (5 minutes)

### Step 1: Login to Cloudinary
1. Go to https://cloudinary.com/console
2. Login with your account

### Step 2: Create Upload Preset
1. Click on **Settings** (gear icon) in the top right
2. Click on **Upload** tab in the left sidebar
3. Scroll down to **Upload presets** section
4. Click **Add upload preset** button

### Step 3: Configure the Preset
Fill in these settings:

**Preset name:** `mr_coco_unsigned`

**Signing Mode:** Select **"Unsigned"**  
⚠️ This is important! Must be "Unsigned" for browser uploads

**Folder:** `admin-media` (or leave empty)

**File size limit:** 10 MB

**Allowed formats:** jpg, jpeg, png, webp, gif

**Access mode:** Public

**Unique filename:** ✓ Enabled (recommended)

**Overwrite:** ✗ Disabled

**Auto tagging:** Leave empty (optional)

### Step 4: Save
Click **Save** button at the top

### Step 5: Copy Preset Name
After saving, copy the preset name (should be `mr_coco_unsigned` or whatever you named it)

---

## Update Your Code

### Option 1: Use the preset name in environment variable

Add to `/app/.env`:
```env
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=mr_coco_unsigned
```

Then update `/app/components/CloudinaryUploadWidget.js`:
```javascript
uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
```

### Option 2: Use directly (already done!)
The code is already set to use `uploadPreset="ml_default"` but you should change it to your preset name.

---

## Quick Fix for Now

**Easiest solution:** Change the preset name in the code to match Cloudinary's default unsigned preset.

In your Cloudinary dashboard:
1. Go to Settings → Upload → Upload presets
2. Find any existing unsigned preset
3. Copy its name
4. Use that name in the widget

OR

Just create a new preset named `ml_default` as shown above!

---

## After Setup

1. Add the environment variable or update the preset name in code
2. Push to GitHub
3. Add the env variable to Vercel:
   - Go to Vercel → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset-name`
4. Redeploy

---

## Testing

After setup:
1. Go to https://www.mrcocobakery.in/admin/products
2. Click "Upload Image"
3. Drag & drop OR click Browse
4. Select an image
5. Should upload successfully! ✅

---

## Common Issues

**Issue:** "Upload preset not found"
**Fix:** Make sure the preset is set to "Unsigned" mode

**Issue:** "Access forbidden"
**Fix:** Check that the preset's access mode is "Public"

**Issue:** Still not working
**Fix:** Clear browser cache, or try in incognito mode

---

Need help? The current code expects preset: `ml_default`
You can either:
- Create a preset with that exact name
- Or change the code to use your preset name
