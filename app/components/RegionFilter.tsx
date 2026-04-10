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
