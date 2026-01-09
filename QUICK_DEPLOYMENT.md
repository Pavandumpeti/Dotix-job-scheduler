# 🚀 QUICK START - DEPLOYMENT STEPS

Follow these steps to deploy your DOTIX Job Scheduler to production.

---

## **STEP 1: Frontend Deployment (Vercel)**

### 1.1 Create Vercel Account
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign up with GitHub
- [ ] Authorize Vercel access

### 1.2 Deploy Frontend
```bash
# In Vercel Dashboard:
1. Click "Add New" → "Project"
2. Click "Import Git Repository"
3. Paste: https://github.com/YOUR-USERNAME/Dotix-job-scheduler
4. Set Root Directory: ./frontend
5. Add Environment Variable:
   NEXT_PUBLIC_API_URL = https://job-scheduler-backend.onrender.com
   (Replace with your actual backend URL)
6. Click "Deploy"
```

- [ ] Wait for deployment (2-3 minutes)
- [ ] Note your Vercel URL (e.g., `https://dotix-scheduler.vercel.app`)
- [ ] Test: Visit your Vercel URL in browser

---

## **STEP 2: Backend Deployment (Render)**

### 2.1 Create Render Account
- [ ] Go to [render.com](https://render.com)
- [ ] Sign up with GitHub
- [ ] Authorize Render access

### 2.2 Deploy Backend
```bash
# In Render Dashboard:
1. Click "New" → "Web Service"
2. Click "Connect a Repository"
3. Search for "Dotix-job-scheduler" and connect
4. Configure:
   - Name: job-scheduler-backend
   - Environment: Node
   - Build Command: npm install
   - Start Command: node backend/server.js
5. Add Environment Variables:
   WEBHOOK_URL = https://webhook.site/YOUR-UNIQUE-ID
   NODE_ENV = production
```

- [ ] Click "Create Web Service"
- [ ] Wait for deployment (3-5 minutes)
- [ ] Note your Render URL (e.g., `https://job-scheduler-xxxxx.onrender.com`)
- [ ] Test API: Visit `https://your-render-url/jobs` in browser

### 2.3 Get Webhook URL
```bash
1. Go to https://webhook.site
2. Copy the unique URL (automatically generated)
3. Add to Render as WEBHOOK_URL environment variable
```

---

## **STEP 3: Update Frontend with Backend URL**

After backend is deployed:

```bash
# In Vercel Dashboard:
1. Go to your project settings
2. Find "Environment Variables"
3. Update NEXT_PUBLIC_API_URL to your Render backend URL
4. Redeploy frontend (click "Deploy" button)
```

- [ ] Vercel redeploys automatically
- [ ] Wait 1-2 minutes for deployment

---

## **STEP 4: Test Everything**

### Frontend Tests
- [ ] Visit `https://your-vercel-url.vercel.app`
- [ ] Page loads without errors
- [ ] Dashboard displays (even if no jobs)
- [ ] Can see "Create Job" form on left
- [ ] Can see empty job table on right

### Create Job Test
- [ ] Enter Task Name: "Test Job"
- [ ] Select Priority: "High"
- [ ] Click "Create Job"
- [ ] Job appears in table
- [ ] Status shows "Pending"

### Run Job Test
- [ ] Click "Run" button on job
- [ ] Status changes to "Running" with spinner
- [ ] Wait 3 seconds
- [ ] Status changes to "Completed" ✓

### Navigation Test
- [ ] Click on job row
- [ ] Navigate to detail page
- [ ] All job info displays correctly
- [ ] Click "Back" button
- [ ] Returns to dashboard

### Filter Test
- [ ] Select "Completed" in status filter
- [ ] Only completed jobs show
- [ ] Select "High" in priority filter
- [ ] Only high priority jobs show
- [ ] Clear filters
- [ ] All jobs show again

### Delete Test
- [ ] Click trash icon on a job
- [ ] Confirm deletion
- [ ] Job removed from list

---

## **STEP 5: Monitor & Maintain**

### Vercel Monitoring
- [ ] Check [vercel.com/dashboard](https://vercel.com/dashboard)
- [ ] Monitor deployments
- [ ] Check analytics

### Render Monitoring
- [ ] Check [render.com/dashboard](https://render.com/dashboard)
- [ ] Monitor logs for errors
- [ ] Check uptime

### Test Webhooks
- [ ] Run a job
- [ ] Check [webhook.site](https://webhook.site)
- [ ] Verify job completion data received

---

## **TROUBLESHOOTING**

### Frontend shows "Cannot fetch jobs"
```
Solution:
1. Check browser console (F12)
2. Verify NEXT_PUBLIC_API_URL is correct
3. Check if backend is running on Render
4. Redeploy Vercel frontend
```

### Backend doesn't start
```
Solution:
1. Check Render logs
2. Verify package.json has "start" script
3. Ensure all dependencies are listed
4. Try redeploying
```

### Webhook not triggering
```
Solution:
1. Verify WEBHOOK_URL in Render environment
2. Test with webhook.site first
3. Check backend logs for errors
4. Run a job and check webhook.site
```

---

## **PRODUCTION CHECKLIST**

### Before Deployment
- [ ] All code committed to GitHub
- [ ] `.env` file is in `.gitignore`
- [ ] `package.json` has correct scripts
- [ ] No `localhost` URLs in code
- [ ] All dependencies installed locally

### After Deployment
- [ ] Frontend loads quickly
- [ ] API calls work (check Network tab)
- [ ] No console errors
- [ ] Jobs persist after page refresh
- [ ] Webhooks send successfully
- [ ] Can access both URLs from different devices

### Ongoing Maintenance
- [ ] Monitor error logs daily
- [ ] Update dependencies monthly
- [ ] Test all features weekly
- [ ] Backup database (if using persistent storage)

---

## **QUICK LINKS**

| Resource | URL |
|----------|-----|
| Vercel Dashboard | https://vercel.com/dashboard |
| Render Dashboard | https://render.com/dashboard |
| Webhook Testing | https://webhook.site |
| GitHub Repo | https://github.com/Pavandumpeti/Dotix-job-scheduler |
| Frontend Live | https://job-scheduler-ten.vercel.app |
| Backend Live | https://job-scheduler-6xvu.onrender.com |

---

## **ESTIMATED TIME**

- Frontend setup: 5 minutes
- Backend setup: 10 minutes
- Configuration: 5 minutes
- Testing: 10 minutes
- **Total: ~30 minutes**

---

## **NEXT STEPS**

1. ✅ Deploy frontend to Vercel
2. ✅ Deploy backend to Render
3. ✅ Configure webhook service
4. ✅ Test all features
5. ✅ Share live URLs
6. ✅ Record video explanation
7. ✅ Submit project

**Good luck! Your project is ready for production! 🎉**
