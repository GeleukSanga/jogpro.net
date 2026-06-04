'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Sample { id: string; product_name: string; status: string; resi?: string }
interface Claim { id: string; video_url: string; views_count: number; status: string; commission_amount?: number; created_at: string }
interface AffiliatorData { full_name: string; tiktok_username: string; status: string; samples: Sample[]; claims: Claim[]; total_komisi: number }

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending: { label: '⏳ Pending', color: '#f59e0b' },
  approved: { label: '✅ Approved', color: '#10b981' },
  rejected: { label: '❌ Ditolak', color: '#ef4444' },
  paid: { label: '💸 Dibayar', color: '#8B5CF6' },
  requested: { label: '📦 Diproses', color: '#6b7280' },
  packed: { label: '📦 Dikemas', color: '#f59e0b' },
  shipped: { label: '🚚 Dikirim', color: '#3b82f6' },
  delivered: { label: '✅ Diterima', color: '#10b981' },
}

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<AffiliatorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [claimForm, setClaimForm] = useState({ video_url: '', views_count: '' })
  const [claimLoading, setClaimLoading] = useState(false)
  const [claimError, setClaimError] = useState('')
  const [claimSuccess, setClaimSuccess] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('affiliator_token')
    if (!token) { router.push('/affiliator/login'); return }
    fetch('/api/affiliator/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { localStorage.removeItem('affiliator_token'); router.push('/affiliator/login') })
  }, [router])

  async function submitClaim(e: React.FormEvent) {
    e.preventDefault()
    setClaimLoading(true)
    setClaimError('')
    setClaimSuccess('')
    const token = localStorage.getItem('affiliator_token')
    try {
      const res = await fetch('/api/affiliator/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ video_url: claimForm.video_url, views_count: parseInt(claimForm.views_count) })
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      setClaimSuccess(`Klaim berhasil! Estimasi komisi: Rp${d.commission_amount?.toLocaleString('id')}`)
      setClaimForm({ video_url: '', views_count: '' })
      // Refresh data
      fetch('/api/affiliator/me', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setData)
    } catch (e: unknown) {
      setClaimError(e instanceof Error ? e.message : 'Gagal submit klaim')
    } finally {
      setClaimLoading(false)
    }
  }

  function logout() { localStorage.removeItem('affiliator_token'); router.push('/affiliator/login') }

  const estimasi = claimForm.views_count ? Math.floor(parseInt(claimForm.views_count) / 1000) * 5000 : 0

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0a0a,#1a0533,#0a0a0a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#a78bfa', fontSize: 18 }}>⏳ Memuat dashboard...</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0a0a,#1a0533,#0a0a0a)', padding: '0 0 48px' }}>
      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 18 }}>{data?.full_name[0]}</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Halo, {data?.full_name?.split(' ')[0]}! 👋</div>
            <div style={{ color: '#10b981', fontSize: 12, fontWeight: 600 }}>✅ Affiliator Aktif • @{data?.tiktok_username}</div>
          </div>
        </div>
        <button onClick={logout} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '8px 16px', color: '#fca5a5', fontSize: 14, cursor: 'pointer' }}>Logout</button>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px', display: 'grid', gap: 20 }}>
        {/* Total Komisi */}
        <div style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.2),rgba(236,72,153,0.2))', border: '1px solid rgba(139,92,246,0.4)', borderRadius: 20, padding: '24px', textAlign: 'center' }}>
          <div style={{ color: '#c4b5fd', fontSize: 14, marginBottom: 8 }}>💰 Total Komisi Approved</div>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: 36 }}>Rp{data?.total_komisi?.toLocaleString('id') || '0'}</div>
        </div>

        {/* Sampel */}
        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '24px' }}>
          <h3 style={{ color: '#fff', fontWeight: 800, marginBottom: 16, fontSize: 18 }}>🎁 Sampel Saya</h3>
          {data?.samples?.length === 0 ? <p style={{ color: '#6b7280' }}>Belum ada sampel</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {data?.samples?.map((s: Sample) => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '12px 16px' }}>
                  <span style={{ color: '#e5e7eb', fontWeight: 600 }}>{s.product_name}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{ color: STATUS_LABEL[s.status]?.color || '#fff', fontSize: 13, fontWeight: 600 }}>{STATUS_LABEL[s.status]?.label || s.status}</span>
                    {s.resi && <span style={{ color: '#9ca3af', fontSize: 12 }}>Resi: {s.resi}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Klaim Views */}
        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '24px' }}>
          <h3 style={{ color: '#fff', fontWeight: 800, marginBottom: 16, fontSize: 18 }}>📊 Klaim Views Baru</h3>
          <form onSubmit={submitClaim}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#c4b5fd', fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 8 }}>Link Video TikTok/Instagram</label>
              <input value={claimForm.video_url} onChange={e => setClaimForm({ ...claimForm, video_url: e.target.value })} placeholder="https://tiktok.com/@kamu/video/..." required
                style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#c4b5fd', fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 8 }}>Jumlah Views (min. 1.000)</label>
              <input type="number" value={claimForm.views_count} onChange={e => setClaimForm({ ...claimForm, views_count: e.target.value })} placeholder="Contoh: 5000" min="1000" required
                style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            {estimasi > 0 && <div style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
              <span style={{ color: '#c4b5fd', fontSize: 14 }}>💰 Estimasi komisi: </span>
              <strong style={{ color: '#fff', fontSize: 16 }}>Rp{estimasi.toLocaleString('id')}</strong>
            </div>}
            {claimError && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 10, padding: '10px 14px', color: '#fca5a5', fontSize: 14, marginBottom: 12 }}>{claimError}</div>}
            {claimSuccess && <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 10, padding: '10px 14px', color: '#6ee7b7', fontSize: 14, marginBottom: 12 }}>{claimSuccess}</div>}
            <button type="submit" disabled={claimLoading} style={{ width: '100%', padding: '14px', background: claimLoading ? 'rgba(139,92,246,0.4)' : 'linear-gradient(135deg,#8B5CF6,#EC4899)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 16, fontWeight: 700, cursor: claimLoading ? 'not-allowed' : 'pointer' }}>
              {claimLoading ? '⏳ Mengirim...' : '📤 Submit Klaim'}
            </button>
          </form>
        </div>

        {/* Riwayat Klaim */}
        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '24px' }}>
          <h3 style={{ color: '#fff', fontWeight: 800, marginBottom: 16, fontSize: 18 }}>📋 Riwayat Klaim</h3>
          {data?.claims?.length === 0 ? <p style={{ color: '#6b7280' }}>Belum ada klaim</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data?.claims?.map((c: Claim) => (
                <div key={c.id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <a href={c.video_url} target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa', fontSize: 13, textDecoration: 'none' }}>🔗 Lihat Video</a>
                    <span style={{ color: STATUS_LABEL[c.status]?.color || '#fff', fontSize: 13, fontWeight: 600 }}>{STATUS_LABEL[c.status]?.label || c.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <span style={{ color: '#9ca3af', fontSize: 13 }}>👁️ {c.views_count?.toLocaleString('id')} views</span>
                    {c.commission_amount && <span style={{ color: '#10b981', fontSize: 13, fontWeight: 600 }}>💰 Rp{c.commission_amount?.toLocaleString('id')}</span>}
                    <span style={{ color: '#6b7280', fontSize: 12 }}>{new Date(c.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
