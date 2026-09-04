// src/components/charts/Charts.tsx
// Tiny dependency-free SVG charts reused by Placement Analytics.
import { cn } from '@/lib/utils'

// --- Horizontal bar list (rejection reasons, skill insights) -----------------

export interface BarItem {
  label: string
  percent: number
  hint?: string
}

export function BarList({ items, accent = 'from-primary to-secondary', emptyLabel }: { items: BarItem[]; accent?: string; emptyLabel?: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-text-secondary py-4 text-center">{emptyLabel ?? 'No data yet.'}</p>
  }
  return (
    <div className="space-y-3.5">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between items-baseline text-sm mb-1.5">
            <span className="font-medium text-text-heading">{item.label}</span>
            <span className="text-text-secondary">{item.percent}%</span>
          </div>
          <div className="h-2.5 w-full bg-surface-3 rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700', accent)}
              style={{ width: `${Math.max(2, Math.min(100, item.percent))}%` }}
            />
          </div>
          {item.hint && <p className="text-xs text-text-secondary mt-1">{item.hint}</p>}
        </div>
      ))}
    </div>
  )
}

// --- Line chart (ATS trend) ---------------------------------------------------

export interface LinePoint {
  label: string
  value: number
}

export function LineChart({ points, height = 160, suffix = '' }: { points: LinePoint[]; height?: number; suffix?: string }) {
  if (points.length < 2) {
    return (
      <p className="text-sm text-text-secondary py-6 text-center">
        {points.length === 1
          ? `Only one data point so far (${points[0].value}${suffix}). Optimize again to draw the trend.`
          : 'No data yet.'}
      </p>
    )
  }
  const width = 520
  const padX = 34
  const padY = 22
  const min = Math.min(...points.map((p) => p.value), 0)
  const max = Math.max(...points.map((p) => p.value), 100)
  const x = (i: number) => padX + (i / (points.length - 1)) * (width - padX * 2)
  const y = (v: number) => padY + (1 - (v - min) / (max - min || 1)) * (height - padY * 2)
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(' ')
  const area = `${path} L ${x(points.length - 1).toFixed(1)} ${height - padY} L ${x(0).toFixed(1)} ${height - padY} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Trend line chart">
      <defs>
        <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <line x1={padX} y1={y(0)} x2={width - padX} y2={y(0)} stroke="#2e303a" strokeDasharray="4 4" strokeWidth="1" />
      <path d={area} fill="url(#lineFill)" />
      <path d={path} fill="none" stroke="url(#lineStroke)" strokeWidth="2.5" strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={`${p.label}-${i}`}>
          <circle cx={x(i)} cy={y(p.value)} r="4" fill="#0b0c13" stroke="#8b5cf6" strokeWidth="2" />
          <text x={x(i)} y={y(p.value) - 10} textAnchor="middle" className="fill-text-heading" fontSize="11" fontWeight="600">
            {p.value}
            {suffix}
          </text>
          <text x={x(i)} y={height - 4} textAnchor="middle" className="fill-text-secondary" fontSize="10">
            {p.label.length > 14 ? `${p.label.slice(0, 13)}…` : p.label}
          </text>
        </g>
      ))}
    </svg>
  )
}