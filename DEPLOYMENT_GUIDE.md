# YY Leathers - Netlify Deployment Guide

## ✅ FIXES APPLIED

1. **Created root `netlify.toml`** - Fixed incorrect location (was in `app/`, now at root)
2. **Removed duplicate `api.ts`** - Deleted duplicate TypeScript function file
3. **Updated `.env.example`** - Added all required environment variables

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Push Changes to GitHub
```bash
git add .
git commit -m "Fix Netlify deployment configuration"
git push origin main
```

### Step 2: Deploy to Netlify

#### Option A: Deploy via Netlify Dashboard (Recommended)
1. Go to https://app.netlify.com/
2. Click "New site from Git"
3. Select your repository: `dhwaragan/YY-Leathers`
4. Configure build settings:
   - **Branch to deploy**: `main`
   - **Build command**: `cd app && npm run build`
   - **Publish directory**: `app/dist`
   - **Functions directory**: `app/netlify/functions`
5. Click "Deploy site"

#### Option B: Deploy via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Step 3: Configure Environment Variables

In Netlify Dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add ALL these variables:

#### Required Variables:
```
GEMINI_API_KEY=your_actual_gemini_api_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
VITE_RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

#### Optional Variables:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
APP_URL=https://your-site-name.netlify.app
```

### Step 4: Trigger Redeploy
After adding environment variables:
1. Go to **Deploys** tab
2. Click "Trigger deploy" → "Deploy site"
3. Wait for build to complete (2-3 minutes)

---

## 🔧 WHAT WAS FIXED

### Before (Broken):
```
netlify.toml location: app/netlify.toml ❌
Build command: cd app && npm run build ❌ (wrong context)
Publish: app/dist ❌ (wrong path)
Functions: netlify/functions ❌ (wrong path)
```

### After (Working):
```
netlify.toml location: ./netlify.toml ✅
Build command: cd app && npm run build ✅
Publish: app/dist ✅
Functions: app/netlify/functions ✅
```

---

## ⚠️ IMPORTANT NOTES

1. **Do NOT commit `.env` file** - It's in `.gitignore` for security
2. **Set all env vars in Netlify** - The app won't work without them
3. **First deploy may take 3-5 minutes** - Normal for Node.js + Vite builds
4. **Check build logs** if deployment fails - Netlify shows detailed errors

---

## 🧪 TESTING AFTER DEPLOYMENT

1. **Test homepage**: Visit your Netlify URL
2. **Test API**: `https://your-site.netlify.app/api/products`
3. **Test chatbot**: Click chat icon and send message
4. **Test payments**: Use Stripe/Razorpay test mode

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue: "Function not found"
**Solution**: Check that `netlify.toml` is at root, not in `app/`

### Issue: "Build failed"
**Solution**: 
- Ensure all env vars are set in Netlify
- Check build logs for specific error
- Verify `package.json` scripts are correct

### Issue: "API routes return 404"
**Solution**: 
- Verify redirects in `netlify.toml`
- Check function files exist in `app/netlify/functions/`

### Issue: "Database not persisting"
**Solution**: 
- Netlify functions have `/tmp` storage (ephemeral)
- For production, use Supabase (already integrated)
- Or upgrade to Netlify Blobs/External database

---

## 📦 PROJECT STRUCTURE (CORRECT)

```
yy-leathers-updatedd/
├── netlify.toml                    ✅ Root config
├── package.json                    ✅ Root package
├── app/
│   ├── package.json                ✅ App dependencies
│   ├── vite.config.ts              ✅ Vite config
│   ├── server.ts                   ✅ Express server
│   ├── .env.example                ✅ Env template
│   ├── dist/                       ✅ Build output (generated)
│   └── netlify/functions/          ✅ Serverless functions
│       ├── api.js                  ✅ Main API handler
│       ├── razorpay-create-order.js
│       ├── razorpay-verify-payment.js
│       ├── razorpay-webhook.js
│       └── orders.js
└── src/                            ✅ React frontend
```

---

## 🎯 QUICK DEPLOY CHECKLIST

- [ ] Push code to GitHub
- [ ] Create site in Netlify
- [ ] Set build command: `cd app && npm run build`
- [ ] Set publish directory: `app/dist`
- [ ] Set functions directory: `app/netlify/functions`
- [ ] Add ALL environment variables
- [ ] Trigger deploy
- [ ] Test live site
- [ ] Test API endpoints
- [ ] Test payment flows (test mode)

---

## 📞 NEED HELP?

If deployment fails:
1. Check Netlify build logs (very detailed)
2. Verify all environment variables are set
3. Ensure `netlify.toml` is at root level
4. Make sure you pushed the latest code

**Your site will be live at**: `https://your-site-name.netlify.app`