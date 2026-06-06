'use client'
import { useEffect, useState } from 'react'

interface Sample { product_name: string; status: string }
interface Affiliator { id: string; full_name: string; whatsapp: string; city: string; tiktok_username: string; tiktok_followers: number; tiktok_url?: string; instagram_url?: string; created_at: string; affiliator_samples: Sample[] }
interface Claim { id: string; video_url: string; views_count: number; status: string; commission_amount?: number; created_at: string; affiliators: { full_name: string; tiktok_username: string } }
interface Summary { id: string; full_name: string; tiktok_username: string; totalViews: number; totalKomisi: number; totalPaid: number; pending: number }

export default function AdminAffiliatorPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [adminToken, setAdminToken] = useState('')
  const [tab, setTab] = useState<'pending' | 'claims' | 'summary'>('pending')
  const [affiliators, setAffiliators] = useState<Affiliator[]>([])
  const [claims, setClaims] = useState<Claim[]>([])
  const [summary, setSummary] = useState<Summary[]>([])
  const [modal, setModal] = useState<{ username: string; password: string } | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token')
    if (token) { setAdminToken(token); setAuthed(true) }
  }, [])

  useEffect(() => {
    if (!authed) return
    if (tab === 'pending') fetchAffiliators()
    if (tab === 'claims') fetchClaims()
    if (tab === 'summary') fetchSummary()
  }, [authed, tab])

  async function fetchAffiliators() {
    try {
      const r = await fetch('/api/admin/affiliators?status=pending', { headers: { 'x-admin-key': adminToken } })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Gagal fetch')
      setAffiliators(Array.isArray(data) ? data : [])
    } catch (e) { console.error('fetchAffiliators:', e) }
  }

  async function fetchClaims() {
    try {
      const r = await fetch('/api/admin/claims?status=pending', { headers: { 'x-admin-key': adminToken } })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Gagal fetch')
      setClaims(Array.isArray(data) ? data : [])
    } catch (e) { console.error('fetchClaims:', e) }
  }

  async function fetchSummary() {
    try {
      const r = await fetch('/api/admin/summary', { headers: { 'x-admin-key': adminToken } })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Gagal fetch')
      setSummary(Array.isArray(data) ? data : [])
    } catch (e) { console.error('fetchSummary:', e) }
  }

  async function login() {
    setPwLoading(true); setPwError('')
    try {
      const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) })
      const d = await r.json()
      if (!r.ok || !d.success) { setPwError(d.error || 'Password salah'); setPwLoading(false); return }
      sessionStorage.setItem('admin_token', d.token)
      setAdminToken(d.token); setAuthed(true)
    } catch { setPwError('Gagal koneksi ke server') }
    setPwLoading(false)
  }

  async function approve(id: string) {
    setLoadingId(id)
    const r = await fetch('/api/admin/approve', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-key': adminToken }, body: JSON.stringify({ affiliator_id: id }) })
    const d = await r.json()
    setLoadingId(null)
    if (d.success) { setModal({ username: d.username, password: d.password }); fetchAffiliators() }
    else alert('Error: ' + d.error)
  }

  async function reject(id: string) {
    if (!confirm('Yakin reject affiliator ini?')) return
    setLoadingId(id)
    await fetch('/api/admin/reject', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-key': adminToken }, body: JSON.stringify({ affiliator_id: id }) })
    setLoadingId(null)
    fetchAffiliators()
  }

  async function reviewClaim(id: string, action: 'approve' | 'reject') {
    setLoadingId(id)
    await fetch('/api/admin/claim-review', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-key': adminToken }, body: JSON.stringify({ claim_id: id, action }) })
    setLoadingId(null)
    fetchClaims()
  }

  if (!authed) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0a0a,#1a0533)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 32, width: '100%', maxWidth: 360 }}>
        <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 24, textAlign: 'center', marginBottom: 24 }}>🔒 Admin Login</h2>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} placeholder="Password admin"
          style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 16, outline: 'none', boxSizing: 'border-box', marginBottom: 12 }} />
        {pwError && <div style={{ color: '#fca5a5', fontSize: 14, marginBottom: 12 }}>{pwError}</div>}
        <button onClick={login} disabled={pwLoading} style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 16, cursor: pwLoading ? 'wait' : 'pointer', opacity: pwLoading ? 0.7 : 1 }}>{pwLoading ? 'Memeriksa...' : 'Masuk'}</button>
      </div>
    </div>
  )

  const card = { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '20px', marginBottom: 12 }
  const btnGreen = { background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 8, padding: '8px 16px', color: '#6ee7b7', fontSize: 14, fontWeight: 600, cursor: 'pointer' }
  const btnRed = { background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 8, padding: '8px 16px', color: '#fca5a5', fontSize: 14, fontWeight: 600, cursor: 'pointer' }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0a0a,#1a0533)', padding: '24px 16px' }}>
      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '1rem' }}>
          <div style={{ background: '#1a0533', border: '1px solid rgba(139,92,246,0.5)', borderRadius: 20, padding: 32, maxWidth: 400, width: '100%' }}>
            <h3 style={{ color: '#fff', fontWeight: 800, marginBottom: 16, fontSize: 20 }}>✅ Affiliator Diapprove!</h3>
            <p style={{ color: '#9ca3af', marginBottom: 20, fontSize: 14 }}>Bagikan kredensial ini ke affiliator. Password hanya tampil sekali!</p>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '16px', marginBottom: 20 }}>
              <div style={{ color: '#c4b5fd', fontSize: 14, marginBottom: 4 }}>Username:</div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 20, marginBottom: 12 }}>{modal.username}</div>
              <div style={{ color: '#c4b5fd', fontSize: 14, marginBottom: 4 }}>Password:</div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>{modal.password}</div>
            </div>
            <button onClick={() => setModal(null)} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Tutup</button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 24, marginBottom: 24 }}>🛠️ Admin Affiliator Panel</h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[['pending', '👥 Pendaftar Baru'], ['claims', '📊 Klaim Views'], ['summary', '💰 Rekap Komisi']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key as 'pending' | 'claims' | 'summary')}
              style={{ padding: '10px 18px', borderRadius: 10, border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', background: tab === key ? 'linear-gradient(135deg,#8B5CF6,#EC4899)' : 'rgba(255,255,255,0.08)', color: '#fff' }}>{label}</button>
          ))}
        </div>

        {/* Pending Tab */}
        {tab === 'pending' && (
          affiliators.length === 0 ? <p style={{ color: '#6b7280' }}>Tidak ada pendaftar baru</p> :
          affiliators.map((a: Affiliator) => (
            <div key={a.id} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>{a.full_name}</div>
                  <div style={{ color: '#9ca3af', fontSize: 13 }}>{a.city} • WA: {a.whatsapp}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button disabled={loadingId === a.id} onClick={() => approve(a.id)} style={btnGreen}>{loadingId === a.id ? '...' : '✅ Approve'}</button>
                  <button disabled={loadingId === a.id} onClick={() => reject(a.id)} style={btnRed}>❌ Reject</button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
                <span style={{ color: '#a78bfa', fontSize: 14 }}>🎵 @{a.tiktok_username} ({a.tiktok_followers?.toLocaleString('id')} followers)</span>
                {a.tiktok_url && <a href={a.tiktok_url} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', fontSize: 13 }}>🔗 Profil TikTok</a>}
              </div>
              <div style={{ color: '#9ca3af', fontSize: 13 }}>
                🎁 Sampel: {a.affiliator_samples?.map((s: Sample) => s.product_name).join(', ') || '-'}
              </div>
              <div style={{ color: '#6b7280', fontSize: 12, marginTop: 6 }}>Daftar: {new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB</div>
            </div>
          ))
        )}

        {/* Claims Tab */}
        {tab === 'claims' && (
          claims.length === 0 ? <p style={{ color: '#6b7280' }}>Tidak ada klaim pending</p> :
          claims.map((c: Claim) => (
            <div key={c.id} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700 }}>{c.affiliators?.full_name} <span style={{ color: '#a78bfa', fontSize: 14 }}>@{c.affiliators?.tiktok_username}</span></div>
                  <div style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }}>👁️ {c.views_count?.toLocaleString('id')} views • 💰 Est. Rp{(Math.floor((c.views_count || 0) / 1000) * 5000).toLocaleString('id')}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button disabled={loadingId === c.id} onClick={() => reviewClaim(c.id, 'approve')} style={btnGreen}>{loadingId === c.id ? '...' : '✅ Approve'}</button>
                  <button disabled={loadingId === c.id} onClick={() => reviewClaim(c.id, 'reject')} style={btnRed}>❌ Reject</button>
                </div>
              </div>
              <a href={c.video_url} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', fontSize: 13 }}>🔗 Lihat Video</a>
              <div style={{ color: '#6b7280', fontSize: 12, marginTop: 8 }}>{new Date(c.created_at).toLocaleDateString('id-ID')}</div>
            </div>
          ))
        )}

        {/* Summary Tab */}
        {tab === 'summary' && (
          summary.length === 0 ? <p style={{ color: '#6b7280' }}>Belum ada data</p> :
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  {['Nama', 'TikTok', 'Total Views', 'Komisi Approved', 'Sudah Dibayar', 'Belum Dibayar'].map(h => (
                    <th key={h} style={{ color: '#9ca3af', fontSize: 13, padding: '10px 12px', textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {summary.map((s: Summary) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ color: '#fff', padding: '12px', fontWeight: 600 }}>{s.full_name}</td>
                    <td style={{ color: '#a78bfa', padding: '12px' }}>@{s.tiktok_username}</td>
                    <td style={{ color: '#e5e7eb', padding: '12px' }}>{s.totalViews?.toLocaleString('id')}</td>
                    <td style={{ color: '#10b981', padding: '12px', fontWeight: 600 }}>Rp{s.totalKomisi?.toLocaleString('id')}</td>
                    <td style={{ color: '#8B5CF6', padding: '12px' }}>Rp{s.totalPaid?.toLocaleString('id')}</td>
                    <td style={{ color: s.pending > 0 ? '#f59e0b' : '#6b7280', padding: '12px', fontWeight: 600 }}>Rp{s.pending?.toLocaleString('id')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
