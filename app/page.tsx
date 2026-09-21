'use client'

import { useState } from 'react'

const spreads = [
  { title: 'Daily Guidance', copy: 'A single card to set your intention.', symbol: '✦', href: '/tarot/daily' },
  { title: 'Past Present Future', copy: 'See the thread connecting your story.', symbol: '◌', href: '/tarot/past-present-future' },
  { title: 'Yes / No', copy: 'A quiet nudge toward your next step.', symbol: '↗', href: '/tarot/yes-no' },
  { title: 'Love', copy: 'Make space for the heart to speak.', symbol: '♡', href: '/tarot/love' },
]

function Arrow() {
  return <span aria-hidden="true" className="arrow">↗</span>
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <main>
      <header className="site-header">
        <a className="logo" href="#top" aria-label="JOGPRO TAROT home">JOGPRO <span>TAROT</span></a>
        <button className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="sr-only">Toggle menu</span><i /><i />
        </button>
        <nav id="main-nav" className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          <a href="#spreads" onClick={() => setMenuOpen(false)}>Tarot Reading</a>
          <a href="/tarot/cards" onClick={() => setMenuOpen(false)}>Card Meanings</a>
          <a href="/tarot/weton" onClick={() => setMenuOpen(false)}>Cek Weton</a>
          <a href="#daily" onClick={() => setMenuOpen(false)}>Daily</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        </nav>
        <a className="header-cta" href="#spreads">Free Reading <Arrow /></a>
      </header>

      <section id="top" className="hero" aria-labelledby="hero-title">
        <div className="eyebrow"><span /> A gentle place to begin <span /></div>
        <h1 id="hero-title">A Moment<br /><em>of Clarity</em></h1>
        <p className="hero-copy">Free tarot for self-reflection. Choose your spread —<br className="desktop-break" /> no signup, just breathe and draw.</p>
        <div className="hero-actions">
          <a className="button button-gold" href="/tarot/daily">Daily Card <Arrow /></a>
          <a className="button button-outline" href="/tarot/past-present-future">Past Present Future</a>
        </div>
        <div className="card-fan" aria-label="Three illustrated tarot cards">
          <div className="tarot-card card-left"><div className="card-inner"><span className="card-number">II</span><div className="moon-mark">☽</div><span className="card-name">THE<br />MOON</span></div></div>
          <div className="tarot-card card-center"><div className="card-inner"><span className="card-number">XVII</span><div className="star-mark">✦</div><span className="card-name">THE<br />STAR</span></div></div>
          <div className="tarot-card card-right"><div className="card-inner"><span className="card-number">XIX</span><div className="sun-mark">◉</div><span className="card-name">THE<br />SUN</span></div></div>
        </div>
        <a href="#spreads" className="scroll-cue" aria-label="Scroll to spreads"><span>↓</span></a>
      </section>

      <section id="spreads" className="spreads-section" aria-labelledby="spreads-title">
        <div className="section-heading"><p className="eyebrow sage-text">Choose your reflection</p><h2 id="spreads-title">Begin where you are.</h2><p>There is no wrong question. Only the one that feels true today.</p></div>
        <div className="spread-grid">
          {spreads.map((spread) => <a className="spread-card" href={spread.href} key={spread.title}><span className="spread-symbol" aria-hidden="true">{spread.symbol}</span><h3>{spread.title}</h3><p>{spread.copy}</p><span className="card-link">Draw cards <Arrow /></span></a>)}
        </div>
      </section>

      <section id="daily" className="daily-section" aria-label="Daily card invitation"><div><p className="eyebrow">Your daily pause</p><h2>One card.<br /><em>A little more light.</em></h2></div><a className="button button-terracotta" href="/tarot/daily">Draw your card <Arrow /></a></section>
      <section className="trust-bar"><span>78 Rider–Waite</span><i /> <span>No signup</span><i /> <span>For self-reflection</span></section>
      <footer id="about" className="site-footer"><a className="logo" href="#top">JOGPRO <span>TAROT</span></a><p>Read inward. Move forward.</p><span className="footer-note">© 2026 JOGPRO TAROT</span></footer>
    </main>
  )
}
