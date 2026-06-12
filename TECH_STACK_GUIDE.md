# MERN Portfolio — Technology Stack Guide

> **A comprehensive technical reference for every technology used in the project**  
> **Author:** Esubalew Molla  
> **Version:** 1.0.0  
> **Intended for:** Internship presentations, technical interviews, project defense

---

## Table of Contents

1. [Programming Languages](#1-programming-languages)
2. [Frontend Frameworks & Libraries](#2-frontend-frameworks--libraries)
3. [Backend Frameworks & Libraries](#3-backend-frameworks--libraries)
4. [Database Technologies](#4-database-technologies)
5. [Authentication Technologies](#5-authentication-technologies)
6. [State Management](#6-state-management)
7. [API Communication](#7-api-communication)
8. [UI & Styling Technologies](#8-ui--styling-technologies)
9. [File Upload Technologies](#9-file-upload-technologies)
10. [Analytics Technologies](#10-analytics-technologies)
11. [Security Technologies](#11-security-technologies)
12. [Deployment Technologies](#12-deployment-technologies)
13. [Development Tools](#13-development-tools)
14. [Architecture Patterns](#14-architecture-patterns)
15. [Third-Party Library Reference](#15-third-party-library-reference)

---

## 1. Programming Languages

### JavaScript (ES6+)

| Aspect | Detail |
|--------|--------|
| **What it is** | High-level, interpreted programming language; core language of the web |
| **Why used** | Only language natively supported by browsers; required for full-stack JavaScript development |
| **Version** | ES2020+ with ES modules (`import`/`export`) |
| **Key features used** | Arrow functions, destructuring, template literals, optional chaining, async/await, modules, spread/rest operators, `Set`, `Array.map/filter/reduce` |

**Where used in this project:**

```javascript
// Arrow functions — compact function syntax
const fetchProjects = async () => {
  const res = await api.get('/api/projects');
  setProjects(Array.isArray(res) ? res : []);
};

// Destructuring — extract values from objects/arrays
const { title, description, category } = req.body;
const { showToast } = useToast();

// Async/await — handle promises synchronously
const handleSubmit = async (e) => {
  e.preventDefault();
  // ... sequential async operations
};

// ES Modules — import/export syntax
export const Home = () => { ... };
import { useProjects } from '../context/ProjectContext';
```

### HTML5

| Aspect | Detail |
|--------|--------|
| **What it is** | Standard markup language for web documents |
| **Why used** | Required for browser-rendered UIs; Vite uses `index.html` as the entry point |
| **Key file** | `client/index.html` — contains `<div id="root">` mount point and script tag |

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/png" href="/images/esu.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Esubalew Portfolio</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

### CSS3 / Tailwind CSS

| Aspect | Detail |
|--------|--------|
| **What it is** | Stylesheet language for visual presentation |
| **How it's used** | Primarily through Tailwind CSS utility classes; custom CSS in `index.css` for global styles, scroll behavior, font imports |
| **Custom CSS** | `scroll-padding-top`, `scroll-margin-top`, `scroll-behavior: smooth`, font-face for Outfit font, dark mode base styles |

```css
/* index.css — global styles */
html {
  scroll-behavior: smooth;
  scroll-padding-top: 6.5rem;
}
body {
  font-family: 'Outfit', sans-serif;
  @apply bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100;
}
```

---

## 2. Frontend Frameworks & Libraries

### React 18

| Aspect | Detail |
|--------|--------|
| **What it is** | Component-based UI library for building interactive user interfaces |
| **Why used** | Industry standard for SPAs; component reusability, virtual DOM for performance, huge ecosystem |
| **Version** | ^18.2.0 |
| **Key concepts used** | Components, JSX, props, hooks, context, conditional rendering, lists & keys |

**How it works in this project:**

```
React Application Flow:
┌─────────────┐   render()   ┌───────────────────┐
│  Components  │────────────►│   Virtual DOM      │
│  (tree)      │             │   (in-memory)      │
└─────────────┘             └─────────┬───────────┘
                                      │ diff
                                      ▼
                              ┌───────────────────┐
                              │   Real Browser DOM │
                              │   (minimal update) │
                              └───────────────────┘
```

**Key React features used:**

```jsx
// Components — reusable UI pieces
const ProjectCard = ({ project }) => { ... };
export const Home = () => { ... };

// Hooks — state and lifecycle in functional components
const [projects, setProjects] = useState([]);
useEffect(() => { fetchProjects(); }, []);

// JSX — JavaScript XML syntax
return (
  <section id="projects">
    <h2>My Projects</h2>
    {projects.map(p => <ProjectCard key={p._id} project={p} />)}
  </section>
);

// Conditional rendering — handle loading/error/empty states
{loading && <Spinner />}
{error && <Error message={error} />}
{!loading && !error && <DataTable data={filteredData} />}
```

### React Router v7

| Aspect | Detail |
|--------|--------|
| **What it is** | Standard routing library for React SPAs |
| **Why used** | Enables client-side navigation without page reloads; supports nested routes, protected routes, URL params |
| **Version** | ^7.13.2 |
| **Key components used** | `BrowserRouter`, `Routes`, `Route`, `Outlet`, `NavLink`, `Link`, `useNavigate`, `useLocation` |

**Routing configuration:**

```jsx
<BrowserRouter>
  <Routes>
    {/* Public routes */}
    <Route path="/login" element={<Login />} />
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
    </Route>

    {/* Protected dashboard routes */}
    <Route path="/dashboard" element={
      <ProtectedRoute><DashboardLayout /></ProtectedRoute>
    }>
      <Route index element={<Dashboard />} />
      <Route path="projects" element={<DashboardProjects />} />
      <Route path="messages" element={<Messages />} />
      <Route path="analytics" element={<Analytics />} />
    </Route>
  </Routes>
</BrowserRouter>
```

**Navigation features:**

| Feature | Implementation |
|---------|---------------|
| **Programmatic navigation** | `useNavigate()` — e.g., `navigate('/login')` on logout |
| **Route state** | `location.state` — passes `{ from: location }` to redirect after login |
| **Active link detection** | `useLocation()` — highlights current sidebar item |
| **Nested layouts** | `<Outlet />` — renders child routes inside parent layout |

---

## 3. Backend Frameworks & Libraries

### Node.js

| Aspect | Detail |
|--------|--------|
| **What it is** | JavaScript runtime built on Chrome's V8 engine |
| **Why used** | Enables JavaScript on the server; non-blocking I/O model for scalability; npm ecosystem |
| **Version** | v16+ (required by project dependencies) |
| **Features used** | CommonJS → ES modules (`"type": "module"`), `import`/`export`, async/await, `process.env` |

```
Node.js Event Loop Model:
┌─────────────┐
│   Client     │─── HTTP Request ──►
└─────────────┘                     │
                                    ▼
┌──────────────────────────────────────────┐
│            Node.js Event Loop            │
│                                          │
│  ┌──────────┐  ┌──────────┐  ┌───────┐  │
│  │ timers   │→ │ pending  │→ │ poll  │  │
│  │          │  │ callbacks│  │       │  │
│  └──────────┘  └──────────┘  └───┬───┘  │
│                                   │      │
│  ┌──────────┐  ┌──────────┐      │      │
│  │ check    │← │ close    │←─────┘      │
│  │          │  │ callbacks│             │
│  └──────────┘  └──────────┘             │
└──────────────────────────────────────────┘
                    │
                    ▼
           ┌──────────────┐
           │   Response    │─── HTTP Response ──► Client
           └──────────────┘
```

### Express.js v5

| Aspect | Detail |
|--------|--------|
| **What it is** | Minimal, unopinionated web framework for Node.js |
| **Why used** | Industry standard for REST APIs; middleware architecture; simple routing |
| **Version** | ^5.2.1 |
| **Alternatives considered** | Fastify (faster but less ecosystem), Koa (requires different middleware style) |

**Express application structure:**

```javascript
// app.js — Express setup
const app = express();
app.use(cors({ /* ... */ }));
app.use(express.json());

// Mount route modules
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
// ... more routes

// Health check
app.get('/', (req, res) => res.json({ status: 'ok' }));

export default app;
```

**Express concepts used:**

| Concept | Usage in project |
|---------|-----------------|
| **Router** | `express.Router()` — modular route files |
| **Middleware** | `app.use()` — CORS, JSON parsing, auth |
| **Request handling** | `req.params`, `req.query`, `req.body`, `req.headers` |
| **Response methods** | `res.status().json()` — structured API responses |
| **Error handling** | Try/catch in controllers returning `{ success, message }` |

---

## 4. Database Technologies

### MongoDB Atlas

| Aspect | Detail |
|--------|--------|
| **What it is** | Cloud-hosted MongoDB service (NoSQL document database) |
| **Why used** | Schema-less flexibility for rapid development; free tier (M0) for prototyping; automatic backups and scaling |
| **Connection** | Mongoose ODM via connection string: `mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>?appName=<app>` |
| **Free tier limits** | 512 MB storage, shared RAM/CPU |

**Why MongoDB over SQL:**

```
MongoDB (NoSQL)                 PostgreSQL (SQL)
├── Schema-less                ├── Fixed schema
├── Documents (JSON-like BSON) ├── Tables with rows/columns
├── Embedded documents         ├── JOINs across tables
├── Horizontal scaling (native)├── Vertical scaling typically
├── Flexible for prototyping   ├── Rigid but consistent
└── Great for JS/Node apps     └── Great for complex queries
```

**In this project:**
- 5 collections: `users`, `projects`, `contacts`, `visitors`, `notifications`
- Data stored as BSON documents, returned as JavaScript objects
- MongoDB Atlas IP whitelist controls access

### Mongoose v9

| Aspect | Detail |
|--------|--------|
| **What it is** | MongoDB ODM (Object Document Mapper) for Node.js |
| **Why used** | Schema validation, middleware hooks, type casting, query building |
| **Version** | ^9.3.3 |

**Mongoose features used:**

```javascript
// 1. Schema Definition — structure + validation
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, enum: ["mern", "frontend", "backend", "mobile"] },
  technologies: [{ type: String, trim: true }],
  image: { type: String, required: [true, "Project image is required"] }
});

// 2. Model — interface to collection
const Project = mongoose.model("Project", projectSchema);

// 3. CRUD Operations
Project.create({ title, description });          // Create
Project.find().sort({ createdAt: -1 });          // Read (all)
Project.findById(id);                             // Read (one)
Project.findByIdAndUpdate(id, updates, { new: true });  // Update
Project.findByIdAndDelete(id);                    // Delete

// 4. Pre-save Hook — auto-hash password
userSchema.pre("save", async function () {
  if (!this.password || !this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 5. Instance Method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 6. Aggregation Pipeline — analytics computations
Visitor.aggregate([
  { $group: { _id: "$country", visitors: { $sum: 1 } } },
  { $sort: { visitors: -1 } }
]);

// 7. Index Definition — performance optimization
visitorSchema.index({ ip: 1, page: 1, createdAt: -1 });
```

---

## 5. Authentication Technologies

### JWT (JSON Web Tokens)

| Aspect | Detail |
|--------|--------|
| **What it is** | Open standard (RFC 7519) for securely transmitting information as a JSON object |
| **Why used** | Stateless authentication — no server-side session storage; compact (URL-safe); signed with HMAC or RSA |
| **Library** | `jsonwebtoken` v9 |
| **Token structure** | `header.payload.signature` (base64url encoded) |

**JWT structure:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.     ← header (algorithm + type)
eyJpZCI6IjYwZDEyMzQ1Njc4OTAiLCJpYXQiOjE2MjAwMDAwMDAsImV4cCI6MTYyMDYwNDgwMH0.  ← payload (claims)
tX9X9X9X9X9X9X9X9X9X9X9X9X9X9X9X9X9X9X9X9X9X  ← signature (HMAC-SHA256)
```

**In this project:**

```javascript
// Server: Token Generation
const token = jwt.sign(
  { id: user._id },          // Payload
  process.env.JWT_SECRET,    // Secret key (from .env)
  { expiresIn: "7d" }        // Options: 7-day expiry
);

// Server: Token Verification
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded;  // { id: "..." }

// Client: Token Storage
localStorage.setItem('token', token);  // Stored on login

// Client: Sending Token
// Axios interceptor auto-attaches:
config.headers.Authorization = `Bearer ${token}`;
```

### Google OAuth 2.0

| Aspect | Detail |
|--------|--------|
| **What it is** | Open standard for delegated access — "Sign in with Google" |
| **Why used** | Eliminates password management; users trust Google's security; single-click login |
| **Flow** | Server-side verification (recommended over client-only) |

**Complete authentication flow:**

```
┌──────────┐     ┌───────────┐     ┌─────────────┐     ┌──────────┐     ┌──────────────┐
│  User     │     │  Browser   │     │   Google     │     │  Server   │     │  MongoDB      │
└─────┬─────┘     └─────┬─────┘     └──────┬──────┘     └─────┬─────┘     └──────┬───────┘
      │                  │                  │                  │                  │
      │  Click Google    │                  │                  │                  │
      │  Sign-In button  │                  │                  │                  │
      ├─────────────────►│                  │                  │                  │
      │                  │  Google OAuth    │                  │                  │
      │                  │  popup opens     │                  │                  │
      │                  ├─────────────────►│                  │                  │
      │                  │                  │                  │                  │
      │  Select account  │                  │                  │                  │
      │                  │◄─────────────────┤                  │                  │
      │                  │  credential token│                  │                  │
      │                  │                  │                  │                  │
      │                  │  POST /api/auth/google              │                  │
      │                  │  { credential }   │                  │                  │
      │                  ├────────────────────────────────────►│                  │
      │                  │                  │                  │                  │
      │                  │                  │   verifyGoogleToken(credential)      │
      │                  │                  │   ├─ OAuth2Client.verifyIdToken()   │
      │                  │                  │   └─ payload { email, sub, name }   │
      │                  │                  │                  │                  │
      │                  │                  │   validateAdminEmail(email)         │
      │                  │                  │   ├─ Compare with ADMIN_EMAIL       │
      │                  │                  │   └─ Error if not authorized         │
      │                  │                  │                  │                  │
      │                  │                  │   Find or create user               │
      │                  │                  │   by email        │                  │
      │                  │                  ├─────────────────►│                  │
      │                  │                  │◄─────────────────┤                  │
      │                  │                  │                  │                  │
      │                  │                  │   jwt.sign({ id }, SECRET, {        │
      │                  │                  │     expiresIn: '7d' })              │
      │                  │                  │                  │                  │
      │                  │◄─────────────────┤                  │                  │
      │                  │  { token }       │                  │                  │
      │                  │                  │                  │                  │
      │  Save token to   │                  │                  │                  │
      │  localStorage    │                  │                  │                  │
      │◄─────────────────┤                  │                  │                  │
      │                  │                  │                  │                  │
      │  Redirect to     │                  │                  │                  │
      │  /dashboard      │                  │                  │                  │
      ├─────────────────►│                  │                  │                  │
```

### @react-oauth/google (Client Library)

| Aspect | Detail |
|--------|--------|
| **What it is** | React component library for Google OAuth |
| **Why used** | Provides `<GoogleLogin>` button component; handles the OAuth popup lifecycle |
| **Alternatives** | Manual OAuth implementation, @react-oauth/google is the official wrapper |

```jsx
// Usage in Login.jsx
import { GoogleLogin } from '@react-oauth/google';

// Wraps the app at root level (main.jsx)
<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  <App />
</GoogleOAuthProvider>

// Login button
<GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={handleGoogleError}
  theme="outline"
  size="large"
  text="continue_with"
/>
```

### google-auth-library (Server Library)

| Aspect | Detail |
|--------|--------|
| **What it is** | Google's official Node.js library for verifying ID tokens server-side |
| **Why used** | Server-side verification prevents token tampering; validates audience, issuer, and signature |
| **File** | `server/services/googleAuthService.js` |

```javascript
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (credentialToken) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: credentialToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload) throw new Error('Failed to get Google user payload');
  return payload;
};
```

---

## 6. State Management

### React Context API

| Aspect | Detail |
|--------|--------|
| **What it is** | Built-in React feature for sharing state across components without prop drilling |
| **Why used** | Simpler than Redux for this scale; no extra dependencies; sufficient for 3 global concerns |
| **Limitation** | Context consumers re-render on any value change; mitigated by splitting into separate contexts |

**Three contexts in this project:**

```
┌──────────────────────────────────────────────────┐
│                  App.jsx                          │
│  ┌──────────────────────────────────────────────┐ │
│  │  ThemeProvider (isDarkMode, toggleTheme)      │ │
│  │  ┌──────────────────────────────────────────┐ │ │
│  │  │  ProjectProvider (projects, CRUD methods) │ │ │
│  │  │  ┌──────────────────────────────────────┐ │ │ │
│  │  │  │  ToastProvider (showToast, toasts[]) │ │ │ │
│  │  │  │  ┌────────────────────────────────┐  │ │ │ │
│  │  │  │  │        Application             │  │ │ │ │
│  │  │  │  └────────────────────────────────┘  │ │ │ │
│  │  │  └──────────────────────────────────────┘ │ │ │
│  │  └──────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

**Context pattern (example: ThemeContext):**

```jsx
// 1. Create context
const ThemeContext = createContext(undefined);

// 2. Create provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Create consumer hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 4. Use anywhere in the tree
const { isDarkMode, toggleTheme } = useTheme();
```

### useState

| Aspect | Detail |
|--------|--------|
| **What it is** | React hook for adding state to functional components |
| **Why used** | Local component state; triggers re-render on update |

```jsx
// Basic state
const [count, setCount] = useState(0);

// Object state
const [formData, setFormData] = useState({ name: '', email: '' });

// Lazy initialization (expensive computation)
const [token] = useState(() => localStorage.getItem('token'));

// State updater function (when new state depends on previous)
setProjects(prev => [...prev, newProject]);
setTimeout(() => setShowToast(false), 5000);
```

**State categories in this project:**

| Category | Examples | Location |
|----------|----------|----------|
| **UI state** | `isLoading`, `isVisible`, `sidebarOpen`, `viewMode`, `searchTerm` | Components |
| **Form state** | `formData`, `errors`, `isSubmitting`, `imagePreview` | DashboardProjects, Messages, Login, Contact |
| **Data state** | `projects`, `messages`, `analytics`, `stats` | Pages |
| **Auth state** | `token` (localStorage) | — |
| **Theme state** | `isDarkMode` | ThemeContext |
| **Notification state** | `notifications`, `unreadCount` | DashboardLayout |

### useEffect

| Aspect | Detail |
|--------|--------|
| **What it is** | React hook for side effects in functional components |
| **Why used** | Data fetching, DOM manipulation, subscriptions, timers |

```jsx
// Data fetching on mount
useEffect(() => { fetchProjects(); }, []);

// Side effect on state change (theme)
useEffect(() => {
  document.documentElement.classList.toggle('dark', isDarkMode);
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}, [isDarkMode]);

// Cleanup (timers)
useEffect(() => {
  const timer = setTimeout(() => setIsDeleting(true), pauseDuration);
  return () => clearTimeout(timer);  // Cleanup on unmount or re-run
}, [text]);

// Event listeners
useEffect(() => {
  window.addEventListener('scroll', toggleVisibility);
  return () => window.removeEventListener('scroll', toggleVisibility);
}, []);

// Interval (notifications refresh)
useEffect(() => {
  fetchNotifications();
  const interval = setInterval(fetchNotifications, 120000);
  return () => clearInterval(interval);
}, []);
```

### State Flow in the Application

```
                    ┌─────────────────────────────┐
                    │   User Action (click, type)   │
                    └─────────────┬───────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │   Event Handler               │
                    │   (onClick, onSubmit, onChange) │
                    └─────────────┬───────────────┘
                                  │
                    ┌─────────────┴───────────────┐
                    │                             │
                    ▼                             ▼
        ┌───────────────────┐         ┌───────────────────┐
        │  setState (local)  │         │ Context method     │
        │  e.g., setFormData │         │ e.g., addProject() │
        └───────────────────┘         └─────────┬─────────┘
                    │                             │
                    ▼                             ▼
        ┌───────────────────┐         ┌───────────────────┐
        │  Component         │         │  API Call          │
        │  re-renders        │         │  (api.post etc.)   │
        └───────────────────┘         └─────────┬─────────┘
                    │                             │
                    ▼                             ▼
        ┌───────────────────┐         ┌───────────────────┐
        │  UI updates        │         │  Server response   │
        │  immediately       │         │  ↓ setState        │
        └───────────────────┘         │  ↓ toast           │
                                       │  ↓ re-render       │
                                       └───────────────────┘
```

---

## 7. API Communication

### Axios

| Aspect | Detail |
|--------|--------|
| **What it is** | Promise-based HTTP client for browser and Node.js |
| **Why used** | Automatic JSON transform; request/response interceptors; timeout support; better error handling than `fetch` |
| **Version** | ^1.14.0 |
| **Alternatives** | `fetch` (built-in but less ergonomic), `ky` (lighter but fewer features) |

**Api client architecture:**

```javascript
// utils/api.js — centralized API client

// 1. Create instance with base URL and timeout
const api = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://portfolio-backend-gxhv.onrender.com",
  timeout: 30000,
});

// 2. Request Interceptor — auto-attach JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.data instanceof FormData) delete config.headers['Content-Type'];
  return config;
});

// 3. Response Interceptor — handle 401
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(normalizeError(error));
  }
);

// 4. Convenience methods with auto-unwrap
const apiClient = {
  get: (url) => api.get(url).then(res => res.data),
  post: (url, data) => api.post(url, data).then(res => res.data),
  put: (url, data) => api.put(url, data).then(res => res.data),
  delete: (url) => api.delete(url).then(res => res.data),
};
```

### REST API Design

| Aspect | Detail |
|--------|--------|
| **What it is** | Architectural style using HTTP methods for CRUD operations on resources |
| **Why used** | Stateless, cacheable, uniform interface; industry standard for web APIs |

**REST conventions followed:**

```
GET     /api/projects         → List all projects
GET     /api/projects/:id     → Get single project
POST    /api/projects         → Create new project
PUT     /api/projects/:id     → Update project
DELETE  /api/projects/:id     → Delete project
```

**API response format:**

```javascript
// Success
{ success: true, data: {...}, message: "..." }

// List
{ success: true, count: 5, data: [...] }

// Error
{ success: false, message: "Description of error", error: "..." }
```

---

## 8. UI & Styling Technologies

### Tailwind CSS v3

| Aspect | Detail |
|--------|--------|
| **What it is** | Utility-first CSS framework |
| **Why used** | Rapid prototyping without writing custom CSS; consistent design system; built-in dark mode; small production bundle (purges unused styles) |
| **Version** | ^3.4.19 |
| **Philosophy** | "Build with constraints" — predefined spacing, colors, typography scale |

**In this project:**

```jsx
// Utility classes instead of custom CSS
<div className="flex items-center justify-between p-6 bg-white dark:bg-gray-900 
                rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
    Dashboard Overview
  </h2>
</div>
```

**Custom Tailwind config:**

```javascript
// tailwind.config.js — design tokens
export default {
  darkMode: 'class',  // Toggle via JavaScript
  theme: {
    extend: {
      colors: {
        surface: { base: 'rgb(var(--surface-base) / <alpha-value>)' },
        content: { primary: 'rgb(var(--content-primary) / <alpha-value>)' },
        border: { DEFAULT: 'rgb(var(--border-default) / <alpha-value>)' },
        accent: { DEFAULT: 'rgb(var(--accent) / <alpha-value>)' },
        terminal: { bg: 'rgb(var(--terminal-bg) / <alpha-value>)' },
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        terminal: 'var(--shadow-terminal)',
      }
    }
  }
};
```

**Key utility patterns used:**

| Pattern | Example | Purpose |
|---------|---------|---------|
| **Layout** | `flex`, `grid`, `container`, `mx-auto` | Page structure |
| **Spacing** | `p-6`, `m-4`, `gap-4`, `space-y-6` | Consistent spacing |
| **Typography** | `text-sm`, `font-bold`, `tracking-wide` | Text styling |
| **Colors** | `text-gray-900`, `bg-blue-600`, `border-gray-200` | Color system |
| **Dark mode** | `dark:bg-gray-900`, `dark:text-white` | Theme support |
| **Responsive** | `md:flex-row`, `lg:w-1/2`, `sm:text-left` | Mobile-first |
| **States** | `hover:bg-gray-100`, `focus:ring-2`, `disabled:opacity-50` | Interactive |
| **Animations** | `transition-colors`, `duration-300`, `animate-spin` | Motion |
| **Effects** | `shadow-lg`, `backdrop-blur`, `rounded-2xl` | Visual design |

### Framer Motion v12

| Aspect | Detail |
|--------|--------|
| **What it is** | Animation library for React with declarative API |
| **Why used** | Spring animations, layout animations, gesture support, scroll-triggered animations |
| **Version** | ^12.38.0 |
| **Alternatives** | CSS animations (less powerful), react-spring (less features), GSAP (paid for commercial) |

**Animation patterns used:**

```jsx
// 1. Scroll-triggered entrance animations
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  Content animates in when scrolled into view
</motion.div>

// 2. Staggered children
<motion.div variants={staggerContainer(0.15, 0)}>
  <motion.div variants={fadeIn('up', 0.1)}>Item 1</motion.div>
  <motion.div variants={fadeIn('up', 0.2)}>Item 2</motion.div>
</motion.div>

// 3. Hover interactions
<motion.div
  whileHover={{ scale: 1.02, y: -8 }}
  transition={{ type: 'spring', stiffness: 300 }}
>

// 4. Layout animations (AnimatePresence)
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      Modal content
    </motion.div>
  )}
</AnimatePresence>

// 5. Continuous animation (floating profile image)
<motion.div
  animate={{ y: [-8, 8, -8] }}
  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
>

// 6. Counter animation
const controls = animate(from, to, {
  duration,
  onUpdate(value) { setValue(Math.round(value)); }
});

// 7. Reusable variants
export const fadeIn = (direction, delay) => ({
  hidden: { y: direction === 'up' ? 40 : 0, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' } }
});
```

### Lucide React

| Aspect | Detail |
|--------|--------|
| **What it is** | Open-source icon library (fork of Feather Icons) |
| **Why used** | Clean, consistent SVG icons; tree-shakable (import only used icons); React components |
| **Version** | ^0.460.0 |
| **Count used** | 25+ different icons across the application |

```jsx
import { Sun, Moon, Menu, X, Send, Trash2, Edit, Eye } from 'lucide-react';

// Usage — as React components
<Sun className="h-5 w-5 text-yellow-500" />
<Send className="w-4 h-4" />
<Trash2 size={18} className="text-red-500" />

// With Button component
<Button icon={Edit}>Edit Project</Button>
<Button icon={Trash2} variant="danger">Delete</Button>
```

---

## 9. File Upload Technologies

### Multer

| Aspect | Detail |
|--------|--------|
| **What it is** | Node.js middleware for handling `multipart/form-data` (file uploads) |
| **Why used** | Industry standard; handles file parsing, size limits, storage configuration |
| **Version** | ^2.1.1 |

### Cloudinary + multer-storage-cloudinary

| Aspect | Detail |
|--------|--------|
| **What it is** | Cloud-based image/video management platform with CDN delivery |
| **Why used** | Automatic image optimization, format conversion (WebP), CDN edge caching, URL-based transformations; eliminates need for server-side image storage |
| **Account tier** | Free (25GB storage, 25GB bandwidth/month) |

**Complete image upload workflow:**

```
┌──────────┐     ┌───────────┐     ┌──────────────┐     ┌──────────┐
│  Admin     │     │  Browser   │     │  Cloudinary    │     │  MongoDB  │
└─────┬─────┘     └─────┬─────┘     └──────┬───────┘     └─────┬─────┘
      │                  │                  │                  │
      │  Select image    │                  │                  │
      │  file (≤5MB)     │                  │                  │
      ├─────────────────►│                  │                  │
      │                  │                  │                  │
      │  Click "Create   │                  │                  │
      │  Project"        │                  │                  │
      ├─────────────────►│                  │                  │
      │                  │                  │                  │
      │                  │  POST /api/upload (multipart/form)  │
      │                  │  Authorization: Bearer <token>      │
      │                  ├────────────────────────────────────►│
      │                  │                  │                  │
      │                  │                  │  Multer parses   │
      │                  │                  │  multipart data  │
      │                  │                  │                  │
      │                  │                  │  CloudinaryStorage│
      │                  │                  │  uploads image   │
      │                  │                  │  to 'portfolio-  │
      │                  │                  │   projects'      │
      │                  │                  │  folder          │
      │                  │                  │                  │
      │                  │                  │  Auto-optimize:  │
      │                  │                  │  WebP format,    │
      │                  │                  │  responsive sizes│
      │                  │                  │                  │
      │                  │◄─────────────────┤                  │
      │                  │  { imageUrl,     │                  │
      │                  │    imagePublicId }│                  │
      │                  │                  │                  │
      │                  │                  │                  │
      │                  │  POST /api/projects (JSON)          │
      │                  │  { title, ..., image: imageUrl,     │
      │                  │    imagePublicId }                  │
      │                  ├────────────────────────────────────►│
      │                  │                  │                  │
      │                  │                  │  Project.create( │
      │                  │                  │    { ..., image })│
      │                  │                  ├─────────────────►│
      │                  │                  │                  │
      │                  │◄─────────────────┤                  │
      │                  │  201 Created     │                  │
      │                  │                  │                  │
      │  Project shows   │                  │                  │
      │  in dashboard    │                  │                  │
      │◄─────────────────┤                  │                  │
      │                  │                  │                  │
      │  ─── Delete ───  │                  │                  │
      │  Click delete    │                  │                  │
      ├─────────────────►│                  │                  │
      │                  │  DELETE /api/projects/:id           │
      │                  ├────────────────────────────────────►│
      │                  │                  │                  │
      │                  │                  │  cloudinary.     │
      │                  │                  │  uploader.destroy│
      │                  │                  │  (imagePublicId) │
      │                  │                  ├─────────────────►│
      │                  │                  │◄─────────────────┤
      │                  │                  │                  │
      │                  │                  │  Project.        │
      │                  │                  │  findByIdAndDelete│
      │                  │                  ├─────────────────►│
      │                  │                  │◄─────────────────┤
      │                  │◄─────────────────┤                  │
      │                  │  200 Deleted     │                  │
```

**Server-side upload middleware:**

```javascript
// middleware/upload.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio-projects',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage });
export default upload;
```

```javascript
// routes/uploadRoutes.js
router.post("/", protect, upload.single("image"), uploadImage);
```

---

## 10. Analytics Technologies

### Visitor Tracking Implementation

**How visitors are tracked — end to end:**

```
1. Client Side (Browser)
   ├── useVisitorTracking hook in MainLayout
   │   └── Fires on route change (location.pathname)
   │       └── POST /api/analytics/visit { page: 'home' }
   │
   └── useTrackSection in ProjectsSection, ContactSection
       └── Fires once per section per session
           └── POST /api/analytics/visit { page: 'projects' }

2. Server Side (Express)
   └── analyticsController.trackVisit
       ├── Extract IP (request-ip)
       ├── Geo lookup (geoip-lite)
       ├── Browser detection (user-agent parsing)
       ├── Device detection (mobile/tablet/desktop regex)
       ├── Dedup check (60-second window)
       └── Save Visitor document to MongoDB

3. Database (MongoDB)
   └── Visitor collection
       ├── page: string
       ├── ip: string
       ├── country: string (from geoip)
       ├── city: string (from geoip)
       ├── device: string (Desktop/Mobile/Tablet)
       ├── browser: string (Chrome/Firefox/etc.)
       ├── userAgent: string
       └── createdAt: timestamp
```

**Browser/Device detection logic:**

```javascript
const detectBrowser = (userAgent) => {
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
  if (userAgent.includes("Edg")) return "Edge";
  if (userAgent.includes("MSIE") || userAgent.includes("Trident")) return "Internet Explorer";
  if (userAgent.includes("OPR") || userAgent.includes("Opera")) return "Opera";
  return "Other";
};

const detectDevice = (userAgent) => {
  if (/mobile|android|iphone|ipad|ipod/i.test(userAgent)) {
    if (/ipad|tablet|kindle|playbook|silk/i.test(userAgent)) return "Tablet";
    return "Mobile";
  }
  return "Desktop";
};
```

### Analytics Database Model

```javascript
const visitorSchema = new mongoose.Schema({
  page:     { type: String, required: true },
  ip:       { type: String, required: true },
  country:  { type: String, default: "Unknown" },
  city:     { type: String, default: "Unknown" },
  device:   { type: String, default: "Desktop" },
  browser:  { type: String, default: "Unknown" },
  userAgent:{ type: String, default: "" },
}, { timestamps: true });

visitorSchema.index({ ip: 1, page: 1, createdAt: -1 });
```

### Dashboard Analytics System

**6 computed metrics (from `getOverview`):**

| Metric | Computation | Meaning |
|--------|-------------|---------|
| `totalVisitors` | `countDocuments()` | Total visit records |
| `uniqueVisitors` | `distinct('ip').length` | Unique IP addresses |
| `todayVisitors` | `count({ createdAt >= today })` | Visits in last 24h |
| `returningVisitors` | Aggregate: group by ip, count > 1 | Repeat visitors |
| `bounceRate` | Single-page / total-with-pages × 100 | % that viewed one page |
| `weekVisitors` / `monthVisitors` | Date-range filtered counts | Period-specific |

**Chart data (from `getCharts`):**

```javascript
// Daily — 30 days, filled with 0s for missing dates
[ { date: '2026-05-15', label: 'May 15', visitors: 42 }, ... ]

// Weekly — 12 weeks, by ISO week
[ { label: 'W20', startDate: '...', visitors: 280 }, ... ]

// Monthly — 12 months
[ { month: '2026-05', label: 'May', visitors: 1200 }, ... ]
```

**Visualization stack:**

```
Data → MongoDB Aggregation → JSON Response
    → Recharts (React charting library)
        ├── AreaChart (trend over time)
        ├── PieChart (device distribution)
        └── Custom CSS bars (countries, sections)
```

---

## 11. Security Technologies

### JWT Verification

```javascript
// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  let token;

  // 1. Extract from Authorization header
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. Check existence
  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  // 3. Verify signature and expiry
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach to request
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};
```

### Protected Routes (Client)

```javascript
// components/ProtectedRoute.jsx
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    // Redirect to login, saving intended location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;  // Render protected content
};
```

### Environment Variables

```javascript
// .env — NEVER committed to version control
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=supersecretkey123
ADMIN_EMAIL=admin@example.com
GOOGLE_CLIENT_ID=123456789-xxxxx.apps.googleusercontent.com
CLOUD_NAME=mycloud
API_KEY=123456
API_SECRET=abcdef123456

// Accessed in code
const secret = process.env.JWT_SECRET;
const mongoUri = process.env.MONGO_URI;
```

**Security measures:**

| Measure | Implementation |
|---------|---------------|
| `.env` in `.gitignore` | Prevents secret exposure in repository |
| CORS whitelist | Only specific origins allowed |
| JWT expiry | 7 days + 401 interceptor for stale tokens |
| Password hashing | bcrypt with 10 salt rounds |
| Google OAuth server-verify | Token verified on server, not just client |
| Admin email validation | Only configured email can log in via Google |
| API route protection | `protect` middleware on all dashboard routes |

### Password Hashing (bcryptjs)

```javascript
// Pre-save hook — User model
userSchema.pre("save", async function () {
  if (!this.password || !this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);  // 10 rounds
  this.password = await bcrypt.hash(this.password, salt);
});

// Comparison method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

---

## 12. Deployment Technologies

### Vercel (Frontend Hosting)

| Aspect | Detail |
|--------|--------|
| **What it is** | Cloud platform for frontend deployment with automatic CDN |
| **Why used** | Free tier; automatic HTTPS; GitHub integration; zero-config for Vite |
| **Deployment URL** | `portfolio-mern-one-rho.vercel.app` |

**Vercel configuration:**

```json
// vercel.json — SPA rewrites
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Deployment process:**
1. Connect GitHub repository to Vercel
2. Vercel detects Vite project automatically
3. Environment variables set in Vercel dashboard
4. Every push to main triggers automatic deployment
5. Assets served from Vercel's global CDN edge network

### MongoDB Atlas (Database Hosting)

| Aspect | Detail |
|--------|--------|
| **What it is** | Fully-managed cloud database service for MongoDB |
| **Why used** | Free M0 cluster; automatic backups; IP whitelist security |
| **Connection** | SRV connection string with authentication (username + password) |

**Atlas features used:**
- **IP whitelist** — only Render server IP can connect
- **Database user** — separate credentials per project
- **Automatic replication** — 3-node replica set (even on free tier)

### Cloudinary (Media CDN)

| Aspect | Detail |
|--------|--------|
| **What it is** | Cloud-based image/video management platform with global CDN |
| **Why used** | Automatic image optimization (format, quality, size); CDN delivery; URL-based transformations |
| **Account** | Free tier (25GB storage, 25GB monthly bandwidth) |

**Cloudinary URL features (not yet utilized but available):**

```
Original: https://res.cloudinary.com/demo/image/upload/v1234/sample.jpg
                ↓ Transform via URL params
Transformed: https://res.cloudinary.com/demo/image/upload/w_400,h_300,c_fill,q_auto,f_webp/sample.jpg
```

---

## 13. Development Tools

### VS Code

| Aspect | Detail |
|--------|--------|
| **What it is** | Source code editor by Microsoft |
| **Why used** | Lightweight; excellent JavaScript/React support; extensions ecosystem |
| **Key extensions** | ESLint, Prettier, Tailwind CSS IntelliSense, ES7+ React snippets |

### Git & GitHub

| Aspect | Detail |
|--------|--------|
| **What it is** | Distributed version control system |
| **Why used** | Track changes; collaborate; deploy via CI/CD |
| **Repository** | `github.com/esubalew7/portfolio-mern` |

**.gitignore configuration:**

```
# node_modules
node_modules/
client/node_modules/
server/node_modules/

# environment variables
.env
client/.env
server/.env

# build files
dist/
build/

# logs
*.log
```

### npm

| Aspect | Detail |
|--------|--------|
| **What it is** | Node package manager — installs dependencies, runs scripts |
| **Why used** | Standard for Node.js ecosystem; `package.json` for dependency management |

**Key scripts:**

```json
// Client
"dev": "vite",           // Development server (hot reload)
"build": "vite build",   // Production build
"lint": "eslint .",      // Code quality
"preview": "vite preview"// Preview production build

// Server
"start": "node server.js",  // Production start
"dev": "nodemon server.js"  // Development with auto-restart
```

---

## 14. Architecture Patterns

### Component-Based Architecture (React)

```
┌─────────────────────────────────────────────┐
│               Component Tree                │
│                                             │
│  App                                         │
│  ├── ThemeProvider (Wraps entire app)        │
│  │   ├── Login Page                        │
│  │   ├── MainLayout                        │
│  │   │   ├── Navbar                        │
│  │   │   ├── Home Page                     │
│  │   │   │   ├── HeroSection               │
│  │   │   │   │   └── ParticlesBackground   │
│  │   │   │   ├── AboutSection              │
│  │   │   │   │   └── AnimatedCounter       │
│  │   │   │   ├── SkillsSection             │
│  │   │   │   ├── ProjectsSection           │
│  │   │   │   │   └── ProjectCard[]         │
│  │   │   │   ├── TerminalSection           │
│  │   │   │   │   └── Terminal              │
│  │   │   │   │       ├── TerminalViewport  │
│  │   │   │   │       │   ├── TerminalLine[]│
│  │   │   │   │       │   └── TerminalPrompt│
│  │   │   │   │       └── TypingEffect      │
│  │   │   │   ├── ExperienceSection         │
│  │   │   │   │   ├── TimelineItem[]        │
│  │   │   │   │   └── TestimonialsMarquee   │
│  │   │   │   │       └── TestimonialCard[]  │
│  │   │   │   └── ContactSection            │
│  │   │   └── Footer                        │
│  │   ├── DashboardLayout                   │
│  │   │   ├── Sidebar                       │
│  │   │   ├── Topbar (Notifications)        │
│  │   │   └── Dashboard Pages               │
│  │   └── ScrollToTop                       │
│  └── Toast Container                       │
└─────────────────────────────────────────────┘
```

**Principles:**
- Single responsibility (each component does one thing)
- Composability (small components compose into larger ones)
- Reusability (Button, Modal, FormInput used across pages)
- Props for configuration, children for composition

### REST Architecture (Backend)

```
Resource: /api/projects
├── GET    /api/projects        → List (Read)
├── GET    /api/projects/:id    → Detail (Read)
├── POST   /api/projects        → Create
├── PUT    /api/projects/:id    → Update
└── DELETE /api/projects/:id    → Delete

Resource: /api/contact
├── POST   /api/contact         → Create (Public)
├── GET    /api/contact         → List (Admin)
├── PUT    /api/contact/:id/read → Update read status
└── DELETE /api/contact/:id     → Delete (Admin)
```

**REST principles:**
- Resources identified by URLs
- HTTP methods define actions (GET, POST, PUT, DELETE)
- Stateless (each request is independent)
- JSON response format

### MVC Pattern (Backend)

```
┌─────────────────────────────────────────────────┐
│                MVC Architecture                   │
│                                                   │
│  ┌──────────┐   ┌──────────┐   ┌─────────────┐  │
│  │  MODEL    │   │  VIEW    │   │  CONTROLLER  │  │
│  │ (Data)    │   │ (Client) │   │ (Logic)      │  │
│  │           │   │          │   │              │  │
│  │ Project   │   │ React    │   │ projectCtrl  │  │
│  │ User      │   │ Pages    │   │ authCtrl     │  │
│  │ Contact   │   │ Sections │   │ contactCtrl  │  │
│  │ Visitor   │   │ UI       │   │ analyticsCtrl│  │
│  │ Notific.  │   │          │   │              │  │
│  └──────────┘   └──────────┘   └──────────────┘  │
│         │              │               │          │
│         └──────────────┼───────────────┘          │
│                        │                          │
│                 ┌──────┴──────┐                   │
│                 │   ROUTES    │                   │
│                 │ (Endpoints) │                   │
│                 └─────────────┘                   │
└─────────────────────────────────────────────────┘
```

**MVC mapping in this project:**

| Layer | Backend File | Description |
|-------|-------------|-------------|
| **Model** | `models/Project.js` | Mongoose schema + model |
| **View** | `client/src/pages/DashboardProjects.jsx` | React component rendering data |
| **Controller** | `controllers/projectController.js` | Business logic, request handling |
| **Routes** | `routes/projectRoutes.js` | URL-to-controller mapping |

### Context Pattern (State Management)

```
┌─────────────────────────────────────────────────┐
│              Context Provider Pattern            │
│                                                   │
│  1. CreateContext → factory object                │
│  2. Provider → wraps subtree, holds state        │
│  3. useContext → consumes in child components    │
│  4. Custom hook → encapsulates context logic     │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │  ThemeProvider                              │  │
│  │  ├── Create: createContext(undefined)       │  │
│  │  ├── State: useState for isDarkMode         │  │
│  │  ├── Logic: toggleTheme, localStorage sync   │  │
│  │  └── Export: useTheme() custom hook         │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 15. Third-Party Library Reference

### Client Dependencies (`client/package.json`)

#### @react-oauth/google ^0.13.5

| Aspect | Detail |
|--------|--------|
| **Purpose** | Google OAuth 2.0 sign-in button component |
| **Where used** | `main.jsx` (provider), `Login.jsx` (button) |
| **Benefits** | Handles OAuth popup lifecycle; returns credential token |
| **Example** | `<GoogleLogin onSuccess={...} onError={...} />` |

#### @tailwindcss/line-clamp ^0.4.4

| Aspect | Detail |
|--------|--------|
| **Purpose** | Truncate text to a specific number of lines |
| **Where used** | `ProjectCard`, `DashboardProjectCard`, message previews |
| **Benefits** | Cross-browser consistent line clamping |
| **Example** | `className="line-clamp-3"` |

#### @tsparticles/react ^3.0.0

| Aspect | Detail |
|--------|--------|
| **Purpose** | React wrapper for tsParticles (particle animation engine) |
| **Where used** | `ParticlesBackground.jsx` |
| **Benefits** | Interactive particle network; GPU-accelerated; highly configurable |
| **Example** | `<Particles id="tsparticles" init={...} options={...} />` |

#### axios ^1.14.0

| Aspect | Detail |
|--------|--------|
| **Purpose** | HTTP client for API requests |
| **Where used** | `utils/api.js` (centralized), all pages/components that make API calls |
| **Benefits** | Interceptors, auto JSON transform, timeout, FormData support |
| **Example** | `api.get('/api/projects')` |

#### framer-motion ^12.38.0

| Aspect | Detail |
|--------|--------|
| **Purpose** | Animation library for React |
| **Where used** | All sections, pages, modals, toasts, UI components |
| **Benefits** | Declarative API, spring physics, layout animations, scroll triggers |

#### lucide-react ^0.460.0

| Aspect | Detail |
|--------|--------|
| **Purpose** | Open-source icon library (React components) |
| **Where used** | Throughout the UI — nav, buttons, cards, dashboard |
| **Benefits** | Tree-shakable, consistent design, 25+ icons used |
| **Example** | `import { Sun, Moon } from 'lucide-react'` |

#### react-icons ^5.6.0

| Aspect | Detail |
|--------|--------|
| **Purpose** | Icon library with 20+ icon sets |
| **Where used** | `SkillsSection.jsx` — technology logos (FaHtml5, SiTailwindcss, etc.) |
| **Benefits** | Popular icon sets (FontAwesome, Material, Simple Icons) in one package |
| **Example** | `<FaReact className="text-blue-400" />` |

#### react-router-dom ^7.13.2

| Aspect | Detail |
|--------|--------|
| **Purpose** | Client-side routing for React |
| **Where used** | `App.jsx` (routes), all navigation, dashboard sidebar |
| **Benefits** | Nested routes, protected routes, URL params, programmatic navigation |

#### recharts ^3.8.1

| Aspect | Detail |
|--------|--------|
| **Purpose** | Composable charting library built on React components |
| **Where used** | `pages/dashboard/Analytics.jsx` |
| **Benefits** | Declarative API, responsive containers, custom tooltips |
| **Components used** | `AreaChart`, `Area`, `PieChart`, `Pie`, `Cell`, `ResponsiveContainer`, `Tooltip`, `CartesianGrid`, `XAxis`, `YAxis` |

#### tsparticles-slim ^2.12.0

| Aspect | Detail |
|--------|--------|
| **Purpose** | Lightweight version of tsParticles engine |
| **Where used** | `ParticlesBackground.jsx` (loaded via `loadSlim`) |
| **Benefits** | Smaller bundle than full tsParticles; sufficient features |
| **Example** | `await loadSlim(engine)` |

### Dev Dependencies (Client)

| Package | Purpose |
|---------|---------|
| `@vitejs/plugin-react` | Vite plugin for React (Fast Refresh, JSX transform) |
| `autoprefixer` | PostCSS plugin for vendor prefixes |
| `eslint` ^9.x | JavaScript linter |
| `eslint-plugin-react-hooks` | ESLint rules for React Hooks |
| `eslint-plugin-react-refresh` | ESLint rules for Fast Refresh |
| `postcss` ^8.x | CSS post-processor (Tailwind dependency) |
| `tailwindcss` ^3.x | Utility-first CSS framework |
| `vite` ^8.x | Build tool and dev server |

### Server Dependencies (`server/package.json`)

#### bcryptjs ^3.0.3

| Aspect | Detail |
|--------|--------|
| **Purpose** | Password hashing library |
| **Where used** | `models/User.js` (pre-save hook + comparePassword method) |
| **Benefits** | Slower algorithm (O(2^rounds)) resists brute force; no native compilation needed |
| **Example** | `bcrypt.hash(password, 10)`, `bcrypt.compare(password, hash)` |

#### cloudinary ^1.41.3

| Aspect | Detail |
|--------|--------|
| **Purpose** | Cloudinary SDK for image management |
| **Where used** | `config/cloudinary.js`, `controllers/projectController.js` |
| **Benefits** | Upload, destroy, and transform images via API |
| **Example** | `cloudinary.uploader.destroy(publicId)` |

#### cors ^2.8.6

| Aspect | Detail |
|--------|--------|
| **Purpose** | Express middleware for Cross-Origin Resource Sharing |
| **Where used** | `app.js` |
| **Benefits** | Allows frontend (different domain) to access API |
| **Example** | `app.use(cors({ origin: ['http://localhost:5173'] }))` |

#### dotenv ^17.4.0

| Aspect | Detail |
|--------|--------|
| **Purpose** | Loads environment variables from `.env` file |
| **Where used** | `server.js`, `app.js`, `config/cloudinary.js` |
| **Benefits** | Keeps secrets out of source code |
| **Example** | `process.env.PORT` |

#### express ^5.2.1

| Aspect | Detail |
|--------|--------|
| **Purpose** | Web framework for Node.js |
| **Where used** | `app.js`, all route files |
| **Benefits** | Minimal, unopinionated, extensive middleware ecosystem |

#### geoip-lite ^1.4.10

| Aspect | Detail |
|--------|--------|
| **Purpose** | Lightweight IP geolocation lookup (MaxMind GeoLite City database) |
| **Where used** | `controllers/analyticsController.js` |
| **Benefits** | Local database (no external API calls), fast lookups |
| **Limitation** | ~99% accuracy for country, lower for city; unknown for local IPs |
| **Example** | `geoip.lookup(ip)` → `{ country: 'US', city: 'Mountain View' }` or `null` |

#### google-auth-library ^10.7.0

| Aspect | Detail |
|--------|--------|
| **Purpose** | Google's official Node.js authentication library |
| **Where used** | `services/googleAuthService.js` |
| **Benefits** | Verifies Google ID tokens server-side (secure) |
| **Example** | `googleClient.verifyIdToken({ idToken })` |

#### jsonwebtoken ^9.0.3

| Aspect | Detail |
|--------|--------|
| **Purpose** | JWT implementation for Node.js |
| **Where used** | `controllers/authController.js`, `middleware/authMiddleware.js` |
| **Benefits** | Sign + verify tokens; supports expiry, custom algorithms |

#### mongoose ^9.3.3

| Aspect | Detail |
|--------|--------|
| **Purpose** | MongoDB ODM for Node.js |
| **Where used** | All models, controllers, `config/db.js` |
| **Benefits** | Schema validation, hooks, aggregation pipeline, query building |

#### multer ^2.1.1 + multer-storage-cloudinary ^4.0.0

| Aspect | Detail |
|--------|--------|
| **Purpose** | Multipart form-data handling + Cloudinary storage engine |
| **Where used** | `middleware/upload.js`, `routes/uploadRoutes.js` |
| **Benefits** | Streams file directly to Cloudinary (no temp file on server) |

#### request-ip ^3.3.0

| Aspect | Detail |
|--------|--------|
| **Purpose** | Extracts client IP from request (handles proxies, headers) |
| **Where used** | `controllers/analyticsController.js` |
| **Benefits** | Works behind proxies; checks `x-forwarded-for`, `x-real-ip`, etc. |
| **Example** | `requestIp.getClientIp(req)` |

#### nodemon ^3.1.14 (devDependency)

| Aspect | Detail |
|--------|--------|
| **Purpose** | Auto-restarts server on file changes during development |
| **Where used** | `npm run dev` script |
| **Benefits** | Eliminates manual restart; speeds up development iteration |

---

*Document generated from full codebase analysis. For questions, contact the project author.*
