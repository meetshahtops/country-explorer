# Country Explorer — Comprehensive Technical Documentation

> **Audience**: This document is written for developers new to Next.js. Every concept is explained simply first, then explored in depth. All examples come directly from this codebase.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Next.js Concepts Used](#4-nextjs-concepts-used)
5. [User Flow](#5-user-flow)
6. [Data Flow](#6-data-flow)
7. [Component Architecture](#7-component-architecture)
8. [Key Features Deep Dive](#8-key-features-deep-dive)
9. [Setup & Installation](#9-setup--installation)
10. [Running the Project](#10-running-the-project)
11. [Best Practices Used](#11-best-practices-used)
12. [Known Issues / Improvements](#12-known-issues--improvements)
13. [Glossary](#13-glossary)

---

## 1. Project Overview

### Purpose

Country Explorer is a web application that lets users browse, search, and learn about every country in the world. It pulls live data from the free [REST Countries API](https://restcountries.com) and presents it in a visually polished, card-based interface.

### Problem It Solves

Finding reliable, readable country data typically means navigating cluttered government or Wikipedia pages. Country Explorer gives you a single clean interface where you can:

- Browse the entire world at a glance
- Search by name instantly
- Filter by geographic region
- See a rich detail page per country — flag, capital, population, languages, currency, and a direct Google Maps link

### Key Features

| Feature | Description |
|---|---|
| Country catalog | Cards for all ~250 countries from the REST Countries API |
| Live search | Debounced text search — results update 300 ms after you stop typing |
| Region filter | Dropdown to narrow to Africa, Americas, Asia, Europe, or Oceania |
| Pagination | 16 countries shown initially; "Explore More Nations" loads 16 more |
| Country detail page | Full dossier: flag, native name, capital, region, population, languages, currency, Google Maps |
| Loading skeletons | Pulsing placeholder UI while data loads — no blank screens |
| Error recovery | "Try Again" button if the API call fails |
| 404 page | Friendly not-found state if an invalid country code is requested |
| Dynamic metadata | Each country detail page sets its own `<title>` and `<meta description>` for SEO |

---

## 2. Tech Stack

### Core Framework — Next.js 16.2.3

**What it is**: Next.js is a framework built on top of React that adds server-side rendering, file-system routing, image optimization, and much more out of the box.

**Why it's used here**: The app needs to fetch country data on the server (faster first load, better SEO) and also needs interactive client-side features like search. Next.js handles both in one project.

**Important version note**: This project uses **Next.js 16**, which ships with React 19 and uses the *App Router* — a newer routing paradigm that differs significantly from the older Pages Router. All routing, layouts, and data fetching in this project use App Router conventions.

### UI Library — React 19.2.4

**What it is**: React is the JavaScript library for building the user interface. Everything you see on screen is a React component.

**Why React 19**: React 19 introduces *Server Components* as a first-class feature. By default, components in the App Router are Server Components — they render on the server and send plain HTML to the browser, with zero JavaScript overhead on the client.

### Language — TypeScript 5 (strict mode)

**What it is**: TypeScript adds static types to JavaScript. Instead of finding bugs at runtime, the compiler catches them as you write code.

**Why strict mode**: With `"strict": true` in `tsconfig.json`, TypeScript enforces the most rigorous checks — no implicit `any`, no unchecked nullable access. This catches entire categories of bugs before they reach production.

The `Country` type in `lib/countries.ts` is the single source of truth for the shape of all country data:

```typescript
export type Country = {
  cca3: string                    // ISO 3-letter country code, e.g. "DEU"
  name: {
    common: string                // "Germany"
    official: string              // "Federal Republic of Germany"
    nativeName?: Record<string, { official: string }>
  }
  flags: { svg: string; alt?: string }
  capital?: string[]
  region: string
  subregion?: string
  population: number
  languages?: Record<string, string>
  currencies?: Record<string, { name: string; symbol?: string }>
  maps?: { googleMaps: string }
}
```

### Styling — Tailwind CSS v4

**What it is**: Tailwind is a utility-first CSS framework. Instead of writing custom CSS files, you compose styles directly in JSX using class names like `flex`, `gap-4`, `text-primary`.

**Why v4**: Tailwind CSS v4 is a major rewrite. Configuration moved from a JavaScript file (`tailwind.config.js`) into the CSS file itself (`globals.css`) using the `@theme` block. There is no `tailwind.config.js` in this project — all design tokens live in `app/globals.css`.

**Material Design 3 integration**: The `@theme` block defines a complete Material Design 3 color system as CSS custom properties (e.g., `--color-primary: #4cd6ff`). Tailwind v4 exposes these as utilities automatically, so `bg-primary`, `text-on-surface`, `border-outline-variant` all "just work."

### HTTP Client — Native `fetch`

No third-party HTTP library is needed. The project uses the browser-native `fetch` API (also available in Node.js 18+). All API calls go through `lib/countries.ts`.

### Testing — Vitest 4 + Testing Library

**Vitest**: A fast test runner that works natively with the Vite bundler and TypeScript. The API is nearly identical to Jest.

**Testing Library**: A set of utilities for testing React components by querying the DOM the way a real user would (by role, label, text) rather than by internal implementation details.

**jsdom**: A Node.js-based DOM environment that lets tests run without a real browser.

The project has **18 tests** across two files:
- `lib/countries.test.ts` — 11 tests for the API layer
- `app/components/CountryGrid.test.tsx` — 7 tests for the pagination component

### Fonts — next/font/google

**What it is**: `next/font/google` downloads Google Fonts at build time and serves them from the same domain as the app. This eliminates a separate font network request and blocks layout shift.

Two fonts are used:
- **Manrope** — headings, brand text (variable: `--font-manrope`)
- **Inter** — body text, labels (variable: `--font-inter`)

### Icons — Material Symbols Outlined

Loaded via Google Fonts CSS import in `globals.css`. Used as ligature text inside `<span>` elements:

```jsx
<span className="material-symbols-outlined">search</span>
```

### External API — REST Countries API

Base URL: `https://restcountries.com/v3.1`

Endpoints used:

| Endpoint | Used for |
|---|---|
| `GET /all` | Load all countries on the homepage |
| `GET /name/{name}` | Search by country name |
| `GET /region/{region}` | Filter by region |
| `GET /alpha/{cca3}` | Load a single country by its 3-letter code |

All requests include a `?fields=` query parameter to limit the response to only the data the app needs, reducing payload size significantly.

---

## 3. Project Structure

### Full File Tree

```
Country Explorer/
├── app/                          ← Everything Next.js renders lives here
│   ├── components/               ← Shared UI components
│   │   ├── BackButton.tsx        ← "Back to Catalog" navigation (client)
│   │   ├── CountryCard.tsx       ← Single country card (server)
│   │   ├── CountryGrid.tsx       ← Grid + pagination logic (client)
│   │   ├── CountryGrid.test.tsx  ← CountryGrid unit tests (co-located)
│   │   ├── Footer.tsx            ← Page footer (server)
│   │   ├── Navbar.tsx            ← Fixed navigation bar (server)
│   │   ├── RegionFilter.tsx      ← Region dropdown (client)
│   │   └── SearchBar.tsx         ← Search input with debounce (client)
│   ├── country/
│   │   └── [cca3]/               ← Dynamic route — one folder per country code
│   │       ├── page.tsx          ← Country detail page (server)
│   │       └── loading.tsx       ← Country detail skeleton
│   ├── error.tsx                 ← Error boundary for the whole app (client)
│   ├── favicon.ico
│   ├── globals.css               ← Tailwind v4 theme + base styles
│   ├── layout.tsx                ← Root layout — wraps every page
│   ├── loading.tsx               ← Homepage loading skeleton
│   ├── not-found.tsx             ← 404 page
│   └── page.tsx                  ← Homepage (server)
├── lib/
│   ├── countries.ts              ← Country type + all API functions
│   └── countries.test.ts         ← API layer tests
├── public/                       ← Static assets served as-is
├── docs/                         ← Project documentation
├── eslint.config.mjs             ← ESLint flat config (ESLint 9)
├── next.config.ts                ← Next.js config (image domains)
├── package.json
├── postcss.config.mjs            ← PostCSS config (Tailwind v4 plugin)
├── tsconfig.json                 ← TypeScript config
├── vitest.config.ts              ← Vitest config (jsdom, React plugin)
└── vitest.setup.ts               ← Imports jest-dom matchers
```

### Role of Each Directory

#### `app/` — The Application

In Next.js App Router, every folder inside `app/` can be a route. Special files have reserved names that Next.js understands:

| File name | What it does |
|---|---|
| `page.tsx` | The UI rendered at that route's URL |
| `layout.tsx` | A wrapper that persists across child routes |
| `loading.tsx` | Shown instantly while the page data loads (uses React Suspense internally) |
| `error.tsx` | Shown when a page throws an error |
| `not-found.tsx` | Shown when `notFound()` is called in a page |

#### `app/components/` — Shared UI Components

Components used by more than one page (or that are complex enough to warrant their own file) live here, co-located with their tests. There is no separate `__tests__/` folder — tests sit next to the component they test.

#### `app/country/[cca3]/` — Dynamic Route

The square brackets `[cca3]` denote a **dynamic segment**. When a user visits `/country/DEU`, Next.js maps `DEU` to the `cca3` param. The page reads this param to fetch that specific country.

#### `lib/` — Business Logic / Data Layer

The `lib/` directory holds pure TypeScript that has nothing to do with rendering. `countries.ts` contains:
1. The `Country` TypeScript type
2. All functions that call the external API

Keeping API calls out of component files makes them easy to test in isolation and easy to swap out if the data source changes.

---

## 4. Next.js Concepts Used

### 4.1 Routing — App Router

The App Router uses the file system as the router. A `page.tsx` file at any path inside `app/` becomes that URL.

```
app/page.tsx              →  /
app/country/[cca3]/page.tsx  →  /country/DEU  (or any cca3 value)
```

There are no `<Route>` components or router configuration files. The folder structure *is* the routing configuration.

### 4.2 Server Components vs Client Components

This is the most important concept to understand in this codebase.

**Server Components** (the default):
- Render on the **server** only
- Can be `async` — they can `await` data directly
- Send plain HTML to the browser — zero JavaScript for the component
- Cannot use hooks (`useState`, `useEffect`, etc.) or browser APIs
- Cannot have event handlers (`onClick`, `onChange`, etc.)

**Client Components** (opt-in with `'use client'` at the top of the file):
- Render on the **server first** (for the initial HTML), then **hydrate** in the browser
- Can use all React hooks and event handlers
- Add JavaScript to the client bundle

**In this project:**

| Component | Type | Why |
|---|---|---|
| `Navbar` | Server | Static links, no interactivity |
| `Footer` | Server | Static content |
| `CountryCard` | Server | Receives data as props, no state |
| `page.tsx` (homepage) | Server | Fetches data on server |
| `page.tsx` (country detail) | Server | Fetches data on server |
| `SearchBar` | Client | Uses `useState`, `useEffect`, `useRouter` |
| `RegionFilter` | Client | Uses `useRouter`, `useSearchParams` |
| `CountryGrid` | Client | Uses `useState` for pagination |
| `BackButton` | Client | Uses `useRouter` for navigation |
| `error.tsx` | Client | Error boundaries must be client components |

### 4.3 Data Fetching

There is no `getServerSideProps` or `getStaticProps` in this project — those are Pages Router patterns. In the App Router, data fetching happens directly inside `async` Server Components:

```typescript
// app/page.tsx
export default async function HomePage({ searchParams }) {
  const { search, region } = await searchParams
  const countries = await getCountries({ search, region })  // ← direct await
  return <CountryGrid countries={countries} />
}
```

**`cache: 'no-store'`**: Every API call in `lib/countries.ts` passes `{ cache: 'no-store' }` to `fetch`. This tells Next.js *not* to cache the response — every page load fetches fresh data from the REST Countries API. This is appropriate here because country data changes infrequently but you always want the latest.

```typescript
const res = await fetch(`${url}?fields=${FIELDS}`, { cache: 'no-store' })
```

**No API Routes**: There are no files in `app/api/`. The app fetches the external REST Countries API directly from Server Components. This avoids an unnecessary proxy hop.

### 4.4 Dynamic Params in App Router (Next.js 16)

In Next.js 16, both `params` and `searchParams` are **Promises** that must be awaited. This is a breaking change from earlier versions:

```typescript
// app/country/[cca3]/page.tsx
export default async function CountryDetailPage({
  params,
}: {
  params: Promise<{ cca3: string }>   // ← Promise, not a plain object
}) {
  const { cca3 } = await params       // ← must await
  const country = await getCountry(cca3)
  // ...
}
```

Similarly on the homepage:

```typescript
// app/page.tsx
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; region?: string }>
}) {
  const { search, region } = await searchParams   // ← must await
  // ...
}
```

### 4.5 Layouts

`app/layout.tsx` is the **root layout** — it wraps every page in the app. It sets up:

1. The `<html>` and `<body>` tags (only defined once here)
2. Global font CSS variables (`manrope.variable`, `inter.variable`)
3. The `dark` class on `<html>`
4. Site-wide metadata defaults

```typescript
export const metadata: Metadata = {
  title: "Country Explorer",
  description: "Explore countries around the world — The Global Curator",
}
```

Individual pages can override this metadata. The country detail page generates dynamic metadata per country:

```typescript
// app/country/[cca3]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const { cca3 } = await params
  const country = await getCountry(cca3)
  return {
    title: `${country.name.common} — Country Explorer`,
    description: `Explore ${country.name.common}: capital, population, ...`,
  }
}
```

### 4.6 Loading UI and Suspense

`loading.tsx` files create instant loading skeletons. When a user navigates to a page, Next.js immediately renders the `loading.tsx` content while the actual page data is being fetched.

```
User visits /country/DEU
  → Next.js renders loading.tsx instantly (pulsing skeleton)
  → Server fetches country data
  → Next.js swaps in page.tsx with real content
```

Additionally, on the homepage, individual `<Suspense>` wrappers around `SearchBar` and `RegionFilter` provide their own inline fallbacks:

```jsx
<Suspense fallback={<div className="h-16 w-full ... animate-pulse" />}>
  <SearchBar />
</Suspense>
```

These components need `<Suspense>` because they read `useSearchParams()`, which in Next.js requires Suspense boundaries to work correctly during static rendering.

### 4.7 Error Boundary

`app/error.tsx` is a Client Component that catches any errors thrown during rendering of the pages it wraps. It receives `unstable_retry` (a Next.js 16 prop) to re-attempt the failed render:

```typescript
'use client'

export default function Error({ error, unstable_retry }) {
  return (
    <button onClick={unstable_retry}>Try Again</button>
  )
}
```

### 4.8 Image Optimization

The `next/image` component automatically:
- Serves images in modern formats (WebP/AVIF where supported)
- Lazy-loads images below the fold
- Prevents Cumulative Layout Shift by reserving space

Remote image sources must be whitelisted in `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    { protocol: "https", hostname: "flagcdn.com" },
    { protocol: "https", hostname: "upload.wikimedia.org" },
  ],
  dangerouslyAllowSVG: true,   // Needed because flags are SVG files
}
```

All flag images use `unoptimized` because they are SVGs (Next.js cannot further compress vector images) and the REST Countries API already serves them at optimal sizes.

---

## 5. User Flow

### Homepage

```
User opens browser → navigates to /
        ↓
loading.tsx renders instantly
(pulsing skeleton: title, search bar placeholder, 8 card skeletons)
        ↓
Server fetches ALL countries from REST Countries API
        ↓
page.tsx renders with real data:
  - Navbar (fixed top)
  - Hero heading "Explore the Global Archive."
  - SearchBar + RegionFilter
  - CountryGrid (first 16 cards visible)
  - Footer
        ↓
User sees 16 country cards
(each shows: flag image, region label, country name, capital, population)
```

### Searching

```
User types "ger" into SearchBar
        ↓ (300ms debounce timer starts)
        ↓ (timer fires)
URL changes to /?search=ger  (router.replace — no history entry)
        ↓
page.tsx re-runs on the server with search="ger"
        ↓
API call to /name/ger returns matching countries
        ↓
CountryGrid re-renders with filtered results
```

### Region Filtering

```
User selects "Europe" from the dropdown
        ↓
URL changes to /?region=Europe
        ↓
page.tsx re-runs with region="Europe"
        ↓
API call to /region/Europe returns European countries
        ↓
CountryGrid renders European countries
```

### Combined Search + Filter

```
URL: /?search=ge&region=Europe
        ↓
API call to /name/ge (search takes priority)
        ↓
Results are client-filtered by region === "Europe"
(This is done in lib/countries.ts — see getCountries logic)
        ↓
Only countries matching both criteria are shown
```

### Pagination

```
User sees 16 cards, more exist
        ↓
"Explore More Nations" button is visible
        ↓
User clicks button
        ↓
CountryGrid's local state: visibleCount 16 → 32
(No API call — all countries were already fetched)
        ↓
32 cards visible; button shows again if more remain
```

### Viewing a Country Detail

```
User clicks on a CountryCard
        ↓
Link navigates to /country/DEU (using cca3 code)
        ↓
loading.tsx for [cca3] renders instantly (skeleton layout)
        ↓
Server fetches /alpha/DEU from REST Countries API
        ↓
Country detail page renders:
  - Full-width flag image
  - Common name + native name
  - Capital card
  - Region card
  - Population card (highlighted)
  - Subregion card
  - Languages + Currency panel
  - "Explore in Maps" button → opens Google Maps
```

### Back Navigation

```
User clicks "Back to Catalog"
        ↓
BackButton calls router.back()
        ↓
Browser navigates to previous URL (with search/filter params preserved)
```

### Error State

```
REST Countries API is unreachable
        ↓
fetch() throws an error in the Server Component
        ↓
error.tsx renders:
  - "Couldn't load countries" message
  - "Try Again" button → calls unstable_retry()
  - retry re-renders the page
```

### 404 State

```
User visits /country/INVALID
        ↓
getCountry("INVALID") returns null (API returned 404)
        ↓
page.tsx calls notFound()
        ↓
not-found.tsx renders:
  - "Country Not Found" message
  - "Back to Catalog" link
```

---

## 6. Data Flow

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   Browser (Client)                       │
│                                                          │
│  SearchBar ──┐                                           │
│  RegionFilter├──► URL Search Params (?search=&region=)   │
│  BackButton  │         │                                 │
│  CountryGrid │         │ router.replace()                │
│  (pagination)│         │                                 │
└──────────────┼─────────┼─────────────────────────────────┘
               │         │
               │         ▼
┌──────────────┼─────────────────────────────────────────────┐
│              │         Next.js Server                       │
│              │                                              │
│    page.tsx reads searchParams                              │
│              │                                              │
│              ▼                                              │
│    lib/countries.ts                                         │
│    ┌──────────────────────────────────────────┐            │
│    │  getCountries({ search, region })         │            │
│    │    ├─ if search + region: /name/{s}       │            │
│    │    │    then filter by region             │            │
│    │    ├─ if search only:    /name/{s}        │            │
│    │    ├─ if region only:    /region/{r}      │            │
│    │    └─ if neither:        /all             │            │
│    └──────────────────────────────────────────┘            │
│              │                                              │
│              ▼                                              │
│    fetch() → REST Countries API (restcountries.com)        │
│              │                                              │
│              ▼                                              │
│    Country[] returned to page.tsx                          │
│              │                                              │
│              ▼                                              │
│    CountryGrid (server props) → CountryCard × N            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### State Management

There is no Redux, Zustand, or React Context in this project. State is managed in three ways:

1. **URL search params** — The source of truth for search query and region filter. When the URL changes, the server re-fetches and re-renders. This means state persists on refresh and is shareable via URL.

2. **Local React state** (`useState`) — `CountryGrid` tracks `visibleCount` locally. This is ephemeral: navigating away resets it. It doesn't need to be in the URL because it's a display preference, not data-defining state.

3. **Server data as props** — The server fetches all countries and passes them down as props. Client components receive data but don't fetch it themselves.

### Data Shapes

The `Country` type is the contract between the API layer and every component. When a component receives `country: Country`, TypeScript guarantees the shape. Optional fields (`capital?`, `subregion?`, `languages?`, `currencies?`, `maps?`) are handled with null-safe access:

```typescript
// Safe access pattern used throughout the codebase:
country.capital?.[0] ?? '—'                          // "Paris" or "—"
Object.values(country.languages ?? {})               // [] if no languages
Object.keys(country.currencies ?? {})[0]             // first currency code or undefined
```

---

## 7. Component Architecture

### Component Map

```
app/layout.tsx (Root Layout — Server)
├── app/page.tsx (Homepage — Server, async)
│   ├── Navbar (Server)
│   ├── [Suspense] → SearchBar (Client)
│   ├── [Suspense] → RegionFilter (Client)
│   ├── CountryGrid (Client)
│   │   └── CountryCard × N (Server)
│   └── Footer (Server)
│
└── app/country/[cca3]/page.tsx (Country Detail — Server, async)
    ├── Navbar (Server)
    ├── BackButton (Client)
    ├── Image (flag)
    └── Footer (Server)
```

### Component Details

#### `Navbar` — Server Component

**Props**: none

**Responsibility**: Fixed navigation bar at the top. Renders the app logo and the "Discover" nav link. Uses `next/link` for client-side navigation without full page reloads.

---

#### `Footer` — Server Component

**Props**: none

**Responsibility**: Bottom bar with copyright and placeholder links. Purely decorative/informational.

---

#### `CountryCard` — Server Component

**Props**:
```typescript
{ country: Country }
```

**Responsibility**: Renders a single country as a clickable card. Uses `next/link` to navigate to `/country/{cca3}`. Uses `next/image` for the flag with `fill` layout (fills its parent container).

On hover, a "View Dossier" button fades in — this is pure CSS (`opacity-0 group-hover:opacity-100`), requiring no JavaScript.

---

#### `CountryGrid` — Client Component

**Props**:
```typescript
{ countries: Country[] }
```

**State**:
```typescript
const [visibleCount, setVisibleCount] = useState(16)
```

**Responsibility**: Controls how many cards are visible. All countries are already in memory (passed as props from the server). "Load more" increments `visibleCount` by 16 — no additional API call needed.

**Edge case**: If `countries.length === 0`, shows an empty state with a travel icon and "No countries found" text.

---

#### `SearchBar` — Client Component

**Props**: none (reads URL params internally)

**State**:
```typescript
const [value, setValue] = useState(searchParams.get('search') ?? '')
```

**Responsibility**: Controlled text input that debounces URL updates. The debounce prevents a new server request on every keystroke.

**Debounce pattern**:
```typescript
useEffect(() => {
  if (!isMounted.current) { isMounted.current = true; return }  // skip first render
  const timer = setTimeout(() => {
    pushSearch(value)
  }, 300)
  return () => clearTimeout(timer)   // cancel if value changes before 300ms
}, [value, pushSearch])
```

The `isMounted` ref prevents the effect from firing on the initial render, which would cause an unnecessary URL update.

**URL sync**: When the URL changes externally (e.g., user presses Back), a separate `useEffect` syncs the input value back to match the URL:

```typescript
useEffect(() => {
  setValue(searchParams.get('search') ?? '')
}, [searchParams])
```

---

#### `RegionFilter` — Client Component

**Props**: none (reads URL params internally)

**Responsibility**: A `<select>` dropdown. On change, immediately updates the URL (no debounce needed — selecting from a dropdown is a deliberate action, not continuous typing).

---

#### `BackButton` — Client Component

**Props**: none

**Responsibility**: Calls `router.back()` on click to navigate to the previous history entry. Must be a Client Component because it uses `useRouter`.

---

### Props Design Patterns

**Data down, events up**: Server Components receive data as props and pass it to Client Components. Client Components emit events (URL changes, state updates) but do not fetch data.

**Optional fields with defaults**: Components use `??` (nullish coalescing) to handle optional fields gracefully rather than conditional rendering chains.

**`Country` type as the contract**: Instead of passing individual props (`name`, `capital`, `population`), components receive the full `Country` object. This makes it easy to add new fields to the UI without changing prop signatures.

---

## 8. Key Features Deep Dive

### 8.1 Debounced Search

**The problem**: If you updated the URL on every keystroke, the server would re-fetch on every character typed. A 7-character search ("germany") would trigger 7 API calls and 7 page re-renders.

**The solution**: A 300ms debounce timer. The timer resets each time the input changes. Only when the user pauses typing for 300ms does the URL actually update.

```typescript
// 1. User types "g" → timer starts (300ms)
// 2. User types "e" → timer resets (300ms from now)
// 3. User types "r" → timer resets
// 4. User stops typing
// 5. After 300ms: URL updates to /?search=ger
// 6. Server fetches /name/ger
```

**Implementation note**: The `useCallback` wrapper around `pushSearch` is important — without it, `pushSearch` would be recreated on every render, which would cause the debounce `useEffect` to fire every render even if `value` hasn't changed.

### 8.2 URL as State

**Why URL state instead of React state?**

1. **Shareable**: Copy the URL and share it — the recipient sees the same filtered view
2. **Bookmarkable**: Save `/?region=Europe` as a bookmark
3. **Refresh-safe**: Refreshing the page preserves the search/filter
4. **Back/forward works**: Browser history tracks URL changes, so Back restores the previous search

**`router.replace()` vs `router.push()`**: The app uses `replace` to avoid polluting history. If `push` were used, every character typed during a search would add a history entry — pressing Back would step through each individual character rather than returning to the previous page.

### 8.3 Combined Search + Region Filter

The REST Countries API does not support searching by name *within* a region in a single API call. Country Explorer works around this:

```typescript
// lib/countries.ts
if (search && region) {
  const countries = await fetchCountries(`${BASE}/name/${encodeURIComponent(search)}`)
  return countries.filter(
    (c) => c.region.toLowerCase() === region.toLowerCase()
  )
}
```

It fetches by name, then filters the result in memory. The `?fields=` parameter ensures only the necessary fields are returned, keeping the response small.

### 8.4 `?fields=` Optimization

The REST Countries API returns ~40 fields per country by default. The app only needs 10:

```typescript
const FIELDS = 'cca3,name,flags,capital,region,subregion,population,languages,currencies,maps'
```

Appending `?fields=${FIELDS}` to every request reduces the JSON payload from ~300KB to ~40KB for the full list of all countries — roughly an 87% reduction.

### 8.5 Pagination Strategy

All countries are fetched upfront and held in memory. Pagination is purely a display concern — `CountryGrid` holds a `visibleCount` state and slices the array:

```typescript
const visible = countries.slice(0, visibleCount)
```

**Trade-off**: This is fast for the user (no loading delay when clicking "Explore More") but means ~40KB of data is in memory even if the user only looks at the first 16 cards. Given the data size, this is a good trade-off.

### 8.6 Loading Skeletons

Two layers of loading UI:

1. **Route-level** (`loading.tsx`): Next.js renders this file immediately while the page's server-side data fetch is in progress. The skeleton matches the exact layout of the real page.

2. **Suspense-level** (inline `fallback` props): Used around `SearchBar` and `RegionFilter` because they use `useSearchParams`, which requires a Suspense boundary in Next.js.

All skeletons use `animate-pulse` (a Tailwind utility that repeatedly fades the element in and out) to signal that content is loading.

### 8.7 Dynamic Metadata (SEO)

Each country detail page generates its own `<title>` and `<meta description>` at request time:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const { cca3 } = await params
  const country = await getCountry(cca3)
  if (!country) return { title: 'Country Not Found' }
  return {
    title: `${country.name.common} — Country Explorer`,
    description: `Explore ${country.name.common}: capital, population, languages, currency, and more.`,
  }
}
```

Next.js calls `generateMetadata` before rendering the page and injects the returned values into `<head>`. This means Google can index each country page with meaningful, unique metadata.

### 8.8 Flag Images with SVG Support

Flag images come from `flagcdn.com` as SVG files. SVGs are special because:
- They cannot be resized/compressed by Next.js image optimization
- They require `dangerouslyAllowSVG: true` in `next.config.ts`

The app marks all flag images as `unoptimized` to skip the optimization step (since SVGs don't benefit from it) and adds a Content Security Policy for SVG security:

```typescript
contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
```

This prevents malicious SVGs (which can embed scripts) from executing JavaScript.

---

## 9. Setup & Installation

### Prerequisites

- **Node.js** 18.17 or later (required for native `fetch` in server components)
- **npm** (comes with Node.js)
- No database or backend required — the app consumes a public API

Check your Node.js version:
```bash
node --version
```

### Step-by-Step Setup

**1. Clone the repository**
```bash
git clone <repository-url>
cd "Country Explorer"
```

**2. Install dependencies**
```bash
npm install
```

This installs everything listed in `package.json` — Next.js, React, TypeScript, Tailwind, Vitest, and all dev tools.

**3. No environment variables needed**

The REST Countries API is a free, public API that requires no authentication. There is no `.env` file needed to run this project.

---

## 10. Running the Project

### Development Mode

```bash
npm run dev
```

Opens a development server at `http://localhost:3000` with:
- Hot module replacement (changes appear instantly in the browser)
- Detailed error messages and stack traces
- Source maps for debugging

### Run Tests

```bash
npm run test:run   # Run all 18 tests once (CI mode — exits when done)
npm run test       # Watch mode — re-runs tests when files change
```

### Lint Check

```bash
npm run lint
```

Runs ESLint with the Next.js recommended rules. Fix lint errors before committing.

### Production Build

```bash
npm run build
```

Compiles and optimizes the app for production. Output goes to `.next/`. Run this to verify the app builds cleanly before deploying.

```bash
npm run start
```

Serves the production build locally. Use this to test the production build before deploying.

### Deployment on Vercel

Vercel is the company that created Next.js, so deploying there is the most seamless experience:

1. Push the repository to GitHub (or GitLab/Bitbucket)
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Vercel auto-detects Next.js and configures the build
4. Every push to `main` triggers an automatic re-deploy

No environment variables are required for deployment (no API keys, no database URLs).

---

## 11. Best Practices Used

### Performance

**Server-first rendering**: Pages that can be Server Components are Server Components. This means less JavaScript sent to the browser, faster Time to Interactive, and better Core Web Vitals.

**`?fields=` query optimization**: Only the 10 fields actually used are requested from the API — an ~87% reduction in payload size for the full countries list.

**Pagination**: Only 16 cards rendered initially. The DOM stays small and fast.

**Debounced search**: Prevents excessive server requests during typing.

**`next/image`**: Lazy loading, appropriate sizing hints (`sizes` attribute), and format optimization for all flag images.

**`next/font/google`**: Fonts are downloaded at build time and served from the same domain — no separate DNS lookup for Google Fonts on each page load.

### Code Quality

**TypeScript strict mode**: Catches null dereferences, missing optional handling, and implicit `any` at compile time.

**Single source of truth for API**: All `fetch` calls are in `lib/countries.ts`. If the API URL changes, or you want to swap the data source, there is exactly one file to change.

**Co-located tests**: Test files live next to the component they test (`CountryGrid.test.tsx` alongside `CountryGrid.tsx`). This makes it obvious what is tested and easy to find the test when working on a component.

**URL state**: Search and filter state lives in the URL, not in a React context or store. This is simpler, requires no state management library, and provides shareability for free.

### SEO

**Dynamic `<title>` and `<meta description>`** per country detail page via `generateMetadata`.

**Server-side rendering**: The REST Countries API data is in the HTML on first load — search engine crawlers see the content without executing JavaScript.

**Semantic HTML**: `<nav>`, `<main>`, `<footer>`, `<h1>`, `<h2>`, `<h3>` are used appropriately.

**`alt` text on images**: Flag images use the API-provided `flags.alt` description, or fall back to `Flag of {country name}`.

### Accessibility

**`lang="en"` on `<html>`**: Tells screen readers the page language.

**Semantic landmarks**: `<nav>`, `<main>`, `<footer>` allow screen reader users to jump directly to sections.

**Descriptive `alt` text**: Every flag image has meaningful alt text.

**Focus styles**: Tailwind's `focus:ring-4` on interactive elements provides visible focus indicators for keyboard users.

**Hover-only content is not critical**: The "View Dossier" button that appears on hover in `CountryCard` is cosmetic — all navigation is handled by the `<Link>` wrapping the entire card.

**`rel="noopener noreferrer"`**: Applied to the Google Maps external link to prevent the linked page from accessing `window.opener`.

### Security

**Image CSP for SVGs**: The `contentSecurityPolicy` in `next.config.ts` prevents SVG files served via `next/image` from executing embedded scripts.

**`rel="noopener noreferrer"`**: Prevents tab-napping attacks from external links.

**No raw HTML injection**: No `dangerouslySetInnerHTML` is used anywhere. All API data is rendered as React text nodes, which are automatically escaped.

---

## 12. Known Issues / Improvements

### Current Limitations

**Combined search + region makes two concepts**: When both search and region are active, the app fetches by search name and filters by region in memory. If the REST Countries API returns a large number of name matches, this works fine. But if someone searches for a very common term (e.g. "an"), the full set of matches is fetched and then filtered client-side — less efficient than a server-side combined query.

**No pagination for filtered results**: When a region is selected, all countries in that region are fetched. Africa alone has 54 countries, which renders 54 `CountryCard` components (though only 16 are visible). A virtualized list or server-side pagination would scale better for very large result sets.

**`cache: 'no-store'` on every request**: Country data changes rarely (names, capitals, populations). Using `cache: 'force-cache'` or ISR (Incremental Static Regeneration) with a revalidation interval (e.g., every 24 hours) would dramatically reduce API calls and improve performance.

**No offline support**: There is no service worker or caching strategy. If the user is offline or the REST Countries API is down, the error boundary is the only fallback.

**Footer links are placeholder `#` hrefs**: The Documentation, API, Terms of Service, and Privacy Policy links don't go anywhere.

**`BackButton` depends on browser history**: If a user deep-links directly to `/country/DEU` (e.g., from a search engine), clicking "Back to Catalog" will navigate to whatever was in their history before — not necessarily the app's homepage.

### Suggested Improvements

1. **ISR caching**: Add `next: { revalidate: 86400 }` to fetch calls (revalidate every 24 hours) to cache country data and avoid hitting the external API on every request.

2. **Smarter back button**: Replace `router.back()` with `<Link href="/">` or check if the referrer is within the app before using `back()`.

3. **Virtualized list**: Use a library like `@tanstack/virtual` to render only the visible cards in the DOM when hundreds of countries are loaded.

4. **Search UX improvement**: Show a loading spinner inside the search input while the server is re-fetching, so users know their input was registered.

5. **Border countries feature**: The REST Countries API provides a `borders` field (array of neighboring country codes). A "Neighboring Countries" section on the detail page would add significant value.

6. **Error granularity**: The error boundary catches all errors equally. Adding specific messages for network errors vs. unexpected errors would help users understand what went wrong.

7. **Test coverage for pages**: The current tests cover `CountryGrid` and `lib/countries.ts`. Adding tests for the page components (with mocked API calls) would improve confidence in the full render path.

---

## 13. Glossary

**App Router**: The newer Next.js routing system (introduced in Next.js 13) where routes are defined by folders and files inside the `app/` directory. This project uses App Router exclusively.

**cca3**: ISO 3166-1 alpha-3 country code — a 3-letter identifier for each country (e.g., `DEU` for Germany, `USA` for United States). Used as the URL slug for country detail pages.

**Client Component**: A React component that runs in the browser (and optionally on the server for the initial render). Marked with `'use client'` at the top of the file. Can use hooks and event handlers.

**CSP (Content Security Policy)**: A browser security feature that restricts what resources a page can load. Used here to prevent embedded scripts in SVG flag images from executing.

**Debounce**: A technique where a function is only called after a specified delay since the last time it was invoked. Used in `SearchBar` to avoid making an API call on every keystroke.

**Dynamic route**: A route whose URL segment is a variable. `app/country/[cca3]/page.tsx` is a dynamic route — `[cca3]` matches any value (e.g., `/country/DEU`, `/country/FRA`).

**Hydration**: The process where React "attaches" event listeners and makes the server-rendered HTML interactive in the browser. Client Components are hydrated; Server Components are not.

**ISR (Incremental Static Regeneration)**: A Next.js caching strategy where server-rendered pages are cached and automatically re-fetched after a specified time interval. Not currently used in this project.

**Lazy loading**: Loading resources (images, code) only when they are needed — typically when they scroll into the viewport. `next/image` applies this automatically.

**Metadata**: HTML `<head>` tags like `<title>` and `<meta description>` that describe a page to browsers and search engines. Managed via the `metadata` export and `generateMetadata` function in Next.js.

**Nullish coalescing (`??`)**: A JavaScript operator that returns the right side if the left side is `null` or `undefined`. `country.capital?.[0] ?? '—'` returns the first capital city, or `'—'` if there is none.

**Optional chaining (`?.`)**: A JavaScript operator that short-circuits to `undefined` if the left side is `null` or `undefined`. `country.capital?.[0]` safely returns `undefined` instead of throwing if `capital` is absent.

**PostCSS**: A tool that transforms CSS using plugins. Here it runs the Tailwind CSS v4 plugin to process Tailwind utilities.

**REST API**: An API that communicates over HTTP using standard methods (GET, POST, etc.) and returns data (usually JSON). The REST Countries API is a public REST API this project queries.

**Server Component**: A React component that only runs on the server — it never runs in the browser. Can be `async`, can fetch data directly, but cannot use hooks or event handlers. The default in Next.js App Router.

**Server-side rendering (SSR)**: Generating the full HTML of a page on the server before sending it to the browser. Results in faster initial page loads and better SEO compared to client-side rendering.

**`searchParams`**: URL query parameters (the `?key=value` part of a URL). In Next.js 16, `searchParams` is a `Promise` that must be awaited in Server Components.

**Suspense**: A React feature that lets you display a fallback UI while a component is loading. Required around components that use `useSearchParams()` in Next.js.

**Tailwind CSS v4**: A major release of the Tailwind utility-first CSS framework. Configuration moved from `tailwind.config.js` into `globals.css` using the `@theme` directive.

**TypeScript strict mode**: A TypeScript compilation setting (`"strict": true`) that enables the most rigorous type checks, catching more potential bugs at compile time.

**URL state**: Storing application state (like search query and filter selection) in the URL's query parameters rather than in React state or a store. Makes state shareable, bookmarkable, and refresh-safe.

**Utility-first CSS**: A styling approach (used by Tailwind) where you compose many small, single-purpose CSS class names directly in your HTML/JSX, rather than writing custom CSS files.

**Vitest**: A test runner compatible with the Vite ecosystem. Used here instead of Jest for its native TypeScript/ESM support and faster speed.

**`vi.stubGlobal()`**: A Vitest utility for replacing global variables (like `fetch`) with mock functions during tests. Allows tests to control what the API "returns" without making real network calls.

---

*Documentation generated 2026-04-10 — covers Country Explorer at commit `570bd41`.*
