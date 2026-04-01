'use client'
import { useState, useEffect } from 'react'
import { WifiOff, X, RefreshCw } from 'lucide-react'

export default function NetworkStatus() {
  const [online, setOnline] = useState(true)
  const [dismissed, setDismissed] = useState(false)
  const [retrying, setRetrying] = useState(false)

  useEffect(() => {
    const handleOnline = () => { setOnline(true); setDismissed(false) }
    const handleOffline = () => { setOnline(false); setDismissed(false) }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    setOnline(navigator.onLine)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const retry = async () => {
    setRetrying(true)
    setDismissed(false)
    await new Promise(r => setTimeout(r, 1000))
    window.location.reload()
  }

  if (dismissed) return null

  // Offline
  if (!online) return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gray-900 text-white px-4 py-3 flex items-center gap-3">
      <WifiOff className="w-4 h-4 text-red-400 shrink-0" />
      <span className="text-sm font-medium flex-1">
        You're offline. Check your internet connection — the site is using cached data.
      </span>
      <button onClick={retry} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors">
        <RefreshCw className="w-3 h-3" /> Retry
      </button>
      <button onClick={() => setDismissed(true)} className="text-white/50 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  )


  return null
}