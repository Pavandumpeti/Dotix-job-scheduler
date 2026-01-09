# 🚀 DEPLOYMENT GUIDE - DOTIX JOB SCHEDULER

This guide covers deploying both frontend and backend to production.

---

## 📋 QUICK SUMMARY

| Component | Platform | URL |
|-----------|----------|-----|
| **Frontend** | Vercel | https://job-scheduler-ten.vercel.app |
| **Backend** | Render | https://job-scheduler-6xvu.onrender.com |
| **Database** | SQLite (on Render) | Built-in with backend |
| **Webhooks** | webhook.site | Testing/Development |

---

## 🎯 PART 1: DEPLOY FRONTEND TO VERCEL

### **Step 1: Create Vercel Account**
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "GitHub" to sign up
4. Authorize Vercel to access your GitHub repositories

### **Step 2: Import GitHub Repository**
1. In Vercel dashboard, click "Add New..." → "Project"
2. Click "Import Git Repository"
3. Paste your GitHub repo URL: `https://github.com/YOUR-USERNAME/Dotix-job-scheduler`
4. Click "Continue"

### **Step 3: Configure Project**
1. **Project Name:** `job-scheduler` (or your preferred name)
2. **Framework:** Next.js (auto-detected)
3. **Root Directory:** `./frontend`
4. Click "Continue"

### **Step 4: Environment Variables**
In the "Environment Variables" section, add:

```
NEXT_PUBLIC_API_URL=https://job-scheduler-6xvu.onrender.com
```

**Explanation:**
- `NEXT_PUBLIC_API_URL` - Points frontend to your deployed backend
- This makes API calls to the production backend, not localhost:3001

### **Step 5: Deploy**
1. Click "Deploy"
2. Wait for deployment to complete (2-3 minutes)
3. You'll get a live URL like: `https://your-project.vercel.app`

### **Step 6: Verify Deployment**
- Visit your Vercel URL
- Test creating a job
- Check if it connects to the backend
- If no jobs appear, check the backend URL in network tab

---

## 🎯 PART 2: DEPLOY BACKEND TO RENDER

### **Step 1: Prepare Backend**

Add a `start` script to backend `package.json`:

```json
{
  "name": "backend",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### **Step 2: Create Render Account**
1. Go to [render.com](https://render.com)
2. Click "Sign up"
3. Choose "GitHub"
4. Authorize Render to access your repositories

### **Step 3: Create Web Service**
1. In Render dashboard, click "New +" → "Web Service"
2. Click "Connect a repository"
3. Search for "Dotix-job-scheduler" and connect
4. Select it from the list

### **Step 4: Configure Service**

**Fill in these details:**

| Field | Value |
|-------|-------|
| **Name** | job-scheduler-backend |
| **Environment** | Node |
| **Region** | Choose closest to you (US East recommended) |
| **Branch** | main |
| **Build Command** | `npm install` |
| **Start Command** | `node backend/server.js` |
| **Plan** | Free (or Starter for better uptime) |

### **Step 5: Add Environment Variables**

Click "Advanced" and add:

```
WEBHOOK_URL=https://webhook.site/YOUR-UNIQUE-ID
NODE_ENV=production
```

**How to get WEBHOOK_URL:**
1. Go to [webhook.site](https://webhook.site)
2. You'll get a unique URL automatically
3. Copy it and paste in Render

### **Step 6: Deploy**
1. Click "Create Web Service"
2. Render will build and deploy (3-5 minutes)
3. Once deployed, you'll get a live URL like: `https://job-scheduler-xxxxx.onrender.com`

### **Step 7: Update Frontend**
After backend is deployed:
1. Go back to Vercel
2. Go to Project Settings → Environment Variables
3. Update `NEXT_PUBLIC_API_URL` to your new Render backend URL
4. Redeploy frontend

---

## 📱 ALTERNATIVE: Deploy Backend to Railway

If you prefer Railway instead of Render:

### **Step 1: Create Railway Account**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Authorize Railway

### **Step 2: Create Project**
1. Click "Create New Project"
2. Select "Deploy from GitHub repo"
3. Find and select your repository

### **Step 3: Configure**
1. Select `backend` directory
2. Add environment variables:
   - `WEBHOOK_URL=https://webhook.site/YOUR-ID`
   - `NODE_ENV=production`
3. Railway auto-detects Node.js

### **Step 4: Deploy**
Railway automatically deploys on every GitHub push!

---

## 🔐 STEP 3: CONFIGURE WEBHOOK SERVICE

### **Option A: Use webhook.site (Free)**

1. Go to [webhook.site](https://webhook.site)
2. Copy your unique URL
3. Paste in backend `.env`: `WEBHOOK_URL=https://webhook.site/your-id`
4. Any requests will appear on the page

### **Option B: Use Custom Service**

Create a simple webhook receiver:

```javascript
// webhook-receiver.js (on your server)
app.post('/webhooks/job-complete', (req, res) => {
    const { jobId, taskName, status } = req.body;
    console.log(`Job ${jobId} (${taskName}) completed!`);
    
    // Send email, update database, etc.
    res.json({ received: true });
});
```

---

## 🗄️ STEP 4: DATABASE MIGRATION (Optional for Production)

SQLite works for deployment, but for production, consider PostgreSQL:

### **Migrate to PostgreSQL on Render:**

1. In Render dashboard, create PostgreSQL database
2. Update backend database config:

```javascript
// Instead of SQLite
const pg = require('pg');

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

// Use pool instead of sqlite3
```

3. Add to environment variables:
```
DATABASE_URL=postgres://user:password@host/dbname
```

---

## ✅ DEPLOYMENT CHECKLIST

### **Before Deploying:**
- [ ] All code committed to GitHub
- [ ] `.env` file NOT committed (add to `.gitignore`)
- [ ] `package.json` has correct scripts
- [ ] No hardcoded localhost URLs
- [ ] All dependencies listed in `package.json`

### **After Deploying:**
- [ ] Frontend loads without errors
- [ ] Can create a job
- [ ] Can run a job
- [ ] Status updates in real-time
- [ ] Can delete jobs
- [ ] Filters work
- [ ] Navigate to detail page
- [ ] No console errors

### **Monitoring:**
- [ ] Check Vercel analytics
- [ ] Check Render logs for errors
- [ ] Monitor webhook deliveries
- [ ] Set up error alerts

---

## 🐛 TROUBLESHOOTING

### **Frontend shows "Cannot connect to API"**

**Problem:** Frontend can't reach backend

**Solution:**
1. Check `NEXT_PUBLIC_API_URL` environment variable
2. Ensure backend URL is correct (copy from Render)
3. Verify backend is running (visit URL in browser)
4. Check browser console for CORS errors

### **Backend throws database error**

**Problem:** SQLite path issue on Render

**Solution:**
```javascript
// Use /tmp for temporary storage on Render
const dbPath = process.env.NODE_ENV === 'production' 
    ? '/tmp/scheduler.db'
    : path.resolve(__dirname, 'scheduler.db');
```

### **Webhook not triggering**

**Problem:** External service not receiving webhook

**Solution:**
1. Check `WEBHOOK_URL` is correct
2. Test with webhook.site first
3. Check backend logs for errors
4. Verify firewall/CORS on webhook receiver

### **Jobs not persisting after restart**

**Problem:** SQLite data lost on Render free tier

**Solution:**
- Render free tier resets database weekly
- Use PostgreSQL for persistent data
- Or use Render's persistent disk storage

---

## 📊 MONITORING & MAINTENANCE

### **Vercel Monitoring**
- Go to Vercel dashboard
- Check "Analytics" for traffic
- Monitor "Deployments" for build status
- View "Logs" for errors

### **Render Monitoring**
- Go to Render dashboard
- Check "Metrics" for CPU/Memory
- View "Logs" for application errors
- Monitor uptime

### **Health Checks**
Test your APIs regularly:

```bash
# Test backend is alive
curl https://your-backend.com/jobs

# Test webhook
curl -X POST https://your-backend.com/run-job/1
```

---

## 🔄 REDEPLOYMENT (Updates)

### **To deploy updates:**

1. **Make changes locally**
   ```bash
   git add .
   git commit -m "Update description"
   git push origin main
   ```

2. **Vercel** - Auto-deploys on push
   - Check Vercel dashboard for status
   - Takes 1-2 minutes

3. **Render** - Auto-deploys on push
   - Check Render dashboard for status
   - Takes 2-5 minutes

---

## 💰 COST ESTIMATION

| Service | Plan | Cost/Month | Notes |
|---------|------|-----------|-------|
| Vercel | Pro | Free (Hobby) | Perfect for next.js |
| Render | Free | $0 | Limited uptime |
| Render | Starter | $7 | Better uptime |
| PostgreSQL | Starter | $15 | If needed |
| Webhook.site | Free | $0 | For testing |

**Recommendation:** Start free, upgrade as traffic grows

---

## 🎯 NEXT STEPS

1. **Deploy Frontend to Vercel**
2. **Deploy Backend to Render**
3. **Test all features** in production
4. **Set up monitoring** and alerts
5. **Configure webhook** for job completions
6. **Document** your live URLs

---

## 📚 USEFUL RESOURCES

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Node.js Hosting](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---

**Your project is ready for production! Good luck! 🚀**
