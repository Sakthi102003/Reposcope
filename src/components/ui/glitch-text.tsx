import { cn } from '@/lib/utils'

interface GlitchTextProps {
  text: string
  className?: string
}

export function GlitchText({ text, className }: GlitchTextProps) {
  return (
    <div className={cn('relative inline-block perspective-1000', className)}>
      <span className="relative inline-block transform-gpu">
        {/* Base text */}
        <span className="relative inline-block text-foreground">{text}</span>

        {/* 3D Glitch layers */}
        <span className="absolute inset-0 animate-glitch-3d-1 text-primary [transform:translateZ(20px)]">
          {text}
        </span>
        <span className="absolute inset-0 animate-glitch-3d-2 text-destructive [transform:translateZ(40px)]">
          {text}
        </span>
        <span className="absolute inset-0 animate-glitch-3d-3 text-secondary [transform:translateZ(60px)]">
          {text}
        </span>

        {/* RGB Split effect */}
        <span className="absolute inset-0 animate-rgb-split-r text-primary [transform:translateX(4px)]">
          {text}
        </span>
        <span className="absolute inset-0 animate-rgb-split-g text-secondary [transform:translateX(-4px)]">
          {text}
        </span>
        <span className="absolute inset-0 animate-rgb-split-b text-destructive [transform:translateX(2px)]">
          {text}
        </span>

        {/* Scan lines */}
        <div className="absolute inset-0 animate-scan-lines bg-gradient-to-b from-transparent via-primary/20 to-transparent" />

        {/* Glitch overlay */}
        <div className="absolute inset-0 animate-glitch-overlay bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
      </span>
    </div>
  )
} 