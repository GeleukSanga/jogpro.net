'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

type Sample = { id: string; product_name: string; status: string; resi?: string }
type Claim = {
  id: string
  video_url: string
  views_count: number
  milestone: number
  commission_amount: number
  status: string
  created_at: string
}
type Me = {
  id: string
  username: string
  full_name: string
  whatsapp: string
  city: string
  tiktok_username: string
  tiktok_followers: number
  status: string
  samples: Sample[]
  claims: Claim[]
  total_komisi: number
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-white/10 rounded-xl ${className ?? ''}`} />
}

function formatRp(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID')
}

function truncateUrl(url: string, max = 40) {
  if (url.length <= max) return url
  return url.slice(0, max) + '…'
}

const SAMPLE_STATUS: Record<string, string> = {
  requested: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  sent: 'bg-green-500/20 text-green-300 border-green-500/30',
}

const CLAIM_STATUS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  approved: 'bg-green-500/20 text-green-300 border-green-500/30',
  paid: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
}

function SampleBadge({ status }: { status: string }) {
  const cls = SAMPLE_STATUS[status] ?? 'bg-white/10 text-slate-400 border-white/10'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {status}
    </span>
  )
}

function ClaimBadge({ status }: { status: string }) {
  const cls = CLAIM_STATUS[status] ?? 'bg-white/10 text-slate-400 border-white/10'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {status}
    </span>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [me, setMe] = useState<Me | null>(null)
  const [loadingMe, setLoadingMe] = useState(true)

  const [claimForm, setClaimForm] = useState({ video_url: '', views_count: '', screenshot_url: '' })
  const [claimLoading, setClaimLoading] = useState(false)
  const [claimError, setClaimError] = useState('')
  const [claimSuccess, setClaimSuccess] = useState<{ earned: number } | null>(null)

  async function fetchMe() {
    const token = localStorage.getItem('affiliator_token')
    try {
      const res = await fetch('/api/affiliator/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) { router.push('/affiliator/login'); return }
      const data = await res.json()
      setMe(data)
    } finally {
      setLoadingMe(false)
    }
  }

  useEffect(() => {
    if (!localStorage.getItem('affiliator_token')) {
      router.push('/affiliator/login')
      return
    }
    fetchMe()
  }, [])

  function logout() {
    localStorage.removeItem('affiliator_token')
    localStorage.removeItem('affiliator_name')
    router.push('/affiliator/login')
  }

  async function submitClaim(e: React.FormEvent) {
    e.preventDefault()
    setClaimError('')
    setClaimSuccess(null)
    setClaimLoading(true)
    const token = localStorage.getItem('affiliator_token')
    try {
      const body: Record<string, string | number> = {
        video_url: claimForm.video_url,
        views_count: Number(claimForm.views_count),
      }
      if (claimForm.screenshot_url) body.screenshot_url = claimForm.screenshot_url
      const res = await fetch('/api/affiliator/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      if (res.status === 401) { router.push('/affiliator/login'); return }
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal submit claim')
      setClaimSuccess({ earned: data.commission_amount ?? data.earned ?? 0 })
      setClaimForm({ video_url: '', views_count: '', screenshot_url: '' })
      fetchMe()
    } catch (err: unknown) {
      setClaimError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setClaimLoading(false)
    }
  }

  const totalViews = me?.claims.reduce((s, c) => s + c.views_count, 0) ?? 0
  const pendingClaims = me?.claims.filter(c => c.status === 'pending').length ?? 0

  return (
    <div className="min-h-screen bg-[#0F172A] text-white overflow-x-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold tracking-[0.3em] text-blue-400 uppercase">Jogpro Creator Program</span>
            {loadingMe ? (
              <Skeleton className="h-8 w-52 mt-2" />
            ) : (
              <h1 className="mt-1 text-2xl font-black">
                Halo,{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {me?.full_name}
                </span>{' '}
                👋
              </h1>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={logout}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-white/10 bg-white/5 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all"
          >
            Logout
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Komisi', icon: '💰', value: loadingMe ? null : formatRp(me?.total_komisi ?? 0), grad: 'from-blue-600/20 to-purple-600/20 border-blue-500/20' },
            { label: 'Pending Claims', icon: '⏳', value: loadingMe ? null : String(pendingClaims), grad: 'from-yellow-600/20 to-orange-600/20 border-yellow-500/20' },
            { label: 'Total Views', icon: '👁️', value: loadingMe ? null : totalViews.toLocaleString('id-ID'), grad: 'from-green-600/20 to-teal-600/20 border-green-500/20' },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className={`rounded-2xl border bg-gradient-to-br ${card.grad} backdrop-blur p-5`}
            >
              <div className="text-2xl mb-2">{card.icon}</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{card.label}</div>
              {card.value === null
                ? <Skeleton className="h-7 w-28" />
                : <div className="text-xl font-black text-white">{card.value}</div>
              }
            </motion.div>
          ))}
        </div>

        {/* Sampel produk */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6"
        >
          <h2 className="text-base font-bold mb-4">📦 Sampel Produk</h2>
          {loadingMe ? (
            <div className="space-y-2">
              {[1, 2].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : !me?.samples.length ? (
            <p className="text-sm text-slate-500">Belum ada sampel yang diminta.</p>
          ) : (
            <div className="space-y-2">
              {me.samples.map(s => (
                <div key={s.id} className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                  <span className="text-sm font-medium text-white">{s.product_name}</span>
                  <SampleBadge status={s.status} />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Claim form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34 }}
          className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6"
        >
          <h2 className="text-base font-bold mb-1">🎯 Klaim Komisi Views</h2>
          <p className="text-xs text-slate-400 mb-5">Rp 2.500 per kelipatan 500 views</p>

          <AnimatePresence>
            {claimSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-2xl bg-green-500/10 border border-green-500/30 p-5 mb-5 text-center"
              >
                <div className="text-3xl mb-2">🎉</div>
                <div className="font-bold text-green-400">Claim berhasil!</div>
                <div className="text-sm text-slate-300 mt-1">
                  Kamu mendapatkan <span className="font-bold text-white">{formatRp(claimSuccess.earned)}</span>
                </div>
                <button
                  onClick={() => setClaimSuccess(null)}
                  className="mt-3 text-xs text-slate-500 hover:text-slate-300 transition"
                >
                  Tutup
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={submitClaim} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">URL Video TikTok</label>
              <input
                type="url"
                placeholder="https://tiktok.com/@user/video/..."
                value={claimForm.video_url}
                onChange={e => setClaimForm(p => ({ ...p, video_url: e.target.value }))}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Jumlah Views</label>
              <input
                type="number"
                placeholder="Contoh: 1500"
                value={claimForm.views_count}
                onChange={e => setClaimForm(p => ({ ...p, views_count: e.target.value }))}
                required
                min={500}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                URL Screenshot <span className="text-slate-500 normal-case font-normal">(opsional)</span>
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={claimForm.screenshot_url}
                onChange={e => setClaimForm(p => ({ ...p, screenshot_url: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition text-sm"
              />
            </div>

            <AnimatePresence>
              {claimError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3"
                >
                  ⚠️ {claimError}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={claimLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
            >
              {claimLoading ? '⏳ Memproses...' : '💸 Submit Claim'}
            </motion.button>
          </form>
        </motion.div>

        {/* Claims history */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6"
        >
          <h2 className="text-base font-bold mb-4">📋 Riwayat Claim</h2>

          {loadingMe ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : !me?.claims.length ? (
            <p className="text-sm text-slate-500">Belum ada riwayat claim.</p>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-white/10">
                      <th className="text-left py-3 pr-4 font-semibold">Video</th>
                      <th className="text-right py-3 pr-4 font-semibold">Views</th>
                      <th className="text-right py-3 pr-4 font-semibold">Milestone</th>
                      <th className="text-right py-3 pr-4 font-semibold">Komisi</th>
                      <th className="text-center py-3 pr-4 font-semibold">Status</th>
                      <th className="text-right py-3 font-semibold">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {me.claims.map(c => (
                      <tr key={c.id} className="hover:bg-white/5 transition">
                        <td className="py-3 pr-4">
                          <a
                            href={c.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition font-medium"
                            title={c.video_url}
                          >
                            {truncateUrl(c.video_url)}
                          </a>
                        </td>
                        <td className="py-3 pr-4 text-right text-slate-300">{c.views_count.toLocaleString('id-ID')}</td>
                        <td className="py-3 pr-4 text-right text-slate-300">{c.milestone.toLocaleString('id-ID')}</td>
                        <td className="py-3 pr-4 text-right font-semibold text-white">{formatRp(c.commission_amount)}</td>
                        <td className="py-3 pr-4 text-center"><ClaimBadge status={c.status} /></td>
                        <td className="py-3 text-right text-slate-400 text-xs">
                          {new Date(c.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {me.claims.map(c => (
                  <div key={c.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <a
                        href={c.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium break-all"
                      >
                        {truncateUrl(c.video_url, 32)}
                      </a>
                      <ClaimBadge status={c.status} />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span>Views: <span className="text-white font-semibold">{c.views_count.toLocaleString('id-ID')}</span></span>
                      <span>Milestone: <span className="text-white font-semibold">{c.milestone.toLocaleString('id-ID')}</span></span>
                      <span>Komisi: <span className="text-white font-semibold">{formatRp(c.commission_amount)}</span></span>
                      <span>{new Date(c.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>

        <p className="text-center text-xs text-slate-600 pb-8">
          Butuh bantuan? Hubungi kami via WhatsApp
        </p>
      </div>
    </div>
  )
}
