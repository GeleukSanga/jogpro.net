'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

const spreadData = {
  daily: {
    label: 'Daily',
    title: 'Your daily card',
    intro: 'A single card to meet the day with intention.',
    questions: ['What would support me today?', 'What energy can I carry with me?'],
    cards: [{ number: 'XVII', name: 'THE STAR', symbol: '✦', color: 'gold', message: 'Hope is not passive. Let it be the small, steady light you choose to follow.' }],
  },
  'past-present-future': {
    label: 'Past Present Future',
    title: 'The thread of your story',
    intro: 'Three cards to see what has been, what is, and what may unfold.',
    questions: ['What am I moving through?', 'What wants my attention right now?'],
    cards: [
      { number: 'II', name: 'THE MOON', symbol: '☽', color: 'rose', message: 'The past gave you instincts. Trust what you learned in the quiet.' },
      { number: 'XIV', name: 'TEMPERANCE', symbol: '◌', color: 'sage', message: 'The present asks for a gentler rhythm. Nothing needs to be forced.' },
      { number: 'XIX', name: 'THE SUN', symbol: '◉', color: 'gold', message: 'Clarity arrives when you let yourself be seen exactly as you are.' },
    ],
  },
  'yes-no': {
    label: 'Yes / No',
    title: 'A clear nudge',
    intro: 'One card to help you hear the answer beneath the question.',
    questions: ['What do I already know about this?', 'Where is my energy asking to go?'],
    cards: [{ number: 'VI', name: 'THE LOVERS', symbol: '♡', color: 'rose', message: 'Yes — when the choice is made from alignment, not from fear.' }],
  },
  love: {
    label: 'Love',
    title: 'Make space for love',
    intro: 'A gentle three-card reflection for matters of the heart.',
    questions: ['What does my heart need to hear?', 'How can I meet love with more openness?'],
    cards: [
      { number: 'III', name: 'THE EMPRESS', symbol: '✿', color: 'rose', message: 'Let affection be nourishing. You do not have to earn tenderness.' },
      { number: 'II', name: 'THE HIGH PRIESTESS', symbol: '☽', color: 'sage', message: 'There is wisdom in the pause. Listen before you reach for certainty.' },
      { number: 'X', name: 'WHEEL OF FORTUNE', symbol: '◉', color: 'gold', message: 'The heart is changing shape. Stay open to an unexpected turn.' },
    ],
  },
} as const

type SpreadKey = keyof typeof spreadData

function Arrow() { return <span aria-hidden="true" className="arrow">↗</span> }

export default function TarotReadingPage() {
  const params = useParams<{ spread: string }>()
  const router = useRouter()
  const selected = (params.spread in spreadData ? params.spread : 'daily') as SpreadKey
  const spread = spreadData[selected]
  const [question, setQuestion] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  function goTo(key: string) { setRevealed(false); setQuestion(''); router.push(`/tarot/${key}`) }

  return (
    <main className="reading-page">
      <header className="site-header">
        <a className="logo" href="/" aria-label="JOGPRO TAROT home">JOGPRO <span>TAROT</span></a>
        <button className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="reading-nav" onClick={() => setMenuOpen(!menuOpen)}><span className="sr-only">Toggle menu</span><i /><i /></button>
        <nav id="reading-nav" className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          <a href="/#spreads">Tarot Reading</a><a href="/#meanings">Card Meanings</a><a href="/tarot/daily">Daily</a><a href="/#about">About</a>
        </nav>
        <a className="header-cta" href="/tarot/daily">Free Reading <Arrow /></a>
      </header>

      <div className="reading-tabs" role="tablist" aria-label="Choose a tarot spread">
        {(Object.keys(spreadData) as SpreadKey[]).map((key) => <button key={key} type="button" role="tab" aria-selected={selected === key} className={selected === key ? 'reading-tab active' : 'reading-tab'} onClick={() => goTo(key)}>{spreadData[key].label}</button>)}
      </div>

      <section className="reading-intro" aria-labelledby="reading-title">
        <p className="eyebrow"><span /> Step 1 · Ask <span /></p>
        <h1 id="reading-title">{spread.title}</h1>
        <p>{spread.intro}</p>
      </section>

      {!revealed ? <section className="ask-card" aria-label="Ask your question">
        <label htmlFor="question">Hold a question in your heart <span>(optional)</span></label>
        <textarea id="question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={spread.questions[0]} rows={3} maxLength={180} />
        <div className="ask-footer"><small>{question.length}/180</small><button type="button" className="button button-gold" onClick={() => setRevealed(true)}>Draw your {spread.cards.length === 1 ? 'card' : 'cards'} <Arrow /></button></div>
        <div className="suggestions" aria-label="Question ideas">{spread.questions.map((item) => <button type="button" key={item} onClick={() => setQuestion(item)}>{item}</button>)}</div>
      </section> : <section className="reveal-section" aria-live="polite">
        <p className="eyebrow sage-text"><span /> Step 2 · Receive <span /></p>
        <div className={spread.cards.length === 1 ? 'reading-cards single' : 'reading-cards'}>{spread.cards.map((card) => <article className={`reading-card ${card.color}`} key={card.name}><div className="reading-card-inner"><span className="card-number">{card.number}</span><div className="reading-symbol">{card.symbol}</div><span className="card-name">{card.name}</span><p>{card.message}</p></div></article>)}</div>
        <p className="reflection">{question ? `For your question: “${question}”` : 'Take what resonates. Leave the rest.'}</p>
        <button type="button" className="button button-outline" onClick={() => setRevealed(false)}>Draw again <Arrow /></button>
      </section>}

      <footer className="reading-footer"><a className="logo" href="/">JOGPRO <span>TAROT</span></a><p>Read inward. Move forward.</p></footer>
    </main>
  )
}
