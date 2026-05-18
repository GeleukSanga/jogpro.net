'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { landingVariants } from '@/lib/landingVariants';
import { parseUtmFromLocation, UtmContext } from '@/lib/wa';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Hero = dynamic(() => import('@/components/Hero'), { ssr: false });
const Gallery = dynamic(() => import('@/components/Gallery'));
const Emotional = dynamic(() => import('@/components/Emotional'));
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

  return (
    <main>
      <Navbar />
      <Hero variant={variant} utmContext={utmContext} />
      <Gallery />
      <Emotional />
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
