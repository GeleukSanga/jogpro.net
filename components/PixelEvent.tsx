'use client';

import { useEffect } from 'react';

interface Props {
  event: string;
  params?: Record<string, unknown>;
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function PixelEvent({ event, params }: Props) {
  useEffect(() => {
    if (window.fbq) {
      window.fbq('track', event, params ?? {});
    }
  }, [event, params]);
  return null;
}
