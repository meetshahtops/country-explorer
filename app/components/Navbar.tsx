// app/components/Navbar.tsx
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0px_20px_40px_rgba(6,14,32,0.4)]">
      <div className="flex items-center justify-between px-8 py-4 w-full max-w-screen-2xl mx-auto font-headline antialiased">
        <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
          Country Explorer
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-primary border-b-2 border-primary pb-1">
            Discover
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button
            aria-label="Toggle dark mode"
            className="p-2 rounded-full hover:bg-surface-container/50 transition-all duration-300 scale-95 active:scale-90"
          >
            <span className="material-symbols-outlined text-primary">dark_mode</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
