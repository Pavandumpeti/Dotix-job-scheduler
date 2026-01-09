# 🎬 DOTIX JOB SCHEDULER - 5 MINUTE VIDEO EXPLANATION SCRIPT

---

## **[0:00-0:15] INTRODUCTION**

**[Show homepage/dashboard on screen]**

**Narration:**
"Hello! I'm presenting **DOTIX Job Scheduler**, a full-stack automation engine built with modern web technologies. This application allows users to create, execute, and monitor background jobs in real-time with webhook integrations."

**Visual:** Show the beautiful dashboard with the form on the left and jobs table on the right.

---

## **[0:15-0:45] ARCHITECTURE OVERVIEW**

**[Show architecture diagram or split screen with frontend and backend]**

**Narration:**
"The project uses a **three-tier architecture**:

1. **Frontend Layer** - Built with Next.js 16 and React 19, providing a modern, responsive UI
2. **Backend Layer** - Node.js with Express handling REST APIs
3. **Database Layer** - SQLite for persistent data storage

The frontend communicates with the backend via REST APIs on localhost:3001, and the backend can trigger external webhooks when jobs complete."

**Key Points to Show:**
- Frontend running on port 3000
- Backend running on port 3001
- Database operations flow
- Webhook integration arrow

---

## **[0:45-1:30] BACKEND ROUTES & API ENDPOINTS**

**[Show terminal with backend running, then switch to API documentation screen]**

**Narration:**
"Let me walk you through all the **5 API routes**:"

### **Route 1: POST /jobs - CREATE JOB**

**[Show the create endpoint diagram]**

**Narration:**
"**POST /jobs** - Creates a new job. You send a JSON payload with:
- Task name (required) - what the job should do
- Priority level - Low, Medium, or High
- Payload data (optional) - custom key-value pairs for the job

**Example Request:**"
```
POST http://localhost:3001/jobs
{
  "taskName": "Generate Invoice",
  "priority": "High",
  "payload": {
    "customerId": "C123",
    "amount": 500
  }
}
```

**Response:**
```
{
  "id": 5,
  "taskName": "Generate Invoice",
  "priority": "High",
  "status": "pending"
}
```

**Code Highlight:** The database automatically generates an ID and sets status to 'pending'. The payload is stored as a JSON string."

---

### **Route 2: GET /jobs - FETCH ALL JOBS**

**[Show the jobs table on screen]**

**Narration:**
"**GET /jobs** - Retrieves all jobs with optional filtering. This endpoint supports two query parameters:

1. **?status=pending** - Filter by status (pending, running, or completed)
2. **?priority=High** - Filter by priority level

You can combine both filters."

**Example Requests:**"
```
GET /jobs                              → Returns ALL jobs
GET /jobs?status=pending               → Only pending jobs
GET /jobs?priority=High                → Only high priority
GET /jobs?status=completed&priority=Low → Both filters combined
```

**Visual:** Show the real table updating as you click the filters in the UI."

**Narration:**
"The query builder dynamically adds SQL WHERE clauses and returns results sorted by most recent first."

---

### **Route 3: POST /run-job/:id - EXECUTE JOB** ⭐

**[Show animation/diagram of the execution flow]**

**Narration:**
"**POST /run-job/:id** - This is the **core feature**. When you click the 'Run' button on any pending job, here's what happens:

**Step 1 (Immediately):**
- Backend marks the job status as 'running' in the database
- Responds to the frontend with 'Job started'

**Step 2 (Frontend receives response):**
- Dashboard immediately shows the job as 'running' with a spinner icon
- No waiting for the server!

**Step 3 (Background - 3 second simulation):**
- Backend waits 3 seconds (simulating long-running work like PDF generation or email sending)

**Step 4 (Completion):**
- Updates job status to 'completed' with a timestamp
- Fetches the full job details

**Step 5 (Webhook trigger):**
- Calls the webhook service to notify external systems
- Sends all job data to the configured webhook URL

**Step 6 (Frontend detection):**
- Dashboard auto-refreshes every 4 seconds
- User sees the job status change from 'running' to 'completed'

This **non-blocking pattern** is crucial for good user experience!"

**Visual:** Show the job transitioning through states in real-time on the dashboard.

---

### **Route 4: GET /jobs/:id - JOB DETAILS**

**[Click on a job row to navigate to detail page]**

**Narration:**
"**GET /jobs/:id** - Fetches complete details for a single job.

When you click on any job in the table, it navigates to `/jobs/5` (where 5 is the job ID). The detail page fetches all information:"

```
GET http://localhost:3001/jobs/5

Returns:
{
  "id": 5,
  "taskName": "Generate Invoice",
  "priority": "High",
  "status": "completed",
  "payload": "{\"customerId\":\"C123\",\"amount\":500}",
  "createdAt": "2026-01-09T10:15:00Z",
  "completedAt": "2026-01-09T10:15:03Z"
}
```

**Visual:** Show the detail page displaying all this information formatted nicely with the payload shown as pretty JSON."

**Narration:**
"Perfect for viewing complete job history and debugging."

---

### **Route 5: DELETE /jobs/:id - REMOVE JOB**

**[Show delete button and confirmation dialog]**

**Narration:**
"**DELETE /jobs/:id** - Permanently removes a job from the database.

When you click the trash icon and confirm, it sends:"

```
DELETE http://localhost:3001/jobs/5
```

**Visual:** Show a job disappearing from the table after deletion.

**Narration:**
"The job is completely removed from the database and the list refreshes."

---

## **[1:30-3:15] FRONTEND COMPONENTS & PAGES**

**[Show the frontend code in an editor]**

**Narration:**
"Now let's explore the **frontend architecture** which has three main components:"

### **Component 1: API Service Layer** (`utils/api.ts`)

**[Show the file]**

**Narration:**
"This is the **communication bridge** between React and the backend. It contains 6 exported functions:

1. **fetchJobs()** - General-purpose job fetching
2. **createJob()** - Sends POST request with new job data
3. **runJob()** - Triggers job execution
4. **getJobDetail()** - Gets single job by ID
5. **fetchJobsFiltered()** - Smart fetching with optional status and priority filters
6. **deleteJob()** - Removes a job

**Key Benefits:**
- Centralized API management
- Single place to change the API URL for production
- Easy to maintain and test
- Type-safe with TypeScript

**Visual:** Highlight how each function maps to a backend route."

---

### **Component 2: Dashboard Page** (`app/page.tsx`) - MAIN PAGE

**[Show the dashboard layout with annotations]**

**Narration:**
"This is the **main dashboard** - the heart of the application. It has three sections:

---

### **SECTION A: Left Panel - Create Job Form**

**[Highlight the form area]**

**Narration:**
"The **Create Job Form** consists of four parts:

**1. Task Name Input:**
- Simple text input where you type the job description
- Required field - shows error if empty
- Example: 'Generate Invoice', 'Send Email', 'Process Report'

**2. Priority Dropdown:**
- Three options: Low, Medium, High
- Defaults to 'Medium'
- Uses simple HTML select element

**3. Payload Builder:**
- Dynamic key-value pair system
- Two inputs: Key and Value
- 'Add Pair' button adds to the list
- Each pair displays as a pill/badge
- 'X' button removes individual pairs

**State Management:**
- taskName - stores input text
- priority - stores selected level
- kvPairs - array of {key, value} objects
- currKey/currValue - temporary inputs

**4. Create Button:**
- Green gradient button
- Triggers handleCreate() function
- Clears form after successful submission
- Refreshes job list immediately

**Visual:** Fill out a form and show the payload builder working in real-time."

---

### **SECTION B: Right Panel - Job Filters**

**[Highlight filter area]**

**Narration:**
"Two dropdown filters allow you to search jobs:

**Status Filter:**
- All Status (default)
- Pending - jobs waiting to run
- Running - jobs currently executing
- Completed - finished jobs

**Priority Filter:**
- All Priority (default)
- Low, Medium, High

**Key Feature:** These filters update the query parameters and trigger auto-refresh to show relevant jobs only.

**Refresh Button:** Manual refresh if you want immediate updates instead of waiting 4 seconds.

**Visual:** Show filters changing the table dynamically."

---

### **SECTION C: Right Panel - Jobs Table**

**[Show the table with all columns]**

**Narration:**
"The **Jobs Table** displays all your jobs with five columns:

**Column 1 - Task:**
- Job name with ID below
- Click to navigate to detail page
- Full row is clickable

**Column 2 - Priority:**
- Color-coded badges
- Red for High (bg-red-100, text-red-700)
- Amber for Medium (bg-amber-100)
- Green for Low (bg-emerald-100)
- Helps at-a-glance prioritization

**Column 3 - Payload:**
- Displays key-value pairs as pills
- Example: [customerId: 123] [amount: 500]
- Shows 'No data' if empty
- Shows 'Bad JSON' if parsing fails

**Column 4 - Status:**
- **Pending:** Clock icon, gray text
- **Running:** Spinner icon, blue text (animating)
- **Completed:** Checkmark icon, green text
- Real-time status updates

**Column 5 - Actions:**
- **Run Button (for pending jobs):**
  - Black button with play icon
  - Only visible for pending jobs
  - Triggers the 3-second simulation
  - Changes to completed status

- **Delete Button (all jobs):**
  - Trash icon
  - Red on hover
  - Shows confirmation dialog
  - Removes from database

**Table Features:**
- Hover effect highlights rows in light blue
- Click any row to view full details
- Striped dividers between rows
- Auto-refresh every 4 seconds shows status changes

**Visual:** Run a job and show status transitioning in real-time."

---

### **Key Hooks & State Management in Dashboard:**

**[Show code snippets]**

**Narration:**
"The component uses several React hooks:

**useState:**
- Manages all form inputs and filters
- Tracks jobs array from API

**useEffect:**
- Loads jobs on component mount
- Sets up 4-second auto-refresh interval
- Cleans up interval on unmount
- Re-runs when filters change

**useRouter:**
- Navigation to detail page
- From Next.js navigation API

**Visual:** Show how dependencies in useEffect control when data refreshes."

---

### **Component 3: Job Detail Page** (`app/jobs/[id]/page.tsx`)

**[Navigate to a job detail page]**

**Narration:**
"The **Detail Page** shows complete information for a single job. It's accessed via `/jobs/[id]` - a dynamic route.

**What it displays:**
- Job ID and title
- Task name
- Priority level
- Current status
- Creation timestamp
- Completion timestamp (if completed)
- **Payload as formatted JSON** - Pretty-printed with indentation

**How it works:**
1. useParams() extracts the ID from the URL
2. useEffect calls getJobDetail(id) on mount
3. Loading state shows 'Loading...' while fetching
4. Once loaded, displays all job information
5. Payload JSON is parsed and formatted nicely in a code block

**Back Button:**
- Returns to dashboard
- Uses router.push('/')

**Visual:** Show clicking through jobs and viewing their details, then going back."

---

## **[3:15-4:15] STYLING & USER EXPERIENCE**

**[Show the styled components]**

**Narration:**
"The entire application uses **Tailwind CSS** for styling, providing a modern, professional look.

**Design System:**

**Color Palette:**
- Primary: Blue-600 for main actions
- Success: Green-600/Emerald for completed jobs
- Warning: Amber for medium priority
- Danger: Red for high priority and deletions
- Neutral: Slate colors for text and backgrounds

**Typography:**
- Headers are bold with tight letter-spacing
- System fonts (Segoe UI, Roboto) for cross-platform consistency
- Font smoothing enabled for crisp rendering

**Components:**
- **Forms:** Light backgrounds with blue focus rings
- **Buttons:** Gradient overlays with smooth transitions
- **Cards:** White backgrounds with subtle shadows and borders
- **Badges:** Inline-block pills with rounded corners
- **Table:** Gradient header, divided rows, hover effects

**Responsiveness:**
- Mobile-first approach
- Grid layout adapts from 1 column (mobile) to 3 columns (desktop)
- Touch-friendly button sizes
- Readable text sizes on all screens

**Visual:** Hover over buttons, show focus states, resize browser to show responsive design."

**Narration:**
"Every interactive element has smooth transitions for a polished feel. The UI provides immediate visual feedback for all actions."

---

## **[4:15-4:45] BACKEND INTERNALS & WEBHOOK**

**[Show terminal and backend code]**

**Narration:**
"Behind the scenes, the **backend** does several sophisticated things:

**1. Database Management:**
- SQLite database with one 'jobs' table
- Auto-creates table on startup
- Stores everything efficiently
- Easy to migrate to PostgreSQL for production

**2. Job Execution Simulation:**
- Non-blocking async pattern
- Responds to client immediately
- Runs background task with setTimeout
- Perfect for real-world background jobs

**3. Webhook Integration:**
When a job completes, the system automatically sends a POST request to a configured webhook URL with:"

```json
{
  "jobId": 5,
  "taskName": "Generate Invoice",
  "priority": "High",
  "payload": { "customerId": "C123", "amount": 500 },
  "completedAt": "2026-01-09T10:15:03Z"
}
```

**Narration:**
"This webhook can trigger external systems like:
- Sending notification emails
- Updating CRM databases
- Logging to analytics platforms
- Starting downstream workflows

**Error Handling:**
- Database errors return proper HTTP status codes
- Invalid requests show descriptive messages
- Webhook failures log to console but don't crash the system

**Visual:** Show successful webhook log in the terminal."

---

## **[4:45-5:00] CONCLUSION & LIVE DEMO**

**[Show the running application with all features working]**

**Narration:**
"Let me show you everything working together:

**Live Demo:**
1. Create a new job with task name 'Send Notification' and payload
2. Click Create - job appears in table as 'Pending'
3. Click Run - job status changes to 'Running' with spinner
4. Wait 3 seconds - status automatically changes to 'Completed' ✓
5. Click on the job - navigate to detail page with all info
6. Filters work - show only completed/high priority jobs
7. Delete a job - shows confirmation and removes it

**Key Takeaways:**
✅ Full-stack architecture with modern tech stack
✅ RESTful API design with 5 core routes
✅ Real-time UI updates with auto-refresh
✅ Non-blocking async job execution
✅ Webhook integration for external systems
✅ Professional styling and UX
✅ Type-safe development with TypeScript

**Potential Extensions:**
- Add user authentication
- Implement job scheduling (cron patterns)
- Add database migrations for PostgreSQL
- Real job queue system (Bull/RabbitMQ)
- WebSocket for true real-time updates
- Webhook retry logic and history
- Job templates and recurring jobs

**Conclusion:**
This project demonstrates professional full-stack development practices suitable for production environments. Thank you for watching!"

**[Show ending screen with project links]**

---

## **TIMING BREAKDOWN**

| Section | Time | Duration |
|---------|------|----------|
| Introduction | 0:00-0:15 | 15 sec |
| Architecture | 0:15-0:45 | 30 sec |
| Backend Routes | 0:45-1:30 | 45 sec |
| Route Details | 1:30-3:15 | 105 sec |
| Frontend Components | (included above) | |
| Styling & UX | 3:15-4:15 | 60 sec |
| Backend Internals | 4:15-4:45 | 30 sec |
| Live Demo & Conclusion | 4:45-5:00 | 15 sec |
| **TOTAL** | | **300 sec (5 min)** |

---

## **VISUAL AIDS TO PREPARE**

1. **Architecture Diagram** - Show layers and connections
2. **API Route Map** - All 5 endpoints with request/response
3. **Data Flow Diagram** - Job creation and execution flow
4. **Component Hierarchy** - How React components organize
5. **Database Schema** - Table structure visualization
6. **Timeline Animation** - Job execution stages
7. **Color Palette** - Design system colors

---

## **DEMO CHECKLIST**

Before recording:
- [ ] Backend running on port 3001
- [ ] Frontend running on port 3000
- [ ] Database initialized with sample data
- [ ] Webhook URL configured
- [ ] Browser console clear (no errors)
- [ ] Screen resolution set to 1920x1080 (or 1440x900)
- [ ] Font sizes visible
- [ ] Tab order: Dashboard → Detail Page → Back
- [ ] Test all filters working
- [ ] Test create job flow
- [ ] Test run job flow
- [ ] Test delete with confirmation
- [ ] Auto-refresh showing updates

---

## **NARRATION TIPS**

- Speak clearly and at moderate pace
- Emphasize key technical terms
- Pause for visual transitions
- Use present tense when describing features
- Show enthusiasm for the project
- Refer to visual elements as you mention them
- Avoid "um" and "uh" fillers
- Background music: Soft, non-distracting tech background

---

## **RECORDING SETUP**

**Software:**
- OBS Studio (free) or ScreenFlow (Mac)
- Screen recording + voice narration
- Editor: DaVinci Resolve (free) or Adobe Premiere

**Screen:**
- Hide browser tabs/extensions
- Zoom to 125-150% for visibility
- Use light theme for clarity
- Dark terminal on light background

**Audio:**
- Good quality microphone
- Noise-free environment
- Proper gain levels (not too loud/quiet)
- Record in WAV for quality, convert to MP3

**Quality:**
- 1080p resolution minimum
- 30-60 FPS
- 48kHz audio sample rate
- 2-3 Mbps video bitrate

---

**Good luck with your video submission! This project is impressive and deserves a great explanation! 🚀**
