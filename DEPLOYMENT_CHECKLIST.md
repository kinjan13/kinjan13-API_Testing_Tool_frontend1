# 📋 Vercel Deployment Checklist

## Pre-Deployment

- [x] Frontend code is ready (built in `frontend/build/`)
- [x] All environment variables configured (`.env.local`, `.env.production`)
- [x] GitHub repository is up to date
- [x] Production build has no errors or warnings
- [x] Backend is deployed and running

## During Vercel Deployment

### New Project Setup
- [ ] Sign in to Vercel with GitHub
- [ ] Click "New Project"
- [ ] Import repository: `https://github.com/kinjan13/API_Testing_Tool_frontend.git`
- [ ] Confirm project settings

### Environment Variables (CRITICAL)
Add these in Vercel Project Settings → Environment Variables:

```
REACT_APP_API_URL=https://api-testing-tool-backend-oay4.onrender.com
```

### Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete (typically 2-3 minutes)
- [ ] Note your Vercel URL (e.g., `https://api-testing-tool-frontend-umber.vercel.app`)

## Post-Deployment (Backend Configuration)

1. [ ] Go to Render backend dashboard
2. [ ] Open Environment tab
3. [ ] Add/Update:
   ```
   FRONTEND_URL=https://your-vercel-url.vercel.app
   ```
4. [ ] Click "Save"
5. [ ] Manual Deploy or re-deploy backend

## Final Verification

After everything is deployed:

- [ ] Frontend loads without errors
- [ ] Can navigate to Login/Signup
- [ ] Login works (no CORS errors)
- [ ] Can make API requests (test with JSONPlaceholder)
- [ ] History page loads user's past requests
- [ ] Dark mode toggle works
- [ ] All routes accessible

## Troubleshooting

If CORS errors occur:
1. Verify backend .env has correct `FRONTEND_URL`
2. Check backend is re-deployed
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check backend logs on Render dashboard

If API calls fail:
1. Verify `REACT_APP_API_URL` in Vercel env vars
2. Test backend is accessible: `curl https://your-backend.onrender.com/`
3. Check backend server status on Render

## Success Indicators

✅ Frontend URL loads your app
✅ Navbar displays correctly
✅ Login page appears
✅ Can sign up / log in
✅ Dashboard loads (home page with request builder)
✅ Can make test API requests
✅ History page shows saved requests
✅ Dark mode works

---

**Once all checks pass, your API Testing Tool is live! 🎉**
