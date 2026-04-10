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
