import type { HTMLAttributes } from 'react'

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl bg-surface shadow-sm hover:shadow-md transition-shadow p-4 ${className}`}
      {...props}
    />
  )
}
