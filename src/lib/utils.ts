import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function shieldScoreColor(score: number): string {
  if (score >= 80) return 'text-green-400'
  if (score >= 60) return 'text-yellow-400'
  return 'text-red-400'
}

export function shieldScoreLabel(score: number): string {
  if (score >= 80) return 'Trusted'
  if (score >= 60) return 'Moderate'
  return 'Caution'
}

export function shieldScoreBg(score: number): string {
  if (score >= 80) return 'bg-green-500/15 text-green-400 border-green-500/30'
  if (score >= 60) return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
  return 'bg-red-500/15 text-red-400 border-red-500/30'
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}
