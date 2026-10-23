import { AlertCircle, CheckCircle2, LoaderCircle } from 'lucide-react'
export function Notice({ children, kind = 'error' }) {
  const Icon = kind === 'loading' ? LoaderCircle : kind === 'success' ? CheckCircle2 : AlertCircle
  return (
    <div className={`notice notice-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      <Icon size={17} />
      {children}
    </div>
  )
}
export function Loading() {
  return (
    <div className="loading">
      <LoaderCircle className="spin" size={20} /> Loading your workspace…
    </div>
  )
}
