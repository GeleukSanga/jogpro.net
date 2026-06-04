'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PRODUCTS = [
  { name: 'Oreo Cable Winder', price: 'Rp20.000', emoji: '🍪' },
  { name: 'Compact Cable Winder', price: 'Rp20.000', emoji: '🔌' },
  { name: 'Phone Stand Keychain', price: 'Rp15.000', emoji: '📱' },
  { name: 'Clickable Gantungan Tas Custom', price: 'Mulai Rp15.000', emoji: '🏷️' },
]

const STEPS = ['Data Diri', 'Sosial Media', 'Pilih Sampel']

export default function AffiliatorPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ full_name: '', whatsapp: '', city: '', tiktok_username: '', tiktok_followers: '', tiktok_url: '', instagram_url: '' })
  const [samples, setSamples] = useState<string[]>([])
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  function toggleSample(name: string) {
    if (samples.includes(name)) {
      setSamples(samples.filter(s => s !== name))
    } else {
      if (samples.length >= 3) { setError('Maksimal 3 sampel'); return }
      setSamples([...samples, name])
      setError('')
    }
  }

  function validateStep() {
    if (step === 0) {
      if (!form.full_name || !form.whatsapp || !form.city) { setError('Semua field wajib diisi'); return false }
      if (!/^08\d{8,11}$/.test(form.whatsapp)) { setError('Format WA: 08xx (10-13 digit)'); return false }
    }
    if (step === 1) {
      if (!form.tiktok_username || !form.tiktok_followers) { setError('Username dan jumlah followers wajib diisi'); return false }
      if (parseInt(form.tiktok_followers) < 600) { setError('Minimal 600 followers TikTok untuk mendaftar'); return false }
    }
    if (step === 2) {
      if (samples.length === 0) { setError('Pilih minimal 1 sampel'); return false }
      if (!agreed) { setError('Kamu harus menyetujui perjanjian'); return false }
    }
    return true
  }

  function nextStep() {
    if (!validateStep()) return
    setStep(s => s + 1)
    setError('')
  }

  async function handleSubmit() {
    if (!validateStep()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/affiliator/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, samples })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal mendaftar')
      setSuccess(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0533 50%, #0a0a0a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: 80, marginBottom: 24 }}>🎉</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 12 }}>Pendaftaran Berhasil!</h1>
        <p style={{ color: '#c4b5fd', fontSize: 18, marginBottom: 24, lineHeight: 1.6 }}>Tim Jogpro akan menghubungi kamu via WhatsApp dalam <strong style={{ color: '#f0abfc' }}>24 jam</strong> untuk konfirmasi dan pengiriman sampel.</p>
        <div style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)', borderRadius: 16, padding: '20px' }}>
          <p style={{ color: '#e9d5ff', margin: 0, fontSize: 14 }}>💜 Terima kasih sudah bergabung sebagai Affiliator Jogpro! Siapkan konten terbaikmu ya!</p>
        </div>
      </motion.div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0533 50%, #0a0a0a 100%)', padding: '2rem 1rem' }}>
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
        <div style={{ display: 'inline-block', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.5)', borderRadius: 999, padding: '6px 20px', marginBottom: 16 }}>
          <span style={{ color: '#c4b5fd', fontSize: 14, fontWeight: 600 }}>✨ Program Affiliator Jogpro</span>
        </div>
        <h1 style={{ fontSize: 'clamp(32px,6vw,56px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
          Konten Kamu = <span style={{ background: 'linear-gradient(90deg,#8B5CF6,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Cuan Terus! 🚀</span>
        </h1>
        <p style={{ color: '#a78bfa', fontSize: 18, lineHeight: 1.6, marginBottom: 32 }}>Dapat produk 3D printed gratis, posting di TikTok/IG, dapat komisi dari setiap 1.000 views. Gampang, fleksibel, menguntungkan!</p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          {[['🎁', '3 Sampel', 'Gratis'], ['💰', 'Rp5.000', '/1.000 views'], ['⏰', 'Fleksibel', 'Kapan aja']].map(([emoji, val, label]) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '16px 24px', minWidth: 100 }}>
              <div style={{ fontSize: 28 }}>{emoji}</div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>{val}</div>
              <div style={{ color: '#9ca3af', fontSize: 12 }}>{label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Form */}
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, alignItems: 'center' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, background: i <= step ? 'linear-gradient(135deg,#8B5CF6,#EC4899)' : 'rgba(255,255,255,0.1)', color: i <= step ? '#fff' : '#6b7280', transition: 'all 0.3s' }}>{i + 1}</div>
              <span style={{ color: i <= step ? '#c4b5fd' : '#6b7280', fontSize: 12, fontWeight: 600 }}>{s}</span>
              {i < STEPS.length - 1 && <div style={{ position: 'absolute', width: 0 }} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '32px', marginBottom: 16 }}>

          {step === 0 && (
            <div>
              <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 22, marginBottom: 24 }}>👤 Data Diri</h2>
              {[['full_name', 'Nama Lengkap', 'Nama kamu...', 'text'], ['whatsapp', 'Nomor WhatsApp', '08xxxxxxxxxx', 'tel'], ['city', 'Kota/Kabupaten', 'Jakarta, Bandung, dll...', 'text']].map(([name, label, placeholder, type]) => (
                <div key={name} style={{ marginBottom: 20 }}>
                  <label style={{ color: '#c4b5fd', fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 8 }}>{label}</label>
                  <input name={name} type={type} placeholder={placeholder} value={form[name as keyof typeof form]} onChange={handleChange}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 22, marginBottom: 24 }}>📱 Akun Sosial Media</h2>
              {[['tiktok_username', 'Username TikTok', '@username_kamu', 'text'], ['tiktok_followers', 'Jumlah Followers TikTok', 'Contoh: 1200 (min 600)', 'number'], ['tiktok_url', 'Link Profil TikTok', 'https://tiktok.com/@username', 'url'], ['instagram_url', 'Link Instagram (opsional)', 'https://instagram.com/username', 'url']].map(([name, label, placeholder, type]) => (
                <div key={name} style={{ marginBottom: 20 }}>
                  <label style={{ color: '#c4b5fd', fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 8 }}>{label} {name === 'instagram_url' ? <span style={{ color: '#6b7280', fontSize: 12 }}>(opsional)</span> : ''}</label>
                  <input name={name} type={type} placeholder={placeholder} value={form[name as keyof typeof form]} onChange={handleChange}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '12px 16px', color: '#fff', fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 12, padding: '12px 16px' }}>
                <p style={{ color: '#c4b5fd', fontSize: 13, margin: 0 }}>ℹ️ Minimal 600 followers TikTok untuk bisa generate affiliate link TikTok</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 22, marginBottom: 8 }}>🎁 Pilih Sampel Gratis</h2>
              <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 24 }}>Pilih maksimal 3 produk yang ingin kamu review</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                {PRODUCTS.map(p => {
                  const selected = samples.includes(p.name)
                  return (
                    <div key={p.name} onClick={() => toggleSample(p.name)} style={{ background: selected ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.05)', border: `2px solid ${selected ? '#8B5CF6' : 'rgba(255,255,255,0.1)'}`, borderRadius: 16, padding: '16px 12px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{p.emoji}</div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{p.name}</div>
                      <div style={{ color: '#a78bfa', fontSize: 12 }}>{p.price}</div>
                      {selected && <div style={{ marginTop: 8, color: '#8B5CF6', fontSize: 20 }}>✓</div>}
                    </div>
                  )
                })}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '16px', marginBottom: 16 }}>
                <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, width: 18, height: 18, accentColor: '#8B5CF6' }} />
                  <span style={{ color: '#c4b5fd', fontSize: 14, lineHeight: 1.5 }}>Saya setuju akan posting minimal 1 video dalam <strong>7 hari</strong> setelah menerima sampel dan melaporkan views sesuai ketentuan program affiliator Jogpro.</span>
                </label>
              </div>
            </div>
          )}

          {error && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 10, padding: '10px 14px', color: '#fca5a5', fontSize: 14, marginBottom: 16 }}>{error}</div>}

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            {step > 0 && <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>← Kembali</button>}
            {step < 2
              ? <button onClick={nextStep} style={{ flex: 2, padding: '14px', background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Lanjut →</button>
              : <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: '14px', background: loading ? 'rgba(139,92,246,0.4)' : 'linear-gradient(135deg,#8B5CF6,#EC4899)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? '⏳ Mengirim...' : '🚀 Daftar Sekarang!'}</button>
            }
          </div>
        </motion.div>
      </div>
    </div>
  )
}
