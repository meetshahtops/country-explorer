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
