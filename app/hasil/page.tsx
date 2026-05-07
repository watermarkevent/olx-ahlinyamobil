'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Hasil, { HasilData } from '@/components/screens/Hasil'
import LoadingScreen from '@/components/screens/LoadingScreen'

const KIOSK_COUNTDOWN_SEC = 15

function HasilInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const src = searchParams.get('src') ?? ''

  const [hasil, setHasil] = useState<HasilData | null>(null)
  const [waSending, setWaSending] = useState(false)
  const [waSent, setWaSent] = useState(false)
  const [countdown, setCountdown] = useState(KIOSK_COUNTDOWN_SEC)
  const [countdownActive, setCountdownActive] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('hasilData')
    if (!raw) { router.replace('/'); return }
    const parsed = JSON.parse(raw) as HasilData & { source?: string }
    setHasil(parsed)
    // Start countdown after a short delay so user can read
    const t = setTimeout(() => setCountdownActive(true), 5000)
    return () => clearTimeout(t)
  }, [router])

  // Countdown tick
  useEffect(() => {
    if (!countdownActive) return
    if (countdown <= 0) {
      sessionStorage.removeItem('hasilData')
      const dest = src ? `/?src=${encodeURIComponent(src)}` : '/'
      router.replace(dest)
      return
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdownActive, countdown, router, src])

  const handleSendWA = async () => {
    if (!hasil || waSent) return
    setWaSending(true)
    try {
      await fetch('/api/send-wa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hasil),
      })
      setWaSent(true)
    } catch {
      setWaSent(true)
    } finally {
      setWaSending(false)
    }
  }

  const handleReset = () => {
    sessionStorage.removeItem('hasilData')
    const dest = src ? `/?src=${encodeURIComponent(src)}` : '/'
    router.replace(dest)
  }

  if (!hasil) return <LoadingScreen />

  return (
    <Hasil
      hasil={hasil}
      onSendWA={handleSendWA}
      waSending={waSending}
      waSent={waSent}
      countdown={countdownActive ? countdown : null}
      onReset={handleReset}
    />
  )
}

export default function HasilPage() {
  return (
    <Suspense>
      <HasilInner />
    </Suspense>
  )
}
