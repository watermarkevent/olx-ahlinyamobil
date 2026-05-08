'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Hasil, { HasilData } from '@/components/screens/Hasil'
import LoadingScreen from '@/components/screens/LoadingScreen'

function HasilInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const src = searchParams.get('src') ?? ''

  const [hasil, setHasil] = useState<HasilData | null>(null)
  const [waSending, setWaSending] = useState(false)
  const [waSent, setWaSent] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('hasilData')
    if (!raw) { router.replace('/'); return }
    setHasil(JSON.parse(raw) as HasilData)
  }, [router])

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
    router.replace(src ? `/?src=${encodeURIComponent(src)}` : '/')
  }

  if (!hasil) return <LoadingScreen />

  return (
    <Hasil
      hasil={hasil}
      onSendWA={handleSendWA}
      waSending={waSending}
      waSent={waSent}
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
