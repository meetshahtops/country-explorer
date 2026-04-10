// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
      <span className="material-symbols-outlined text-5xl text-primary">explore_off</span>
      <h2 className="text-2xl font-headline font-bold text-on-surface">Country Not Found</h2>
      <p className="text-on-surface-variant text-center max-w-sm">
        We couldn't find that country in our catalog.
      </p>
      <Link
        href="/"
        className="px-8 py-4 hero-gradient text-on-primary-fixed font-bold rounded-xl transition-all duration-300 hover:scale-105"
      >
        Back to Catalog
      </Link>
    </div>
  )
}
