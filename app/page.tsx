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

      {/* Cara Kerja & Komisi */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ maxWidth: 800, margin: '0 auto 48px' }}>

        {/* How It Works */}
        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 24, textAlign: 'center', marginBottom: 24 }}>🔄 Cara Kerja</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 36 }}>
          {[
            ['1️⃣', 'Daftar', 'Isi form + pilih 3 sampel gratis'],
            ['2️⃣', 'Terima Sampel', 'Kami kirim produk fisik dalam 2-3 hari'],
            ['3️⃣', 'Bikin Konten', 'Review produk, upload ke TikTok/IG/FB/Threads'],
            ['4️⃣', 'Laporkan', 'Laporkan views konten lewat dashboard'],
            ['5️⃣', 'Dapat Cuan!', 'Komisi views + komisi affiliate'],
          ].map(([num, title, desc]) => (
            <div key={title} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '20px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{num}</div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{title}</div>
              <div style={{ color: '#9ca3af', fontSize: 13, lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* Platform */}
        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 24, textAlign: 'center', marginBottom: 24 }}>📱 Platform yang Bisa Digunakan</h2>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
          {[
            ['🎵', 'TikTok', '#ff0050'],
            ['📸', 'Instagram', '#E1306C'],
            ['📘', 'Facebook', '#1877F2'],
            ['🧵', 'Threads', '#000'],
          ].map(([emoji, name, color]) => (
            <div key={name} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>{emoji}</span>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{name}</span>
            </div>
          ))}
        </div>

        {/* Requirements */}
        <div style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
          <h3 style={{ color: '#f0abfc', fontWeight: 700, fontSize: 18, marginBottom: 12 }}>⚠️ Syarat Wajib</h3>
          <ul style={{ color: '#c4b5fd', fontSize: 14, lineHeight: 2, margin: 0, paddingLeft: 20 }}>
            <li>Punya akun <strong style={{ color: '#fff' }}>TikTok yang eligible TikTok Affiliate</strong> (min. 600 followers)</li>
            <li>Punya akun <strong style={{ color: '#fff' }}>Shopee Affiliate yang aktif</strong></li>
            <li>Bersedia posting minimal 1 konten dalam 7 hari setelah menerima sampel</li>
          </ul>
        </div>

        {/* Commission */}
        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 24, textAlign: 'center', marginBottom: 24 }}>💰 Sistem Komisi</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2))', border: '1px solid rgba(139,92,246,0.4)', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>👀</div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 28, marginBottom: 4 }}>Rp5.000</div>
            <div style={{ color: '#c4b5fd', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>per 1.000 views</div>
            <div style={{ color: '#9ca3af', fontSize: 13, lineHeight: 1.5 }}>Posting konten produk di akunmu, setiap 1.000 views = Rp5.000 langsung dari Jogpro</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(59,130,246,0.15))', border: '1px solid rgba(34,197,94,0.4)', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🛒</div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 28, marginBottom: 4 }}>Hingga 20%</div>
            <div style={{ color: '#86efac', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>komisi affiliate</div>
            <div style={{ color: '#9ca3af', fontSize: 13, lineHeight: 1.5 }}>Gunakan affiliate link TikTok Shop & Shopee di kontenmu. Komisi hingga 20% per penjualan!</div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#f0abfc', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>🔥 Double Cuan!</p>
          <p style={{ color: '#c4b5fd', fontSize: 14, margin: 0 }}>Dapat komisi views dari Jogpro <strong style={{ color: '#fff' }}>+</strong> komisi affiliate dari TikTok Shop & Shopee sekaligus!</p>
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

      {/* FAQ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        style={{ maxWidth: 700, margin: '0 auto', paddingTop: 48 }}>
        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 24, textAlign: 'center', marginBottom: 32 }}>❓ FAQ — Pertanyaan Umum</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            ['💸', 'Kapan payout / pencairan komisi?', 'Setiap akhir pekan (Sabtu/Minggu). Saldo akan otomatis ditransfer ke rekening/ewallet kamu.'],
            ['📊', 'Berapa minimal saldo untuk payout?', 'Minimal saldo Rp10.000. Kalau di bawah itu, saldo akan diakumulasi ke minggu berikutnya.'],
            ['🎁', 'Apakah sampel benar-benar gratis?', 'Iya! 3 sampel produk 100% gratis termasuk ongkir. Kamu tidak perlu bayar apa pun.'],
            ['📹', 'Harus posting di platform apa?', 'Bebas! TikTok, Instagram, Facebook, Threads — yang penting kontennya tentang produk Jogpro.'],
            ['⏱️', 'Ada batas waktu posting konten?', 'Ya, minimal 1 konten dalam 7 hari setelah sampel diterima. Semakin sering posting, semakin banyak cuan!'],
            ['🛒', 'Bagaimana cara dapat komisi affiliate?', 'Gunakan affiliate link TikTok Shop & Shopee yang kami sediakan di dashboard. Setiap penjualan lewat link kamu = komisi hingga 20%.'],
            ['👥', 'Apakah follower TikTok wajib 600?', 'Ya, karena untuk generate affiliate link TikTok Shop butuh minimal 600 followers. Tapi kamu tetap bisa posting di IG/FB/Threads ya.'],
            ['📦', 'Berapa lama pengiriman sampel?', '2-3 hari kerja via JNT/Lion Parcel. Gratis ongkir untuk seluruh Pulau Jawa.'],
          ].map(([emoji, q, a]) => (
            <div key={q} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{emoji}</span>
                <div>
                  <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: '0 0 6px 0' }}>{q}</h4>
                  <p style={{ color: '#a78bfa', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div style={{ textAlign: 'center', marginTop: 40, paddingBottom: 48 }}>
          <p style={{ color: '#c4b5fd', fontSize: 16, marginBottom: 8 }}>Masih ada pertanyaan?</p>
          <a href="https://wa.me/628972523968" target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#25D366,#128C7E)', borderRadius: 12, padding: '14px 28px', color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>
            💬 Chat via WhatsApp
          </a>
        </div>
      </motion.div>
    </div>
  )
}
