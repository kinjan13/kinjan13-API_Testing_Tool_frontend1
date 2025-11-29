# API Testing Tool - Frontend Deployment Guide

## 🚀 Frontend Deployment to Vercel

### Step-by-Step Instructions

#### **Step 1: Go to Vercel**
- Visit: https://vercel.com
- Sign in with GitHub account (or create one)

#### **Step 2: Import GitHub Repository**
1. Click "New Project"
2. Click "Import Git Repository"
3. Paste your frontend repo URL:
   ```
   https://github.com/kinjan13/API_Testing_Tool_frontend.git
   ```
4. Click "Import"

#### **Step 3: Configure Project**
1. **Project Name**: Give it a name (e.g., `api-testing-tool-frontend`)
2. **Framework**: Select "Create React App" (auto-detected)
3. **Root Directory**: Leave as default (or select `frontend/` if mono-repo)
4. **Environment Variables**: Add the following:

   | Key | Value |
   |-----|-------|
   | `REACT_APP_API_URL` | `https://api-testing-tool-backend-oay4.onrender.com` |

#### **Step 4: Deploy**
- Click "Deploy"
- Vercel will build and deploy your project
- Your frontend URL will be displayed (e.g., `https://api-testing-tool-frontend-umber.vercel.app/`)

---

## 🔄 Backend Configuration Update

After frontend is deployed:

### Step 1: Update Backend Environment Variables
1. Go to: https://dashboard.render.com
2. Select your backend service
3. Click "Environment" tab
4. Update or add:
   ```
   FRONTEND_URL=https://your-vercel-frontend-url.vercel.app
   ```

### Step 2: Re-deploy Backend
1. Click "Manual Deploy" or "Deploy latest commit"
2. Backend will restart with new CORS settings

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Frontend loads at Vercel URL
- [ ] Login/Signup works without CORS errors
- [ ] Can make API requests through the tool
- [ ] History saves correctly to backend database
- [ ] Dark mode toggle works
- [ ] All routes are accessible (Home, History, etc.)

---

## 🔗 Environment Variables Used

### Frontend (Vercel)
- `REACT_APP_API_URL` - Backend API URL

### Backend (Render)
- `FRONTEND_URL` - Frontend URL (for CORS)
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - JWT token secret

---

## 📝 Troubleshooting

### CORS Errors After Deployment?
- Verify `FRONTEND_URL` is set correctly in backend .env
- Ensure backend is re-deployed after updating .env
- Check backend CORS configuration includes the Vercel URL

### Login/Signup Not Working?
- Check browser console for error messages
- Verify `REACT_APP_API_URL` is correct in Vercel environment variables
- Ensure backend is running and accessible

### History Not Loading?
- Verify user is logged in
- Check backend `/history/get` endpoint is working
- Verify database is connected properly

---

## 📱 Testing Production Build Locally

Before deploying, test production build:

```bash
npm run build
npm install -g serve
serve -s build
```

This serves the production build at `http://localhost:3000`

---

## 🎯 Your Deployment URLs

Once deployed, your URLs will be:

- **Frontend**: `https://your-vercel-url.vercel.app`
- **Backend API**: `https://your-render-backend.onrender.com`
- **GitHub Frontend Repo**: `https://github.com/kinjan13/API_Testing_Tool_frontend`

---

## ✨ Summary

Your API Testing Tool is now:
- ✅ Version controlled on GitHub
- ✅ Built with production optimizations
- ✅ Ready for cloud deployment
- ✅ Environment-aware (dev/prod)
- ✅ Fully functional with authentication and history tracking

Happy testing! 🎉
