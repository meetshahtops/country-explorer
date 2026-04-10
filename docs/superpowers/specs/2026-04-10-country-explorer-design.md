# Country Explorer — Frontend Design Spec

**Date:** 2026-04-10  
**Stack:** Next.js 16.2.3, React 19.2.4, Tailwind CSS v4, TypeScript  
**API:** REST Countries v3.1 (`https://restcountries.com/v3.1/`)  
**Design system:** "The Global Curator" (dark editorial, glassmorphism)

---

## 1. Routes

| URL | File | Type |
|-----|------|------|
| `/` | `app/page.tsx` | Server Component |
| `/country/[cca3]` | `app/country/[cca3]/page.tsx` | Server Component |

---

## 2. Architecture

### Homepage (`/`)

`page.tsx` is an `async` Server Component. It reads `searchParams.region` and `searchParams.search`, calls the appropriate REST Countries endpoint, and passes the resulting array to `<CountryGrid>`.

**Endpoint selection logic:**

| Condition | Endpoint | Post-fetch filter |
|-----------|----------|-------------------|
| Neither search nor region | `/v3.1/all` | none |
| Region only | `/v3.1/region/{region}` | none |
| Search only | `/v3.1/name/{search}` | none |
| Both search + region | `/v3.1/name/{search}` | client-side: filter by `country.region === region` |

All endpoints include `?fields=cca3,name,flags,capital,region,subregion,population,languages,currencies,maps` to minimise payload.

If the API returns 404 (no match for name search), treat as empty array and show empty state.

### Country Detail (`/country/[cca3]`)

`page.tsx` is an `async` Server Component. It receives `params` (awaited — Next.js 16 requires `await params`), calls `/v3.1/alpha/{cca3}?fields=...`, and renders the detail layout. Calls `notFound()` on 404.

### Search & Filter inputs

`<SearchBar>` and `<RegionFilter>` are `'use client'` components that read the current URL via `useSearchParams` and push updates via `useRouter`. `<SearchBar>` debounces 300ms before pushing `?search=`. `<RegionFilter>` pushes `?region=` immediately. Combined search + region queries are supported (fetch by name, client-side filter by region), so `?search=` is preserved when region changes.

### Load more

`<CountryGrid>` is a `'use client'` component. It receives the full `countries` array from the server and manages `visibleCount` state (starts at 16, increments by 16 on "Explore More Nations" click). All filtering by the API has already happened server-side before this component receives its props.

---

## 3. File Structure

```
app/
├── layout.tsx                  # Root layout: Manrope + Inter via next/font, dark class, Material Symbols link
├── globals.css                 # Tailwind v4 @import, @theme block (design tokens), @layer utilities (glass-effect, hero-gradient)
├── page.tsx                    # Homepage Server Component
├── loading.tsx                 # Skeleton grid (8 cards, animated pulse)
├── error.tsx                   # 'use client' error boundary with retry button
├── not-found.tsx               # 404 page with link back to catalog
├── country/
│   └── [cca3]/
│       ├── page.tsx            # Detail page Server Component
│       └── loading.tsx         # Detail page skeleton
├── components/
│   ├── Navbar.tsx              # Fixed nav — logo, Discover link, dark mode toggle (stub)
│   ├── Footer.tsx              # Footer with REST Countries attribution
│   ├── CountryCard.tsx         # Presentational card — flag, region label, name, capital, population, hover CTA
│   ├── CountryGrid.tsx         # 'use client' — manages visibleCount, renders CountryCards + load-more button
│   ├── SearchBar.tsx           # 'use client' — debounced search input, synced to ?search= param
│   ├── RegionFilter.tsx        # 'use client' — region select dropdown, synced to ?region= param
│   └── BackButton.tsx          # 'use client' — uses useRouter().back()
└── lib/
    └── countries.ts            # getCountries({search, region}), getCountry(cca3) — all fetch logic
```

---

## 4. Data Types

```ts
// lib/countries.ts

type Country = {
  cca3: string
  name: {
    common: string
    official: string
    nativeName?: Record<string, { official: string }>
  }
  flags: { svg: string; alt?: string }
  capital?: string[]
  region: string
  subregion?: string
  population: number
  languages?: Record<string, string>
  currencies?: Record<string, { name: string; symbol: string }>
  maps?: { googleMaps: string }
}
```

---

## 5. Styling

**Tailwind CSS v4** — no `tailwind.config.js`. All customisation lives in `globals.css`:

```css
@import "tailwindcss";

@theme {
  /* Surface tokens */
  --color-surface-container-lowest: #060e20;
  --color-surface-container-low: #131b2e;
  --color-surface-container: #171f33;
  --color-surface-container-high: #222a3d;
  --color-surface-container-highest: #2d3449;
  --color-surface-bright: #31394d;
  --color-surface: #0b1326;
  --color-surface-variant: #2d3449;

  /* Brand colours */
  --color-primary: #4cd6ff;
  --color-primary-container: #009dc1;
  --color-primary-fixed: #b7eaff;
  --color-tertiary: #ffb695;
  --color-secondary: #b5c8df;
  --color-secondary-container: #36485b;

  /* On-colours */
  --color-on-surface: #dae2fd;
  --color-on-surface-variant: #c1c6d7;
  --color-on-primary: #003543;
  --color-on-primary-fixed: #001f28;
  --color-on-primary-container: #002e3a;
  --color-on-secondary-container: #a4b7cd;
  --color-outline: #8b90a0;
  --color-outline-variant: #414754;

  /* Typography */
  --font-headline: var(--font-manrope);
  --font-body: var(--font-inter);
  --font-label: var(--font-inter);

  /* Border radius */
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;
}

@layer utilities {
  .glass-effect {
    background: rgba(45, 52, 73, 0.6);
    backdrop-filter: blur(12px);
  }
  .hero-gradient {
    background: linear-gradient(135deg, #4cd6ff 0%, #009dc1 100%);
  }
}
```

**Fonts:** Manrope and Inter loaded via `next/font/google` in `layout.tsx`, exposed as CSS variables `--font-manrope` and `--font-inter`.

**Icons:** Material Symbols Outlined loaded via a `<link>` tag added directly inside a `<head>` element in the root `layout.tsx` (App Router root layouts may include an explicit `<head>` block alongside `<html>` and `<body>`).

**Transitions:** All interactive elements use `transition-all duration-300` with `cubic-bezier(0.4, 0, 0.2, 1)` (Tailwind's default `ease-in-out` cubic). Card hover: `scale-[1.02]`, flag image hover: `scale-110`.

**No borders rule:** Section dividers use background colour shifts only. Ghost borders (`border-outline-variant/15`) used only where accessibility requires visible boundaries.

---

## 6. Loading States

| Location | Skeleton |
|----------|----------|
| `app/loading.tsx` | 8-card pulse grid — `h-48` flag placeholder + 3 text line blocks per card |
| `app/country/[cca3]/loading.tsx` | Large flag placeholder (aspect-[16/10]) + stat bento grid blocks |

---

## 7. Error Handling

| Scenario | Handling |
|----------|----------|
| `getCountries()` network/server error | `app/error.tsx` — "Couldn't load countries" + Reset button |
| `getCountry(cca3)` returns 404 | `notFound()` → `app/not-found.tsx` — link back to catalog |
| Name search returns 404 (no match) | Treated as `[]` — empty state message within grid area |

---

## 8. Design Rules (from "The Global Curator")

- **No structural borders.** Boundaries via background colour shifts or `outline-variant/15` ghost borders only.
- **Glassmorphism** for floating elements: `rgba(45,52,73,0.6)` + `backdrop-blur-[12px]`.
- **Ambient shadow spec:** `0px 20px 40px rgba(6,14,32,0.4)` — never pure black.
- **Transitions:** `300ms cubic-bezier(0.4,0,0.2,1)` on all interactive elements.
- **Typography pairing:** Manrope for headlines/display, Inter for body/labels.
- **Left-heavy alignment** for headlines — no centred hero text.
- **Tertiary (`#ffb695`)** used sparingly for highlight data points (e.g. Capital label).
