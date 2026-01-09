# Dotix – Job Scheduler & Automation System

Dotix is a full-stack job scheduling and automation system that allows users to create, manage, and execute jobs with priorities. Once a job is completed, the system automatically triggers a webhook with job details.

This project is designed to demonstrate backend job processing, REST APIs, database integration, and a modern frontend dashboard.

---

## 🚀 Live Demo

- **Frontend:** [https://job-scheduler-ten.vercel.app](https://job-scheduler-ten.vercel.app)
- **Backend API:** [https://job-scheduler-6xvu.onrender.com](https://job-scheduler-6xvu.onrender.com)
- **GitHub Repository:** [github.com/Pavandumpeti/Dotix-job-scheduler](https://github.com/Pavandumpeti/Dotix-job-scheduler)

---

## ✨ Features

- ✅ Create jobs with task name, payload, and priority
- ✅ View all jobs in a beautiful dashboard
- ✅ Run jobs manually with async execution
- ✅ Track job status (pending → running → completed)
- ✅ Trigger webhook automatically after job completion
- ✅ Filter jobs by status and priority
- ✅ RESTful API design with 5 core endpoints
- ✅ Real-time UI updates with auto-refresh
- ✅ Modern, responsive design with Tailwind CSS
- ✅ Type-safe development with TypeScript

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - REST API framework
- **SQLite** - Lightweight database
- **Axios** - HTTP client for webhooks
- **Dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

### Frontend
- **Next.js 16** - React meta-framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icon library

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **Webhook.site** - Webhook testing

---

## 📁 Project Structure

```
root/
├── frontend/                  # Next.js Application
│    ├── src/
│    │   ├── app/
│    │   │   ├── page.tsx              # Dashboard (main page)
│    │   │   ├── layout.tsx            # Root layout
│    │   │   ├── globals.css           # Global styles
│    │   │   └── jobs/[id]/page.tsx    # Job detail page
│    │   └── utils/api.ts              # API client functions
│    ├── package.json
│    ├── tailwind.config.ts
│    └── next.config.ts
│
└── backend/                   # Express Server
     ├── server.js             # Main app entry point
     ├── config/db.js          # Database configuration
     ├── controllers/jobController.js  # Business logic
     ├── utils/webhook.js      # Webhook trigger service
     ├── package.json
     └── .env.example          # Environment template
```
Copy code

---

## 🗄️ Database Schema

```sql
CREATE DATABASE dotix;
USE dotix;

CREATE TABLE jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  taskName VARCHAR(255) NOT NULL,
  payload JSON,
  priority VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  completedAt TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
⚙️ Backend Setup
bash
Copy code
cd backend
npm install
npm run dev
Create .env file:

env
Copy code
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=dotix
WEBHOOK_URL=https://webhook.site/your-id
Backend runs at:

arduino
Copy code
http://localhost:5000
🎨 Frontend Setup
bash
Copy code
cd frontend
npm install
npm run dev
Create .env.local file:

env
Copy code
NEXT_PUBLIC_API_URL=http://localhost:5000
Frontend runs at:

arduino
Copy code
http://localhost:3000
🔌 API Endpoints
Create Job
bash
Copy code
POST /jobs
Get All Jobs
bash
Copy code
GET /jobs
Get Job by ID
bash
Copy code
GET /jobs/:id
Run Job
bash
Copy code
POST /run-job/:id
🔔 Webhook Behavior
When a job is completed, a POST request is sent to the configured webhook URL.

Payload includes:

Job ID

Task Name

Priority

Payload

Completion timestamp

🧠 How It Works
User creates a job from UI

Job is stored in MySQL with pending status

User clicks Run Job

Backend updates job status to running

Simulated execution completes

Job status updates to completed

Webhook is triggered automatically

🤖 AI Usage Disclosure
AI was used for:

Code optimization

Architecture guidance

Documentation formatting

All logic was reviewed, tested, and customized manually.

✅ Status
✔ Backend implemented
✔ Frontend implemented
✔ Database integrated
✔ Webhook functional
