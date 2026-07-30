# Netlify Deployment Setup Guide

## Critical: Environment Variables Must Be Set in Netlify UI

After deploying to Netlify, you MUST add these environment variables in the Netlify dashboard:

### Steps:
1. Go to https://app.netlify.com
2. Select your site (yyleathers)
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable** and add each of the following:

### Required Environment Variables:

```
VITE_SUPABASE_URL = https://vnspipodxzxuwsailgok.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuc3BpcG9keHp4dXdzYWlsZ29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NTIyNTgsImV4cCI6MjA5NjMyODI1OH0.wI8_OVKRzSGDTMyNQd5I_U1wZmQwVkDWYR2g-eiU78s
VITE_RAZORPAY_KEY_ID = rzp_test_TGze6JVd7cR6lc
VITE_ADMIN_PASSWORD = YYLeathers@SecureAdmin2026!
GEMINI_API_KEY = YOUR_GEMINI_API_KEY_HERE
RAZORPAY_KEY_SECRET = UO9SKMVsJoqRu9h2dpLbHCRU
```

### After Adding Variables:
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for the build to complete
4. Test the site

## Important Notes:

- **VITE_** prefix is REQUIRED for client-side variables
- Without these variables, the site will show "Invalid supabaseUrl" error
- The `netlify.toml` file has the variables for build time, but Netlify UI variables are needed for runtime
- Never commit `.env` file to git (it's in .gitignore)

## Troubleshooting:

If you see "Invalid supabaseUrl" error:
1. Check that all environment variables are set in Netlify UI
2. Trigger a new deploy after adding variables
3. Clear browser cache and test again