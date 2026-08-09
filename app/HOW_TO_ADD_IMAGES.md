# How to Add Product Images - Simple Guide

## The Problem
Your old Supabase project is down (quota exceeded), so all product images show as broken/placeholder.

## The Solution (3 Easy Steps)

### STEP 1: Upload Images to New Supabase (5 minutes)

1. Open this link in your browser:
   **https://joutnmqckfwtfwicfqrm.supabase.co**

2. Click **Storage** on the left menu

3. Click **New bucket**:
   - Name: `yy-images`
   - Toggle **Public** to ON
   - Click **Create**

4. Click on the `yy-images` bucket

5. Click **New folder**:
   - Name: `products`
   - Click **Create**

6. Open the `products` folder

7. **Drag and drop** all your product images here:
   - Select all product images from your computer
   - Drag them into the browser window
   - Wait for upload to complete

### STEP 2: Update Image URLs (1 minute)

1. Open PowerShell
2. Run these commands:
```powershell
cd app
node update-image-urls.mjs
```

This will automatically:
- Find all images you just uploaded
- Update all product URLs in your database
- Show you a summary

### STEP 3: Test Your Website (30 seconds)

```powershell
npm run dev
```

Open http://localhost:3000 and check if images are showing!

---

## What Happens Automatically?

Once images are uploaded, the code automatically:
- ✅ Compresses images to save bandwidth
- ✅ Resizes to correct dimensions
- ✅ Converts to WebP format (smaller file size)
- ✅ Caches for 30 minutes (faster loading)
- ✅ Keeps you under 5GB/month limit

**You don't need to do anything else!**

---

## If You Don't Have the Original Images

**Quick fix:** Use placeholder images for now
- Website will work immediately
- You can add real images later
- Placeholders show "YY Leathers" text

**To get original images:**
- Check with your client/photographer
- Look in your email/cloud storage
- Check if they're in your browser cache

---

## Troubleshooting

**Images still not showing?**
1. Make sure you uploaded images to the `products` folder (not root)
2. Make sure the bucket is named `yy-images` (not `yy-images-2` or similar)
3. Make sure the bucket is **Public** (not private)
4. Run `node update-image-urls.mjs` again
5. Clear browser cache: Press F12 → Right-click refresh → Empty Cache and Hard Reload

**Script says "No images found"?**
- You haven't uploaded images yet
- Go back to Step 1 and upload images first

**Images show but are slow?**
- This is normal for first load
- Images are being cached
- Refresh the page and it will be faster

---

## Need Help?

If you're stuck:
1. Take a screenshot of Supabase Storage
2. Take a screenshot of the error in browser console (F12)
3. Share both with me and I'll help you fix it

---

**That's it! Your images should be working now!** 🎉