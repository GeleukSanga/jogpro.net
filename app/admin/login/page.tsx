'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Flame, Lock, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const json = await res.json()
      if (!json.success) {
        setError(json.message || 'Password salah')
        return
      }
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Gagal login, coba lagi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#f5f5f0] px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-[2rem] border border-black/10 bg-white p-8 shadow-xl">
        <a href="/" className="mx-auto flex w-fit items-center gap-2 text-xl font-black tracking-[-0.08em]">
          <span className="grid size-8 place-items-center rounded-full bg-[#171717] text-[#d7ff3f]"><Flame className="size-4 fill-current" /></span>
          JOGPRO<span className="text-[#ef4b32]">.</span>
        </a>
        <h1 className="mt-6 text-center text-2xl font-black tracking-[-0.06em]">Admin login</h1>
        <p className="mt-2 text-center text-xs text-[#888]">Masukkan password terenkripsi untuk akses /admin</p>

        <div className="mt-6 relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#999]" />
          <input
            type={show ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-full border border-black/10 bg-[#fbfbf8] py-3 pl-10 pr-10 text-sm font-bold outline-none focus:border-[#171717]"
            autoFocus
          />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999]">
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>

        {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-center text-xs font-bold text-red-600">{error}</p>}

        <button type="submit" disabled={loading || !password} className="mt-5 flex w-full items-center justify-center rounded-full bg-[#171717] py-3.5 text-sm font-black text-white transition hover:scale-[1.02] disabled:opacity-40">
          {loading ? 'Memeriksa…' : 'Masuk ke Admin'}
        </button>

        <p className="mt-4 text-center text-[10px] text-[#aaa]">Password disimpan terenkripsi (bcrypt) di Vercel Env • Cookie httpOnly 7 hari</p>
      </form>
    </div>
  )
}
