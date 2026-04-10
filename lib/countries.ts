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
  currencies?: Record<string, { name: string; symbol?: string }>
  maps?: { googleMaps: string }
}

const FIELDS = 'cca3,name,flags,capital,region,subregion,population,languages,currencies,maps'
const BASE = 'https://restcountries.com/v3.1'

async function fetchCountries(url: string): Promise<Country[]> {
  const res = await fetch(`${url}?fields=${FIELDS}`, { cache: 'no-store' })
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
  const res = await fetch(`${BASE}/alpha/${cca3}?fields=${FIELDS}`, { cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Failed to fetch country: ${res.status}`)
  const data = await res.json()
  return Array.isArray(data) ? data[0] ?? null : data
}
