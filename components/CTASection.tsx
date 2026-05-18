'use client';
import { waLink } from '@/lib/wa';

type CTASectionProps = {
  title: string;
  subtext: string;
  waText: string;
};

export default function CTASection({ title, subtext, waText }: CTASectionProps) {
  return (
    <section style={{
      background: 'linear-gradient(160deg, #BFD7ED 0%, #F2C4CE 100%)',
      padding: '100px 24px',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ fontSize: 52, marginBottom: 24 }}>🕯</div>

        <h2 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)',
          fontWeight: 700, lineHeight: 1.15,
          letterSpacing: '-0.02em',
          color: '#2C2523', marginBottom: 20,
        }}>
          {title}
        </h2>

        <p className="sans" style={{
          fontSize: 16, lineHeight: 1.7,
          color: 'rgba(44,37,35,0.7)',
          maxWidth: 520, margin: '0 auto 12px',
        }}>
          {subtext}
        </p>

        <p className="sans" style={{
          fontSize: 13, color: 'rgba(44,37,35,0.5)',
          fontStyle: 'italic', marginBottom: 44,
        }}>
          Konsultasi gratis · Tanpa komitmen · Respon cepat
        </p>

        <a
          href={waLink(waText)}
          target="_blank" rel="noopener noreferrer"
          className="sans"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '16px 36px', borderRadius: 99,
            background: '#2C2523', color: '#FAF8F5',
            fontWeight: 700, fontSize: 16,
            textDecoration: 'none', letterSpacing: '0.01em',
            boxShadow: '0 8px 30px rgba(44,37,35,0.25)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)';
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 14px 40px rgba(44,37,35,0.3)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 30px rgba(44,37,35,0.25)';
          }}
        >
          <WaIcon />
          Chat WhatsApp Sekarang
        </a>
      </div>
    </section>
  );
}

function WaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
