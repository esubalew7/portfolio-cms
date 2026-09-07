# Portfolio Editorial Design System
**Version:** 2.0.0 (Phase 1 Foundation)  
**Direction:** Awwwards-Winning Developer Portfolio  
**Inspiration:** Apple Product Storytelling + Framer Fluid Motion + Stripe Precision Typography  
**Target:** High-Performance, Handcrafted, Fluid Responsive, Dual-Theme (Dark Obsidian & Alabaster Light)

---

## 1. Design Direction & Core Philosophy

This portfolio is **not a SaaS dashboard** and **not a generic template**. It is an interactive editorial narrative showcasing engineering mastery, design precision, and high-impact software craft.

### Core Principles

1. **Handcrafted & Un-Templated:**  
   Avoid symmetrical, auto-centered cards. Compose layouts with deliberate editorial asymmetry, variable column spans, and generous whitespace.
2. **Subtle Tactility over Neon Clutter:**  
   No radioactive neon gradients or rainbow border animations. We use deep obsidian voids, titanium silver, slate accents, and concentrated electric cobalt highlights (`#3b82f6` / `#2563eb`).
3. **Restrained, Intentional Glassmorphism:**  
   Glass (`backdrop-filter`) is strictly reserved for floating utility layers (Navigation, Command Palette, Tooltips, Toasts). **Content cards are never frosted glass**; they use crisp solid surfaces with 1px specular edges to guarantee 100% legibility and zero GPU fillrate drops.
4. **Fluid Proportional Typography:**  
   Every typographic element scales continuously across viewports using mathematical `clamp()` functions, creating seamless balance from 320px mobile screens to 4K ultra-wide monitors.
5. **Physical Micro-Interactions:**  
   Hover states feel tactile with crisp spring physics (`stiffness: 380, damping: 30`), subtle 3-4px elevation lifts, and specular boundary illumination.

---

## 2. Editorial Layout System (12-Column Grid)

Rather than stacking uniform 3-column cards, sections leverage a **12-column responsive editorial grid** with asymmetric groupings:

```
[1]  [2]  [3]  [4]  [5]  [6]  [7]  [8]  [9]  [10]  [11]  [12]
├── Asymmetric Narrative (col-span-5 Narrative  |  col-span-7 Showcase)
├── Monumental Hero (col-span-8 Headline statement  |  col-span-4 Metric badge)
├── Offset Stagger (col-span-7 Feature A  |  col-span-5 Detail B)
└── Large Whitespace Channels (gap-6 sm:gap-8 lg:gap-10)
```

### Container & Layout Tokens
- **Container Class:** `.editorial-container` (`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12`)
- **Grid Class:** `.editorial-grid` (`grid grid-cols-12 gap-6 lg:gap-10`)
- **Vertical Rhythm:**
  - Section vertical padding: `py-20 lg:py-28` (80px – 112px)
  - Inter-component spacing: `space-y-8` to `space-y-12` (32px – 48px)
  - Intentionally wide empty columns (`col-span-1` or `col-span-2` offsets) to let content breathe.

---

## 3. Atmospheric Background System

Depth is achieved through atmospheric layers rather than heavy WebGL computations:

```
┌─────────────────────────────────────────────────────────┐
│ [Layer 4] Foreground Interactive Content                │
├─────────────────────────────────────────────────────────┤
│ [Layer 3] Specular 1px Borders & Ambient Drops          │
├─────────────────────────────────────────────────────────┤
│ [Layer 2] Micro-Noise Grain (3.5% Opacity SVG)          │
├─────────────────────────────────────────────────────────┤
│ [Layer 1] Ambient Aurora Gradients & Radial Spotlights  │
├─────────────────────────────────────────────────────────┤
│ [Layer 0] Base Canvas Background (--bg-app)             │
└─────────────────────────────────────────────────────────┘
```

### Background Utilities
1. **`.bg-aurora`:** Multi-stop ambient gradient creating subtle chromatic warmth behind major focal sections without animating on CPU:
   ```css
   radial-gradient(ellipse 60% 40% at 20% 20%, var(--aurora-1), transparent 70%),
   radial-gradient(ellipse 50% 35% at 80% 30%, var(--aurora-2), transparent 70%),
   radial-gradient(ellipse 70% 50% at 50% 80%, var(--aurora-3), transparent 75%)
   ```
2. **`.bg-radial-glow`:** Centered or offset spotlight drawing eye focus to headlines or featured interactive items.
3. **`.bg-noise`:** In-memory SVG fractal noise (3.5% opacity) eliminating digital color banding and giving screens a premium tactile paper texture.
4. **`.glass-panel`:** Floating specular glass container restricted exclusively to navigation bars, command menus, and popovers.

---

## 4. Semantic Color System

All colors are controlled via CSS custom properties and mirrored in Tailwind tokens:

| Token | Class Name | Light Mode (Alabaster) | Dark Mode (Obsidian) | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas** | `bg-canvas` | `#fafafc` | `#07080b` | Base page canvas background |
| **Surface Base** | `bg-surface-base` | `#ffffff` | `#0e1017` | Primary card / container background |
| **Surface Raised** | `bg-surface-raised` | `#f3f4f7` | `#151822` | Nested cards, badge fills, inputs |
| **Surface Elevated**| `bg-surface-elevated`| `#ffffff` | `#1c202d` | Floating menus, modals, dialogs |
| **Border Subtle** | `border-subtle` | `rgba(0,0,0,0.06)` | `rgba(255,255,255,0.06)` | Clean structural dividers |
| **Border Default** | `border-border` | `rgba(0,0,0,0.12)` | `rgba(255,255,255,0.12)` | Interactive element outlines |
| **Border Strong** | `border-strong` | `rgba(0,0,0,0.22)` | `rgba(255,255,255,0.24)` | Focus rings & active tabs |
| **Content Primary** | `text-content-primary`| `#0a0d14` | `#f9fafb` | Headlines, primary text |
| **Content Secondary**| `text-content-secondary`| `#4b5563` | `#9ca3af` | Prose, subtitles, descriptions |
| **Content Muted** | `text-content-muted` | `#9ca3af` | `#6b7280` | Captions, metadata, placeholders |
| **Accent** | `bg-accent` / `text-accent`| `#2563eb` | `#3b82f6` | Brand focus, primary CTA buttons |
| **Accent Hover** | `hover:bg-accent-hover`| `#1d4ed8` | `#60a5fa` | Hover action state |
| **Accent Subtle** | `bg-accent-subtle` | `rgba(37,99,235,0.08)`| `rgba(59,130,246,0.14)`| Badge backgrounds, active pills |
| **Success** | `text-success` | `#059669` | `#10b981` | Live indicators, verified states |
| **Warning** | `text-warning` | `#d97706` | `#f59e0b` | In-progress tags, alerts |

---

## 5. Typography Scale (Fluid Clamp System)

Typography is fully fluid. No static pixel font sizes for headings.

| Token | Class Name | Fluid Clamp Calculation | Mobile | Desktop | Weight | Leading | Tracking |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Display XXL** | `.text-display-xxl` | `clamp(3.25rem, 7.5vw, 6.5rem)` | 52px | 104px | 800 | `1.02` | `-0.04em` |
| **Display XL** | `.text-display-xl` | `clamp(2.5rem, 5vw, 4.25rem)` | 40px | 68px | 800 | `1.08` | `-0.03em` |
| **Section Heading** | `.text-section-heading`| `clamp(1.85rem, 3.5vw, 2.75rem)` | 30px | 44px | 700 | `1.15` | `-0.025em`|
| **Card Heading** | `.text-card-heading` | `clamp(1.25rem, 2vw, 1.65rem)` | 20px | 26px | 600 | `1.25` | `-0.015em`|
| **Body Large** | `.text-body-large` | `clamp(1.125rem, 1.25vw, 1.25rem)`| 18px | 20px | 400 | `1.65` | `normal` |
| **Body Default** | `text-base` | `1rem` (16px) | 16px | 16px | 400 | `1.6` | `normal` |
| **Caption** | `.text-caption` | `0.8125rem` (13px) | 13px | 13px | 600 | `1.4` | `+0.08em` |
| **Code / Mono** | `.font-code` | `0.875rem` (14px) | 14px | 14px | 500 | `1.5` | `normal` |

---

## 6. Border Radius (Strict 4 Tokens)

To eliminate the visual disharmony of mixing 6+ different border radii, the system strictly enforces 4 reusable tokens:

| Token | Radius Value | Tailwind Class | Usage Guidelines |
| :--- | :---: | :--- | :--- |
| **`sm` (Subtle)** | **`6px`** | `rounded-sm` | Pill tags, skill badges, tooltips, inline code blocks |
| **`md` (Component)**| **`12px`** | `rounded-md` | Buttons, text inputs, dropdown menus, icon containers |
| **`lg` (Container)**| **`20px`** | `rounded-lg` | Bento tiles, project cards, experience cards, modals |
| **`full` (Pill)** | **`9999px`** | `rounded-full` | Floating navigation pill, avatars, status indicator dots |

---

## 7. Shadow System (Specular Lighting)

| Token | Light Mode Shadow | Dark Mode Shadow | Usage |
| :--- | :--- | :--- | :--- |
| **`soft`** | `0 2px 8px -2px rgba(0,0,0,0.05)` | `0 2px 8px -2px rgba(0,0,0,0.4)` | Rest state cards, subtle badges |
| **`medium`** | `0 8px 24px -4px rgba(0,0,0,0.08)` | `0 8px 24px -4px rgba(0,0,0,0.55)`| Hover elevation, dropdown menus |
| **`floating`**| `0 20px 48px -12px rgba(0,0,0,0.14)`| `0 24px 56px -12px rgba(0,0,0,0.75)`| Modals, command palette, toasts |
| **`glass`** | `0 0 0 1px var(--border-subtle), 0 16px 40px -8px rgba(0,0,0,0.12)` | `0 0 0 1px var(--border-subtle), 0 20px 48px -8px rgba(0,0,0,0.6)` | Floating navbar, glass overlays |

---

## 8. Glassmorphism Usage Policy

> [!CAUTION]
> **BANNED:** Frosted glass on standard content cards (Projects, Experience, Skills, About). Frosted cards destroy text contrast, create GPU fillrate lag on mobile devices, and look like amateur templates.

### Permitted Elements Only
- **Floating Navigation Bar:** `glass-panel rounded-full`
- **Command Palette / Modal Backdrop:** `glass-panel rounded-lg`
- **Interactive Tooltips / Floating Toasts:** `glass-panel rounded-md`

All standard content surfaces must use solid `--surface-base` (`#ffffff` / `#0e1017`) or `--surface-raised` (`#f3f4f7` / `#151822`) with a sharp 1px `--border-subtle`.

---

## 9. Motion Choreography System

Importable from [`frontend/src/animations/variants.js`](file:///c:/Users/M%20%20K%20%20T/OneDrive/Documents/Home/esu%20vs/My%20Project/portfolio-cms/frontend/src/animations/variants.js):

```javascript
import { 
  fade, fadeIn, slideUp, slideIn, scaleReveal, 
  cardHover, buttonHover, pageReveal, staggerContainer, 
  getReducedMotionSafe 
} from '../animations/variants';
```

### Standard Easing & Spring Profiles
- **Apple Fluid Deceleration:** `ease: [0.16, 1, 0.3, 1]`
- **Subtle Spring:** `stiffness: 260, damping: 28, mass: 0.8` (Card reveals, page entrances)
- **Snappy Spring:** `stiffness: 380, damping: 30, mass: 0.6` (Button taps, hover responses)
- **Accessibility:** `getReducedMotionSafe(variant)` and global `@media (prefers-reduced-motion: reduce)` automatically eliminate motion sickness triggers.

---

## 10. 3D Performance Architecture Standards (Phase 3 Requirements)

Every 3D component introduced in future phases must adhere to these non-negotiable engineering rules:

1. **Single Unified Canvas or WebGL Overlay:**  
   Eliminate multiple concurrent `<Canvas>` instances. Share a single WebGL context using `@react-three/fiber` View portals.
2. **Zero Synchronous 3D Bundling:**  
   All 3D components must be loaded via `React.lazy()` behind `<Suspense fallback={<Skeleton />}>`. Under no circumstances should Three.js be imported in the entry chunk.
3. **GPU-Only Particle Shaders:**  
   No JavaScript loops mutating Float32Array buffers on the CPU every frame. All particle motion must execute on GPU Vertex Shaders with sinusoidal uniforms.
4. **InstancedMesh & Texture Atlasing:**  
   Repeated geometries (particles, skill spheres, nodes) must be drawn via `InstancedMesh`. Draw calls per scene must stay under **15**.
5. **Adaptive DPR:**  
   Strictly clamp resolution to `dpr={[1, Math.min(window.devicePixelRatio, 1.5)]}` to prevent 3x retina fillrate throttling.
6. **Viewport-Aware Culling:**  
   Wrap canvases with `IntersectionObserver` to trigger `frameloop="demand"` and stop all RAF ticks when out of the user's viewport.
7. **Mobile Particle Reduction:**  
   Automatically reduce particle count by 70% on screens < 768px.
8. **Framerate Targets:**  
   Locked **60 FPS** on Desktop / Solid **50+ FPS** on mobile devices.

---

## 11. Component Styling Quick Reference

### Action Button (Primary)
```html
<button className="px-6 py-3 rounded-md bg-accent text-accent-foreground font-medium text-sm transition-all duration-200 shadow-soft hover:bg-accent-hover hover:shadow-medium active:scale-[0.98]">
  Explore Projects
</button>
```

### Action Button (Secondary / Ghost)
```html
<button className="px-6 py-3 rounded-md bg-surface-raised text-content-primary border border-border font-medium text-sm transition-all duration-200 hover:border-strong hover:bg-surface-elevated active:scale-[0.98]">
  Download Resume
</button>
```

### Content Card (Bento Tile)
```html
<div className="p-8 rounded-lg bg-surface-base border border-border-subtle shadow-soft transition-all duration-300 hover:shadow-medium hover:border-border group">
  <span className="text-caption text-accent mb-3 block">Full-Stack Architecture</span>
  <h3 className="text-card-heading text-content-primary mb-3">Distributed Real-Time Systems</h3>
  <p className="text-content-secondary leading-relaxed">Engineered scalable web applications with event-driven synchronization.</p>
</div>
```

---
*Maintained under Portfolio Redesign Project Phase 1. Ready for Phase 2 implementation.*
