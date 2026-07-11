# Netlify Deployment Guide for YY Leathers

## Prerequisites
- A Netlify account (sign up at https://netlify.com)
- Your project pushed to a Git repository (GitHub/GitLab/Bitbucket)

## Step 1: Prepare Your Environment Variables

Before deploying, gather these credentials:

### Required Environment Variables:
1. **GEMINI_API_KEY** - Get from https://aistudio.google.com/app/apikey
2. **SUPABASE_URL** - Your Supabase project URL
3. **SUPABASE_ANON_KEY** - Your Supabase anon/public key
4. **STRIPE_SECRET_KEY** - From Stripe Dashboard (Test mode for testing)
5. **STRIPE_WEBHOOK_SECRET** - From Stripe webhook configuration
6. **VITE_STRIPE_PUBLISHABLE_KEY** - Stripe publishable key (starts with pk_test_)
7. **RAZORPAY_KEY_ID** - From Razorpay Dashboard (starts with rzp_test_)
8. **RAZORPAY_KEY_SECRET** - From Razorpay Dashboard
9. **RAZORPAY_WEBHOOK_SECRET** - From Razorpay webhook configuration
10. **VITE_RAZORPAY_KEY_ID** - Same as RAZORPAY_KEY_ID (for client-side)
11. **APP_URL** - Your Netlify site URL (e.g., https://yy-leathers.netlify.app)

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify UI (Recommended for First Time)

1. **Push your code to GitHub/GitLab**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Import your repository in Netlify**
   - Go to https://app.netlify.com/start
   - Click "Import an existing project"
   - Choose your Git provider (GitHub/GitLab/Bitbucket)
   - Select your repository

3. **Configure Build Settings**
   - **Base directory**: `app`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
   
   ⚠️ **IMPORTANT**: Set these EXACTLY as shown above!

4. **Add Environment Variables**
   - Click "Show advanced" → "New variable"
   - Add ALL environment variables listed in Step 1
   - Make sure to prefix client-side variables with `VITE_` (Vite convention)
   - Example:
     ```
     GEMINI_API_KEY = your_key_here
     VITE_SUPABASE_URL = https://your-project.supabase.co
     SUPABASE_URL = https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY = your_anon_key
     SUPABASE_ANON_KEY = your_anon_key
     STRIPE_SECRET_KEY = sk_test_...
     VITE_STRIPE_PUBLISHABLE_KEY = pk_test_...
     STRIPE_WEBHOOK_SECRET = whsec_...
     RAZORPAY_KEY_ID = rzp_test_...
     RAZORPAY_KEY_SECRET = your_secret
     VITE_RAZORPAY_KEY_ID = rzp_test_...
     RAZORPAY_WEBHOOK_SECRET = your_webhook_secret
     APP_URL = https://your-site.netlify.app
     ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete (2-5 minutes)
   - Netlify will provide you with a URL like `https://yy-leathers-12345.netlify.app`

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Netlify**
   ```bash
   cd app
   netlify init
   ```

4. **Set Environment Variables**
   ```bash
   netlify env:set GEMINI_API_KEY "your_key"
   netlify env:set VITE_SUPABASE_URL "https://your-project.supabase.co"
   # ... set all other variables
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Step 3: Configure Payment Webhooks

### Stripe Webhook Setup:
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-site.netlify.app/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy the webhook secret and add it to Netlify as `STRIPE_WEBHOOK_SECRET`

### Razorpay Webhook Setup:
1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add endpoint: `https://your-site.netlify.app/api/razorpay/webhook`
3. Select events: `payment.captured`, `order.paid`
4. Copy the webhook secret and add it to Netlify as `RAZORPAY_WEBHOOK_SECRET`

## Step 4: Configure Supabase (Optional but Recommended)

1. Go to your Supabase project
2. Open SQL Editor
3. Run this SQL to create the sync table:
   ```sql
   CREATE TABLE IF NOT EXISTS yy_store_sync (
     key TEXT PRIMARY KEY,
     value JSONB NOT NULL,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
   );

   ALTER TABLE yy_store_sync ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Allow anon read" ON yy_store_sync FOR SELECT USING (true);
   CREATE POLICY "Allow anon upsert" ON yy_store_sync FOR INSERT WITH CHECK (true);
   CREATE POLICY "Allow anon update" ON yy_store_sync FOR UPDATE USING (true);
   ```

## Step 5: Test Your Deployment

1. **Visit your Netlify URL**
2. **Test API endpoints**:
   - `https://your-site.netlify.app/api/products` - Should return products
   - `https://your-site.netlify.app/api/offers` - Should return offers
3. **Test payment flow** (use test mode keys)
4. **Check browser console** for any errors

## Common Issues & Solutions

### Issue 1: "Module not found" errors
**Solution**: Make sure all dependencies are in package.json and build completes locally first:
```bash
cd app
npm install
npm run build
```

### Issue 2: Functions not working (404 errors)
**Solution**: 
- Verify `netlify.toml` has correct paths
- Check that functions directory is `netlify/functions` (not `app/netlify/functions`)
- Redeploy after fixing

### Issue 3: Environment variables not working
**Solution**:
- Variables starting with `VITE_` are exposed to the browser
- Server-side variables (like `STRIPE_SECRET_KEY`) should NOT start with `VITE_`
- Redeploy after adding new variables

### Issue 4: CORS errors
**Solution**: The server.ts already has CORS enabled. If issues persist, check Netlify function logs.

### Issue 5: Database not persisting
**Solution**: Netlify Functions are stateless. The app uses:
- Local file system (`/tmp/db.json`) for serverless
- Supabase for cloud sync (recommended)
- Data resets on cold starts without Supabase

## Step 6: Custom Domain (Optional)

1. In Netlify Dashboard → Domain settings
2. Click "Add custom domain"
3. Follow instructions to configure DNS
4. Enable HTTPS (Netlify provides free SSL)

## Monitoring & Logs

- **View logs**: Netlify Dashboard → Functions → Click on function → Logs
- **Monitor performance**: Netlify Analytics (paid feature)
- **Set up alerts**: Netlify Dashboard → Notifications

## Security Checklist

- [ ] Never commit `.env` file to Git (it's in .gitignore)
- [ ] Use test mode keys for development
- [ ] Rotate keys if accidentally exposed
- [ ] Enable webhook signature verification
- [ ] Use HTTPS in production
- [ ] Set up CORS properly (already configured)

## Need Help?

- Netlify Docs: https://docs.netlify.com
- Netlify Support: https://www.netlify.com/support
- Check build logs in Netlify Dashboard for specific errors

## Quick Deployment Checklist

- [ ] Code pushed to Git repository
- [ ] All environment variables gathered
- [ ] netlify.toml configured correctly
- [ ] Build works locally (`npm run build`)
- [ ] Site deployed to Netlify
- [ ] Environment variables set in Netlify
- [ ] Payment webhooks configured
- [ ] Supabase table created (optional)
- [ ] Site tested and working
- [ ] Custom domain configured (optional)