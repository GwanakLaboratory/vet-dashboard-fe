# Design Guidelines: Veterinary EMR Dashboard with 3D Dog Model

## Design Approach

**Selected Framework:** Medical Dashboard Design System  
**Reference:** Clinical EMR interfaces (Epic, Cerner patterns) with data-first hierarchy  
**Rationale:** This is a utility-focused, information-dense medical application requiring professional clarity, efficient data scanning, and quick decision-making support for veterinary professionals.

---

## Core Design Principles

1. **Medical Data Hierarchy:** Critical information (abnormal test results, alerts) must be immediately scannable
2. **Professional Credibility:** Clean, clinical aesthetic that builds trust with veterinary professionals
3. **Efficient Workflows:** Minimize clicks, maximize information density without clutter
4. **Visual Status Indicators:** Color-coded health metrics (Red=High, Yellow=Warning, Green=Normal)

---

## Layout System

### Spacing Scale
Use Tailwind units: **2, 3, 4, 6, 8, 12, 16** for consistent rhythm
- Tight spacing (2-3): Within cards, between related data points
- Medium spacing (4-6): Between card sections, form fields
- Large spacing (8-12): Between major sections, page margins
- Extra large (16): Section dividers, page top/bottom padding

### Grid Structure
- **Sidebar:** Fixed 256px (w-64), full-height, sticky
- **Main Content:** flex-1 with max-w-7xl container
- **Dashboard Cards:** Grid-cols-1 md:grid-cols-2 lg:grid-cols-4 for statistics
- **Data Tables:** Full-width with horizontal scroll on mobile
- **3D Model View:** 60/40 split (model left, data panel right) on desktop, stacked on mobile

---

## Typography

**Primary Font:** Inter (clean, medical-grade legibility)  
**Monospace Font:** JetBrains Mono (for numerical data, test results)

### Type Scale
- **Page Headers:** text-2xl font-semibold (32px)
- **Section Headers:** text-xl font-semibold (24px)
- **Card Titles:** text-lg font-medium (20px)
- **Body Text:** text-base (16px)
- **Data Labels:** text-sm font-medium (14px)
- **Numerical Values:** text-base font-mono (16px monospace)
- **Captions/Metadata:** text-xs (12px)

### Emphasis
- Critical alerts: font-semibold
- Patient names: font-medium
- Test result values: font-mono font-semibold
- Timestamps: font-normal text-xs

---

## Component Library

### Navigation
**Left Sidebar:**
- Logo + clinic name at top (h-16 px-4)
- Navigation items: py-3 px-4 with hover states
- Active state: subtle background treatment
- Icons: 20px from Heroicons (outline style)
- Collapsible sections for sub-navigation

**Top Bar:**
- h-16 fixed across all pages
- Patient selector dropdown (left)
- Search bar (center, max-w-md)
- Notification bell + user profile (right)

### Cards & Widgets

**Statistics Cards:**
- Rounded corners (rounded-lg)
- Padding: p-6
- Shadow: shadow-sm with subtle border
- Header with icon (24px) + title
- Large numerical value (text-3xl font-bold)
- Trend indicator (up/down arrow + percentage)

**Patient Profile Card:**
- Photo thumbnail (96px rounded-full)
- Name, ID, breed, age in structured layout
- Key vitals in grid (2 columns)
- Status badges (rounded-full px-3 py-1 text-xs)

**Timeline Items:**
- Left timestamp column (w-32)
- Vertical connecting line
- Visit card with rounded-lg border
- Expandable details section

### Data Displays

**Test Result Tables:**
- Sticky header (position-sticky top-0)
- Alternating row backgrounds (striped pattern)
- Status indicator column (8px circle: red/yellow/green)
- Numerical values right-aligned in monospace
- Reference range column in muted text
- Sort icons in headers

**Charts (Recharts):**
- Line charts for trends with reference range shaded area
- Bar charts for categorical comparisons
- Responsive container (aspect-ratio-video)
- Legend positioned top-right
- Tooltip with detailed breakdown
- Grid lines: subtle, dashed

### Forms & Inputs

**Input Fields:**
- Height: h-10 (40px)
- Padding: px-3
- Border: border rounded-md
- Focus state: ring-2 treatment
- Label above input (text-sm font-medium mb-1)

**Buttons:**
- Primary: h-10 px-4 rounded-md font-medium
- Secondary: outlined variant
- Icon buttons: 40x40px square
- Danger actions: explicit red treatment for destructive operations

### 3D Model Interface

**Interactive Dog Model (React-Three-Fiber):**
- Canvas container: aspect-square on mobile, h-screen on desktop
- Orbit controls enabled with damping
- Clickable body parts with hover highlight effect
- Model positioned center with slight tilt for visibility

**Interaction Panel:**
- Slides in from right on body part click
- Width: w-96 on desktop, full-width on mobile
- Contains: Part name header, related tests list, mini charts
- Close button (X) in top-right corner
- Scrollable content area

**Body Part Markers:**
- Floating label on hover showing part name
- Clickable hotspot areas (invisible spheres positioned on model)
- Selected state: glowing outline or highlight material

### Status Indicators

**Health Status Colors:**
- Critical High: Red indicator + red text
- Warning: Yellow/amber indicator + yellow text  
- Normal: Green indicator + default text
- No Data: Gray indicator + muted text

**Alert Badges:**
- Positioned top-right of cards
- Count bubble (rounded-full)
- Pulsing animation for new alerts

---

## Page-Specific Layouts

### Home Dashboard
- 4-column stats grid at top (total patients, abnormal results, etc.)
- 2-column layout below: Recent visits (left 60%) + Top issues (right 40%)
- Bottom section: Breed distribution chart + visit frequency graph

### Patient Detail View
- Top: Patient profile card (full-width)
- Tabbed interface below (Visit History, Test Results, 3D Model, Medical History)
- Each tab full-width with appropriate data display

### 3D Body Map Page
- Split view: 3D model (60%) + inspection panel (40%) on desktop
- Mobile: Model top (h-96), scrollable panel below
- Footer: Body system filter buttons (Digestive, Cardiac, Renal, etc.)

### Test Results Page
- Filters bar at top (date range, test category dropdown)
- Table below with expandable rows for trend charts
- Export button (top-right)

---

## Animations

Use sparingly for professional context:
- Skeleton loaders for data fetching
- Smooth transitions for tab switches (200ms ease)
- Subtle hover states on interactive elements
- 3D model rotation with smooth orbit controls
- Chart animations on initial load only

---

## Images

**3D Dog Model:** Use a simple, anatomically-labeled dog mesh (GLB format). If unavailable, use geometric placeholder (colored mesh regions for organs/systems)

**Patient Photos:** Circular thumbnails, placeholder shows generic dog silhouette

**No decorative imagery** - this is a clinical tool focused on data presentation

---

## Accessibility

- All status colors paired with icons (not color-only indicators)
- Keyboard navigation for all interactive elements
- ARIA labels on data visualizations
- Focus visible states on all clickable items
- Minimum touch target: 44x44px on mobile

---

This design prioritizes **data clarity, clinical professionalism, and efficient veterinary workflows** while incorporating the innovative 3D interactive model as a modern diagnostic aid.