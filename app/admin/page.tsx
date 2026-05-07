'use client'

import { useState, useEffect, useCallback } from 'react'

interface StatsData {
  totalLeads: number
  todayLeads: number
  sourceBreakdown: Record<string, number>
  qualityBreakdown: { HOT: number; WARM: number; COLD: number }
  archetypeBreakdown: Record<string, number>
  last7Days: { date: string; count: number }[]
  funnel: { started: number; completed: number }
  recentLeads: {
    id: string
    created_at: string
    source: string
    lead_quality: string
    nama: string
    whatsapp: string
    car_brand: string | null
    car_model: string | null
    car_year: number | null
    dominant_archetype: string | null
    income_range: string | null
  }[]
}

const QUALITY_COLOR = {
  HOT: '#EF4444',
  WARM: '#F97316',
  COLD: '#6B7280',
}

const ARCHETYPE_LABEL: Record<string, string> = {
  URBAN: 'City Driver',
  FAMILY: 'Family First',
  ADVENTURE: 'Adventure Seeker',
  PREMIUM: 'Premium Taste',
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)

  const fetchStats = useCallback(async (pw: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-admin-password': pw },
      })
      if (res.status === 401) {
        setAuthError('Password salah.')
        setAuthed(false)
        return
      }
      const data = await res.json()
      setStats(data)
      setAuthed(true)
      setAuthError('')
    } catch {
      setAuthError('Gagal memuat data.')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    fetchStats(password)
  }

  const handleExport = async () => {
    setExportLoading(true)
    try {
      const res = await fetch('/api/admin/export', {
        headers: { 'x-admin-password': password },
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Export gagal.')
    } finally {
      setExportLoading(false)
    }
  }

  // Auto-refresh every 60s when authed
  useEffect(() => {
    if (!authed) return
    const t = setInterval(() => fetchStats(password), 60_000)
    return () => clearInterval(t)
  }, [authed, password, fetchStats])

  // ── Login screen ─────────────────────────────────────────────
  if (!authed) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-dvh px-6"
        style={{ background: 'var(--trusted-blue)' }}
      >
        <div className="flex items-center gap-2 mb-8">
          <span className="text-white font-black text-3xl">OLX</span>
          <span
            className="text-sm font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'var(--certified-orange)', color: '#fff' }}
          >
            Mobbi
          </span>
          <span className="text-white font-bold text-lg ml-1">Admin</span>
        </div>
        <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col gap-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-base font-medium outline-none"
            style={{ background: '#fff', color: 'var(--trusted-blue)' }}
            autoFocus
          />
          {authError && (
            <p className="text-sm text-red-400 text-center">{authError}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl text-lg font-black text-white transition-all active:scale-95 disabled:opacity-60"
            style={{ background: 'var(--certified-orange)' }}
          >
            {loading ? 'Memuat...' : 'Masuk'}
          </button>
        </form>
      </div>
    )
  }

  if (!stats) return null

  const maxDay = Math.max(...stats.last7Days.map((d) => d.count), 1)
  const conversionRate = stats.funnel.started > 0
    ? Math.round((stats.funnel.completed / stats.funnel.started) * 100)
    : 0

  return (
    <div className="min-h-dvh pb-12" style={{ background: '#F1F5F9' }}>
      {/* Top bar */}
      <div className="px-5 pt-6 pb-4" style={{ background: 'var(--trusted-blue)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-xl">OLX</span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'var(--certified-orange)', color: '#fff' }}
            >
              Mobbi
            </span>
            <span className="text-white font-bold text-sm ml-1">Admin</span>
          </div>
          <button
            onClick={handleExport}
            disabled={exportLoading}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-60"
            style={{ background: 'var(--certified-orange)' }}
          >
            {exportLoading ? '...' : 'Export CSV'}
          </button>
        </div>
        <p className="text-xs mt-2" style={{ color: '#7A9CC4' }}>
          Auto-refresh setiap 60 detik
        </p>
      </div>

      <div className="px-4 py-5 flex flex-col gap-5">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-4 bg-white">
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#94A3B8' }}>Total Leads</p>
            <p className="text-3xl font-black" style={{ color: 'var(--trusted-blue)' }}>{stats.totalLeads}</p>
          </div>
          <div className="rounded-2xl p-4 bg-white">
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#94A3B8' }}>Hari Ini</p>
            <p className="text-3xl font-black" style={{ color: 'var(--trusted-blue)' }}>{stats.todayLeads}</p>
          </div>
          <div className="rounded-2xl p-4 bg-white">
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#94A3B8' }}>Form Dimulai</p>
            <p className="text-3xl font-black" style={{ color: 'var(--trusted-blue)' }}>{stats.funnel.started}</p>
          </div>
          <div className="rounded-2xl p-4 bg-white">
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#94A3B8' }}>Konversi</p>
            <p className="text-3xl font-black" style={{ color: conversionRate >= 50 ? '#16A34A' : 'var(--certified-orange)' }}>
              {conversionRate}%
            </p>
          </div>
        </div>

        {/* Lead quality */}
        <div className="rounded-2xl p-4 bg-white">
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#94A3B8' }}>Lead Quality</p>
          <div className="flex gap-3 mb-4">
            {(['HOT', 'WARM', 'COLD'] as const).map((q) => (
              <div key={q} className="flex-1 rounded-xl p-3 text-center" style={{ background: `${QUALITY_COLOR[q]}18` }}>
                <p className="text-2xl font-black" style={{ color: QUALITY_COLOR[q] }}>
                  {stats.qualityBreakdown[q]}
                </p>
                <p className="text-xs font-bold mt-0.5" style={{ color: QUALITY_COLOR[q] }}>{q}</p>
              </div>
            ))}
          </div>
          {/* Criteria legend */}
          <div className="rounded-xl p-3 flex flex-col gap-2" style={{ background: '#F8FAFC' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#94A3B8' }}>Kriteria</p>
            <div className="flex items-start gap-2">
              <span className="text-xs font-black px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: '#EF444418', color: '#EF4444' }}>HOT</span>
              <p className="text-xs leading-snug" style={{ color: '#475569' }}>Punya mobil + niat trade-in / cari rekomendasi + income ≥ Rp 10 jt</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs font-black px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: '#F9731618', color: '#F97316' }}>WARM</span>
              <p className="text-xs leading-snug" style={{ color: '#475569' }}>Punya mobil ATAU income ≥ Rp 10 jt (salah satu)</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs font-black px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: '#6B728018', color: '#6B7280' }}>COLD</span>
              <p className="text-xs leading-snug" style={{ color: '#475569' }}>Tidak punya mobil + income &lt; Rp 10 jt</p>
            </div>
          </div>
        </div>

        {/* Per source */}
        <div className="rounded-2xl p-4 bg-white">
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#94A3B8' }}>Per Source</p>
          {Object.keys(stats.sourceBreakdown).length === 0 ? (
            <p className="text-sm" style={{ color: '#94A3B8' }}>Belum ada data</p>
          ) : (
            <div className="flex flex-col gap-2">
              {Object.entries(stats.sourceBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([src, count]) => {
                  const pct = Math.round((count / stats.totalLeads) * 100)
                  return (
                    <div key={src}>
                      <div className="flex justify-between text-sm font-medium mb-1">
                        <span style={{ color: 'var(--trusted-blue)' }}>{src}</span>
                        <span style={{ color: '#64748B' }}>{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: '#E2E8F0' }}>
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ width: `${pct}%`, background: 'var(--trusted-blue)' }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>

        {/* 7-day chart */}
        <div className="rounded-2xl p-4 bg-white">
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#94A3B8' }}>7 Hari Terakhir</p>
          <div className="flex items-end gap-2 h-24">
            {stats.last7Days.map((d) => {
              const heightPct = Math.round((d.count / maxDay) * 100)
              const label = d.date.slice(5) // MM-DD
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold" style={{ color: 'var(--trusted-blue)' }}>
                    {d.count > 0 ? d.count : ''}
                  </span>
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${Math.max(heightPct, 4)}%`,
                      background: d.count > 0 ? 'var(--trusted-blue)' : '#E2E8F0',
                      minHeight: 4,
                    }}
                  />
                  <span className="text-xs" style={{ color: '#94A3B8' }}>{label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Archetype breakdown */}
        {Object.keys(stats.archetypeBreakdown).length > 0 && (
          <div className="rounded-2xl p-4 bg-white">
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#94A3B8' }}>Archetype</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(stats.archetypeBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([arch, count]) => (
                  <div key={arch} className="rounded-xl p-3" style={{ background: 'var(--light-blue)' }}>
                    <p className="text-xl font-black" style={{ color: 'var(--trusted-blue)' }}>{count}</p>
                    <p className="text-xs font-bold mt-0.5" style={{ color: '#64748B' }}>
                      {ARCHETYPE_LABEL[arch] ?? arch}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Recent leads */}
        <div className="rounded-2xl p-4 bg-white">
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#94A3B8' }}>Lead Terbaru</p>
          <div className="flex flex-col gap-3">
            {stats.recentLeads.map((lead) => {
              const q = lead.lead_quality as 'HOT' | 'WARM' | 'COLD'
              const time = new Date(lead.created_at).toLocaleString('id-ID', {
                timeZone: 'Asia/Jakarta',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
              return (
                <div key={lead.id} className="flex items-start gap-3 pb-3 border-b last:border-b-0" style={{ borderColor: '#F1F5F9' }}>
                  <span
                    className="mt-0.5 text-xs font-black px-2 py-1 rounded-lg flex-shrink-0"
                    style={{
                      background: `${QUALITY_COLOR[q] ?? '#6B7280'}18`,
                      color: QUALITY_COLOR[q] ?? '#6B7280',
                    }}
                  >
                    {q}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <p className="font-bold text-sm truncate" style={{ color: 'var(--trusted-blue)' }}>
                        {lead.nama}
                      </p>
                      <span className="text-xs flex-shrink-0" style={{ color: '#94A3B8' }}>{time}</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
                      {lead.source} &middot; {lead.income_range ?? '–'}{lead.dominant_archetype ? ` · ${ARCHETYPE_LABEL[lead.dominant_archetype] ?? lead.dominant_archetype}` : ''}
                    </p>
                    {(lead.car_brand || lead.car_model) && (
                      <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                        {[lead.car_brand, lead.car_model, lead.car_year].filter(Boolean).join(' ')}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <button
          onClick={() => fetchStats(password)}
          disabled={loading}
          className="w-full py-4 rounded-2xl text-base font-bold border-2 transition-all active:scale-95"
          style={{ borderColor: '#CBD5E1', color: '#64748B', background: '#fff' }}
        >
          {loading ? 'Memuat...' : 'Refresh'}
        </button>
      </div>
    </div>
  )
}
