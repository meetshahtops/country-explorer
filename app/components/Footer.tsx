// app/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="w-full py-12 border-t border-surface-variant/15 bg-surface-container-lowest">
      <div className="flex flex-col md:flex-row items-center justify-between px-8 gap-4 w-full max-w-screen-2xl mx-auto font-body text-xs uppercase tracking-widest">
        <span className="text-outline text-center md:text-left">
          © 2024 The Global Curator. Data sourced from REST Countries.
        </span>
        <div className="flex flex-wrap justify-center gap-8">
          <a href="#" className="text-outline hover:text-primary transition-colors opacity-80 hover:opacity-100">
            Documentation
          </a>
          <a href="#" className="text-outline hover:text-primary transition-colors opacity-80 hover:opacity-100">
            API
          </a>
          <a href="#" className="text-outline hover:text-primary transition-colors opacity-80 hover:opacity-100">
            Terms of Service
          </a>
          <a href="#" className="text-outline hover:text-primary transition-colors opacity-80 hover:opacity-100">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  )
}
