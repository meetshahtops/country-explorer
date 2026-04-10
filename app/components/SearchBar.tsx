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
