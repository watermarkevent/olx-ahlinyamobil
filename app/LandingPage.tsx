'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, Suspense } from 'react'
import Landing from '@/components/screens/Landing'
import AttractScreen from '@/components/screens/AttractScreen'

const IDLE_TIMEOUT_MS = 60_000 // 60 seconds of inactivity

function LandingInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const src = searchParams.get('src') ?? ''
  const [showAttract, setShowAttract] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetIdle = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setShowAttract(true), IDLE_TIMEOUT_MS)
  }

  useEffect(() => {
    resetIdle()
    const events = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart']
    events.forEach((e) => window.addEventListener(e, resetIdle, { passive: true }))
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      events.forEach((e) => window.removeEventListener(e, resetIdle))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleStart = () => {
    const dest = src ? `/form?src=${encodeURIComponent(src)}` : '/form'
    router.push(dest)
  }

  if (showAttract) {
    return (
      <AttractScreen
        onTap={() => {
          setShowAttract(false)
          resetIdle()
        }}
      />
    )
  }

  return <Landing onStart={handleStart} />
}

export default function LandingPage() {
  return (
    <Suspense>
      <LandingInner />
    </Suspense>
  )
}
