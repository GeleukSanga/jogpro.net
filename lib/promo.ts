// Promo countdown per unique user (deteksi via localStorage)
export const PROMO_KEY = 'jogpro_promo_start_v1'
export const PROMO_SECONDS = 57 * 60

export function getPromoRemaining(): number {
  if (typeof window === 'undefined') return PROMO_SECONDS
  try {
    let start = Number(window.localStorage.getItem(PROMO_KEY))
    if (!start) {
      start = Date.now()
      window.localStorage.setItem(PROMO_KEY, String(start))
    }
    return Math.max(0, PROMO_SECONDS - Math.floor((Date.now() - start) / 1000))
  } catch {
    return PROMO_SECONDS
  }
}

export function formatCountdown(totalSecs: number): string {
  const m = Math.floor(totalSecs / 60)
  const s = totalSecs % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
