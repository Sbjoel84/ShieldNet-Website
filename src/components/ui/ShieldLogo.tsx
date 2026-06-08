import { cn } from '@/lib/utils'

interface ShieldLogoProps {
  sizeClass?: string
  className?: string
  wrapperClassName?: string
  ring?: boolean
  pulse?: boolean
}

export function ShieldLogo({
  sizeClass = 'w-10 h-10',
  className,
  wrapperClassName,
  ring = true,
  pulse = true,
}: ShieldLogoProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl flex-shrink-0',
        sizeClass,
        ring && 'ring-1 ring-green-500/30',
        pulse && 'animate-shield-pulse',
        wrapperClassName,
      )}
    >
      <img
        src="/logo-alt.svg"
        alt="ShieldNet"
        className={cn('object-contain bg-white w-full h-full', className)}
      />
      <span aria-hidden="true" className="logo-shine-overlay pointer-events-none absolute inset-0 animate-logo-shine" />
    </div>
  )
}
