'use client'

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
      <span className="material-symbols-outlined text-5xl text-outline">cloud_off</span>
      <h2 className="text-2xl font-headline font-bold text-on-surface">
        Couldn't load countries
      </h2>
      <p className="text-on-surface-variant text-center max-w-sm">
        There was a problem connecting to the data source. Please try again.
      </p>
      <button
        onClick={unstable_retry}
        className="px-8 py-4 hero-gradient text-on-primary-fixed font-bold rounded-xl transition-all duration-300 hover:scale-105"
      >
        Try Again
      </button>
    </div>
  )
}
