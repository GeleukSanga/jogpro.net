'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

const majors = ['The Fool','The Magician','The High Priestess','The Empress','The Emperor','The Hierophant','The Lovers','The Chariot','Strength','The Hermit','Wheel of Fortune','Justice','The Hanged Man','Death','Temperance','The Devil','The Tower','The Star','The Moon','The Sun','Judgement','The World']
const suits = ['Wands','Cups','Swords','Pentacles']
const ranks = ['Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Page','Knight','Queen','King']
const symbols: Record<string, string> = { Wands: '✦', Cups: '♡', Swords: '⚔', Pentacles: '◇' }
const roman = ['0','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI']
const majorSymbols = ['✦','✧','☽','✿','♜','◌','♡','↗','∞','◒','◉','⚖','◇','☼','◌','♄','⚡','✦','☽','◉','✧','◎']

type Card = { name: string; group: string; number: string; symbol: string; keywords: string; upright: string; reversed: string; prompt: string }
const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const cards: Card[] = [
  ...majors.map((name, i) => ({ name, group: 'Major Arcana', number: roman[i], symbol: majorSymbols[i], keywords: ['beginnings · trust · possibility','will · focus · creation','intuition · mystery · inner voice','nourishment · abundance · growth','structure · leadership · stability','tradition · teaching · devotion','choice · harmony · connection','movement · determination · direction','courage · patience · compassion','solitude · wisdom · searching','cycles · change · luck','balance · truth · consequence','surrender · perspective · pause','release · transformation · renewal','harmony · patience · flow','attachment · shadow · desire','sudden change · revelation · freedom','hope · healing · inspiration','intuition · dreams · uncertainty','joy · clarity · vitality','awakening · reflection · calling','completion · wholeness · journey'][i], upright: `The energy of ${name.toLowerCase()} invites you to meet this moment with presence and honesty. Trust the lesson that is already unfolding.`, reversed: `Look gently at where the energy of ${name.toLowerCase()} may feel blocked, rushed, or turned inward. A new perspective is available.`, prompt: `Where is ${name.toLowerCase()} asking you to listen more closely?` })),
  ...suits.flatMap(suit => ranks.map((rank, i) => { const name = `${rank} of ${suit}`; return { name, group: suit, number: i === 0 ? 'A' : i < 10 ? String(i + 1) : rank[0], symbol: symbols[suit], keywords: `${suit.toLowerCase()} · reflection · movement`, upright: `Let the energy of the ${suit.toLowerCase()} guide one honest next step. Stay close to what feels real.`, reversed: `Notice where your ${suit.toLowerCase()} energy is asking for patience, balance, and care.`, prompt: `What would a more intentional relationship with this energy look like today?` } }))
]

function Arrow() { return <span aria-hidden="true" className="arrow">↗</span> }
function Header() { return <header className="site-header"><Link className="logo" href="/" aria-label="JOGPRO TAROT home">JOGPRO <span>TAROT</span></Link><nav className="main-nav" aria-label="Main navigation"><Link href="/#spreads">Tarot Reading</Link><Link href="/tarot/cards">Card Meanings</Link><Link href="/tarot/daily">Daily</Link><Link href="/#about">About</Link></nav><Link className="header-cta" href="/tarot/daily">Free Reading <Arrow /></Link></header> }

export default function CardDetailPage() {
  const params = useParams<{ slug: string }>()
  const card = cards.find(item => slugify(item.name) === params.slug)
  if (!card) return <main className="detail-page"><Header /><section className="detail-not-found"><p className="eyebrow"><span /> The deck is quiet <span /></p><h1>Card not <em>found</em></h1><p>That card does not appear in this deck. Return to the library to explore all 78 meanings.</p><Link className="button button-sage" href="/tarot/cards">Back to Card Library <Arrow /></Link></section></main>
  return <main className="detail-page"><Header /><div className="detail-wrap"><nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/tarot/cards">Card Meanings</Link><span aria-hidden="true">/</span><span>{card.name}</span></nav><section className="detail-hero"><div className={`detail-card ${card.group === 'Cups' ? 'rose' : card.group === 'Swords' ? 'sage' : ''}`}><div className="detail-card-inner"><span>{card.number}</span><strong>{card.symbol}</strong><b>{card.name}</b><small>{card.group}</small></div></div><div className="detail-copy"><p className="eyebrow"><span /> {card.group} <span /></p><h1>{card.name}</h1><p className="detail-keywords">{card.keywords}</p><p className="detail-lede">Every card offers a mirror, not a verdict. Let its image meet you where you are.</p></div></section><section className="detail-meanings"><article><p className="meaning-label">Upright</p><h2>The open invitation</h2><p>{card.upright}</p></article><article><p className="meaning-label reversed-label">Reversed</p><h2>The inward lesson</h2><p>{card.reversed}</p></article></section><section className="detail-reflection"><p className="eyebrow"><span /> A moment to reflect <span /></p><blockquote>“{card.prompt}”</blockquote><Link className="button button-sage" href="/tarot/daily">Draw a Daily Card <Arrow /></Link></section><Link className="back-library" href="/tarot/cards">← Back to the complete card library</Link></div><footer className="site-footer"><Link className="logo" href="/">JOGPRO <span>TAROT</span></Link><p>Read inward. Move forward.</p><span className="footer-note">© 2026 JOGPRO TAROT</span></footer></main>
}

