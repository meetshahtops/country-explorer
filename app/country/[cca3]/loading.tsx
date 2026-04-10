// app/country/[cca3]/loading.tsx
import Navbar from '@/app/components/Navbar'

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
        <div className="mb-8 h-6 w-40 bg-surface-container rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-12">
            <div className="w-full aspect-[16/10] bg-surface-container rounded-xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-4 w-48 bg-surface-container rounded animate-pulse" />
              <div className="h-16 w-80 bg-surface-container rounded animate-pulse" />
              <div className="h-6 w-52 bg-surface-container rounded animate-pulse" />
            </div>
          </div>
          <div className="lg:col-span-5 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 bg-surface-container rounded-xl animate-pulse" />
              <div className="h-32 bg-surface-container rounded-xl animate-pulse" />
              <div className="col-span-2 h-32 bg-surface-container rounded-xl animate-pulse" />
              <div className="col-span-2 h-20 bg-surface-container rounded-xl animate-pulse" />
            </div>
            <div className="h-40 bg-surface-container rounded-xl animate-pulse" />
            <div className="h-16 bg-surface-container rounded-xl animate-pulse" />
          </div>
        </div>
      </main>
    </>
  )
}
