
export enum ConfidenceLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  EXCELLENT = 'excellent',
}

export function getConfidenceLevel(confidence: number): ConfidenceLevel {
  if (confidence < 0.7) return ConfidenceLevel.LOW
  if (confidence < 0.85) return ConfidenceLevel.MEDIUM
  if (confidence < 0.95) return ConfidenceLevel.HIGH
  return ConfidenceLevel.EXCELLENT
}

export function getConfidenceColor(confidence: number): string {
  const level = getConfidenceLevel(confidence)

  switch (level) {
    case ConfidenceLevel.LOW:
      return 'text-red-400'
    case ConfidenceLevel.MEDIUM:
      return 'text-amber-400'
    case ConfidenceLevel.HIGH:
      return 'text-cyan-400'
    case ConfidenceLevel.EXCELLENT:
      return 'text-emerald-400'
  }
}

export function getConfidenceBgColor(confidence: number): string {
  const level = getConfidenceLevel(confidence)

  switch (level) {
    case ConfidenceLevel.LOW:
      return 'bg-red-500/20'
    case ConfidenceLevel.MEDIUM:
      return 'bg-amber-500/20'
    case ConfidenceLevel.HIGH:
      return 'bg-cyan-500/20'
    case ConfidenceLevel.EXCELLENT:
      return 'bg-emerald-500/20'
  }
}

export function formatTime(timestamp: string): string {
  try {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch {
    return timestamp
  }
}

export function formatDate(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return 'Unknown'
  }
}

export function getRelativeTime(timestamp: string): string {
  try {
    const date = new Date(timestamp)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return formatDate(date)
  } catch {
    return timestamp
  }
}

export function getGestureColor(name: string): string {
  const colors = [
    'text-indigo-400',
    'text-cyan-400',
    'text-emerald-400',
    'text-amber-400',
    'text-pink-400',
    'text-blue-400',
  ]

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i)
    hash = hash & hash
  }

  return colors[Math.abs(hash) % colors.length]
}
