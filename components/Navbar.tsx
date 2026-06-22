'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: '#ffffff',
      borderBottom: '1px solid #e5e5e5',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        {/* Logo */}
        <Link href="/" style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>
          Jogpro Finance
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
          <Link href="/gadai" style={{ fontWeight: 500, fontSize: 15 }}>Gadai HP</Link>
          <Link href="/paylater" style={{ fontWeight: 500, fontSize: 15 }}>Paylater</Link>
          <Link href="#kontak" style={{ fontWeight: 500, fontSize: 15 }}>Hubungi Kami</Link>
          <Link href="/gadai" className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>
            Ajukan Gadai
          </Link>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
          }}
          className="hamburger"
        >
          <span style={{
            display: 'block',
            width: 24,
            height: 2,
            background: '#0a0a0a',
            marginBottom: 5,
            transition: 'all 0.2s',
          }} />
          <span style={{
            display: 'block',
            width: 24,
            height: 2,
            background: '#0a0a0a',
            marginBottom: 5,
            transition: 'all 0.2s',
          }} />
          <span style={{
            display: 'block',
            width: 24,
            height: 2,
            background: '#0a0a0a',
            transition: 'all 0.2s',
          }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          borderTop: '1px solid #e5e5e5',
          background: '#ffffff',
          padding: '16px 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          <Link href="/gadai" onClick={() => setOpen(false)} style={{ fontWeight: 500, fontSize: 16 }}>Gadai HP</Link>
          <Link href="/paylater" onClick={() => setOpen(false)} style={{ fontWeight: 500, fontSize: 16 }}>Paylater</Link>
          <Link href="#kontak" onClick={() => setOpen(false)} style={{ fontWeight: 500, fontSize: 16 }}>Hubungi Kami</Link>
          <Link href="/gadai" onClick={() => setOpen(false)} className="btn-primary" style={{ width: 'fit-content', padding: '10px 20px', fontSize: 14 }}>
            Ajukan Gadai
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
