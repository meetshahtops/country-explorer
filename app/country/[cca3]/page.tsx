// app/country/[cca3]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import BackButton from '@/app/components/BackButton'
import { getCountry } from '@/lib/countries'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cca3: string }>
}): Promise<Metadata> {
  const { cca3 } = await params
  const country = await getCountry(cca3)
  if (!country) return { title: 'Country Not Found' }
  return {
    title: `${country.name.common} — Country Explorer`,
    description: `Explore ${country.name.common}: capital, population, languages, currency, and more.`,
  }
}

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
                          {currencyCode}{currency.symbol ? ` (${currency.symbol})` : ''}
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
