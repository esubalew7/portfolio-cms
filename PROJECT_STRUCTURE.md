# MERN Portfolio — Project Structure

> **Author:** Esubalew Molla  
> **Stack:** MongoDB · Express.js · React.js · Node.js  
> **Deployment:** Vercel (frontend) · Render (backend)

---

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Project Tree](#project-tree)
3. [Frontend Structure](#frontend-structure)
4. [Backend Structure](#backend-structure)
5. [Configuration Files](#configuration-files)
6. [Request Flow](#request-flow)
7. [Authentication Flow](#authentication-flow)
8. [Analytics Flow](#analytics-flow)
9. [Project Management Flow](#project-management-flow)
10. [Contact Flow](#contact-flow)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│                   Client (Vite + React)          │
│  Browser → index.html → main.jsx → App.jsx      │
│                                                   │
│  Pages (Routes) → Layouts → Sections/Components  │
│         ↓                                        │
│  Context (global state) ← custom Hooks           │
│         ↓                                        │
│  Utility Layer: api.js (axios) → HTTP requests   │
└──────────────────────┬──────────────────────────┘
                       │ HTTP (JSON)
                       ▼
┌─────────────────────────────────────────────────┐
│           Server (Express.js on Node.js)         │
│                                                   │
│  app.js (CORS, JSON parsing)                     │
│    ↓                                              │
│  Routes → Middleware (auth) → Controllers        │
│    ↓                                              │
│  Services (Google Auth, Cloudinary)              │
│    ↓                                              │
│  Models (Mongoose ODM) → MongoDB Atlas           │
└─────────────────────────────────────────────────┘
```

The client and server communicate exclusively over RESTful JSON APIs. The client is a Single Page Application (SPA) built with Vite + React, while the server is an Express.js API connected to a MongoDB Atlas cluster.

---

## Project Tree

```
portfolio-mern/
│
├── .gitignore
├── README.md
├── PROJECT_STRUCTURE.md                 (this file)
│
├── client/                               # Frontend — React SPA
│   ├── .env                              # Client environment variables
│   ├── .gitignore
│   ├── index.html                        # HTML entry point
│   ├── package.json                      # Dependencies & scripts
│   ├── vercel.json                       # Vercel SPA rewrites
│   ├── vite.config.js                    # Vite bundler configuration
│   ├── tailwind.config.js                # Tailwind CSS design tokens
│   ├── postcss.config.js                 # PostCSS (Tailwind + Autoprefixer)
│   ├── eslint.config.js                  # ESLint configuration
│   ├── public/                           # Static assets
│   │   └── images/                       # Profile images & icons
│   │       ├── esu2.png                  # Hero section profile image
│   │       ├── esu3.png                  # About section profile image
│   │       ├── bdu.jpg                   # University logo (Experience)
│   │       ├── askuala.jpg               # Internship company logo
│   │       ├── p1.jpg..p5.jpg            # Testimonial avatars
│   │       └── resume.pdf                # Downloadable resume
│   │
│   └── src/                              # Application source code
│       ├── main.jsx                      # React DOM entry
│       ├── App.jsx                       # Root component + Routes
│       ├── index.css                     # Global styles (Tailwind)
│       ├── animations/
│       │   └── variants.js               # Framer Motion reusable variants
│       ├── components/
│       │   ├── AnimatedCounter.jsx        # Scroll-triggered number animation
│       │   ├── Footer.jsx                # Site footer with socials
│       │   ├── Loader.jsx                # Full-screen loading spinner
│       │   ├── Navbar.jsx                # Fixed navigation bar
│       │   ├── ParticlesBackground.jsx   # tsParticles interactive canvas
│       │   ├── ProjectCard.jsx           # Public project display card
│       │   ├── ProtectedRoute.jsx        # Auth guard for dashboard
│       │   ├── ScrollToTop.jsx           # Floating back-to-top button
│       │   ├── SocialLinks.jsx           # Social icon definitions + row
│       │   ├── TestimonialCard.jsx       # Individual testimonial card
│       │   ├── TestimonialsMarquee.jsx   # Infinite marquee animation
│       │   ├── dashboard/                # Dashboard-specific components
│       │   │   ├── AnalyticsStatCard.jsx  # Analytics metric card
│       │   │   ├── ChartCard.jsx          # Chart wrapper with title
│       │   │   ├── DashboardProjectCard.jsx # Project card (grid view)
│       │   │   ├── DashboardTable.jsx     # Generic data table
│       │   │   └── PageHeader.jsx         # Page title + search + actions
│       │   ├── Terminal/                  # Interactive Terminal subsystem
│       │   │   ├── index.js               # Barrel exports
│       │   │   ├── Terminal.jsx           # Terminal shell container
│       │   │   ├── TerminalLine.jsx       # Output line renderer
│       │   │   ├── TerminalPrompt.jsx     # Input prompt component
│       │   │   ├── TerminalViewport.jsx   # Scrollable viewport
│       │   │   ├── TypingEffect.jsx       # Typewriter output effect
│       │   │   ├── commandParser.js       # Raw input → AST parser
│       │   │   ├── commandRegistry.js     # Command definitions + handlers
│       │   │   ├── terminalConstants.js   # Theme & prompt constants
│       │   │   └── useTerminal.js         # Terminal state hook
│       │   └── ui/                        # Reusable UI primitives
│       │       ├── Button.jsx             # Multi-variant button
│       │       ├── ConfirmationModal.jsx  # Confirm/cancel dialog
│       │       ├── FormInput.jsx          # Input + textarea component
│       │       ├── Modal.jsx              # Animated modal wrapper
│       │       └── TimelineItem.jsx       # Timeline entry (Experience)
│       ├── context/                       # React Context providers
│       │   ├── ProjectContext.jsx          # Projects CRUD + state
│       │   ├── ThemeContext.jsx            # Dark/light mode toggle
│       │   └── ToastContext.jsx            # Toast notification system
│       ├── data/
│       │   └── testimonials.js            # Testimonials data array
│       ├── hooks/                         # Custom React hooks
│       │   ├── useTypewriter.js           # Typewriter animation hook
│       │   └── useVisitorTracking.js       # Page/section visit tracking
│       ├── layouts/
│       │   ├── MainLayout.jsx             # Public site layout (Nav + Footer)
│       │   └── DashboardLayout.jsx        # Admin dashboard layout
│       ├── pages/                         # Route-level page components
│       │   ├── Home.jsx                   # Public portfolio homepage
│       │   ├── Login.jsx                  # Admin login page
│       │   ├── Dashboard.jsx              # Dashboard overview
│       │   ├── DashboardProjects.jsx      # Project CRUD management
│       │   ├── Messages.jsx               # Contact message inbox
│       │   └── dashboard/
│       │       └── Analytics.jsx          # Visitor analytics dashboard
│       ├── sections/                      # Homepage sections
│       │   ├── HeroSection.jsx            # Landing hero with particles
│       │   ├── AboutSection.jsx           # About me + animated counters
│       │   ├── SkillsSection.jsx          # Skill categories + progress bars
│       │   ├── ProjectsSection.jsx        # Filterable project grid
│       │   ├── ExperienceSection.jsx      # Education, internships, testimonials
│       │   ├── TerminalSection.jsx        # Interactive console embed
│       │   └── ContactSection.jsx         # Contact form + info
│       └── utils/                         # Utility modules
│           ├── api.js                     # Axios client with interceptors
│           ├── dashboardUtils.js          # Date formatting & text helpers
│           └── sectionNavigation.js       # Scroll-to-section helpers
│
└── server/                               # Backend — Express.js API
    ├── .env                              # Server environment variables
    ├── package.json                      # Dependencies & scripts
    ├── app.js                            # Express app setup (CORS, routes)
    ├── server.js                         # Entry point (DB connect + listen)
    ├── config/
    │   ├── db.js                         # MongoDB connection via Mongoose
    │   └── cloudinary.js                 # Cloudinary SDK configuration
    ├── controllers/
    │   ├── analyticsController.js         # Visit tracking & analytics queries
    │   ├── authController.js             # Register, login, Google OAuth
    │   ├── contactController.js          # Contact message CRUD
    │   ├── dashboardController.js        # Dashboard stats & activity
    │   ├── notificationController.js     # Notification CRUD
    │   ├── projectController.js          # Project CRUD + Cloudinary cleanup
    │   └── uploadController.js           # Image upload handler
    ├── middleware/
    │   ├── authMiddleware.js             # JWT verification guard
    │   └── upload.js                     # Multer + CloudinaryStorage config
    ├── models/
    │   ├── Contact.js                    # Contact message schema
    │   ├── Notification.js              # Notification schema
    │   ├── Project.js                   # Project schema with category enum
    │   ├── User.js                      # Admin user schema (bcrypt)
    │   └── Visitor.js                   # Page visit analytics schema
    ├── routes/
    │   ├── analyticsRoutes.js            # POST /visit, GET /overview, etc.
    │   ├── authRoutes.js                # POST /register, /login, /google
    │   ├── contactRoutes.js             # POST /, GET /, PUT /:id/read
    │   ├── dashboardRoutes.js           # GET /stats, /activity
    │   ├── notificationRoutes.js        # GET /, PUT /:id/read
    │   ├── projectRoutes.js             # Full CRUD for projects
    │   └── uploadRoutes.js              # POST / (image upload)
    └── services/
        └── googleAuthService.js         # Google token verification + admin check
```

---

## Frontend Structure

### Entry Point

| File | Purpose |
|------|---------|
| `main.jsx` | Mounts the React app into `#root`, wraps with `GoogleOAuthProvider` and `StrictMode`. |
| `App.jsx` | Root component: sets up providers (`ThemeProvider`, `ProjectProvider`, `ToastProvider`), defines routes via `react-router-dom`, shows a 2-second loader on initial mount, and renders `ScrollToTop`. |
| `index.css` | Tailwind directives + custom styles: scroll padding for fixed navbar, smooth scrolling, font-family (Outfit), dark mode transitions. |

### Routing Table (`App.jsx`)

| Path | Component | Layout | Protected |
|------|-----------|--------|-----------|
| `/login` | `Login` | None | No |
| `/` | `Home` | `MainLayout` | No |
| `/dashboard` | `Dashboard` | `DashboardLayout` | Yes |
| `/dashboard/projects` | `DashboardProjects` | `DashboardLayout` | Yes |
| `/dashboard/messages` | `Messages` | `DashboardLayout` | Yes |
| `/dashboard/analytics` | `Analytics` | `DashboardLayout` | Yes |

### Layouts

**MainLayout** — Used for the public-facing portfolio. Renders `Navbar` at top, `Footer` at bottom, and the page via `<Outlet />`. Calls `useVisitorTracking()` to log homepage visits.

**DashboardLayout** — Used for the admin area. Includes:
- Collapsible sidebar with navigation links (Dashboard, Analytics, Projects, Messages)
- Theme toggle (dark/light mode)
- Notification dropdown with real-time unread count
- Admin profile dropdown
- Logout functionality
- Auto-refreshes notifications every 2 minutes via `setInterval`

### Sections (Homepage)

Sections are the visual blocks of the single-page portfolio. They are rendered sequentially in `Home.jsx`.

| Section | File | Key Features |
|---------|------|-------------|
| Hero | `HeroSection.jsx` | Particles background, typewriter effect for roles, profile image (`esu2.png`) with floating animation, CTA buttons (View Projects, Download Resume), social icons |
| About | `AboutSection.jsx` | Profile image (`esu3.png`), animated stat counters (Years Experience, Projects, Skills), "Let's Collaborate" CTA |
| Skills | `SkillsSection.jsx` | 5 categories (Frontend, Backend, Database, Programming, Tools), animated progress bars with gradient fills, icons from `react-icons` |
| Projects | `ProjectsSection.jsx` | Filterable grid (All/MERN/Frontend/Backend/Mobile), loading/error/empty states, uses `ProjectContext` for data, calls `useTrackSection('projects')` for analytics |
| Terminal | `TerminalSection.jsx` | Embeds the interactive `Terminal` component with glow border, header text explaining to type `help` |
| Experience | `ExperienceSection.jsx` | Education + Internship + Certifications timeline using `TimelineItem`, client testimonials marquee using `TestimonialsMarquee` |
| Contact | `ContactSection.jsx` | Contact form (name, email, message) with client-side validation, success/error states, contact info cards (email, phone, location), calls `useTrackSection('contact')` |

### Pages

| Page | File | Key Features |
|------|------|-------------|
| Home | `Home.jsx` | Orchestrates all sections with ambient gradient backgrounds |
| Login | `Login.jsx` | Email/password form + Google OAuth button, JWT stored in `localStorage`, redirects to intended destination |
| Dashboard | `Dashboard.jsx` | Stats cards (Users, Messages, Projects), real-time status, recent activity feed |
| DashboardProjects | `DashboardProjects.jsx` | Table/card view toggle, search/filter, full CRUD modal with image upload, confirmation dialog for deletion |
| Messages | `Messages.jsx` | Message cards with read/unread status, search by name, view detail modal, reply via `mailto:`, delete with confirmation |
| Analytics | `dashboard/Analytics.jsx` | 6 stat cards (total/unique/returning visitors, page views, bounce rate, today), area chart (daily/weekly/monthly toggle), location analytics (countries + cities), portfolio sections ranking, device distribution pie chart, recent visitors table |

### Context Providers

| Context | File | State | Key Methods |
|---------|------|-------|-------------|
| ThemeContext | `ThemeContext.jsx` | `isDarkMode` | `toggleTheme()` — persists to `localStorage`, toggles `dark` class on `<html>` |
| ProjectContext | `ProjectContext.jsx` | `projects`, `loading`, `error` | `fetchProjects()` (auto-retry on network error), `addProject()`, `updateProject()`, `deleteProject()` |
| ToastContext | `ToastContext.jsx` | `toasts[]` | `showToast(message, type)` — renders animated toast with auto-dismiss (5s) and progress bar |

### Custom Hooks

| Hook | File | Purpose |
|------|------|---------|
| `useTypewriter(words)` | `hooks/useTypewriter.js` | Returns a string that types/deletes through an array of words cyclically |
| `useVisitorTracking()` | `hooks/useVisitorTracking.js` | Tracks page visits via `POST /api/analytics/visit` on route change (deduplicates same path) |
| `useTrackSection(sectionName)` | `hooks/useVisitorTracking.js` | Tracks section views once per section per session using a module-level `Set` |

### Utility Modules

| Module | File | Exports |
|--------|------|---------|
| API Client | `utils/api.js` | `api.get()`, `.post()`, `.put()`, `.delete()` — axios instance with auth interceptor (auto-attaches JWT), 401 redirect on expired token, FormData support |
| Dashboard Utils | `utils/dashboardUtils.js` | `formatDate(timestamp)`, `normalizedText(value, fallback)` |
| Navigation | `utils/sectionNavigation.js` | `SECTION_IDS`, `getSectionHref()`, `scrollToSectionById()`, `isValidSectionId()` |

### Component Breakdown

#### UI Primitives (`components/ui/`)

| Component | Props | Purpose |
|-----------|-------|---------|
| `Button` | `variant` (primary/secondary/danger/outline/ghost), `loading`, `icon` | Styled button with loading spinner |
| `FormInput` | `label`, `error`, `textarea`, standard input props | Reusable input/textarea with error state |
| `Modal` | `isOpen`, `onClose`, `title`, `maxWidth` | Animated modal with backdrop blur |
| `ConfirmationModal` | `isOpen`, `onConfirm`, `title`, `message`, `type` | Confirmation dialog with danger/info variants |
| `TimelineItem` | `logo`, `role`, `company`, `duration`, `location`, `tags`, `bullets` | Timeline entry with scroll animation |

#### General Components (`components/`)

| Component | Purpose |
|-----------|---------|
| `AnimatedCounter` | Animates from `from` to `to` when scrolled into view using Framer Motion's `animate()` |
| `Footer` | Copyright + name + social icons |
| `Loader` | Full-screen animated spinner with rotating rings + pulsing dot |
| `Navbar` | Fixed top navigation with mobile menu, dark mode toggle, scroll-aware transparency, active section tracking |
| `ParticlesBackground` | Interactive particle network using `tsparticles-slim` (repulse on hover, push on click) |
| `ProjectCard` | Public-facing project display with image zoom, category badge, tech tags, Live Demo / GitHub buttons |
| `ProtectedRoute` | Auth guard — redirects to `/login` if no JWT token in `localStorage` |
| `ScrollToTop` | Floating button that appears after scrolling 400px |
| `SocialLinks` | Defines 6 social platforms (GitHub, LinkedIn, Telegram, Facebook, Twitter, Instagram) with inline SVG icons |
| `TestimonialCard` | Memoized testimonial card with avatar (image or initials), star rating, quote |
| `TestimonialsMarquee` | Infinite CSS animation marquee (triplicated data, pauses on hover) |

#### Dashboard Components (`components/dashboard/`)

| Component | Purpose |
|-----------|---------|
| `AnalyticsStatCard` | Metric card with icon, value, label, optional trend indicator |
| `ChartCard` | Wrapper for charts with title, subtitle, optional action element |
| `DashboardProjectCard` | Grid-view project card with image, description, tech stack, edit/delete buttons |
| `DashboardTable` | Generic data table with loading skeleton, empty state, custom column renderers |
| `PageHeader` | Page title + description + search bar + action buttons |

#### Terminal Subsystem (`components/Terminal/`)

The terminal is a fully interactive in-browser CLI that mimics a Linux terminal. It supports 8 commands:

| Command | Handler | Description |
|---------|---------|-------------|
| `help` | CommandRegistry | Lists all available commands |
| `about` | CommandRegistry | Displays "About Me" information |
| `skills` | CommandRegistry | Lists technical skills by category |
| `projects` | CommandRegistry | Fetches and displays projects from context |
| `experience` | CommandRegistry | Shows experience timeline |
| `contact` | CommandRegistry | Displays contact information |
| `clear` | CommandRegistry | Clears terminal output |
| `download` | CommandRegistry | Provides resume download link |

**Architecture:** `Terminal.jsx` → `useTerminal.js` (state + logic) → `commandParser.js` (parses raw input into AST) → `commandRegistry.js` (maps commands to handler functions). Output is rendered by `TerminalLine.jsx` with an optional `TypingEffect.jsx` for typewriter-style display. Input uses `TerminalPrompt.jsx`. The viewport auto-scrolls via `TerminalViewport.jsx`.

### Data Flow (Frontend)

```
User Action → Component Event Handler
    → API call via api.js (axios)
        → Server responds with JSON
    → Component updates local state or Context
        → React re-renders affected UI
    → Optional: Toast notification shown
```

---

## Backend Structure

### Entry Point

**`server.js`** — Imports the Express app, connects to MongoDB via `connectDB()`, then starts listening on the configured `PORT`. If the database connection fails, the process exits with an error.

**`app.js`** — Creates the Express app, configures CORS (allows localhost dev servers and the Vercel production domain), parses JSON bodies, mounts all route modules, and exports the app.

### API Endpoints

#### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Controller | Purpose |
|--------|----------|------|------------|---------|
| POST | `/register` | Public | `authController.register` | Register a new admin (email + password) |
| POST | `/login` | Public | `authController.login` | Login with email + password, returns JWT |
| POST | `/google` | Public | `authController.googleLogin` | Login via Google OAuth credential token |
| GET | `/me` | Protected | `authController.getMe` | Get current admin profile |

#### Contact (`/api/contact`)

| Method | Endpoint | Auth | Controller | Purpose |
|--------|----------|------|------------|---------|
| POST | `/` | Public | `contactController.createContact` | Submit contact message (creates notification) |
| GET | `/` | Public | `contactController.getAllContacts` | Get all messages (sorted newest first) |
| PUT | `/:id/read` | Public | `contactController.markMessageAsRead` | Mark a message as read |
| DELETE | `/:id` | Protected | `contactController.deleteContact` | Delete a message |

#### Projects (`/api/projects`)

| Method | Endpoint | Auth | Controller | Purpose |
|--------|----------|------|------------|---------|
| GET | `/` | Public | `projectController.getAllProjects` | Get all projects |
| GET | `/:id` | Public | `projectController.getProject` | Get single project |
| POST | `/` | Protected | `projectController.createProject` | Create project (creates notification) |
| PUT | `/:id` | Protected | `projectController.updateProject` | Update project |
| DELETE | `/:id` | Protected | `projectController.deleteProject` | Delete project + Cloudinary image |

#### Analytics (`/api/analytics`)

| Method | Endpoint | Auth | Controller | Purpose |
|--------|----------|------|------------|---------|
| POST | `/visit` | Public | `analyticsController.trackVisit` | Record a page visit (deduplicated within 1-min window) |
| GET | `/overview` | Protected | `analyticsController.getOverview` | Dashboard overview stats |
| GET | `/charts` | Protected | `analyticsController.getCharts` | Daily/weekly/monthly chart data |
| GET | `/locations` | Protected | `analyticsController.getLocations` | Country + city distribution |
| GET | `/portfolio` | Protected | `analyticsController.getPortfolioAnalytics` | Section visit rankings |
| GET | `/recent` | Protected | `analyticsController.getRecentVisitors` | Latest visitor records |

#### Dashboard (`/api/dashboard`)

| Method | Endpoint | Auth | Controller | Purpose |
|--------|----------|------|------------|---------|
| GET | `/stats` | Protected | `dashboardController.getStats` | Total projects, messages, users |
| GET | `/activity` | Protected | `dashboardController.getActivity` | Recent activity feed (merged messages + projects) |

#### Notifications (`/api/notifications`)

| Method | Endpoint | Auth | Controller | Purpose |
|--------|----------|------|------------|---------|
| GET | `/` | Protected | `notificationController.getNotifications` | Get latest 10 notifications |
| GET | `/unread-count` | Protected | `notificationController.getUnreadCount` | Count of unread notifications |
| PUT | `/:id/read` | Protected | `notificationController.markAsRead` | Mark a notification as read |

#### Upload (`/api/upload`)

| Method | Endpoint | Auth | Controller | Purpose |
|--------|----------|------|------------|---------|
| POST | `/` | Protected | `uploadController.uploadImage` | Upload image to Cloudinary, returns URL + publicId |

### Models

#### User
| Field | Type | Constraints |
|-------|------|-------------|
| `email` | String | `required`, `unique`, `lowercase` |
| `password` | String | Optional (for Google users), hashed via bcrypt pre-save hook |
| `timestamps` | auto | createdAt, updatedAt |

**Methods:** `comparePassword(enteredPassword)` — bcrypt comparison.

#### Project
| Field | Type | Constraints |
|-------|------|-------------|
| `title` | String | `required` |
| `description` | String | `required` |
| `category` | String | Enum: `mern`, `frontend`, `backend`, `mobile` |
| `technologies` | [String] | Array of tech names |
| `image` | String | Cloudinary URL, `required` |
| `imagePublicId` | String | Cloudinary public ID (for deletion) |
| `liveLink` | String | Optional |
| `githubLink` | String | Optional |
| `createdAt` | Date | Default `Date.now` |

#### Contact
| Field | Type | Constraints |
|-------|------|-------------|
| `name` | String | `required` |
| `email` | String | `required`, `lowercase` |
| `message` | String | `required` |
| `isRead` | Boolean | Default `false` |
| `createdAt` | Date | Default `Date.now` |

#### Visitor
| Field | Type | Constraints |
|-------|------|-------------|
| `page` | String | `required` |
| `ip` | String | `required` |
| `country` | String | Default `"Unknown"` |
| `city` | String | Default `"Unknown"` |
| `device` | String | Desktop / Mobile / Tablet |
| `browser` | String | Chrome / Firefox / Safari / etc. |
| `userAgent` | String | Raw UA string |
| `timestamps` | auto | createdAt, updatedAt |

**Index:** `{ ip: 1, page: 1, createdAt: -1 }` — supports deduplication queries.

#### Notification
| Field | Type | Constraints |
|-------|------|-------------|
| `type` | String | Enum: `message`, `project` |
| `title` | String | `required` |
| `description` | String | `required` |
| `isRead` | Boolean | Default `false` |
| `timestamps` | auto | createdAt, updatedAt |

### Middleware

| Middleware | File | Purpose |
|------------|------|---------|
| `protect` | `middleware/authMiddleware.js` | Extracts JWT from `Authorization: Bearer <token>`, verifies with `jwt.verify()`, attaches decoded payload to `req.user`. Returns 401 if missing or invalid. |
| `upload` | `middleware/upload.js` | Multer storage engine configured for Cloudinary. Accepts jpg/png/jpeg/webp, stores in `portfolio-projects` folder. |

### Services

| Service | File | Exports |
|---------|------|---------|
| Google Auth | `services/googleAuthService.js` | `verifyGoogleToken(credential)` — verifies Google OAuth token, returns payload + `validateAdminEmail(email)` — checks against `ADMIN_EMAIL` env var + `extractGoogleUserInfo(payload)` — extracts user info |

### Controller Details

#### analyticsController.js — Key Functions

- **`trackVisit`**: Extracts IP via `request-ip`, looks up geo via `geoip-lite`, detects browser/device from user-agent. Checks for duplicate within 60 seconds (same IP + page). Creates a `Visitor` record.
- **`getOverview`**: Computes total/unique/today/week/month visitors, returning visitors, bounce rate (single-page vs multi-page), last 7 days trend.
- **`getCharts`**: Aggregates daily (30 days), weekly (12 weeks), monthly (12 months) visitor counts.
- **`getLocations`**: Groups visitors by country + top 10 cities, computes percentages.
- **`getPortfolioAnalytics`**: Ranks sections by visit count.
- **`getRecentVisitors`**: Returns the most recent N visitor records (default 20, max 100).

#### authController.js — Key Functions

- **`register`**: Validates email/password, checks for existing user, creates via `User.create()` (password auto-hashed).
- **`login`**: Normalizes email, finds user, compares password, returns JWT (7-day expiry).
- **`googleLogin`**: Verifies Google credential via `googleAuthService`, validates against `ADMIN_EMAIL`, finds or creates user, returns JWT.
- **`getMe`**: Returns current user profile (password excluded).

### Middleware Flow

```
Request → CORS → JSON Parser → Route Matcher
    → [protect middleware if admin route]
        → JWT verification
            → Attach req.user { id }
        → Controller function
    → [upload middleware if upload route]
        → Multer processes multipart/form-data
        → File saved to Cloudinary
        → req.file populated with { path, filename }
    → Response JSON
```

---

## Configuration Files

### Root

| File | Purpose |
|------|---------|
| `.gitignore` | Ignores `node_modules/`, `.env` files, `dist/`, `build/`, logs |
| `README.md` | Project documentation with installation, features, tech stack, live demo link |

### Client

| File | Purpose |
|------|---------|
| `.env` | `VITE_API_URL` (dev/prod), `VITE_GOOGLE_CLIENT_ID` |
| `.gitignore` | Ignores node_modules, dist, .local, Vercel/Netlify specific |
| `vite.config.js` | React plugin, Vite configuration |
| `tailwind.config.js` | Custom color tokens (surface, content, border, accent, terminal), box shadows |
| `postcss.config.js` | Tailwind CSS + Autoprefixer |
| `eslint.config.js` | ESLint flat config with React Hooks + Refresh rules |
| `vercel.json` | SPA rewrites (all routes → `index.html`) |
| `package.json` | Dependencies: React 18, React Router 7, Framer Motion 12, Recharts 3, Axios, tsParticles, Lucide icons, Tailwind CSS 3 |

### Server

| File | Purpose |
|------|---------|
| `.env` | `PORT`, `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `GOOGLE_CLIENT_ID`, `CLOUD_NAME`, `API_KEY`, `API_SECRET` |
| `package.json` | Dependencies: Express 5, Mongoose 9, bcryptjs 3, jsonwebtoken 9, Cloudinary, multer-storage-cloudinary, geoip-lite, google-auth-library, cors, dotenv |

---

## Request Flow (End-to-End Example)

### Example: A user views the portfolio and sends a contact message

```
1. Browser loads https://portfolio.example.com
   → index.html → main.jsx → App.jsx renders
   → ThemeProvider + ProjectProvider + ToastProvider wrap the app
   → MainLayout mounts, Navbar + Footer rendered
   → Home page renders all sections

2. User navigates to #projects section
   → ProjectsSection mounts
   → useProjects() from ProjectContext triggers fetchProjects()
   → api.get('/api/projects') is called
   → Axios interceptor adds no auth token (public route)

3. Server receives GET /api/projects
   → app.js routes to projectRoutes.js
   → No auth middleware (public)
   → getAllProjects controller runs
   → Project.find().sort({ createdAt: -1 })
   → Returns JSON array of projects

4. Client receives projects array
   → setProjects() in ProjectContext updates state
   → ProjectsSection re-renders with project cards

5. User fills contact form and clicks "Send Message"
   → ContactSection.handleSubmit() validates form
   → api.post('/api/contact', { name, email, message })

6. Server receives POST /api/contact
   → contactController.createContact runs
   → Validates required fields
   → Contact.create({ name, email, message })
   → Notification.create({ type: 'message', title, description })
   → Returns 201 with success

7. Client receives 201 response
   → setSubmitStatus('success') shows success toast
   → Form clears
   → Toast notification appears (auto-dismiss in 5s)
```

---

## Authentication Flow

### Email/Password Login

```
1. User navigates to /login
2. User enters email + password, clicks "Sign In"
3. Login.jsx validates form (client-side)
4. api.post('/api/auth/login', { email, password })
5. Server authController.login:
   a. Normalizes email
   b. Finds user by email
   c. Compares password via bcrypt
   d. Signs JWT { id } with JWT_SECRET, expires in 7 days
   e. Returns { success: true, token }
6. Client stores token in localStorage
7. Client redirects to /dashboard (or previously intended route)
```

### Google OAuth Login

```
1. User clicks "Continue with Google" button
2. Google OAuth popup opens, user selects account
3. Google returns credential token
4. Login.jsx calls api.post('/api/auth/google', { credential })
5. Server authController.googleLogin:
   a. Verifies Google token via google-auth-library
   b. Validates email against ADMIN_EMAIL env var
   c. Finds or creates User with that email
   d. Signs JWT { id } with JWT_SECRET, expires in 7 days
   e. Returns { success: true, token }
6. Same token storage + redirect as email login
```

### Protected Route Guard

```
1. User visits /dashboard
2. App.jsx renders ProtectedRoute wrapper
3. ProtectedRoute checks localStorage for 'token'
4. If no token → Navigate to /login with { from: location } state
5. If token exists → Render DashboardLayout
6. All admin API calls include Authorization: Bearer <token>
7. Axios request interceptor auto-attaches token
8. Axios response interceptor: if 401 + token existed → remove token, redirect to /login
```

---

## Analytics Flow

### Visit Tracking

```
1. MainLayout mounts → useVisitorTracking() hook runs
2. On location change (useEffect on location.pathname):
   a. Maps pathname to page name ('/' → 'home')
   b. Calls trackPage(page)
   c. api.post('/api/analytics/visit', { page })
3. Server analyticsController.trackVisit:
   a. Extracts IP from request (request-ip)
   b. Gets geo data (geoip-lite)
   c. Detects browser + device from User-Agent
   d. Checks for recent duplicate (same IP + page within 60s)
   e. Creates Visitor document with all metadata
```

### Section Tracking

Additionally, `ProjectsSection` and `ContactSection` call `useTrackSection(sectionName)` which sends analytics for in-page sections using a deduplication `Set` that prevents double-counting within a session.

### Analytics Dashboard

```
DashboardLayout → /dashboard/analytics (Analytics page)
   → Fires 5 parallel API calls:
      GET /api/analytics/overview
      GET /api/analytics/charts
      GET /api/analytics/locations
      GET /api/analytics/portfolio
      GET /api/analytics/recent?limit=12
   → All protected by JWT auth middleware
   → Renders:
      - 6 stat cards (total, unique, returning, today, etc.)
      - Area chart (daily/weekly/monthly toggle)
      - This week / This month mini cards
      - Country bar chart + city list
      - Section ranking
      - Device distribution pie chart
      - Recent visitors table
```

---

## Project Management Flow

### Create Project (Admin Dashboard)

```
1. Admin navigates to /dashboard/projects
2. Clicks "Add Project" button → Modal opens with form
3. Admin fills: title, category (MERN/Frontend/Backend/Mobile),
   description, technologies (comma-separated), live/github links
4. Admin selects image file (PNG/JPG/WEBP, max 5MB)
5. On submit:
   a. Step 1: Upload image
      - FormData with image file → api.post('/api/upload')
      - Server: multer saves to Cloudinary, returns { imageUrl, imagePublicId }
   b. Step 2: Create project
      - api.post('/api/projects', { title, description, category,
        technologies, image: imageUrl, imagePublicId, liveLink, githubLink })
      - Server: creates Project document + Notification document
      - Returns created project
6. ProjectContext.addProject() adds to local state
7. UI updates: new project appears in list/grid
8. Success toast shown
```

### Update Project

```
1. Admin clicks edit icon on a project
2. Modal opens with pre-filled form data
3. Admin modifies fields, optionally selects new image
4. On submit:
   a. If new image: upload to Cloudinary first
   b. api.put('/api/projects/:id', { ...updated fields })
   c. Server updates document, returns updated project
5. ProjectContext.updateProject() updates local state
6. UI updates
```

### Delete Project

```
1. Admin clicks delete icon → ConfirmationModal appears
2. Admin confirms
3. api.delete('/api/projects/:id')
4. Server:
   a. Finds project
   b. Deletes associated Cloudinary image (non-blocking)
   c. Deletes project from MongoDB
5. ProjectContext.deleteProject() removes from local state
6. UI removes card/row
7. Success toast
```

---

## Contact Flow

### User Submits Contact Form (Public)

```
1. User fills name, email, message in ContactSection form
2. Client-side validation (required fields, email format, message length)
3. If valid: api.post('/api/contact', { name, email, message })
4. Server:
   a. Validates required fields
   b. Contact.create({ name, email, message })
   c. Notification.create({ type: 'message', title: 'New message received', description: name })
   d. Returns 201 with success
5. Client shows success toast, clears form
```

### Admin Views Messages (Dashboard)

```
1. Admin navigates to /dashboard/messages
2. Messages page fetches: api.get('/api/contact')
3. Displays message cards with:
   - Name, email, preview, date, read/unread badge
   - Blue accent border for unread
4. Clicking a message:
   a. Marks as read optimistically (PUT /api/contact/:id/read)
   b. Opens detail modal with full message + reply button (mailto: link)
5. Admin can search by name, filter by read status
6. Delete: confirmation dialog → api.delete('/api/contact/:id')
```

---

## Technologies Used

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| Vite 8 | Build tool & dev server |
| React Router 7 | Client-side routing |
| Tailwind CSS 3 | Utility-first styling |
| Framer Motion 12 | Animations & transitions |
| Axios | HTTP client |
| Recharts 3 | Analytics charts |
| tsParticles | Interactive particle background |
| Lucide React | Icon library |
| React Icons | Technology icons (Skills section) |
| Google OAuth (@react-oauth/google) | Google sign-in button |

### Backend
| Technology | Purpose |
|------------|---------|
| Express 5 | HTTP server & routing |
| Mongoose 9 | MongoDB ODM |
| MongoDB Atlas | Database (cloud) |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| Cloudinary + multer-storage-cloudinary | Image hosting |
| google-auth-library | Google OAuth verification |
| geoip-lite | IP geolocation |
| request-ip | Client IP extraction |
| cors | Cross-origin resource sharing |

---
*Document generated from full codebase analysis. For questions, contact the project author.*
