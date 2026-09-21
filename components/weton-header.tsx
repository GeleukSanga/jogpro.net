'use client'

import { useState, type ReactNode } from 'react'

export function WetonHeader() {
  const [open, setOpen] = useState(false)
  return <header className="site-header">
    <a className="logo" href="/" aria-label="JOGPRO TAROT home">JOGPRO <span>TAROT</span></a>
    <button className="menu-button" type="button" aria-expanded={open} aria-controls="weton-nav" onClick={() => setOpen(!open)}><span className="sr-only">Toggle menu</span><i /><i /></button>
    <nav id="weton-nav" className={open ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
      <a href="/tarot/weton">Cek Weton</a><a href="/tarot/jodoh">Cek Jodoh</a><a href="/tarot/cards">Card Meanings</a><a href="/#about">About</a>
    </nav>
    <a className="header-cta" href="/tarot/daily">Free Reading <span className="arrow" aria-hidden="true">↗</span></a>
  </header>
}

export function WetonFooter() { return <footer className="reading-footer"><a className="logo" href="/">JOGPRO <span>TAROT</span></a><p>Tradisi sebagai cermin, bukan vonis.</p></footer> }

export function ShareButtons({ text, url }: { text: string; url: string }) {
  async function copy() { await navigator.clipboard?.writeText(text); }
  return <div className="weton-share"><button type="button" onClick={copy}>Salin hasil</button><a href={`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`} target="_blank" rel="noreferrer">Bagikan ke WhatsApp ↗</a></div>
}

export function DateField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) { return <label className="weton-field" htmlFor={id}><span>{label}</span><input id={id} type="date" min="1900-01-01" max={new Date().toISOString().slice(0, 10)} value={value} onChange={(e) => onChange(e.target.value)} /></label> }

export function Disclaimer() { return <p className="weton-disclaimer">Bacaan ini adalah bagian dari budaya dan refleksi diri—cermin, bukan vonis. Gunakan sebagai ruang untuk mengenal diri, bukan kepastian masa depan.</p> }

export function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) { return <div className="section-heading"><p className="eyebrow"><span /> {eyebrow} <span /></p><h2>{title}</h2></div> }

export function InfoBlock({ title, text }: { title: string; text: string | null }) { if (!text) return null; return <article className="weton-info-block"><p className="eyebrow">{title}</p><p>{text}</p></article> }

export function WetonCard({ result, label }: { result: { weton: string; neptu: number; pasaran: string }; label?: string }) { return <article className="weton-result-card"><p className="eyebrow">{label || 'Hasil weton'}</p><h2>{result.weton}</h2><div><strong>Neptu {result.neptu}</strong><span>Pasaran {result.pasaran}</span></div></article> }

export const formatDate = (value: string) => value ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date(`${value}T00:00:00`)) : ''

export function WetonShell({ children }: { children: React.ReactNode }) { return <main className="weton-page"><WetonHeader />{children}<WetonFooter /></main> }

export const Arrow = () => <span className="arrow" aria-hidden="true">↗</span>
