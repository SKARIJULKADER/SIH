// src/components/brainfish/BrainFishAvatar.tsx
// The BrainFish mascot — a friendly fish with a brainy sidekick 🧠🐟
interface BrainFishAvatarProps {
  size?: number
  className?: string
  online?: boolean
}

export function BrainFishAvatar({ size = 40, className = '', online }: BrainFishAvatarProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-growth to-sky-500 shadow-glow-growth ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="leading-none select-none" style={{ fontSize: size * 0.5 }}>
        🐟
      </span>
      <span
        className="absolute -top-0.5 -right-1 flex items-center justify-center rounded-full bg-violet-500 border-2 border-white"
        style={{ width: size * 0.44, height: size * 0.44, fontSize: size * 0.22 }}
      >
        🧠
      </span>
      {online && (
        <span className="absolute -bottom-0.5 right-1 w-2.5 h-2.5 rounded-full bg-growth border-2 border-white" />
      )}
    </span>
  )
}
