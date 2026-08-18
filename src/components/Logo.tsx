export function Logo({ size = 44 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-900"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
        <path
          d="M4 5.5C4 4.67 4.67 4 5.5 4H11v14H5.5A1.5 1.5 0 0 1 4 16.5v-11Z"
          fill="white"
          fillOpacity="0.95"
        />
        <path
          d="M20 5.5c0-.83-.67-1.5-1.5-1.5H13v14h5.5a1.5 1.5 0 0 0 1.5-1.5v-11Z"
          fill="white"
          fillOpacity="0.7"
        />
        <path d="M2 19.5 12 22l10-2.5" stroke="#F5B942" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </div>
  )
}
