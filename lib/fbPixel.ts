declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

export const FB_PIXEL_ID = '1333558018471897'

// Safe wrapper - won't error if fbq not loaded yet
export function fbqTrack(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.fbq) {
    if (params) window.fbq('track', event, params)
    else window.fbq('track', event)
  }
}

export function fbqTrackCustom(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', event, params)
  }
}

export function parsePrice(priceStr: string | number): number {
  if (typeof priceStr === 'number') return priceStr
  // "Rp 20.000" -> 20000
  const num = priceStr.replace(/[^0-9]/g, '')
  return Number(num) || 0
}
