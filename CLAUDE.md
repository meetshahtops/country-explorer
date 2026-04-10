# Country Explorer — Project Guide

> **Next.js 16 warning**: This version has breaking changes. APIs, conventions, and file structure differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Stack

- **Next.js 16.2.3** — App Router, no Pages Router
- **React 19.2.4** — Server Components by default
- **TypeScript 5** — strict mode enabled
- **Tailwind CSS v4** — via `@tailwindcss/postcss`, configured in `globals.css` with `@theme`
- **Vitest 4** — jsdom environment, Testing Library

## Commands

```bash
npm run dev       # start dev server
npm run build     # production build
npm run lint      # ESLint (flat config, eslint 9)
npm run test:run  # run all tests once (CI)
npm run test      # watch mode
```

## Project Structure

```
app/
  components/       # shared UI components (+ co-located tests)
  country/[cca3]/   # dynamic country detail route
  error.tsx         # error boundary (client component)
  loading.tsx       # root loading skeleton
  not-found.tsx     # 404 page
  page.tsx          # homepage (async server component)
  globals.css       # Tailwind theme + Material Design 3 tokens
lib/
  countries.ts      # all API calls + Country type
  countries.test.ts # API layer tests
```

## Component Conventions

**Server components** (default — no directive needed): `Navbar`, `Footer`, `CountryCard`, page files. Async-fetch directly; no hooks or event handlers.

**Client components** (`'use client'`): `SearchBar`, `RegionFilter`, `CountryGrid`, `BackButton`. Required for hooks, event handlers, and browser APIs.

**Suspense**: Wrap client components that read `searchParams` (e.g. `SearchBar`, `RegionFilter`) in `<Suspense>` in the parent page.

## Data Fetching

All external data goes through `lib/countries.ts`. It calls the REST Countries API (`https://restcountries.com/v3.1`) with `cache: 'no-store'`. Functions return typed `Country` objects or arrays; 404s return `null`/`[]`; other errors throw.

Do not add API routes or server actions unless explicitly needed — the current pattern is direct server-component fetching.

## URL State

Search and region filter state lives in URL search params. Use `router.replace()` (not `push()`) to avoid polluting history. `SearchBar` debounces 300 ms before updating the URL.

## Styling

Tailwind v4 utility classes only. The `@theme` block in `globals.css` defines Material Design 3 CSS custom properties — reference those tokens (e.g. `bg-surface`, `text-on-surface`, `bg-primary`) rather than raw Tailwind colour utilities. Utility layers (`glass-effect`, `hero-gradient`) are also defined there.

Fonts: **Manrope** (headings) and **Inter** (body/labels) via `next/font/google`.

## Testing

- Unit/integration tests with Vitest + Testing Library
- Mock `fetch` with `vi.stubGlobal()` in API tests
- Mock child components with `vi.mock()` in component tests
- Run `npm run test:run` before committing; all 18 tests must pass

## Image Optimization

Use `next/image` for all images. Allowed remote domains: `flagcdn.com`, `upload.wikimedia.org`. SVGs are permitted via `dangerouslyAllowSVG` in `next.config.ts`.
