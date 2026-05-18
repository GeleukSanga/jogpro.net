'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const items = [
  { src: '/portfolio/p1.jpg', caption: 'Kenangan di Batu Caves', sub: 'Pasangan', tag: 'Pasangan' },
  { src: '/portfolio/p2.jpg', caption: 'Ayah & buah hati', sub: 'Keluarga', tag: 'Keluarga' },
  { src: '/portfolio/p3.jpg', caption: 'Gadis penuh semangat', sub: 'Personal', tag: 'Personal' },
  { src: '/portfolio/p4.jpg', caption: 'Momen santai terbaik', sub: 'Personal', tag: 'Personal' },
  { src: '/portfolio/p5.jpg', caption: 'Firman yang menerangi', sub: 'Religi', tag: 'Religi' },
  { src: '/portfolio/p6.jpg', caption: 'Bunda Maria', sub: 'Religi', tag: 'Religi' },
  { src: '/portfolio/p7.jpg', caption: 'Hari pernikahan', sub: 'Pernikahan', tag: 'Pernikahan' },
  { src: '/portfolio/p8.jpg', caption: 'Si kecil dalam cahaya hangat', sub: 'Keluarga', tag: 'Keluarga' },
  { src: '/portfolio/p9.jpg', caption: 'Momen makan si kecil', sub: 'Keluarga', tag: 'Keluarga' },
];

const tagColors: Record<string, { bg: string; color: string }> = {
  Pasangan:   { bg: '#F2C4CE', color: '#7A3D46' },
  Keluarga:   { bg: '#BFD7ED', color: '#2A5A7A' },
  Personal:   { bg: '#E8F2FB', color: '#2A5A7A' },
  Religi:     { bg: '#EDE8F5', color: '#5A3A7A' },
  Pernikahan: { bg: '#FAEAE0', color: '#7A4A2A' },
};

export default function Gallery() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animDir, setAnimDir] = useState<'left' | 'right'>('right');
  const [visible, setVisible] = useState(true);

  const goTo = useCallback((idx: number, dir: 'left' | 'right' = 'right') => {
    setAnimDir(dir);
    setVisible(false);
    setTimeout(() => {
      setCurrent(idx);
      setVisible(true);
    }, 220);
  }, []);

  const prev = () => {
    setPaused(true);
    goTo((current - 1 + items.length) % items.length, 'left');
  };

  const next = useCallback(() => {
    goTo((current + 1) % items.length, 'right');
  }, [current, goTo]);

  // Auto-advance every 3.5s
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => next(), 3500);
    return () => clearInterval(t);
  }, [paused, next]);

  const item = items[current];
  const tc = tagColors[item.tag] ?? { bg: '#E8F2FB', color: '#2A5A7A' };

  return (
    <section id="galeri" style={{ background: '#FAF8F5', padding: '96px 24px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p className="sans" style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#9E958F', marginBottom: 16,
          }}>
            Portfolio
          </p>
          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 700, lineHeight: 1.15,
            letterSpacing: '-0.02em', color: '#2C2523', marginBottom: 16,
          }}>
            Setiap foto,{' '}
            <span style={{
              background: 'linear-gradient(90deg, #BFD7ED, #F2C4CE)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              sebuah kenangan
            </span>
          </h2>
          <p className="sans" style={{
            color: '#9E958F', maxWidth: 440, margin: '0 auto', lineHeight: 1.65, fontSize: 15,
          }}>
            Bukan sekadar lampu — ini cara kamu mengatakan bahwa mereka selalu ada di hatimu.
          </p>
        </div>

        {/* Slideshow */}
        <div
          style={{ position: 'relative', maxWidth: 520, margin: '0 auto' }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Card */}
          <div style={{
            borderRadius: 24,
            overflow: 'hidden',
            background: '#fff',
            boxShadow: '0 20px 60px rgba(44,37,35,0.12), 0 4px 16px rgba(44,37,35,0.06)',
            transition: 'opacity 0.22s ease, transform 0.22s ease',
            opacity: visible ? 1 : 0,
            transform: visible
              ? 'translateX(0)'
              : animDir === 'right' ? 'translateX(24px)' : 'translateX(-24px)',
          }}>
            {/* Image */}
            <div style={{ position: 'relative', aspectRatio: '4/5' }}>
              <Image
                key={current}
                src={item.src}
                alt={item.caption}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 520px"
                priority
              />
              {/* Tag badge overlay */}
              <span className="sans" style={{
                position: 'absolute', top: 16, left: 16,
                padding: '4px 12px', borderRadius: 99,
                background: tc.bg, color: tc.color,
                fontSize: 11, fontWeight: 600,
                backdropFilter: 'blur(8px)',
              }}>
                {item.tag}
              </span>
              {/* Counter */}
              <span className="sans" style={{
                position: 'absolute', top: 16, right: 16,
                padding: '4px 12px', borderRadius: 99,
                background: 'rgba(44,37,35,0.5)', color: '#FAF8F5',
                fontSize: 11, fontWeight: 500,
                backdropFilter: 'blur(8px)',
              }}>
                {current + 1} / {items.length}
              </span>
            </div>

            {/* Caption */}
            <div style={{ padding: '20px 24px 22px' }}>
              <p style={{
                fontFamily: 'Georgia, serif', fontSize: 17,
                color: '#2C2523', marginBottom: 4, lineHeight: 1.3,
              }}>
                {item.caption}
              </p>
              <p className="sans" style={{ fontSize: 13, color: '#9E958F' }}>{item.sub}</p>
            </div>
          </div>

          {/* Prev button */}
          <button onClick={prev} aria-label="Sebelumnya" style={{
            position: 'absolute', left: -20, top: '42%', transform: 'translateY(-50%)',
            width: 44, height: 44, borderRadius: '50%',
            background: '#FAF8F5', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(44,37,35,0.14)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: '#2C2523',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-50%) scale(1.1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-50%) scale(1)'; }}
          >
            ‹
          </button>

          {/* Next button */}
          <button onClick={() => { setPaused(true); next(); }} aria-label="Berikutnya" style={{
            position: 'absolute', right: -20, top: '42%', transform: 'translateY(-50%)',
            width: 44, height: 44, borderRadius: '50%',
            background: '#FAF8F5', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(44,37,35,0.14)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: '#2C2523',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-50%) scale(1.1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-50%) scale(1)'; }}
          >
            ›
          </button>
        </div>

        {/* Dot indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}>
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => { setPaused(true); goTo(i, i > current ? 'right' : 'left'); }}
              aria-label={`Foto ${i + 1}`}
              style={{
                width: i === current ? 24 : 8,
                height: 8, borderRadius: 99, border: 'none', cursor: 'pointer',
                background: i === current ? '#2C2523' : '#D4CFC9',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Bottom note */}
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <p className="sans" style={{ color: '#9E958F', marginBottom: 20, fontSize: 15 }}>
            Punya foto istimewa? Kami bantu wujudkan.
          </p>
          <a
            href="https://wa.me/6289725239680?text=Halo,%20saya%20ingin%20konsultasi%20litophane"
            target="_blank" rel="noopener noreferrer"
            className="sans"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '12px 26px', borderRadius: 99,
              border: '1.5px solid #2C2523',
              color: '#2C2523', fontSize: 14, fontWeight: 500,
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#2C2523';
              (e.currentTarget as HTMLAnchorElement).style.color = '#FAF8F5';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              (e.currentTarget as HTMLAnchorElement).style.color = '#2C2523';
            }}
          >
            Konsultasi Gratis
          </a>
        </div>
      </div>
    </section>
  );
}
