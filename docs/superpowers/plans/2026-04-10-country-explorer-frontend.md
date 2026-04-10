# Country Explorer Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a two-page Next.js frontend (country list + country detail) that matches the "Global Curator" design system and fetches data from the REST Countries v3.1 API.

**Architecture:** Server Components handle data fetching; search and region filter state lives in URL search params (`?search=…&region=…`); a thin `'use client'` `CountryGrid` manages load-more batch state. Country detail is a separate Server Component page at `/country/[cca3]`.

**Tech Stack:** Next.js 16.2.3, React 19.2.4, TypeScript, Tailwind CSS v4, Vitest + React Testing Library

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `lib/countries.ts` | All REST Countries fetch logic + Country type |
| Modify | `app/globals.css` | Tailwind v4 `@theme` design tokens, `@layer utilities` |
| Modify | `app/layout.tsx` | Fonts (Manrope/Inter via next/font), dark class, body base styles |
| Modify | `next.config.ts` | Image remote patterns for flagcdn.com |
| Create | `app/components/Navbar.tsx` | Fixed top nav |
| Create | `app/components/Footer.tsx` | Footer with attribution |
| Create | `app/components/CountryCard.tsx` | Presentational card |
| Create | `app/components/CountryGrid.tsx` | `'use client'` — load-more batch state |
| Create | `app/components/SearchBar.tsx` | `'use client'` — debounced `?search=` URL push |
| Create | `app/components/RegionFilter.tsx` | `'use client'` — `?region=` URL push |
| Create | `app/components/BackButton.tsx` | `'use client'` — `useRouter().back()` |
| Modify | `app/page.tsx` | Homepage Server Component |
| Create | `app/loading.tsx` | Homepage skeleton |
| Create | `app/error.tsx` | Error boundary with reset |
| Create | `app/not-found.tsx` | 404 page |
| Create | `app/country/[cca3]/page.tsx` | Country detail Server Component |
| Create | `app/country/[cca3]/loading.tsx` | Detail page skeleton |
| Create | `vitest.config.ts` | Vitest config |
| Create | `vitest.setup.ts` | jest-dom matchers |
| Create | `lib/countries.test.ts` | Unit tests for fetch logic |
| Create | `app/components/CountryGrid.test.tsx` | Component tests for load-more |

---

## Task 1: Install test dependencies and configure Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Modify: `package.json`

- [ ] **Step 1: Install Vitest and testing libraries**

```bash
cd "/home/tops/Desktop/Country Explorer"
npm install --save-dev vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

Expected: packages install without error, added to `devDependencies`.

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
// vitest.setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Add test script to `package.json`**

Add `"test": "vitest"` and `"test:run": "vitest run"` to the `"scripts"` block so it looks like:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest",
  "test:run": "vitest run"
}
```

- [ ] **Step 5: Verify Vitest runs (no tests yet)**

```bash
cd "/home/tops/Desktop/Country Explorer"
npm run test:run
```

Expected output includes `No test files found` or exits with code 0.

- [ ] **Step 6: Commit**

```bash
cd "/home/tops/Desktop/Country Explorer"
git add vitest.config.ts vitest.setup.ts package.json package-lock.json
git commit -m "chore: add Vitest and React Testing Library"
```

---

## Task 2: Tailwind v4 design tokens and global CSS

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace `app/globals.css` entirely**

```css
/* app/globals.css */
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

@theme {
  /* Surface hierarchy */
  --color-surface-container-lowest: #060e20;
  --color-surface-container-low: #131b2e;
  --color-surface-container: #171f33;
  --color-surface-container-high: #222a3d;
  --color-surface-container-highest: #2d3449;
  --color-surface-bright: #31394d;
  --color-surface: #0b1326;
  --color-surface-variant: #2d3449;
  --color-surface-dim: #0b1326;

  /* Brand */
  --color-primary: #4cd6ff;
  --color-primary-container: #009dc1;
  --color-primary-fixed: #b7eaff;
  --color-primary-fixed-dim: #4cd6ff;
  --color-tertiary: #ffb695;
  --color-tertiary-container: #ef6719;
  --color-secondary: #b5c8df;
  --color-secondary-container: #36485b;

  /* On-colours */
  --color-on-surface: #dae2fd;
  --color-on-surface-variant: #c1c6d7;
  --color-on-primary: #003543;
  --color-on-primary-fixed: #001f28;
  --color-on-primary-container: #002e3a;
  --color-on-secondary-container: #a4b7cd;
  --color-on-tertiary-container: #4c1a00;

  /* Structure */
  --color-outline: #8b90a0;
  --color-outline-variant: #414754;
  --color-background: #0b1326;
  --color-on-background: #dae2fd;

  /* Typography */
  --font-headline: var(--font-manrope);
  --font-body: var(--font-inter);
  --font-label: var(--font-inter);
}

@layer base {
  body {
    background-color: #060e20;
    color: #dae2fd;
  }
}

@layer utilities {
  .glass-effect {
    background: rgba(45, 52, 73, 0.6);
    backdrop-filter: blur(12px);
  }
  .hero-gradient {
    background: linear-gradient(135deg, #4cd6ff 0%, #009dc1 100%);
  }
  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }
}
```

- [ ] **Step 2: Commit**

```bash
cd "/home/tops/Desktop/Country Explorer"
git add app/globals.css
git commit -m "style: add Global Curator design tokens to Tailwind v4 theme"
```

---

## Task 3: Root layout — fonts and dark mode

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace `app/layout.tsx`**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Country Explorer",
  description: "Explore countries around the world — The Global Curator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} dark`}
    >
      <body className="min-h-screen flex flex-col font-body antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd "/home/tops/Desktop/Country Explorer"
git add app/layout.tsx
git commit -m "style: configure Manrope and Inter fonts via next/font"
```

---

## Task 4: Next.js config — image remote patterns

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Replace `next.config.ts`**

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
```

- [ ] **Step 2: Commit**

```bash
cd "/home/tops/Desktop/Country Explorer"
git add next.config.ts
git commit -m "config: allow flag SVGs from flagcdn.com and wikimedia"
```

---

## Task 5: Data layer — Country type and fetch functions (TDD)

**Files:**
- Create: `lib/countries.ts`
- Create: `lib/countries.test.ts`

- [ ] **Step 1: Write the failing tests in `lib/countries.test.ts`**

```ts
// lib/countries.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getCountries, getCountry } from './countries'

const FIELDS = 'cca3,name,flags,capital,region,subregion,population,languages,currencies,maps'
const BASE = 'https://restcountries.com/v3.1'

function mockOkResponse(data: unknown) {
  return {
    ok: true,
    status: 200,
    json: async () => data,
  } as Response
}

function mock404Response() {
  return {
    ok: false,
    status: 404,
    json: async () => ({}),
  } as unknown as Response
}

describe('getCountries', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fetches /all when no params given', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(mockOkResponse([]))
    await getCountries()
    expect(fetch).toHaveBeenCalledWith(`${BASE}/all?fields=${FIELDS}`)
  })

  it('fetches /region/{region} when only region given', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(mockOkResponse([]))
    await getCountries({ region: 'Europe' })
    expect(fetch).toHaveBeenCalledWith(`${BASE}/region/Europe?fields=${FIELDS}`)
  })

  it('fetches /name/{search} when only search given', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(mockOkResponse([]))
    await getCountries({ search: 'germany' })
    expect(fetch).toHaveBeenCalledWith(`${BASE}/name/germany?fields=${FIELDS}`)
  })

  it('fetches /name/{search} and filters by region when both given', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      mockOkResponse([
        { cca3: 'DEU', region: 'Europe' },
        { cca3: 'GEO', region: 'Asia' },
      ])
    )
    const result = await getCountries({ search: 'ge', region: 'Europe' })
    expect(fetch).toHaveBeenCalledWith(`${BASE}/name/ge?fields=${FIELDS}`)
    expect(result).toHaveLength(1)
    expect(result[0].cca3).toBe('DEU')
  })

  it('returns [] when API returns 404', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(mock404Response())
    const result = await getCountries({ search: 'xyznonexistent' })
    expect(result).toEqual([])
  })

  it('throws on non-404 error responses', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as unknown as Response)
    await expect(getCountries()).rejects.toThrow('Failed to fetch countries: 500')
  })
})

describe('getCountry', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fetches /alpha/{cca3} with fields', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      mockOkResponse({ cca3: 'DEU', name: { common: 'Germany' } })
    )
    const country = await getCountry('DEU')
    expect(fetch).toHaveBeenCalledWith(`${BASE}/alpha/DEU?fields=${FIELDS}`)
    expect(country?.cca3).toBe('DEU')
  })

  it('handles array response from /alpha endpoint', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      mockOkResponse([{ cca3: 'DEU', name: { common: 'Germany' } }])
    )
    const country = await getCountry('DEU')
    expect(country?.cca3).toBe('DEU')
  })

  it('returns null on 404', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(mock404Response())
    const result = await getCountry('XXX')
    expect(result).toBeNull()
  })

  it('throws on non-404 error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: async () => ({}),
    } as unknown as Response)
    await expect(getCountry('DEU')).rejects.toThrow('Failed to fetch country: 503')
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
cd "/home/tops/Desktop/Country Explorer"
npm run test:run -- lib/countries.test.ts
```

Expected: FAIL — `Cannot find module './countries'`

- [ ] **Step 3: Create `lib/countries.ts`**

```ts
// lib/countries.ts

export type Country = {
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

const FIELDS = 'cca3,name,flags,capital,region,subregion,population,languages,currencies,maps'
const BASE = 'https://restcountries.com/v3.1'

async function fetchCountries(url: string): Promise<Country[]> {
  const res = await fetch(`${url}?fields=${FIELDS}`)
  if (res.status === 404) return []
  if (!res.ok) throw new Error(`Failed to fetch countries: ${res.status}`)
  return res.json()
}

export async function getCountries({
  search,
  region,
}: {
  search?: string
  region?: string
} = {}): Promise<Country[]> {
  if (search && region) {
    const countries = await fetchCountries(`${BASE}/name/${encodeURIComponent(search)}`)
    return countries.filter(
      (c) => c.region.toLowerCase() === region.toLowerCase()
    )
  }
  if (search) {
    return fetchCountries(`${BASE}/name/${encodeURIComponent(search)}`)
  }
  if (region) {
    return fetchCountries(`${BASE}/region/${encodeURIComponent(region)}`)
  }
  return fetchCountries(`${BASE}/all`)
}

export async function getCountry(cca3: string): Promise<Country | null> {
  const res = await fetch(`${BASE}/alpha/${cca3}?fields=${FIELDS}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Failed to fetch country: ${res.status}`)
  const data = await res.json()
  return Array.isArray(data) ? data[0] ?? null : data
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
cd "/home/tops/Desktop/Country Explorer"
npm run test:run -- lib/countries.test.ts
```

Expected: all 10 tests PASS.

- [ ] **Step 5: Commit**

```bash
cd "/home/tops/Desktop/Country Explorer"
git add lib/countries.ts lib/countries.test.ts
git commit -m "feat: add Country type and REST Countries fetch functions"
```

---

## Task 6: Navbar component

**Files:**
- Create: `app/components/Navbar.tsx`

- [ ] **Step 1: Create `app/components/Navbar.tsx`**

```tsx
// app/components/Navbar.tsx
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0px_20px_40px_rgba(6,14,32,0.4)]">
      <div className="flex items-center justify-between px-8 py-4 w-full max-w-screen-2xl mx-auto font-headline antialiased">
        <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
          Country Explorer
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-primary border-b-2 border-primary pb-1">
            Discover
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button
            aria-label="Toggle dark mode"
            className="p-2 rounded-full hover:bg-surface-container/50 transition-all duration-300 scale-95 active:scale-90"
          >
            <span className="material-symbols-outlined text-primary">dark_mode</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd "/home/tops/Desktop/Country Explorer"
git add app/components/Navbar.tsx
git commit -m "feat: add Navbar component"
```

---

## Task 7: Footer component

**Files:**
- Create: `app/components/Footer.tsx`

- [ ] **Step 1: Create `app/components/Footer.tsx`**

```tsx
// app/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="w-full py-12 border-t border-surface-variant/15 bg-surface-container-lowest">
      <div className="flex flex-col md:flex-row items-center justify-between px-8 gap-4 w-full max-w-screen-2xl mx-auto font-body text-xs uppercase tracking-widest">
        <span className="text-outline text-center md:text-left">
          © 2024 The Global Curator. Data sourced from REST Countries.
        </span>
        <div className="flex flex-wrap justify-center gap-8">
          <a href="#" className="text-outline hover:text-primary transition-colors opacity-80 hover:opacity-100">
            Documentation
          </a>
          <a href="#" className="text-outline hover:text-primary transition-colors opacity-80 hover:opacity-100">
            API
          </a>
          <a href="#" className="text-outline hover:text-primary transition-colors opacity-80 hover:opacity-100">
            Terms of Service
          </a>
          <a href="#" className="text-outline hover:text-primary transition-colors opacity-80 hover:opacity-100">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd "/home/tops/Desktop/Country Explorer"
git add app/components/Footer.tsx
git commit -m "feat: add Footer component"
```

---

## Task 8: CountryCard component

**Files:**
- Create: `app/components/CountryCard.tsx`

- [ ] **Step 1: Create `app/components/CountryCard.tsx`**

```tsx
// app/components/CountryCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import type { Country } from '@/lib/countries'

export default function CountryCard({ country }: { country: Country }) {
  return (
    <Link
      href={`/country/${country.cca3}`}
      className="group relative bg-surface-container rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300 hover:bg-surface-bright shadow-lg block"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={country.flags.svg}
          alt={country.flags.alt ?? `Flag of ${country.name.common}`}
          fill
          unoptimized
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
      </div>
      <div className="p-8">
        <div className="mb-6">
          <span className="text-primary font-semibold text-xs tracking-widest uppercase mb-2 block">
            {country.region}
          </span>
          <h3 className="text-2xl font-headline font-bold text-on-surface">
            {country.name.common}
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-baseline justify-between border-b border-outline-variant/10 pb-2">
            <span className="text-outline text-xs uppercase tracking-wider font-medium">Capital</span>
            <span className="text-on-surface-variant font-medium">
              {country.capital?.[0] ?? '—'}
            </span>
          </div>
          <div className="flex items-baseline justify-between border-b border-outline-variant/10 pb-2">
            <span className="text-outline text-xs uppercase tracking-wider font-medium">Population</span>
            <span className="text-on-surface-variant font-medium">
              {country.population.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="mt-8 w-full py-4 rounded-xl hero-gradient text-on-primary-fixed font-bold flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-95 active:scale-90">
          View Dossier
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd "/home/tops/Desktop/Country Explorer"
git add app/components/CountryCard.tsx
git commit -m "feat: add CountryCard component"
```

---

## Task 9: CountryGrid component (TDD)

**Files:**
- Create: `app/components/CountryGrid.tsx`
- Create: `app/components/CountryGrid.test.tsx`

- [ ] **Step 1: Write the failing tests in `app/components/CountryGrid.test.tsx`**

```tsx
// app/components/CountryGrid.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CountryGrid from './CountryGrid'
import type { Country } from '@/lib/countries'

vi.mock('./CountryCard', () => ({
  default: ({ country }: { country: Country }) => (
    <div data-testid="country-card">{country.name.common}</div>
  ),
}))

function makeCountries(n: number): Country[] {
  return Array.from({ length: n }, (_, i) => ({
    cca3: `C${String(i).padStart(3, '0')}`,
    name: { common: `Country ${i}`, official: `Country ${i}` },
    flags: { svg: 'flag.svg' },
    region: 'Europe',
    population: 1000,
  }))
}

describe('CountryGrid', () => {
  it('shows 16 cards initially when more than 16 countries', () => {
    render(<CountryGrid countries={makeCountries(20)} />)
    expect(screen.getAllByTestId('country-card')).toHaveLength(16)
  })

  it('shows all cards when fewer than 16 countries', () => {
    render(<CountryGrid countries={makeCountries(10)} />)
    expect(screen.getAllByTestId('country-card')).toHaveLength(10)
  })

  it('shows "Explore More Nations" button when more than 16 countries', () => {
    render(<CountryGrid countries={makeCountries(20)} />)
    expect(screen.getByRole('button', { name: /explore more nations/i })).toBeInTheDocument()
  })

  it('does not show load-more button when all countries are visible', () => {
    render(<CountryGrid countries={makeCountries(10)} />)
    expect(screen.queryByRole('button', { name: /explore more nations/i })).not.toBeInTheDocument()
  })

  it('shows 16 more cards on button click', () => {
    render(<CountryGrid countries={makeCountries(40)} />)
    expect(screen.getAllByTestId('country-card')).toHaveLength(16)
    fireEvent.click(screen.getByRole('button', { name: /explore more nations/i }))
    expect(screen.getAllByTestId('country-card')).toHaveLength(32)
  })

  it('hides load-more button after all cards are shown', () => {
    render(<CountryGrid countries={makeCountries(20)} />)
    fireEvent.click(screen.getByRole('button', { name: /explore more nations/i }))
    expect(screen.queryByRole('button', { name: /explore more nations/i })).not.toBeInTheDocument()
  })

  it('shows empty state message when countries array is empty', () => {
    render(<CountryGrid countries={[]} />)
    expect(screen.getByText('No countries found')).toBeInTheDocument()
    expect(screen.queryByTestId('country-card')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
cd "/home/tops/Desktop/Country Explorer"
npm run test:run -- app/components/CountryGrid.test.tsx
```

Expected: FAIL — `Cannot find module './CountryGrid'`

- [ ] **Step 3: Create `app/components/CountryGrid.tsx`**

```tsx
// app/components/CountryGrid.tsx
'use client'

import { useState } from 'react'
import CountryCard from './CountryCard'
import type { Country } from '@/lib/countries'

const BATCH = 16

export default function CountryGrid({ countries }: { countries: Country[] }) {
  const [visibleCount, setVisibleCount] = useState(BATCH)

  if (countries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-on-surface-variant">
        <span className="material-symbols-outlined text-5xl">travel_explore</span>
        <p className="font-headline text-xl">No countries found</p>
      </div>
    )
  }

  const visible = countries.slice(0, visibleCount)
  const hasMore = visibleCount < countries.length

  return (
    <div className="space-y-12">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {visible.map((country) => (
          <CountryCard key={country.cca3} country={country} />
        ))}
      </section>
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={() => setVisibleCount((n) => n + BATCH)}
            className="px-12 py-5 bg-surface-container-high text-on-surface rounded-full border border-outline-variant/15 hover:bg-surface-bright transition-all duration-300 font-bold tracking-wide scale-95 active:scale-90"
          >
            Explore More Nations
          </button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
cd "/home/tops/Desktop/Country Explorer"
npm run test:run -- app/components/CountryGrid.test.tsx
```

Expected: all 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
cd "/home/tops/Desktop/Country Explorer"
git add app/components/CountryGrid.tsx app/components/CountryGrid.test.tsx
git commit -m "feat: add CountryGrid component with load-more (TDD)"
```

---

## Task 10: SearchBar component

**Files:**
- Create: `app/components/SearchBar.tsx`

- [ ] **Step 1: Create `app/components/SearchBar.tsx`**

```tsx
// app/components/SearchBar.tsx
'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('search') ?? '')

  useEffect(() => {
    setValue(searchParams.get('search') ?? '')
  }, [searchParams])

  const pushSearch = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (query) {
        params.set('search', query)
      } else {
        params.delete('search')
      }
      router.push(`/?${params.toString()}`)
    },
    [router, searchParams]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      pushSearch(value)
    }, 300)
    return () => clearTimeout(timer)
  }, [value, pushSearch])

  return (
    <div className="relative w-full lg:max-w-2xl">
      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
        <span className="material-symbols-outlined text-outline">search</span>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for a country, capital, or region..."
        className="w-full bg-surface-container-lowest border border-outline-variant/15 text-on-surface-variant py-5 pl-14 pr-6 rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 placeholder:text-outline outline-none"
      />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd "/home/tops/Desktop/Country Explorer"
git add app/components/SearchBar.tsx
git commit -m "feat: add SearchBar component with debounced URL push"
```

---

## Task 11: RegionFilter component

**Files:**
- Create: `app/components/RegionFilter.tsx`

- [ ] **Step 1: Create `app/components/RegionFilter.tsx`**

```tsx
// app/components/RegionFilter.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const REGIONS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']

export default function RegionFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentRegion = searchParams.get('region') ?? ''

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString())
    if (e.target.value) {
      params.set('region', e.target.value)
    } else {
      params.delete('region')
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="relative">
      <select
        value={currentRegion}
        onChange={handleChange}
        className="appearance-none bg-surface-container-high border border-outline-variant/15 text-on-surface py-5 px-8 pr-16 rounded-full focus:ring-4 focus:ring-primary/20 transition-all duration-300 cursor-pointer outline-none"
      >
        <option value="">All Regions</option>
        {REGIONS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
        <span className="material-symbols-outlined text-primary">expand_more</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd "/home/tops/Desktop/Country Explorer"
git add app/components/RegionFilter.tsx
git commit -m "feat: add RegionFilter component"
```

---

## Task 12: BackButton component

**Files:**
- Create: `app/components/BackButton.tsx`

- [ ] **Step 1: Create `app/components/BackButton.tsx`**

```tsx
// app/components/BackButton.tsx
'use client'

import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      className="group flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors duration-300"
    >
      <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">
        arrow_back
      </span>
      <span className="font-label text-sm uppercase tracking-widest font-semibold">
        Back to Catalog
      </span>
    </button>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd "/home/tops/Desktop/Country Explorer"
git add app/components/BackButton.tsx
git commit -m "feat: add BackButton component"
```

---

## Task 13: Homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
// app/page.tsx
import { Suspense } from 'react'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import SearchBar from '@/app/components/SearchBar'
import RegionFilter from '@/app/components/RegionFilter'
import CountryGrid from '@/app/components/CountryGrid'
import { getCountries } from '@/lib/countries'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; region?: string }>
}) {
  const { search, region } = await searchParams
  const countries = await getCountries({ search, region })

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-6 max-w-screen-2xl mx-auto">
        <section className="mb-16 mt-12">
          <div className="flex flex-col space-y-2 mb-12">
            <span className="text-tertiary text-xs uppercase tracking-widest font-semibold">
              Curation
            </span>
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter text-on-surface leading-tight">
              Explore the <br />
              <span className="text-primary">Global</span> Archive.
            </h1>
          </div>
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            <Suspense>
              <SearchBar />
            </Suspense>
            <Suspense>
              <RegionFilter />
            </Suspense>
          </div>
        </section>
        <CountryGrid countries={countries} />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd "/home/tops/Desktop/Country Explorer"
git add app/page.tsx
git commit -m "feat: build homepage with server-side country fetching"
```

---

## Task 14: Homepage loading skeleton

**Files:**
- Create: `app/loading.tsx`

- [ ] **Step 1: Create `app/loading.tsx`**

```tsx
// app/loading.tsx
import Navbar from '@/app/components/Navbar'

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-6 max-w-screen-2xl mx-auto">
        <section className="mb-16 mt-12">
          <div className="flex flex-col space-y-2 mb-12">
            <div className="h-4 w-24 bg-surface-container rounded animate-pulse" />
            <div className="h-14 w-[28rem] bg-surface-container rounded animate-pulse mt-2" />
            <div className="h-14 w-72 bg-surface-container rounded animate-pulse" />
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="h-16 w-full lg:max-w-2xl bg-surface-container rounded-xl animate-pulse" />
            <div className="h-16 w-48 bg-surface-container rounded-full animate-pulse" />
          </div>
        </section>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-surface-container rounded-xl overflow-hidden">
              <div className="h-48 bg-surface-container-high animate-pulse" />
              <div className="p-8 space-y-4">
                <div className="h-3 w-16 bg-surface-container-high rounded animate-pulse" />
                <div className="h-6 w-36 bg-surface-container-high rounded animate-pulse" />
                <div className="h-4 w-full bg-surface-container-high rounded animate-pulse" />
                <div className="h-4 w-full bg-surface-container-high rounded animate-pulse" />
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd "/home/tops/Desktop/Country Explorer"
git add app/loading.tsx
git commit -m "feat: add homepage loading skeleton"
```

---

## Task 15: Error and NotFound pages

**Files:**
- Create: `app/error.tsx`
- Create: `app/not-found.tsx`

- [ ] **Step 1: Create `app/error.tsx`**

```tsx
// app/error.tsx
'use client'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
      <span className="material-symbols-outlined text-5xl text-outline">cloud_off</span>
      <h2 className="text-2xl font-headline font-bold text-on-surface">
        Couldn't load countries
      </h2>
      <p className="text-on-surface-variant text-center max-w-sm">
        There was a problem connecting to the data source. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-8 py-4 hero-gradient text-on-primary-fixed font-bold rounded-xl transition-all duration-300 hover:scale-105"
      >
        Try Again
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Create `app/not-found.tsx`**

```tsx
// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
      <span className="material-symbols-outlined text-5xl text-primary">explore_off</span>
      <h2 className="text-2xl font-headline font-bold text-on-surface">Country Not Found</h2>
      <p className="text-on-surface-variant text-center max-w-sm">
        We couldn't find that country in our catalog.
      </p>
      <Link
        href="/"
        className="px-8 py-4 hero-gradient text-on-primary-fixed font-bold rounded-xl transition-all duration-300 hover:scale-105"
      >
        Back to Catalog
      </Link>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
cd "/home/tops/Desktop/Country Explorer"
git add app/error.tsx app/not-found.tsx
git commit -m "feat: add error boundary and 404 pages"
```

---

## Task 16: Country detail page

**Files:**
- Create: `app/country/[cca3]/page.tsx`

- [ ] **Step 1: Create `app/country/[cca3]/page.tsx`**

```tsx
// app/country/[cca3]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import BackButton from '@/app/components/BackButton'
import { getCountry } from '@/lib/countries'

export default async function CountryDetailPage({
  params,
}: {
  params: Promise<{ cca3: string }>
}) {
  const { cca3 } = await params
  const country = await getCountry(cca3)

  if (!country) notFound()

  const nativeName = country.name.nativeName
    ? Object.values(country.name.nativeName)[0]?.official
    : null

  const languages = country.languages ? Object.values(country.languages) : []
  const currencyCode = country.currencies ? Object.keys(country.currencies)[0] : null
  const currency = currencyCode ? country.currencies![currencyCode] : null

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
        <div className="mb-8 flex items-center">
          <BackButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Flag & Identity */}
          <div className="lg:col-span-7 space-y-12">
            <div className="relative">
              <div className="absolute inset-0 bg-primary opacity-10 blur-3xl rounded-full -z-10 scale-75" />
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden shadow-[0px_20px_40px_rgba(6,14,32,0.4)]">
                <Image
                  src={country.flags.svg}
                  alt={country.flags.alt ?? `Flag of ${country.name.common}`}
                  fill
                  unoptimized
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-[0.2em] text-tertiary font-bold">
                  Official Designation
                </span>
                <div className="h-px flex-grow bg-outline-variant opacity-15" />
              </div>
              <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tight text-on-surface">
                {country.name.common}
              </h1>
              {nativeName && nativeName !== country.name.common && (
                <p className="text-xl text-on-surface-variant font-headline italic opacity-80">
                  {nativeName}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Capital */}
              <div className="glass-effect p-6 rounded-xl hover:bg-surface-bright transition-all duration-300">
                <span className="material-symbols-outlined text-primary mb-3 block">location_city</span>
                <div className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Capital</div>
                <div className="text-xl font-headline font-bold">{country.capital?.[0] ?? '—'}</div>
              </div>

              {/* Region */}
              <div className="glass-effect p-6 rounded-xl hover:bg-surface-bright transition-all duration-300">
                <span className="material-symbols-outlined text-tertiary mb-3 block">public</span>
                <div className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Region</div>
                <div className="text-xl font-headline font-bold">{country.region}</div>
              </div>

              {/* Population */}
              <div className="glass-effect p-6 rounded-xl hover:bg-surface-bright transition-all duration-300 sm:col-span-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="material-symbols-outlined text-primary mb-3 block">groups</span>
                    <div className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Population</div>
                    <div className="text-3xl font-headline font-extrabold text-primary">
                      {country.population.toLocaleString()}
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full border-2 border-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
                  </div>
                </div>
              </div>

              {/* Subregion */}
              {country.subregion && (
                <div className="bg-surface-container p-6 rounded-xl sm:col-span-2">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-outline">map</span>
                    <div>
                      <div className="text-xs uppercase tracking-widest text-on-surface-variant mb-0.5">Subregion</div>
                      <div className="text-lg font-headline font-semibold">{country.subregion}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Languages + Currency */}
            <div className="space-y-6">
              {(languages.length > 0 || currency) && (
                <div className="p-6 border border-outline-variant/15 rounded-xl space-y-4">
                  {languages.length > 0 && (
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary">language</span>
                        <span className="font-headline font-bold">Languages</span>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-end max-w-[60%]">
                        {languages.map((lang) => (
                          <span
                            key={lang}
                            className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-semibold"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {languages.length > 0 && currency && (
                    <div className="h-px bg-outline-variant opacity-10" />
                  )}
                  {currency && (
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary">payments</span>
                        <span className="font-headline font-bold">Currency</span>
                      </div>
                      <div className="text-right">
                        <div className="text-on-surface font-semibold">{currency.name}</div>
                        <div className="text-sm text-primary font-mono tracking-tighter">
                          {currencyCode} ({currency.symbol})
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Explore in Maps */}
              {country.maps?.googleMaps && (
                <a
                  href={country.maps.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full hero-gradient text-on-primary-fixed font-headline font-bold py-5 rounded-xl transition-all duration-300 scale-[0.98] hover:scale-100 active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-primary/10"
                >
                  <span className="material-symbols-outlined">explore</span>
                  Explore in Maps
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd "/home/tops/Desktop/Country Explorer"
git add app/country/
git commit -m "feat: build country detail page"
```

---

## Task 17: Country detail loading skeleton

**Files:**
- Create: `app/country/[cca3]/loading.tsx`

- [ ] **Step 1: Create `app/country/[cca3]/loading.tsx`**

```tsx
// app/country/[cca3]/loading.tsx
import Navbar from '@/app/components/Navbar'

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
        <div className="mb-8 h-6 w-40 bg-surface-container rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-12">
            <div className="w-full aspect-[16/10] bg-surface-container rounded-xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-4 w-48 bg-surface-container rounded animate-pulse" />
              <div className="h-16 w-80 bg-surface-container rounded animate-pulse" />
              <div className="h-6 w-52 bg-surface-container rounded animate-pulse" />
            </div>
          </div>
          <div className="lg:col-span-5 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 bg-surface-container rounded-xl animate-pulse" />
              <div className="h-32 bg-surface-container rounded-xl animate-pulse" />
              <div className="col-span-2 h-32 bg-surface-container rounded-xl animate-pulse" />
              <div className="col-span-2 h-20 bg-surface-container rounded-xl animate-pulse" />
            </div>
            <div className="h-40 bg-surface-container rounded-xl animate-pulse" />
            <div className="h-16 bg-surface-container rounded-xl animate-pulse" />
          </div>
        </div>
      </main>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd "/home/tops/Desktop/Country Explorer"
git add app/country/
git commit -m "feat: add country detail loading skeleton"
```

---

## Task 18: Run all tests and start dev server

- [ ] **Step 1: Run all tests**

```bash
cd "/home/tops/Desktop/Country Explorer"
npm run test:run
```

Expected: all tests pass (10 data layer tests + 7 CountryGrid tests = 17 total).

- [ ] **Step 2: Start the dev server**

```bash
cd "/home/tops/Desktop/Country Explorer"
npm run dev
```

Expected: server starts at `http://localhost:3000`. Open in browser and verify:
- Homepage loads with country cards
- Search input filters countries (with 300ms debounce)
- Region dropdown filters countries
- Clicking a card navigates to `/country/[cca3]`
- Back button returns to homepage
- "Explore More Nations" button loads 16 more cards
- Loading skeletons appear during navigation
