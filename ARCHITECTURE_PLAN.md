# Architecture Plan — MERN Portfolio CMS

## 1. Current Folder Structure

```
portfolio-cms/
├── .gitignore
├── client/                          # Vite React app (MONOLITHIC — portfolio + admin combined)
│   ├── .env
│   ├── .gitignore
│   ├── index.html
│   ├── vercel.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── eslint.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── node_modules/
│   ├── dist/                        # Built output
│   └── src/
│       ├── main.jsx                 # Entry point
│       ├── index.css
│       ├── App.jsx                  # Router — BOTH portfolio & admin routes defined here
│       ├── animations/
│       │   └── variants.js
│       ├── components/
│       │   ├── AnimatedCounter.jsx
│       │   ├── Footer.jsx
│       │   ├── Loader.jsx
│       │   ├── Navbar.jsx
│       │   ├── ParticlesBackground.jsx
│       │   ├── ProjectCard.jsx
│       │   ├── ProtectedRoute.jsx   # Auth guard (admin-only concern)
│       │   ├── ScrollToTop.jsx
│       │   ├── SocialLinks.jsx
│       │   ├── TestimonialCard.jsx
│       │   ├── TestimonialsMarquee.jsx
│       │   ├── Terminal/            # Interactive terminal (portfolio feature)
│       │   │   ├── index.js
│       │   │   ├── Terminal.jsx
│       │   │   ├── TerminalLine.jsx
│       │   │   ├── TerminalPrompt.jsx
│       │   │   ├── TerminalViewport.jsx
│       │   │   ├── TypingEffect.jsx
│       │   │   ├── commandParser.js
│       │   │   ├── commandRegistry.js
│       │   │   ├── terminalConstants.js
│       │   │   └── useTerminal.js
│       │   ├── dashboard/           # Admin-only components
│       │   │   ├── AnalyticsStatCard.jsx
│       │   │   ├── ChartCard.jsx
│       │   │   ├── DashboardProjectCard.jsx
│       │   │   ├── DashboardTable.jsx
│       │   │   └── PageHeader.jsx
│       │   └── ui/                  # Shared UI primitives
│       │       ├── Button.jsx
│       │       ├── ConfirmationModal.jsx
│       │       ├── FormInput.jsx
│       │       ├── Modal.jsx
│       │       └── TimelineItem.jsx
│       ├── context/
│       │   ├── ProjectContext.jsx   # Portfolio + dashboard data
│       │   ├── ThemeContext.jsx     # Shared theme toggle
│       │   └── ToastContext.jsx     # Admin notifications
│       ├── data/
│       │   └── testimonials.js
│       ├── hooks/
│       │   ├── useTypewriter.js
│       │   └── useVisitorTracking.js
│       ├── layouts/
│       │   ├── DashboardLayout.jsx  # Admin layout
│       │   └── MainLayout.jsx      # Portfolio layout
│       ├── pages/
│       │   ├── Home.jsx            # Portfolio homepage
│       │   ├── Login.jsx           # Admin login
│       │   ├── Dashboard.jsx       # Admin dashboard overview
│       │   ├── DashboardProjects.jsx  # Admin project CRUD
│       │   ├── Messages.jsx        # Admin messages inbox
│       │   └── dashboard/
│       │       └── Analytics.jsx   # Admin analytics
│       ├── sections/               # Portfolio homepage sections
│       │   ├── AboutSection.jsx
│       │   ├── ContactSection.jsx
│       │   ├── ExperienceSection.jsx
│       │   ├── HeroSection.jsx
│       │   ├── ProjectsSection.jsx
│       │   ├── SkillsSection.jsx
│       │   └── TerminalSection.jsx
│       └── utils/
│           ├── api.js              # Axios client (shared)
│           ├── dashboardUtils.js   # Admin-only utilities
│           └── sectionNavigation.js
├── admin-dashboard/                # ⚠️ UNUSED Vite scaffold — default counter template
│   ├── .gitignore
│   ├── README.md
│   ├── index.html
│   ├── eslint.config.js
│   ├── vite.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── node_modules/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   └── src/
│       ├── main.jsx
│       ├── index.css
│       ├── App.jsx                 # Vite boilerplate (counter demo)
│       ├── App.css
│       └── assets/
│           ├── hero.png
│           ├── react.svg
│           └── vite.svg
├── server/                         # Express + MongoDB backend API
│   ├── .env
│   ├── app.js                      # Express app setup & route mounting
│   ├── server.js                   # Entry point (DB connect + listen)
│   ├── package.json
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── contactController.js
│   │   ├── dashboardController.js
│   │   ├── notificationController.js
│   │   ├── projectController.js
│   │   └── uploadController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── upload.js
│   ├── models/
│   │   ├── Contact.js
│   │   ├── Notification.js
│   │   ├── Project.js
│   │   ├── User.js
│   │   └── Visitor.js
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── projectRoutes.js
│   │   └── uploadRoutes.js
│   └── services/
│       └── googleAuthService.js
└── ARCHITECTURE_PLAN.md            # ← You are here
```

---

## 2. Key Architectural Issues

### 2.1 Monolithic Frontend
The `client/` package bundles **portfolio frontend** and **admin dashboard** as a single Vite + React app. Admin routes (`/dashboard`, `/dashboard/projects`, `/dashboard/messages`, `/dashboard/analytics`, `/login`) and portfolio routes (`/`) share the same build, the same `package.json`, and the same bundle.

### 2.2 Dead `admin-dashboard/` Folder
The folder `admin-dashboard/` in the root is a default Vite scaffold. Its `App.jsx` is a counter demo — it contains **no actual admin logic**. All real admin code lives in `client/src/`. This folder should be removed after migration.

### 2.3 No Shared Library Package
UI primitives (`ui/Button.jsx`, `ui/Modal.jsx`, etc.) live inside `client/`. If the admin dashboard is extracted to its own app, these must either be duplicated or extracted into a shared internal package.

### 2.4 Single API Client
`client/src/utils/api.js` is used by both portfolio and dashboard code. It hardcodes the production API URL and uses a single auth interceptor.

### 2.5 Context Cross-Contamination
`ProjectContext.jsx` and `ThemeContext.jsx` are used by both the portfolio and the admin dashboard, creating implicit coupling.

---

## 3. Target Production Architecture

```
portfolio-cms/
├── packages/
│   ├── portfolio-frontend/          # Standalone Vite app — public portfolio
│   │   ├── src/
│   │   │   ├── main.jsx
│   │   │   ├── App.jsx             # Portfolio-only routes
│   │   │   ├── pages/
│   │   │   │   └── Home.jsx
│   │   │   ├── sections/           # Hero, About, Skills, Projects, etc.
│   │   │   ├── components/         # Navbar, Footer, Terminal, ProjectCard, etc.
│   │   │   ├── layouts/
│   │   │   │   └── MainLayout.jsx
│   │   │   ├── context/
│   │   │   │   ├── ThemeContext.jsx
│   │   │   │   └── ProjectContext.jsx
│   │   │   ├── hooks/
│   │   │   ├── animations/
│   │   │   ├── data/
│   │   │   └── utils/
│   │   │       ├── api.js
│   │   │       └── sectionNavigation.js
│   │   ├── .env
│   │   ├── vite.config.js
│   │   ├── tailwind.config.js
│   │   ├── vercel.json
│   │   └── package.json
│   │
│   ├── admin-dashboard/             # Standalone Vite app — admin panel
│   │   ├── src/
│   │   │   ├── main.jsx
│   │   │   ├── App.jsx             # Admin-only routes
│   │   │   ├── pages/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── DashboardProjects.jsx
│   │   │   │   ├── Messages.jsx
│   │   │   │   └── dashboard/
│   │   │   │       └── Analytics.jsx
│   │   │   ├── components/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── layout/
│   │   │   │       └── DashboardLayout.jsx
│   │   │   ├── context/
│   │   │   │   ├── ThemeContext.jsx
│   │   │   │   └── ToastContext.jsx
│   │   │   └── utils/
│   │   │       ├── api.js
│   │   │       └── dashboardUtils.js
│   │   ├── .env
│   │   ├── vite.config.js
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   └── shared-ui/                   # (Optional) Internal package for shared primitives
│       ├── Button.jsx
│       ├── Modal.jsx
│       ├── FormInput.jsx
│       ├── ConfirmationModal.jsx
│       ├── TimelineItem.jsx
│       └── package.json
│
├── backend-api/                     # Express backend (renamed from server/)
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── .env
│   └── package.json
│
├── .gitignore
├── package.json                     # Workspace root (npm workspaces or turborepo)
└── README.md
```

---

## 4. File Classification

### Portfolio Frontend
| File | Reason |
|------|--------|
| `client/src/main.jsx` | Entry point |
| `client/src/App.jsx` | Router — portfolio routes only after split |
| `client/src/index.css` | Global styles |
| `client/src/pages/Home.jsx` | Portfolio homepage |
| `client/src/sections/*` | All 7 portfolio sections |
| `client/src/layouts/MainLayout.jsx` | Portfolio layout shell |
| `client/src/components/Navbar.jsx` | Portfolio navigation |
| `client/src/components/Footer.jsx` | Portfolio footer |
| `client/src/components/HeroSection`-related | Portfolio hero |
| `client/src/components/Terminal/*` | Interactive terminal feature |
| `client/src/components/ProjectCard.jsx` | Project display card |
| `client/src/components/TestimonialCard.jsx` | Testimonial display |
| `client/src/components/TestimonialsMarquee.jsx` | Marquee animation |
| `client/src/components/ParticlesBackground.jsx` | Visual effect |
| `client/src/components/Loader.jsx` | Loading screen |
| `client/src/components/AnimatedCounter.jsx` | Animated stats |
| `client/src/components/SocialLinks.jsx` | Social media links |
| `client/src/components/ScrollToTop.jsx` | Scroll behavior |
| `client/src/context/ThemeContext.jsx` | Theme (used by both but originates in portfolio) |
| `client/src/context/ProjectContext.jsx` | Project data fetching |
| `client/src/hooks/useTypewriter.js` | Terminal typing effect |
| `client/src/hooks/useVisitorTracking.js` | Analytics tracking |
| `client/src/utils/api.js` | API client |
| `client/src/utils/sectionNavigation.js` | Section scrolling |
| `client/src/data/testimonials.js` | Static data |
| `client/src/animations/variants.js` | Framer motion variants |

### Admin Dashboard
| File | Reason |
|------|--------|
| `client/src/pages/Dashboard.jsx` | Admin overview |
| `client/src/pages/DashboardProjects.jsx` | Admin project CRUD |
| `client/src/pages/Messages.jsx` | Admin messages |
| `client/src/pages/Login.jsx` | Admin authentication |
| `client/src/pages/dashboard/Analytics.jsx` | Admin analytics |
| `client/src/layouts/DashboardLayout.jsx` | Admin layout shell |
| `client/src/components/ProtectedRoute.jsx` | Auth guard |
| `client/src/components/dashboard/*` | Dashboard-specific components |
| `client/src/context/ToastContext.jsx` | Notification toasts |
| `client/src/utils/dashboardUtils.js` | Dashboard helpers |

### Shared (migrate to `packages/shared-ui/` or duplicate)
| File | Reason |
|------|--------|
| `client/src/components/ui/Button.jsx` | Used by both portfolio and admin forms |
| `client/src/components/ui/Modal.jsx` | Used by admin; could be used by portfolio |
| `client/src/components/ui/FormInput.jsx` | Used in both contact forms and admin |
| `client/src/components/ui/ConfirmationModal.jsx` | Admin heavy, but reusable |
| `client/src/components/ui/TimelineItem.jsx` | Portfolio experience section |

### Backend API (all stay in `backend-api/`)
All files under `server/` remain as the backend API. Only the folder may be renamed.

---

## 5. Dependency Map

```
portfolio-frontend ──┬── api.js ──────► backend-api (REST)
                     ├── ThemeContext.jsx
                     ├── ProjectContext.jsx
                     ├── ToastContext.jsx (no — admin only after split)
                     └── ui/* (shared)

admin-dashboard ──┬── api.js ──────► backend-api (REST)
                  ├── ThemeContext.jsx (copied or shared)
                  ├── ToastContext.jsx
                  └── ui/* (shared)

backend-api ──► MongoDB (external)
            ──► Cloudinary (external)
            ──► Google OAuth (external)
```

---

## 6. Risks Before Migration

| # | Risk | Impact | Mitigation |
|---|------|--------|------------|
| 1 | **Admin routes are interleaved with portfolio routes** in a single `App.jsx`. Extraction requires re-bundling and re-testing all navigation. | High — broken routing | Keep both `App.jsx` files side-by-side during transition; verify every route |
| 2 | **`admin-dashboard/` folder is a dead scaffold** — deleting it is safe, but must be done after the real admin code is extracted from `client/` | Low | Just delete after migration |
| 3 | **Shared contexts** (`ThemeContext`, `ProjectContext`) are tightly coupled to the client app. Extracting them requires either duplication or a shared package. | Medium | Duplicate `ThemeContext`; decouple `ProjectContext` from admin concerns |
| 4 | **`api.js` hardcodes the backend URL** — both apps will need their own copy | Low | Extract to each package with its own `.env` |
| 5 | **Tailwind config** is shared under `client/` — both new apps will need their own config | Low | Copy and adjust per app |
| 6 | **No monorepo tooling** currently — adding workspace support changes the dev workflow | Medium | Start with two standalone apps before introducing workspaces |
| 7 | **Deployment pipelines** (Vercel for client, Render for backend) need updating for two frontend apps | Medium | Configure separate Vercel projects for portfolio and admin |
