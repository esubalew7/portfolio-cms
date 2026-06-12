# MERN Portfolio — System Documentation

> **Full-Stack MERN Application** 
> **Author:** Esubalew Molla  
> **Version:** 1.0.0  
> **Last Updated:** June 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Frontend Workflow](#3-frontend-workflow)
4. [Backend Workflow](#4-backend-workflow)
5. [Database Design](#5-database-design)
6. [Authentication System](#6-authentication-system)
7. [Project Management System](#7-project-management-system)
8. [Visitor Analytics System](#8-visitor-analytics-system)
9. [Performance Optimization](#9-performance-optimization)
10. [Deployment Architecture](#10-deployment-architecture)
11. [Future Improvements](#11-future-improvements)

---

## 1. Project Overview

### Project Purpose

The MERN Portfolio is a full-stack web application that serves as a professional portfolio website for Esubalew Molla, a Computer Science student and MERN Stack Developer. It demonstrates real-world software engineering practices including REST API design, JWT authentication, database integration, dynamic UI rendering, visitor analytics, and cloud-based image management.

### Business Goal

- Establish a professional online presence to showcase technical skills, projects, and experience
- Provide a platform for potential employers and clients to learn about the developer and initiate contact
- Demonstrate proficiency in the MERN stack (MongoDB, Express.js, React.js, Node.js)
- Collect and visualize visitor analytics to understand portfolio engagement

### Target Users

| User Role | Description | Access Level |
|-----------|-------------|-------------|
| **Visitors** (General Public) | Recruiters, employers, peers, collaborators | Public portfolio pages only |
| **Administrator** (Self) | Portfolio owner managing content | Full admin dashboard access |

### Main Features

| Feature | Category | Description |
|---------|----------|-------------|
| Interactive Portfolio | Public | Hero section with typewriter effect, particle background, animated counters |
| Skills Display | Public | Animated progress bars across 5 skill categories |
| Project Showcase | Public | Filterable project grid with live demo and GitHub links |
| Contact Form | Public | Server-side validated form that stores messages in MongoDB |
| Interactive Terminal | Public | In-browser CLI that responds to `help`, `about`, `skills`, `projects`, `experience`, `contact`, `clear`, `download` |
| Dark/Light Mode | Public | Theme toggle persisted to localStorage, respects system preference |
| Admin Dashboard | Private | Overview stats, recent activity feed |
| Project Management | Private | Full CRUD with Cloudinary image upload |
| Message Inbox | Private | Read, search, reply-to, and delete contact messages |
| Notification System | Private | Real-time unread count, dropdown with auto-refresh |
| Visitor Analytics | Private | 6 metric cards, area/bar/pie charts, location data, device distribution |
| Google OAuth | Private | Sign in with Google using server-side token verification |
| JWT Authentication | Private | Expiring tokens with axios interceptor-based auto-refresh |

---

## 2. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Vite + React 18)                    │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐  ┌─────────────────┐  │
│  │ Browser  │→ │ index.html│→ │ main.jsx   │→ │ App.jsx         │  │
│  │ (User)   │  │ (SPA)     │  │ (React DOM)│  │ (Root + Routes) │  │
│  └──────────┘  └──────────┘  └────────────┘  └─────────────────┘  │
│                                                     │               │
│                    ┌──────────────────────────────────┼───────────┐ │
│                    │        ROUTER (React Router)      │           │ │
│                    │  / → MainLayout → Home            │           │ │
│                    │  /login → Login                   │           │ │
│                    │  /dashboard → ProtectedRoute      │           │ │
│                    │    ├── index → Dashboard          │           │ │
│                    │    ├── projects → DashboardProjects│          │ │
│                    │    ├── messages → Messages         │          │ │
│                    │    └── analytics → Analytics       │          │ │
│                    └──────────────────┬────────────────┘           │
│                                       │                            │
│              ┌─────────────────────────┼────────────────────────┐  │
│              │    CONTEXT (Global State)│                        │  │
│              │  ThemeContext (dark mode)│                        │  │
│              │  ProjectContext (CRUD)   │                        │  │
│              │  ToastContext (notifs)   │                        │  │
│              └─────────────────────────┼────────────────────────┘  │
│                                        │                            │
│              ┌─────────────────────────┼────────────────────────┐  │
│              │    HOOKS (Custom Logic)  │                        │  │
│              │  useTypewriter          │                        │  │
│              │  useVisitorTracking     │                        │  │
│              │  useTrackSection        │                        │  │
│              │  useTerminal            │                        │  │
│              └─────────────────────────┼────────────────────────┘  │
│                                        │                            │
│              ┌─────────────────────────┼────────────────────────┐  │
│              │    UTILITY (api.js)      │                        │  │
│              │  axios.create(baseURL)  │                        │  │
│              │  Request interceptor    │  ← JWT auto-attach     │  │
│              │  Response interceptor   │  ← 401 redirect        │  │
│              │  .get / .post / .put / .delete  → unwrap res.data│  │
│              └─────────────────────────┼────────────────────────┘  │
└────────────────────────────────────────┼───────────────────────────┘
                                         │ HTTPS (JSON)
                                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SERVER (Express.js on Node.js)                    │
│                                                                     │
│  ┌──────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │ server.js│→ │ app.js           │  │  Routes                   │  │
│  │ (entry)  │  │ CORS → JSON →    │  │  /api/auth/*              │  │
│  │          │  │ Mount all routes  │  │  /api/contact/*           │  │
│  └──────────┘  └──────────────────┘  │  /api/projects/*          │  │
│                                       │  /api/analytics/*        │  │
│                    ┌──────────────────┼  /api/dashboard/*        │  │
│                    │  MIDDLEWARE       │  /api/notifications/*    │  │
│                    │  authMiddleware   │  /api/upload/*           │  │
│                    │  upload (multer+  │  / (health check)        │  │
│                    │    Cloudinary)    └──────────┬───────────────┘  │
│                    └──────────────────┼           │                  │
│                                       │           ▼                  │
│                    ┌──────────────────┼──────────────────────────┐  │
│                    │  CONTROLLERS      │  SERVICES                │  │
│                    │  authController   │  googleAuthService       │  │
│                    │  projectController│                          │  │
│                    │  contactController│  ┌────────────────────┐  │  │
│                    │  analyticsCtrl    │  │ Cloudinary CDN     │  │  │
│                    │  dashboardCtrl    │  │ (image hosting)    │  │  │
│                    │  notificationCtrl │  └────────────────────┘  │  │
│                    │  uploadController  │                          │  │
│                    └──────────────────┼──────────────────────────┘  │
│                                       │                             │
│                                       ▼                             │
│                    ┌────────────────────────────────────────────┐  │
│                    │  MODELS (Mongoose ODM)                     │  │
│                    │  User, Project, Contact, Visitor,           │  │
│                    │  Notification                               │  │
│                    └────────────────────┬───────────────────────┘  │
└─────────────────────────────────────────┼──────────────────────────┘
                                          │
                                          ▼
                    ┌────────────────────────────────────────────┐
                    │            MongoDB Atlas (Cloud)            │
                    │  ├── portfolio-db                           │
                    │  │   ├── users                             │
                    │  │   ├── projects                          │
                    │  │   ├── contacts                          │
                    │  │   ├── visitors                          │
                    │  │   └── notifications                     │
                    └────────────────────────────────────────────┘
```

### Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **SPA with React Router** | Enables seamless navigation without page reloads, better UX |
| **Separate client/server** | Clear separation of concerns, independent scaling, deployable to different hosts |
| **Vite over CRA** | Faster dev server (ESM-based), smaller build output |
| **Express 5** | Latest Express version with async error handling improvements |
| **Mongoose ODM** | Schema validation, middleware hooks (bcrypt pre-save), relationship references |
| **Context API over Redux** | Sufficient for this scale; avoids boilerplate overhead |
| **Cloudinary for images** | CDN delivery, automatic optimization, on-the-fly transformations |
| **JWT stored in localStorage** | Simple for single-admin scenario; HttpOnly cookies recommended for multi-user |

### Tech Stack Summary

```
FRONTEND                          BACKEND
React 18                          Node.js
Vite 8                            Express 5
React Router 7                    Mongoose 9
Tailwind CSS 3                    MongoDB Atlas
Framer Motion 12                  JWT (jsonwebtoken)
Axios                             bcryptjs
Recharts 3                        Cloudinary (multer)
tsParticles                       geoip-lite
Google OAuth React                google-auth-library
Lucide React                      request-ip
```

---

## 3. Frontend Workflow

### 3.1 Routing

Routing is handled by `react-router-dom` v7 with a nested route structure:

```
<BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
    </Route>
    <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
      <Route index element={<Dashboard />} />
      <Route path="projects" element={<DashboardProjects />} />
      <Route path="messages" element={<Messages />} />
      <Route path="analytics" element={<Analytics />} />
    </Route>
  </Routes>
  <ScrollToTop />
</BrowserRouter>
```

**Key behaviors:**
- Public routes (`/`, `/login`) require no authentication
- Dashboard routes are wrapped in `ProtectedRoute` which checks for JWT in `localStorage`
- `MainLayout` renders Navbar + Footer around its child route
- `DashboardLayout` renders sidebar + top navbar around its child routes
- `ScrollToTop` is rendered globally outside routes

### 3.2 Component Hierarchy

```
App.jsx
├── ThemeProvider
│   └── ProjectProvider
│       └── ToastProvider
│           ├── Loader (conditional — 2s splash)
│           ├── Routes
│           │   ├── Login (no layout)
│           │   ├── MainLayout
│           │   │   ├── Navbar
│           │   │   ├── Outlet → Home
│           │   │   │   ├── HeroSection (ParticlesBackground)
│           │   │   │   ├── AboutSection (AnimatedCounter)
│           │   │   │   ├── SkillsSection
│           │   │   │   ├── ProjectsSection (ProjectCard[])
│           │   │   │   ├── TerminalSection (Terminal)
│           │   │   │   ├── ExperienceSection (TimelineItem[], TestimonialsMarquee)
│           │   │   │   └── ContactSection
│           │   │   └── Footer
│           │   └── DashboardLayout (ProtectedRoute)
│           │       ├── Sidebar (navigation, theme toggle, logout)
│           │       ├── Topbar (notifications, admin profile)
│           │       └── Outlet
│           │           ├── Dashboard
│           │           ├── DashboardProjects
│           │           ├── Messages
│           │           └── Analytics
│           └── ScrollToTop
```

### 3.3 Context API — State Management

Three React Context providers wrap the entire application:

#### ThemeContext
- **State:** `isDarkMode` (boolean)
- **Persistence:** Reads from localStorage on mount, falls back to `prefers-color-scheme` media query
- **Effect:** Toggles `dark` class on `<html>` element (Tailwind strategy)
- **Method:** `toggleTheme()`

#### ProjectContext
- **State:** `projects[]`, `loading`, `error`
- **Data flow:**
  1. On mount, `useEffect` calls `fetchProjects()`
  2. On network error (server waking up from sleep), auto-retries after 3 seconds
  3. Listens for `retryProjects` custom event on `window`
- **Methods:** `fetchProjects()`, `addProject()`, `updateProject()`, `deleteProject()`

#### ToastContext
- **State:** `toasts[]` with `{ id, message, type }`
- **Visual:** Fixed bottom-right container with animated slide-in/out
- **Types:** `success` (green), `error` (red), `info` (blue)
- **Auto-dismiss:** 5 seconds with shrinking progress bar

### 3.4 API Communication

The `api.js` utility wraps axios with:

```
Axios Instance
├── baseURL: "http://localhost:5000" (dev) or Render URL (prod)
├── timeout: 30s
│
├── Request Interceptor
│   ├── Reads token from localStorage
│   ├── Attaches Authorization: Bearer <token>
│   └── Handles FormData (deletes Content-Type for boundary)
│
├── Response Interceptor
│   ├── Success: passes through
│   └── Error:
│       ├── If 401 + token existed → clear token → redirect to /login
│       └── Normalizes error object (message, status, data)
│
└── Wrapper Methods (.get/.post/.put/.delete)
    └── Auto-unwrap: response.data returned directly
```

### 3.5 Theme System

```
ThemeContext.tsx
├── Initial state: localStorage('theme') || prefers-color-scheme media query
├── Dark mode active: <html class="dark">
├── Tailwind strategy: class-based dark mode
└── Persistence: localStorage.setItem('theme', 'dark'|'light')

Tailwind Config:
├── darkMode: 'class'
├── Custom color tokens:
│   ├── surface-* (backgrounds)
│   ├── content-* (text colors)
│   ├── border-*
│   ├── accent-*
│   └── terminal-* (dedicated terminal colors)
└── Custom shadows: card, card-hover, elevated, terminal
```

**Theme-aware components:**
- Every component uses `dark:` Tailwind variants
- `ParticlesBackground` changes particle color based on `useTheme()`
- `Navbar` has a dedicated theme toggle button (Sun/Moon icons)
- `DashboardLayout` sidebar includes a theme toggle

### 3.6 Terminal System

The interactive terminal is a fully functional in-browser CLI subsystem.

```
Terminal.jsx
├── Visual: VS Code-inspired dark theme
│   ├── Title bar with window controls (minimize, maximize, close)
│   ├── Command counter display
│   └── Scrollable viewport with auto-scroll
│
├── useTerminal.js (State Hook)
│   ├── lines[] — all output lines
│   ├── input — current input text
│   ├── history[] — command history (up/down arrow navigation)
│   ├── Execute: append input → parse → run handler → append output
│   ├── Clear: reset lines[]
│   └── Autocomplete: Tab key completes commands
│
├── commandParser.js
│   └── Tokenizes input into { command, args, flags } AST
│
├── commandRegistry.js
│   └── Map<command, { description, handler, usage }>
│   ├── help → lists all commands
│   ├── about → developer bio
│   ├── skills → skill categories from inline data
│   ├── projects → fetches from ProjectContext
│   ├── experience → inline experience data
│   ├── contact → contact info
│   ├── clear → resets terminal
│   └── download → resume download link
│
├── TerminalViewport.jsx
│   └── Scrollable container, auto-scrolls on new output
│
├── TerminalLine.jsx
│   └── Renders single output line (typewriter effect optional)
│
├── TerminalPrompt.jsx
│   └── Input field with prompt prefix (user@portfolio:~$)
│
├── TypingEffect.jsx
│   └── Typewriter animation for command output
│
└── terminalConstants.js
    └── Theme colors, prompt format, styling constants
```

### 3.7 Visitor Analytics UI

The analytics dashboard (`pages/dashboard/Analytics.jsx`) fetches 5 parallel endpoints and visualizes:

```
Analytics Page
├── 6 Stat Cards (AnalyticsStatCard)
│   ├── Total Visitors (blue)
│   ├── Unique Visitors (green)
│   ├── Page Views (purple)
│   ├── Returning Visitors (orange)
│   ├── Bounce Rate % (rose)
│   └── Today's Visitors (cyan)
│
├── Area Chart (ChartCard + Recharts AreaChart)
│   ├── Toggle: Daily (30d) / Weekly (12w) / Monthly (12m)
│   └── Gradient fill, custom tooltip
│
├── This Week / This Month Mini Cards
│
├── Location Analytics
│   ├── Unknown traffic indicator (amber warning)
│   ├── Country distribution with horizontal progress bars
│   └── Top cities grid
│
├── Portfolio Analytics
│   ├── Most viewed sections ranking
│   └── Engagement placeholders (social clicks, project clicks)
│
├── Recent Visitors Table
│   ├── Country, City, Device, Browser, Page, Timestamp
│   └── Device icons (Smartphone, Tablet, Monitor)
│
└── Device Distribution Pie Chart (Recharts PieChart)
    ├── Donut chart with Desktop/Mobile/Tablet
    └── Color-coded legend
```

---

## 4. Backend Workflow

### 4.1 Express Server

```
server.js
├── dotenv.config()
├── connectDB() → mongoose.connect(MONGO_URI)
│   └── On failure: log error, process.exit(1)
└── app.listen(PORT)
```

```
app.js
├── cors() — allowed origins:
│   ├── http://localhost:5173, http://localhost:5174
│   └── https://portfolio-mern-one-rho.vercel.app
├── express.json()
├── Route mounting:
│   ├── /api/contact → contactRoutes
│   ├── /api/auth → authRoutes
│   ├── /api/projects → projectRoutes
│   ├── /api/upload → uploadRoutes
│   ├── /api/dashboard → dashboardRoutes
│   ├── /api/notifications → notificationRoutes
│   └── /api/analytics → analyticsRoutes
└── GET / health check → { status: 'ok', timestamp }
```

### 4.2 API Architecture

Each route module follows the same pattern:

```
router.js
├── Import express, controllers, middleware
├── const router = express.Router()
├── Route definitions:
│   ├── Public: router.get('/', controller)
│   ├── Protected: router.get('/', protect, controller)
│   └── With upload: router.post('/', protect, upload.single('image'), controller)
└── export default router
```

### 4.3 Controllers

All controllers follow a consistent pattern:

```javascript
export const actionName = async (req, res) => {
    try {
        // 1. Extract data: req.body, req.params, req.query
        // 2. Validate inputs (return 400 if invalid)
        // 3. Business logic (DB operations, external calls)
        // 4. Return 200/201 with JSON { success, data, message }
    } catch (error) {
        // 5. Log error
        // 6. Return 500 with { success: false, message, error }
    }
};
```

**Controller Summary:**

| Controller | Key Functions | Input | Output |
|------------|---------------|-------|--------|
| `authController` | `register`, `login`, `googleLogin`, `getMe` | Body: `{ email, password }` or `{ credential }` | JWT token or user profile |
| `projectController` | CRUD + cloudinary cleanup | Body + Params | Project document |
| `contactController` | `createContact`, `getAllContacts`, `markMessageAsRead`, `deleteContact` | Body + Params | Contact document |
| `analyticsController` | `trackVisit`, `getOverview`, `getCharts`, `getLocations`, `getPortfolioAnalytics`, `getRecentVisitors` | Body + Params + Query | Analytics data |
| `dashboardController` | `getStats`, `getActivity` | — | Stats + activity feed |
| `notificationController` | `getNotifications`, `markAsRead`, `getUnreadCount` | Body + Params | Notifications |
| `uploadController` | `uploadImage` | File (multipart) | `{ imageUrl, imagePublicId }` |

### 4.4 Middleware

#### authMiddleware.js

```
protect(req, res, next):
├── Check Authorization header for "Bearer <token>"
├── If missing → 401 { success: false, message: "Not authorized, no token" }
├── jwt.verify(token, JWT_SECRET)
│   ├── Invalid → 401 { success: false, message: "Not authorized, token failed" }
│   └── Valid → req.user = decoded (payload: { id })
└── next()
```

#### upload.js

```
upload = multer({
  storage: CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'portfolio-projects',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
  }),
});
```

### 4.5 Services

#### googleAuthService.js

```
verifyGoogleToken(credential):
├── Input: Google OAuth credential string
├── Process: OAuth2Client.verifyIdToken({ idToken, audience })
├── Output: payload { sub, email, name, picture, email_verified }
└── Throws: if invalid token

validateAdminEmail(email):
├── Compares against ADMIN_EMAIL from .env
├── Throws: "Access Denied" if mismatch
└── Returns: normalized email

extractGoogleUserInfo(payload):
├── Input: decoded Google payload
└── Output: { googleId, email, name, picture, emailVerified }
```

### 4.6 Error Handling

The application uses a layered error handling approach:

| Layer | Strategy |
|-------|----------|
| **Controllers** | Try/catch blocks returning structured JSON `{ success, message, error }` |
| **Middleware (auth)** | Returns 401 directly, no `next(err)` pattern |
| **Mongoose** | Schema validation errors propagate to controller catch blocks |
| **Cloudinary** | Non-blocking: log failure but continue (e.g., image delete failure) |
| **Client (axios)** | Response interceptor normalizes errors, 401 triggers session expiry |
| **Client (React)** | Components handle `loading`, `error`, and empty states separately |

---

## 5. Database Design

The application uses **MongoDB Atlas** (cloud-hosted) with 5 collections managed through **Mongoose ODM**.

### 5.1 Users Collection

**Purpose:** Stores admin credentials for authentication.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Auto-generated | Unique identifier |
| `email` | String | Required, unique, lowercase | Admin email address |
| `password` | String | Optional (null for Google-only users) | bcrypt-hashed password |
| `createdAt` | Date | Auto (timestamps) | Account creation date |
| `updatedAt` | Date | Auto (timestamps) | Last update date |

**Hooks:**
- `pre('save')`: Hashes password with bcrypt (salt rounds: 10) if password is present and modified

**Methods:**
- `comparePassword(enteredPassword)`: Returns boolean via bcrypt.compare

**Relationships:** None (standalone collection)

### 5.2 Projects Collection

**Purpose:** Stores portfolio projects displayed on the public site and managed via dashboard.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Auto-generated | Unique identifier |
| `title` | String | Required | Project title |
| `description` | String | Required | Project description |
| `category` | String | Required, enum: `mern`/`frontend`/`backend`/`mobile` | Project category for filtering |
| `technologies` | [String] | Array of strings | Tech stack used |
| `image` | String | Required | Cloudinary URL |
| `imagePublicId` | String | Optional | Cloudinary public ID for deletion |
| `liveLink` | String | Optional | Live demo URL |
| `githubLink` | String | Optional | Source code URL |
| `createdAt` | Date | Default `Date.now` | Creation timestamp |

**Relationships:** None (standalone collection)

**Data flow:** `DashboardProjects.jsx` → `ProjectContext.jsx` → `api.js` → `Express API` → `Mongoose` → `MongoDB`

### 5.3 Contacts Collection

**Purpose:** Stores messages submitted through the public contact form.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Auto-generated | Unique identifier |
| `name` | String | Required | Sender's name |
| `email` | String | Required, lowercase | Sender's email |
| `message` | String | Required | Message body |
| `isRead` | Boolean | Default `false` | Admin read status |
| `createdAt` | Date | Default `Date.now` | Submission timestamp |

**Relationships:** Implicitly linked to `notifications` collection (creating a contact also creates a notification with `type: 'message'`)

### 5.4 Visitors Collection

**Purpose:** Tracks page/section visits for analytics.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Auto-generated | Unique identifier |
| `page` | String | Required | Page or section name (e.g., "home", "projects") |
| `ip` | String | Required | Client IP address |
| `country` | String | Default `"Unknown"` | Geo-located country |
| `city` | String | Default `"Unknown"` | Geo-located city |
| `device` | String | Default `"Desktop"` | Detected device type |
| `browser` | String | Default `"Unknown"` | Detected browser name |
| `userAgent` | String | Default `""` | Raw User-Agent header |
| `createdAt` | Date | Auto (timestamps) | Visit timestamp |

**Indexes:**
- `{ ip: 1, page: 1, createdAt: -1 }` — Optimizes deduplication queries

**Relationships:** None (standalone analytics collection)

### 5.5 Notifications Collection

**Purpose:** Stores admin notifications (triggered by new messages or projects).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Auto-generated | Unique identifier |
| `type` | String | Required, enum: `message`/`project` | Notification category |
| `title` | String | Required | Short title |
| `description` | String | Required | Detail text |
| `isRead` | Boolean | Default `false` | Admin read status |
| `createdAt` | Date | Auto (timestamps) | Creation timestamp |
| `updatedAt` | Date | Auto (timestamps) | Last update |

**Relationships:** Generated as a side effect of `contactController.createContact` and `projectController.createProject`

### Entity Relationship Diagram

```
┌──────────┐     ┌──────────────┐     ┌───────────────┐
│   User   │     │   Project    │     │   Contact     │
│──────────│     │──────────────│     │───────────────│
│ _id      │     │ _id          │     │ _id           │
│ email    │     │ title        │     │ name          │
│ password │     │ description  │     │ email         │
└──────────┘     │ category     │     │ message       │
                 │ technologies │     │ isRead        │
┌──────────┐     │ image (CDN)  │     │ createdAt     │
│  Visitor │     │ liveLink     │     └───────┬───────┘
│──────────│     │ githubLink   │             │
│ _id      │     │ createdAt    │             │ creates
│ page     │     └──────────────┘             │
│ ip       │                                  ▼
│ country  │     ┌───────────────────────────────┐
│ city     │     │       Notification            │
│ device   │     │───────────────────────────────│
│ browser  │     │ _id                           │
│ userAgent│     │ type: 'message' | 'project'   │
│ createdAt│     │ title                         │
└──────────┘     │ description                   │
                 │ isRead                        │
                 │ createdAt                     │
                 └───────────────────────────────┘
```

---

## 6. Authentication System

### 6.1 JWT Authentication

#### Login Flow

```
┌─────────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐
│  User   │     │  Browser  │     │  Server  │     │ MongoDB  │
└────┬────┘     └─────┬─────┘     └────┬─────┘     └────┬─────┘
     │  Enter email   │                │                │
     │  & password    │                │                │
     ├────────────────►│                │                │
     │                │  POST /api/auth/login            │
     │                │  { email, password }             │
     │                ├────────────────►│                │
     │                │                │  Find user      │
     │                │                │  by email       │
     │                │                ├───────────────►│
     │                │                │◄───────────────┤
     │                │                │                │
     │                │                │  bcrypt.compare │
     │                │                │  (password)     │
     │                │                │                │
     │                │                │  jwt.sign({ id },│
     │                │                │  SECRET, {      │
     │                │                │  expiresIn: 7d })│
     │                │                │                │
     │                │◄───────────────┤                │
     │                │ { token }      │                │
     │                │                │                │
     │  Store token   │                │                │
     │  in localStorage│               │                │
     │◄────────────────┤               │                │
     │                │                │                │
     │  Redirect to   │                │                │
     │  /dashboard    │                │                │
     ├────────────────►│               │                │
```

#### Protected Route Flow

```
┌─────────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐
│  User   │     │  Browser  │     │  Server  │     │   API    │
└────┬────┘     └─────┬─────┘     └────┬─────┘     └────┬─────┘
     │  Visit         │                │                │
     │  /dashboard    │                │                │
     ├────────────────►│               │                │
     │                │  ProtectedRoute                 │
     │                │  Check localStorage             │
     │                │  for 'token'                    │
     │                │  │ token exists                 │
     │                │  ▼ Render dashboard             │
     │                │                │                │
     │                │  GET /api/auth/me               │
     │                │  Authorization: Bearer <token>  │
     │                ├────────────────►│                │
     │                │                │  jwt.verify     │
     │                │                │  (token, secret)│
     │                │                │                │
     │                │                │  req.user =    │
     │                │                │  { id }        │
     │                │                │                │
     │                │                │  User.findById  │
     │                │                ├───────────────►│
     │                │                │◄───────────────┤
     │                │◄───────────────┤                │
     │                │ { user data }  │                │
```

#### Token Expiry & Session Management

```
Request (expired token) → Server → 401
↓
Axios Response Interceptor:
├── Status is 401
├── Token exists in localStorage
└── Actions:
    ├── localStorage.removeItem('token')
    └── window.location.href = '/login'
```

**Security considerations:**
- Token expires in 7 days (balance between UX and security)
- Token is stored in `localStorage` (vulnerable to XSS; HttpOnly cookies recommended for production)
- All admin routes apply the `protect` middleware
- Password is hashed with bcrypt (10 salt rounds)
- Email normalization prevents case-sensitivity issues

### 6.2 Google OAuth Authentication

#### Flow

```
┌─────────┐     ┌───────────┐     ┌──────────────┐     ┌──────────┐     ┌──────────┐
│  User   │     │  Browser  │     │   Google      │     │  Server  │     │ MongoDB  │
└────┬────┘     └─────┬─────┘     └──────┬───────┘     └────┬─────┘     └────┬─────┘
     │  Click         │                │                │                │
     │  "Google" btn  │                │                │                │
     ├────────────────►│               │                │                │
     │                │  Google OAuth  │                │                │
     │                │  popup opens   │                │                │
     │                ├───────────────►│                │                │
     │                │◄───────────────┤                │                │
     │                │ { credential } │                │                │
     │                │                │                │                │
     │                │  POST /api/auth/google          │                │
     │                │  { credential }                 │                │
     │                ├────────────────────────────────►│                │
     │                │                │                │                │
     │                │                │  verifyGoogleToken(credential)  │
     │                │                │  ├─ OAuth2Client.verifyIdToken │
     │                │                │  └─ payload { email, sub, ... }│
     │                │                │                │                │
     │                │                │  validateAdminEmail(email)     │
     │                │                │  ├─ Compare with ADMIN_EMAIL   │
     │                │                │  └─ Throw if not authorized    │
     │                │                │                │                │
     │                │                │  Find or create user           │
     │                │                │  by email       │                │
     │                │                ├───────────────►│                │
     │                │                │◄───────────────┤                │
     │                │                │                │                │
     │                │                │  jwt.sign({ id },              │
     │                │                │  SECRET, 7d)   │                │
     │                │                │                │                │
     │                │◄───────────────┤                │                │
     │                │ { token }      │                │                │
```

**Server-side verification** (recommended over client-only):
- Google credential token is sent to the server
- Server verifies the token using `google-auth-library` `OAuth2Client.verifyIdToken()`
- Server validates that the email matches the configured `ADMIN_EMAIL`
- This prevents anyone with any Google account from accessing the dashboard

---

## 7. Project Management System

### 7.1 Architecture

```
Admin Dashboard (/dashboard/projects)
│
├── View modes: Table view ↔ Grid view
├── Search: filters by title, description, technologies
│
├── CREATE
│   ├── Modal with form fields
│   ├── Image upload (2-step process)
│   └── Validation (client + server)
│
├── READ
│   ├── Fetch from ProjectContext (auto-fetched on app mount)
│   └── display in table or cards
│
├── UPDATE
│   ├── Pre-filled modal
│   ├── Optional re-upload image
│   └── Update in DB + local state
│
└── DELETE
    ├── Confirmation dialog
    ├── Cloudinary image cleanup
    └── Remove from DB + local state
```

### 7.2 Project Creation — Detailed Sequence

```
Admin fills form → clicks "Create Project"
│
├── Step 1: Image Upload
│   ├── FormData.append('image', file)
│   ├── POST /api/upload (protected)
│   ├── Server:
│   │   ├── Auth middleware verifies JWT
│   │   ├── Multer receives multipart file
│   │   ├── CloudinaryStorage uploads to 'portfolio-projects' folder
│   │   └── Returns { imageUrl, imagePublicId }
│   └── Client stores URLs
│
├── Step 2: Create Project
│   ├── POST /api/projects (protected) with JSON body:
│   │   { title, description, category, technologies, image, imagePublicId, liveLink, githubLink }
│   ├── Server:
│   │   ├── Auth middleware verifies JWT
│   │   ├── Validates required fields
│   │   ├── Normalizes category & technologies
│   │   ├── Project.create(...)
│   │   ├── Notification.create({ type: 'project', title, description })
│   │   └── Returns 201 with project
│   └── Client:
│       ├── ProjectContext.addProject() → updates local state
│       └── Toast: "Project created successfully"
│
└── Modal closes, project appears in list/grid
```

### 7.3 Image Management

```
Image Lifecycle:
├── UPLOAD: Client selects file → multer/Cloudinary → stored in cloud
│   ├── Folder: portfolio-projects
│   ├── Formats: jpg, png, jpeg, webp
│   └── Max size: 5MB (client-side validation)
│
├── STORAGE: URL stored in MongoDB Project.image
│
├── DISPLAY: img src = Cloudinary URL (CDN-delivered)
│
└── DELETE: project deletion triggers cloudinary.uploader.destroy(publicId)
    └── Non-blocking: log failure if delete fails, DB record always removed
```

---

## 8. Visitor Analytics System

### 8.1 Tracking Architecture

```
┌──────────────────┐     ┌───────────────┐     ┌──────────────┐
│  Browser Events  │────►│  Express API  │────►│  MongoDB     │
│                  │     │               │     │  (Visitors   │
│  Page load       │     │  POST /visit  │     │   collection)│
│  Route change    │     │               │     │              │
│  Section view    │     │  Extract:     │     │  { page,     │
│                  │     │  - IP (req)   │     │    ip,       │
└──────────────────┘     │  - User-Agent │     │    country,  │
                          │  - Geo lookup │     │    city,     │
                          │  - Browser    │     │    device,   │
                          │  - Device     │     │    browser,  │
                          │               │     │    createdAt │
                          │  Dedup check  │     └──────────────┘
                          │  (60s window) │
                          └───────────────┘
```

### 8.2 Tracking Mechanisms

#### Page Visits (useVisitorTracking)

Triggered in `MainLayout.jsx` on every route change:

```javascript
// Hook: useVisitorTracking
useEffect(() => {
  const path = location.pathname;
  if (path === prevPath.current) return;  // Skip duplicate
  prevPath.current = path;

  const pageMap = { '/': 'home', '/experience': 'experience' };
  const page = pageMap[path];
  if (page) trackPage(page);  // POST /api/analytics/visit { page }
}, [location.pathname]);
```

#### Section Visits (useTrackSection)

Triggered in `ProjectsSection.jsx` and `ContactSection.jsx`:

```javascript
// Hook: useTrackSection
const trackedSections = new Set();  // Module-level dedup

useEffect(() => {
  if (trackedSections.has(sectionName)) return;  // Only once per session
  trackedSections.add(sectionName);
  trackPage(sectionName);  // POST /api/analytics/visit { page }
}, [sectionName]);
```

### 8.3 Server-Side Processing

```
trackVisit controller:
│
├── 1. Extract IP (request-ip.getClientIp)
├── 2. Geo-lookup (geoip-lite.lookup)
│   ├── Success: returns { country, city }
│   └── Failure: country = "Unknown", city = "Unknown"
│
├── 3. Browser detection:
│   ├── Chrome, Firefox, Safari, Edge, Opera, IE, Other
│   └── Based on User-Agent string analysis
│
├── 4. Device detection:
│   ├── Mobile: /mobile|android|iphone|ipad|ipod/i
│   ├── Tablet: /ipad|tablet|kindle|playbook|silk/i
│   └── Default: Desktop
│
├── 5. Deduplication:
│   ├── Query: Visitor.findOne({ ip, page, createdAt > (now - 60s) })
│   ├── If found: return 200 (skip, deduplicated: true)
│   └── If not found: Visitor.create(...)
│
└── 6. Response: 201 { success: true, message: "Visit tracked" }
```

### 8.4 Analytics Computations

#### Overview Statistics

```javascript
getOverview:
├── totalVisitors: countDocuments()
├── uniqueVisitors: distinct('ip').length
├── todayVisitors: count where createdAt >= start of today
├── weekVisitors: count where createdAt >= start of week (Sunday)
├── monthVisitors: count where createdAt >= start of month
├── returningVisitors: aggregate → group by ip, count > 1
├── bounceRate: single-page-visitors / total-visitors-with-pages × 100
└── last7Days: aggregate daily counts for last 7 days
```

#### Chart Data

```javascript
getCharts:
├── daily: 30 days (group by date, fill gaps with 0)
├── weekly: 12 weeks (group by ISO week)
└── monthly: 12 months (group by YYYY-MM)
```

#### Location Data

```javascript
getLocations:
├── countries: group by country, sort by visitors DESC
├── cities: group by { country, city }, limit 10, sort DESC
├── unknownTraffic: count + percentage of Unknown country visits
└── country percentages: (country.visitors / totalVisitors) × 100
```

### 8.5 Limitations

| Limitation | Cause | Impact |
|------------|-------|--------|
| Unknown country | Missing geoip-lite database entries, local/dev IPs (127.0.0.1, ::1) | ~20-30% of traffic shows "Unknown" |
| Ad blockers | Block API requests | Visits not tracked |
| Bot traffic | Not filtered | Inflates visitor counts |
| Same IP sharing | Multiple users behind NAT | Counted as single unique visitor |
| Session-only dedup | Module-level Set resets on page refresh | Section may be recounted |
| 60s dedup window | Short window for repeated clicks | May undercount rapid navigation |
| VPN/proxy users | Geo-located to VPN server location | Inaccurate country data |

### 8.6 Dashboard Visualizations

The analytics dashboard renders all computed data using Recharts:

| Visualization | Data Source | Chart Type | Interactivity |
|--------------|-------------|------------|---------------|
| Overview cards | `GET /overview` | Stat cards (6) | — |
| Visitor trend | `GET /charts` | Area chart | Daily/Weekly/Monthly toggle |
| Country distribution | `GET /locations` | Horizontal bar (CSS) | — |
| City list | `GET /locations` | Grid cards | — |
| Section ranking | `GET /portfolio` | Horizontal bar (CSS) | — |
| Device distribution | `GET /recent` | Pie chart (donut) | — |
| Recent visitors | `GET /recent` | Table | — |

---

## 9. Performance Optimization

### 9.1 Frontend Optimizations

| Technique | Implementation | Benefit |
|-----------|---------------|---------|
| **Code splitting** | React Router code splitting via dynamic `import()` | Smaller initial bundle |
| **Vite build** | ESM-based bundling, tree-shaking, CSS code splitting | Fast builds, optimized output |
| **Image optimization** | Cloudinary CDN automatic format selection (WebP) | Smaller image payloads |
| **Lazy loading images** | `loading="lazy"` on testimonial images | Deferred offscreen loading |
| **Animation performance** | Framer Motion `will-change` transforms, GPU-accelerated | Smooth 60fps animations |
| **Memoization** | `React.memo` on `TestimonialCard`, `useMemo` on filtered arrays | Prevents unnecessary re-renders |
| **Debounced search** | Derived state via `useMemo` for filtered projects | Instant filtering without API call |
| **Optimistic updates** | Mark message as read immediately, revert on error | Perceived instant feedback |
| **Conditional rendering** | Loader/Error/Empty states for all data-fetching components | Clear UX during loading |
| **Tailwind purge** | Unused CSS removed in production build | Minimal CSS bundle (82KB gzipped: 13KB) |

### 9.2 Backend Optimizations

| Technique | Implementation | Benefit |
|-----------|---------------|---------|
| **Database indexing** | Visitor collection index on `{ ip, page, createdAt }` | Fast deduplication queries |
| **Field selection** | `.select('name createdAt')` on dashboard activity queries | Reduced data transfer |
| **Limit queries** | `getRecentVisitors` limit param (default 20, max 100) | Prevents large payloads |
| **Parallel queries** | `Promise.all` in `getOverview` (7 concurrent queries) | Faster response time |
| **Aggregation pipelines** | MongoDB native aggregations for analytics | Server-side computation |
| **Auto-retry** | ProjectContext retries on network error after 3s | Resilient to cold starts |
| **Non-blocking cleanup** | Cloudinary image delete wrapped in try/catch | DB delete not blocked by CDN failure |
| **Deduplication** | 60-second dedup window for visit tracking | Prevents spam/refresh inflation |

### 9.3 Database Optimizations

| Technique | Benefit |
|-----------|---------|
| **Proper indexing** (Visitor: ip + page + createdAt) | Sub-ms dedup lookups |
| **Projected queries** (only fetch needed fields) | Lower memory, faster wire transfer |
| **Aggregation pipeline** (server-side compute) | Avoids N+1 queries for analytics |
| **Limited result sets** (top 10 notifications, 5 latest messages) | Predictable response sizes |
| **Timestamps on schemas** | Efficient date-range filtering |

---

## 10. Deployment Architecture

### 10.1 Deployment Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          VERCEL (Frontend)                         │
│                                                                     │
│  Domain: portfolio-mern-one-rho.vercel.app                         │
│  Build: npm run build → vite build                                  │
│  SPA Rewrite: vercel.json → all routes → /index.html               │
│  Environment: VITE_API_URL, VITE_GOOGLE_CLIENT_ID                  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        RENDER (Backend)                             │
│                                                                     │
│  Runtime: Node.js                                                   │
│  Start: node server.js                                              │
│  Port: 5000                                                         │
│  Environment: PORT, MONGO_URI, JWT_SECRET, ADMIN_EMAIL,            │
│               GOOGLE_CLIENT_ID, CLOUD_NAME, API_KEY, API_SECRET     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ MongoDB Wire Protocol
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     MONGODB ATLAS (Database)                        │
│                                                                     │
│  Cluster: Free tier (M0)                                            │
│  Region: Based on application need                                  │
│  Auth: Username/Password + IP whitelist                             │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       CLOUDINARY (CDN)                              │
│                                                                     │
│  Images stored in 'portfolio-projects' folder                       │
│  Automatic format selection (WebP)                                  │
│  CDN delivery with global edge caching                              │
└─────────────────────────────────────────────────────────────────────┘
```

### 10.2 Environment Variables

#### Client (`client/.env`)

| Variable | Value (Development) | Value (Production) |
|----------|-------------------|-------------------|
| `VITE_API_URL` | `http://localhost:5000` | `https://portfolio-backend-gxhv.onrender.com` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | Same |

#### Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `ADMIN_EMAIL` | Authorized admin email for Google OAuth |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `CLOUD_NAME` | Cloudinary cloud name |
| `API_KEY` | Cloudinary API key |
| `API_SECRET` | Cloudinary API secret |

### 10.3 CORS Configuration

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',          // Vite dev
    'http://localhost:5174',          // Vite dev (alternate)
    'https://portfolio-mern-one-rho.vercel.app'  // Production
  ],
  credentials: true
}));
```

### 10.4 Vercel SPA Rewrites

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

All routes are rewritten to `index.html` so React Router can handle client-side routing.

### 10.5 Deployment Checklist

```
Pre-deployment:
├── .env files configured locally
├── vite build succeeds
├── ESLint passes (or known warnings documented)
└── All features tested locally

Frontend (Vercel):
├── Connect GitHub repository
├── Set framework preset: Vite
├── Build command: npm run build
├── Output directory: dist
├── Environment variables configured in Vercel dashboard
└── Deploy

Backend (Render):
├── Connect GitHub repository
├── Runtime: Node.js
├── Build command: npm install
├── Start command: node server.js
├── Environment variables configured in Render dashboard
└── Deploy

Post-deployment:
├── Test all API endpoints
├── Verify CORS headers
├── Check MongoDB connection
├── Verify Google OAuth flow
├── Test Cloudinary image upload
└── Verify analytics tracking
```

---

## 11. Future Improvements

### Performance & Scalability

| Improvement | Description | Priority |
|-------------|-------------|----------|
| **React.lazy + Suspense** | Code-split dashboard pages to reduce initial bundle | High |
| **Redis caching** | Cache analytics computations (1-minute TTL) | Medium |
| **CDN for static assets** | Move images to Cloudinary exclusively | Low |
| **Database indexing** | Add indexes on Contact.createdAt, Notification.createdAt | High |
| **Pagination** | Add pagination for contacts and projects in dashboard | Medium |
| **Server-side rendering** | Next.js or React Helmet for SEO | Low |

### Security

| Improvement | Description | Priority |
|-------------|-------------|----------|
| **HttpOnly cookies** | Store JWT in HttpOnly cookies instead of localStorage | High |
| **CSRF protection** | Add CSRF tokens for cookie-based auth | Medium |
| **Rate limiting** | express-rate-limit on contact form and auth endpoints | High |
| **Input sanitization** | Sanitize contact form inputs (XSS prevention) | Medium |
| **Helmet.js** | Add security headers (CSP, X-Frame-Options, etc.) | Medium |
| **Environment validation** | Validate required env vars on startup | Low |
| **Password requirements** | Stronger password policy (min 8 chars, special chars) | Low |

### Features

| Improvement | Description | Priority |
|-------------|-------------|----------|
| **Blog section** | Add markdown-based blog with CRUD | Medium |
| **Email notifications** | Send email to admin on new contact message | Medium |
| **Social share** | Add share buttons for projects | Low |
| **Multi-language** | i18n support (English + Amharic) | Low |
| **PWA support** | Service worker, offline fallback, manifest.json | Medium |
| **Analytics export** | CSV/PDF export of analytics data | Low |
| **Testimonials CRUD** | Admin CRUD for testimonials | Medium |
| **File upload** | Support PDF/doc upload for resume | Low |
| **Dashboard search** | Advanced filtering for all dashboard tables | Medium |

### Code Quality

| Improvement | Description | Priority |
|-------------|-------------|----------|
| **Unit tests** | Jest + React Testing Library for components | High |
| **API tests** | Supertest for endpoint integration tests | High |
| **E2E tests** | Cypress or Playwright for critical flows | Medium |
| **TypeScript migration** | Add TypeScript for type safety | Medium |
| **API documentation** | Swagger/OpenAPI documentation | Medium |
| **Error monitoring** | Sentry integration | Medium |
| **Logging** | Structured logging (Winston/Pino) | Medium |

### DevOps

| Improvement | Description | Priority |
|-------------|-------------|----------|
| **CI/CD pipeline** | GitHub Actions for lint + test + build | High |
| **Docker** | Dockerize both client and server | Medium |
| **Staging environment** | Separate staging deployment for testing | Medium |
| **Automated deployment** | Auto-deploy on merge to main | Medium |
| **Health checks** | MongoDB connection health + uptime monitoring | Low |

---

*Document generated from full codebase analysis. For questions, contact the project author.*
