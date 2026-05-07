'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormData, INITIAL_FORM } from '@/lib/formState'
import { PROFILING_QUESTIONS } from '@/lib/formConfig'
import DataAwal from '@/components/screens/DataAwal'
import PunyaMobil from '@/components/screens/PunyaMobil'
import TujuanScreen from '@/components/screens/TujuanScreen'
import DataKendaraan from '@/components/screens/DataKendaraan'
import ProfilingStep from '@/components/screens/ProfilingStep'
import TawarRekomendasiScreen from '@/components/screens/TawarRekomendasiScreen'
import LoadingScreen from '@/components/screens/LoadingScreen'

const S = {
  DATA_AWAL: 0,
  PUNYA_MOBIL: 1,
  TUJUAN: 2,
  DATA_KENDARAAN: 3,
  PROFILING: 4,
  VALUATION_RESULT: 5,
  LOADING: 99,
} as const

interface HistoryEntry { screen: number; profilingIndex: number }

function genSessionId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function FormInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const src = searchParams.get('src') ?? ''

  const [screen, setScreen] = useState<number>(S.DATA_AWAL)
  const [data, setData] = useState<FormData>(INITIAL_FORM)
  const [profilingIndex, setProfilingIndex] = useState(0)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [pendingValuation, setPendingValuation] = useState<{ min: number; max: number } | null>(null)

  const sessionId = useRef(genSessionId())
  const startedTracked = useRef(false)

  useEffect(() => { sessionStorage.removeItem('hasilData') }, [])

  // Track form_started once on mount
  useEffect(() => {
    if (startedTracked.current) return
    startedTracked.current = true
    trackEvent('form_started')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const trackEvent = (eventType: string, metadata?: Record<string, unknown>) => {
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sessionId.current, source: src || null, eventType, metadata }),
    }).catch(() => {})
  }

  const patch = (p: Partial<FormData>) => setData((d) => ({ ...d, ...p }))

  const push = (nextScreen: number, nextPi?: number) => {
    setHistory((h) => [...h, { screen, profilingIndex }])
    setScreen(nextScreen)
    if (nextPi !== undefined) setProfilingIndex(nextPi)
  }

  const goBack = () => {
    if (!history.length) return
    const prev = history[history.length - 1]
    setScreen(prev.screen)
    setProfilingIndex(prev.profilingIndex)
    setHistory((h) => h.slice(0, -1))
  }

  // Dynamic profiling: skip kidsCount unless married with kids
  const activeQuestions = PROFILING_QUESTIONS.filter((q) => {
    if (q.id === 'kidsCount') return data.familyStatus === 'Menikah, anak masih kecil / sekolah'
    return true
  })

  // ── Progress bar ─────────────────────────────────────────────

  const stepNumber = () => {
    if (screen === S.DATA_AWAL) return 1
    if (screen === S.PUNYA_MOBIL) return 2
    if (screen === S.TUJUAN) return 3
    const base = data.hasCar ? 4 : 3
    if (screen === S.DATA_KENDARAAN) return base
    if (screen === S.PROFILING) {
      const carOffset = (data.tujuan === 'harga' || data.tujuan === 'tradein') ? 1 : 0
      return base + carOffset + profilingIndex
    }
    return 1
  }

  const totalSteps = () => {
    if (!data.hasCar) return 2 + activeQuestions.length
    if (data.tujuan === 'harga') return 4
    if (data.tujuan === 'rekomendasi') return 3 + activeQuestions.length
    return 4 + activeQuestions.length
  }

  // ── Navigation ───────────────────────────────────────────────

  const onPunyaMobilSelect = (hasCar: boolean) => {
    if (hasCar) push(S.TUJUAN)
    else push(S.PROFILING, 0)
  }

  const onTujuanSelect = (tujuan: 'harga' | 'rekomendasi' | 'tradein') => {
    if (tujuan === 'harga' || tujuan === 'tradein') push(S.DATA_KENDARAAN)
    else push(S.PROFILING, 0)
  }

  const onDataKendaraanNext = () => {
    if (data.tujuan === 'harga') {
      setScreen(S.LOADING)
      runValuationOnly(data)
    } else {
      push(S.PROFILING, 0)
    }
  }

  const onProfilingNext = (currentData: FormData) => {
    const nextIndex = profilingIndex + 1
    if (nextIndex >= activeQuestions.length) {
      setScreen(S.LOADING)
      runFullAnalysis(currentData)
    } else {
      push(S.PROFILING, nextIndex)
    }
  }

  // User says "Ya, coba rekomendasi" after seeing valuation
  const onWantRecommendation = () => {
    patch({ tujuan: 'tradein' })
    push(S.PROFILING, 0)
  }

  // User says "Tidak, sudah cukup" — save lead + go to hasil
  const onNoRecommendation = async () => {
    if (!pendingValuation) return
    await saveLead(data, pendingValuation, null)
    trackEvent('form_completed', { tujuan: 'harga' })
    sessionStorage.setItem('hasilData', JSON.stringify({
      nama: data.nama,
      whatsapp: data.whatsapp,
      tujuan: 'harga',
      hasCar: true,
      carBrand: data.carBrand,
      carModel: data.carModel,
      carYear: data.carYear,
      valuationMin: pendingValuation.min,
      valuationMax: pendingValuation.max,
      source: src || null,
    }))
    router.push(src ? `/hasil?src=${encodeURIComponent(src)}` : '/hasil')
  }

  // ── API calls ────────────────────────────────────────────────

  async function runValuationOnly(d: FormData) {
    try {
      const res = await fetch('/api/valuate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: d.carBrand, model: d.carModel,
          year: parseInt(d.carYear),
          transmission: d.carTransmission, condition: d.carCondition,
        }),
      })
      const val = await res.json()
      setPendingValuation(val)
      setScreen(S.VALUATION_RESULT)
    } catch {
      router.push('/')
    }
  }

  async function runFullAnalysis(d: FormData) {
    const needsCar = d.hasCar === true && (d.tujuan === 'tradein')

    try {
      const [valuateRes, recommendRes] = await Promise.all([
        needsCar
          ? fetch('/api/valuate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                brand: d.carBrand, model: d.carModel,
                year: parseInt(d.carYear),
                transmission: d.carTransmission, condition: d.carCondition,
              }),
            })
          : Promise.resolve(null),
        fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            job: d.job, hobbies: d.hobbies, incomeRange: d.incomeRange,
            familyStatus: d.familyStatus, kidsCount: d.kidsCount,
            carUsage: d.carUsage, carPriority: d.carPriority,
          }),
        }),
      ])

      const valuationData = valuateRes
        ? await valuateRes.json()
        : (pendingValuation ?? null)
      const recommendData = await recommendRes.json()

      await saveLead(d, valuationData, recommendData)
      trackEvent('form_completed', { tujuan: d.tujuan, archetype: recommendData?.dominantArchetype })

      const gapAmount = valuationData && recommendData
        ? Math.max(0, recommendData.primary.priceMin - valuationData.max)
        : recommendData?.primary?.priceMin ?? 0

      sessionStorage.setItem('hasilData', JSON.stringify({
        nama: d.nama,
        whatsapp: d.whatsapp,
        tujuan: d.tujuan,
        hasCar: d.hasCar,
        carBrand: d.carBrand,
        carModel: d.carModel,
        carYear: d.carYear,
        valuationMin: valuationData?.min,
        valuationMax: valuationData?.max,
        primaryBrand: recommendData?.primary?.brand,
        primaryModel: recommendData?.primary?.model,
        primaryPriceMin: recommendData?.primary?.priceMin,
        altBrand: recommendData?.alternative?.brand,
        altModel: recommendData?.alternative?.model,
        altPriceMin: recommendData?.alternative?.priceMin,
        gapAmount,
        dominantArchetype: recommendData?.dominantArchetype,
        narrative: recommendData?.narrative ?? '',
        source: src || null,
      }))

      router.push(src ? `/hasil?src=${encodeURIComponent(src)}` : '/hasil')
    } catch (err) {
      console.error(err)
      router.push('/')
    }
  }

  async function saveLead(
    d: FormData,
    valuation: { min: number; max: number } | null,
    recommendation: Record<string, unknown> | null
  ) {
    try {
      await fetch('/api/save-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: d, valuation, recommendation, source: src || null }),
      })
    } catch { /* non-blocking */ }
  }

  // ── Render ───────────────────────────────────────────────────

  if (screen === S.LOADING) return <LoadingScreen />

  if (screen === S.VALUATION_RESULT && pendingValuation)
    return (
      <TawarRekomendasiScreen
        nama={data.nama}
        carBrand={data.carBrand}
        carModel={data.carModel}
        carYear={data.carYear}
        valuationMin={pendingValuation.min}
        valuationMax={pendingValuation.max}
        onYes={onWantRecommendation}
        onNo={onNoRecommendation}
      />
    )

  const step = stepNumber()
  const total = totalSteps()

  if (screen === S.DATA_AWAL)
    return <DataAwal data={data} onChange={patch} onNext={() => push(S.PUNYA_MOBIL)} step={step} totalSteps={total} />

  if (screen === S.PUNYA_MOBIL)
    return <PunyaMobil data={data} onChange={patch} onSelect={onPunyaMobilSelect} onBack={goBack} step={step} totalSteps={total} />

  if (screen === S.TUJUAN)
    return <TujuanScreen data={data} onChange={patch} onSelect={onTujuanSelect} onBack={goBack} step={step} totalSteps={total} />

  if (screen === S.DATA_KENDARAAN)
    return <DataKendaraan data={data} onChange={patch} onNext={onDataKendaraanNext} onBack={goBack} step={step} totalSteps={total} />

  if (screen === S.PROFILING) {
    const q = activeQuestions[profilingIndex]
    return (
      <ProfilingStep
        question={q}
        data={data}
        onChange={patch}
        onNext={() => onProfilingNext(data)}
        onBack={goBack}
        step={step}
        totalSteps={total}
      />
    )
  }

  return null
}

export default function FormPage() {
  return (
    <Suspense>
      <FormInner />
    </Suspense>
  )
}
