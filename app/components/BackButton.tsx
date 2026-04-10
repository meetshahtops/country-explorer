// app/components/BackButton.tsx
'use client'

import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      className="group flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors duration-300"
    >
      <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">
        arrow_back
      </span>
      <span className="font-label text-sm uppercase tracking-widest font-semibold">
        Back to Catalog
      </span>
    </button>
  )
}
