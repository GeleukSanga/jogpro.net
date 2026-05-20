'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { landingVariants } from '@/lib/landingVariants';
import { parseUtmFromLocation, UtmContext } from '@/lib/wa';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Hero = dynamic(() => import('@/components/Hero'), { ssr: false });
const Problem = dynamic(() => import('@/components/Problem'));
const Gallery = dynamic(() => import('@/components/Gallery'));
const Emotional = dynamic(() => import('@/components/Emotional'));
const RealView = dynamic(() => import('@/components/RealView'));
const FAQ = dynamic(() => import('@/components/FAQ'));
const CTASection = dynamic(() => import('@/components/CTASection'));

type VariantKey = keyof typeof landingVariants;

type LandingPageProps = {
  variantKey: VariantKey;
};

export default function LandingPage({ variantKey }: LandingPageProps) {
  const variant = landingVariants[variantKey];
  const [utmContext, setUtmContext] = useState<UtmContext | undefined>(undefined);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setUtmContext(parseUtmFromLocation(window.location.search, variant.slug));
  }, [variant.slug]);

  // TikTok Pixel: Track PageView as ViewContent (Standard Event)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ttq = (window as any).ttq;
    if (ttq) {
      ttq.track('ViewContent', {
        content_id: 'lumimemo-lampu-custom',
        content_name: 'LumiMemo Landing Page',
        content_type: 'product',
        value: 99000,
        currency: 'IDR',
      });
    }
  }, []);

  // Meta Pixel & TikTok Pixel: Track WhatsApp clicks
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleWaClick = (e: Event) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target && target.getAttribute('href')?.includes('wa.me')) {
        // Meta Pixel tracking
        const fbq = (window as any).fbq;
        if (fbq) {
          fbq('track', 'Contact');
          fbq('trackCustom', 'WhatsAppClick', {
            page: window.location.pathname,
            text: target.innerText.trim(),
            timestamp: new Date().toISOString(),
          });
        }

        // TikTok Pixel tracking
        const ttq = (window as any).ttq;
        if (ttq) {
          ttq.track('Contact', {
            content_name: target.innerText.trim(),
            content_type: 'product',
            value: 99000,
            currency: 'IDR',
          });
        }
      }
    };

    document.addEventListener('click', handleWaClick);
    return () => document.removeEventListener('click', handleWaClick);
  }, []);

  return (
    <main>
      <Navbar />
      <Hero variant={variant} utmContext={utmContext} />
      <Problem />
      <Gallery />
      <Emotional />
      <RealView />
      <FAQ />
      <CTASection
        title={variant.ctaTitle}
        subtext={variant.ctaSubtext}
        waText={variant.primaryWaText}
        utmContext={utmContext}
      />
      <Footer />
      <WhatsAppFloat waText={variant.primaryWaText} utmContext={utmContext} />
    </main>
  );
}
