# Vercel Environment Variables Setup

## Problem
Login/Signup on Vercel is failing because `REACT_APP_API_URL` environment variable is **not set** in your Vercel project.

## Solution
Follow these steps to fix it:

### Step 1: Go to Vercel Project Settings
1. Visit https://vercel.com/dashboard
2. Click on your project: **api-testing-tool-frontend**

### Step 2: Navigate to Environment Variables
1. Go to **Settings** tab
2. Click on **Environment Variables** from left sidebar

### Step 3: Add the Environment Variable
Click **Add New** and enter:

| Name | Value |
|------|-------|
| `REACT_APP_API_URL` | `https://api-testing-tool-backend-oay4.onrender.com` |

**Important:** 
- Name must be: `REACT_APP_API_URL` (exactly this - React only exposes variables starting with `REACT_APP_`)
- Value should NOT have trailing slash
- Select environment: **Production** (or All)

### Step 4: Redeploy
After adding the env var:
1. Go to **Deployments** tab
2. Click the three dots (...) next to the latest deployment
3. Click **Redeploy** 
   - OR push new commit to trigger auto-deploy
   - OR run: `vercel --prod` from CLI

### Step 5: Verify
1. Visit your Vercel app: https://api-testing-tool-frontend-khaki.vercel.app
2. Try login/signup - it should now work!

## Troubleshooting

**If still not working:**
1. Open DevTools (F12) → Network tab
2. Try to login
3. Check the request URL - it should go to `https://api-testing-tool-backend-oay4.onrender.com/auth/login`
4. If it shows `undefined`, the env var wasn't set correctly
5. If CORS error appears, the backend CORS config might need adjustment

**Backend CORS Status:** ✅ Already configured
- Backend allows: `https://api-testing-tool-frontend-khaki.vercel.app`
- Verified with test request

## Local Testing
If you want to test locally with the Render backend:
```bash
# Create .env.local in frontend folder:
REACT_APP_API_URL=https://api-testing-tool-backend-oay4.onrender.com

# Start frontend:
npm start
```

## Current Setup
- **Frontend (Vercel):** https://api-testing-tool-frontend-khaki.vercel.app
- **Backend (Render):** https://api-testing-tool-backend-oay4.onrender.com
- **Status:** Backend ✅ CORS ✅ Frontend Env Var ❌ (needs to be set on Vercel)
