'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/affiliator/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login gagal')
      localStorage.setItem('affiliator_token', data.token)
      localStorage.setItem('affiliator_name', data.full_name)
      router.push('/affiliator/dashboard')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0533 50%, #0a0a0a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
          <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 28, marginBottom: 8 }}>Login Affiliator</h1>
          <p style={{ color: '#9ca3af', fontSize: 15 }}>Masuk ke dashboard affiliator kamu</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 32 }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: '#c4b5fd', fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 8 }}>Username</label>
              <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="username kamu" required
                style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ color: '#c4b5fd', fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 8 }}>Password</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required
                style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            {error && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 10, padding: '10px 14px', color: '#fca5a5', fontSize: 14, marginBottom: 16 }}>{error}</div>}
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', background: loading ? 'rgba(139,92,246,0.4)' : 'linear-gradient(135deg,#8B5CF6,#EC4899)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? '⏳ Masuk...' : '🚀 Login'}
            </button>
          </form>
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 14, marginTop: 24 }}>Belum daftar? <Link href="/affiliator" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>Daftar di sini →</Link></p>
        </div>
      </div>
    </div>
  )
}
