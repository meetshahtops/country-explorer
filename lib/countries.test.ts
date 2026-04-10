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
