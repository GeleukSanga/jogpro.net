'use client';

import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { landingVariants } from '@/lib/landingVariants';

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

  return (
    <main>
      <Navbar />
      <Hero variant={variant} />
      <Gallery />
      <Emotional />
      <CTASection
        title={variant.ctaTitle}
        subtext={variant.ctaSubtext}
        waText={variant.primaryWaText}
      />
      <Footer />
      <WhatsAppFloat waText={variant.primaryWaText} />
    </main>
  );
}
