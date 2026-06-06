'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const PRODUCTS = [
  { id: 'oreo', name: 'Oreo Cable Winder', emoji: '🎮' },
  { id: 'compact', name: 'Compact Cable Winder', emoji: '🔌' },
  { id: 'stand', name: 'Phone Stand Keychain', emoji: '📱' },
]

const BENEFITS = [
  { icon: '💰', title: 'Komisi 20% per Checkout', desc: 'Setiap checkout via link affiliatemu di TikTok/Shopee, kamu dapat 20% dari GMV.' },
  { icon: '🎯', title: 'Rp 2.500 per 500 Views', desc: 'Setiap video tembus kelipatan 500 views, kamu bisa klaim komisi views langsung.' },
  { icon: '📦', title: 'Sampel Produk Gratis', desc: 'Affiliator approved dapat produk Jogpro gratis untuk dibuat konten.' },
]

export default function AffiliatorRegisterPage() {
  const [form, setForm] = useState({
    full_name: '', whatsapp: '', city: '',
    tiktok_username: '', tiktok_followers: '',
    tiktok_url: '', instagram_url: '',
  })
  const [samples, setSamples] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const toggleSample = (name: string) => {
    setSamples(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : prev.length < 3 ? [...prev, name] : prev
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/affiliator/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, samples }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan')
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white overflow-x-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-sm font-semibold tracking-[0.3em] text-blue-400 uppercase">Jogpro Creator Program</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-black leading-tight">
            Jadi{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent">
              Affiliator
            </span>
            <br />Jogpro Sekarang
          </h1>
          <p className="mt-4 text-slate-400 text-lg">Hasilkan komisi dari setiap konten yang kamu buat</p>
        </motion.div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5"
            >
              <div className="text-3xl mb-3">{b.icon}</div>
              <div className="font-bold text-sm text-white mb-1">{b.title}</div>
              <div className="text-xs text-slate-400 leading-relaxed">{b.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Form / Success */}
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border border-green-500/30 bg-green-500/10 backdrop-blur p-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="text-6xl mb-4"
              >✅</motion.div>
              <h2 className="text-2xl font-black text-green-400 mb-2">Pendaftaran Masuk!</h2>
              <p className="text-slate-300 leading-relaxed">
                Kami akan menghubungimu via WhatsApp dalam <strong>1×24 jam</strong> setelah review pendaftaranmu.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8 space-y-5"
            >
              <h2 className="text-xl font-bold text-white mb-2">Form Pendaftaran</h2>

              {/* Fields */}
              {[
                { key: 'full_name', label: 'Nama Lengkap', placeholder: 'Nama kamu', type: 'text' },
                { key: 'whatsapp', label: 'No. WhatsApp', placeholder: '08xxxxxxxxxx', type: 'tel' },
                { key: 'city', label: 'Kota', placeholder: 'Domisili kamu', type: 'text' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition text-sm"
                  />
                </div>
              ))}

              {/* TikTok Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Username TikTok</label>
                <div className="flex">
                  <span className="bg-white/10 border border-white/10 border-r-0 rounded-l-xl px-3 flex items-center text-slate-400 text-sm">@</span>
                  <input
                    type="text"
                    placeholder="usernamemu"
                    value={form.tiktok_username}
                    onChange={e => setForm(p => ({ ...p, tiktok_username: e.target.value }))}
                    required
                    className="flex-1 bg-white/5 border border-white/10 rounded-r-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition text-sm"
                  />
                </div>
              </div>

              {/* Followers */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Jumlah Followers TikTok <span className="text-yellow-400">(Min. 600)</span></label>
                <input
                  type="number"
                  placeholder="Contoh: 1500"
                  value={form.tiktok_followers}
                  onChange={e => setForm(p => ({ ...p, tiktok_followers: e.target.value }))}
                  required min={600}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition text-sm"
                />
              </div>

              {/* TikTok URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">URL Profil TikTok</label>
                <input
                  type="url"
                  placeholder="https://tiktok.com/@usernamemu"
                  value={form.tiktok_url}
                  onChange={e => setForm(p => ({ ...p, tiktok_url: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition text-sm"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">URL Instagram <span className="text-slate-500">(opsional)</span></label>
                <input
                  type="url"
                  placeholder="https://instagram.com/usernamemu"
                  value={form.instagram_url}
                  onChange={e => setForm(p => ({ ...p, instagram_url: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition text-sm"
                />
              </div>

              {/* Sampel */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Pilih Sampel Produk <span className="text-yellow-400">(1-3 produk)</span></label>
                <div className="grid grid-cols-3 gap-3">
                  {PRODUCTS.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleSample(p.name)}
                      className={`rounded-xl border p-3 text-center transition text-xs font-semibold ${
                        samples.includes(p.name)
                          ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                          : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/30'
                      }`}
                    >
                      <div className="text-2xl mb-1">{p.emoji}</div>
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3">
                  ⚠️ {error}
                </motion.div>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading || samples.length === 0}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
              >
                {loading ? '⏳ Mengirim...' : '🚀 Daftar Sekarang'}
              </motion.button>

              <p className="text-center text-sm text-slate-500">
                Sudah punya akun?{' '}
                <Link href="/affiliator/login" className="text-blue-400 hover:text-blue-300 font-semibold">
                  Login di sini
                </Link>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
