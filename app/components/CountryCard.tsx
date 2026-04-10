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
