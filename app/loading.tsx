// app/loading.tsx
import Navbar from '@/app/components/Navbar'

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-6 max-w-screen-2xl mx-auto">
        <section className="mb-16 mt-12">
          <div className="flex flex-col space-y-2 mb-12">
            <div className="h-4 w-24 bg-surface-container rounded animate-pulse" />
            <div className="h-14 w-[28rem] bg-surface-container rounded animate-pulse mt-2" />
            <div className="h-14 w-72 bg-surface-container rounded animate-pulse" />
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="h-16 w-full lg:max-w-2xl bg-surface-container rounded-xl animate-pulse" />
            <div className="h-16 w-48 bg-surface-container rounded-full animate-pulse" />
          </div>
        </section>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-surface-container rounded-xl overflow-hidden">
              <div className="h-48 bg-surface-container-high animate-pulse" />
              <div className="p-8 space-y-4">
                <div className="h-3 w-16 bg-surface-container-high rounded animate-pulse" />
                <div className="h-6 w-36 bg-surface-container-high rounded animate-pulse" />
                <div className="h-4 w-full bg-surface-container-high rounded animate-pulse" />
                <div className="h-4 w-full bg-surface-container-high rounded animate-pulse" />
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  )
}
