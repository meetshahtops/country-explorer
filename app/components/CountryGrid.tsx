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
