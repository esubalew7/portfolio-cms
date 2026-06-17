# CMS Architecture — Portfolio Content Management System

## Overview

The CMS replaces all hardcoded portfolio data with a single dynamic source of truth stored in MongoDB. The admin dashboard provides full CRUD for every section, and the portfolio frontend consumes everything via a single API endpoint.

---

## Data Model

**Collection:** `portfoliocontents` (single document)

**Model:** `server/models/PortfolioContent.js`

### Schema Structure

```
PortfolioContent (single document)
├── hero
│   ├── greeting       String    "Hello, I am"
│   ├── name           String    "Esubalew"
│   ├── titles         [String]  Typewriter roles
│   ├── description    String    Hero paragraph
│   ├── image          String    Profile image path/URL
│   └── cta
│       ├── primary    { text, link }
│       └── secondary  { text, link }
│
├── about
│   ├── title          String    "About Me"
│   ├── subtitle       String    Tagline
│   ├── description    String    About paragraph
│   ├── image          String    About image path/URL
│   ├── stats          [{ label, value, suffix }]
│   └── cta            { text, link }
│
├── skills
│   ├── title          String    "Core Skills"
│   ├── subtitle       String    Section subtitle
│   └── categories     [{ name, items: [{ name, level }] }]
│
├── experience
│   ├── title          String    "Experience"
│   ├── subtitle       String    Section subtitle
│   └── categories     [{ name, items: [{ role, company, duration, location, tags, bullets, logo }] }]
│
├── testimonials
│   ├── title          String    "Client Feedback"
│   ├── subtitle       String    Section subtitle
│   └── items          [{ name, role, company, image, rating, feedback }]
│
├── socialLinks        [{ platform, url }]
│
├── resume
│   ├── title          String
│   ├── url            String    PDF path/URL
│   └── buttonText     String    "Download Resume"
│
└── contactInfo
    ├── email          String
    ├── phone          String
    ├── location       String
    ├── formTitle      String
    ├── formDescription String
    ├── formButtonText String
    └── successMessage String
```

### Design Decisions

- **Single document, single collection** – One `PortfolioContent` document holds all sections. No relational overhead. Every GET returns the full content object; every PUT updates the same document.
- **Embedded subdocuments** – Sections like `hero`, `about`, etc. are embedded with `_id: false` to keep the response clean and avoid unnecessary `_id` fields on every nested object.
- **Default values** – Each sub-schema defines sensible defaults so the document is valid immediately on creation.
- **`timestamps: true`** – Top-level document gets `createdAt` / `updatedAt` for cache invalidation.

---

## API Endpoints

| Method | Endpoint          | Auth     | Description                  |
|--------|-------------------|----------|------------------------------|
| GET    | `/api/content`    | Public   | Fetch all portfolio content  |
| PUT    | `/api/content`    | JWT      | Update any or all sections   |

### GET /api/content

Returns the single `PortfolioContent` document. If none exists, auto-seeds with default data.

**Response:**

```json
{
  "success": true,
  "data": { "hero": { ... }, "about": { ... }, ... }
}
```

### PUT /api/content

Accepts a partial or full content object. Only the provided top-level fields are merged.

**Request body** (partial allowed):

```json
{
  "hero": { "name": "New Name", "titles": ["Dev."] },
  "about": { "description": "Updated about text" }
}
```

**Response:**

```json
{
  "success": true,
  "data": { "hero": { ... }, "about": { ... }, ... }
}
```

---

## File Layout

```
server/
├── models/
│   └── PortfolioContent.js       ← Schema definition
├── controllers/
│   └── contentController.js      ← GET / PUT logic + default seed
├── routes/
│   └── contentRoutes.js          ← Route wiring
└── app.js                        ← Route mounting

portfolio-frontend/src/
├── context/
│   └── ContentContext.jsx        ← API fetch + provider
├── sections/
│   ├── HeroSection.jsx           ← Consumes content.hero
│   ├── AboutSection.jsx          ← Consumes content.about
│   ├── SkillsSection.jsx         ← Consumes content.skills
│   ├── ExperienceSection.jsx     ← Consumes content.experience
│   └── ContactSection.jsx        ← Consumes content.contactInfo
├── components/
│   ├── SocialLinks.jsx           ← Consumes content.socialLinks
│   └── TestimonialsMarquee.jsx   ← Consumes content.testimonials
└── App.jsx                       ← Wraps with ContentProvider

admin-dashboard/src/
├── pages/
│   └── ContentEditor.jsx         ← Full editor for all sections
├── components/
│   └── content/                  ← Section-specific form components
└── App.jsx                       ← Route + sidebar entry
```

---

## Frontend Data Flow

1. **`ContentProvider`** (wraps entire app) fetches `GET /api/content` on mount.
2. Each section reads from `useContent()` context with fallback defaults.
3. **No hardcoded data** – every string, number, array comes from the API.
4. **Icons** – Skill icons are mapped client-side by name (e.g., `"HTML"` → `FaHtml5`). Social link icons are mapped by platform name (e.g., `"GitHub"` → GitHub SVG).

---

## Default Seed Data

The controller's `getDefaultContent()` function contains the complete initial data matching the original hardcoded portfolio content. When the `portfoliocontents` collection is empty, the first `GET /api/content` call auto-seeds it.

To reset to defaults, delete the document from the collection and restart.

---

## Admin Dashboard: Content Editor

**Route:** `/dashboard/content`

The Content Editor is a single-page form with collapsible sections (accordion). Each CMS section (Hero, About, Skills, etc.) is an expandable panel containing the relevant form fields.

- **Arrays** (skills, experience items, social links, testimonials) support add/remove/reorder.
- **Save** sends `PUT /api/content` with the full merged document.
- **Protected** – requires valid JWT.

---

## Migration Path

Existing hardcoded data in `portfolio-frontend/src/data/testimonials.js`, inline data in sections, and `SocialLinks.jsx` constants are replaced by `ContentContext` reads. The files are retained but no longer contain primary data sources – they become presentation-only components that receive data via props or context.
