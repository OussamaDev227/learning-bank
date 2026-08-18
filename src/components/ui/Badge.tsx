import type { HTMLAttributes } from 'react'

export function Badge({ className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-primary-100 text-primary-700 text-xs font-bold px-3 py-1 ${className}`}
      {...props}
    />
  )
}

export function ComingSoonBadge() {
  return (
    <span className="absolute top-2 left-2 rounded-full bg-page text-text-muted text-[10px] font-bold px-2 py-0.5 border border-primary-100">
      قريباً
    </span>
  )
}
