export const WHATSAPP_NUMBER = '628972523968';

export type UtmContext = {
  landingPath?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export function waLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function normalizeUtmValue(value?: string | null) {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function parseUtmFromLocation(search: string, landingPath: string): UtmContext {
  const params = new URLSearchParams(search);

  return {
    landingPath,
    utm_source: normalizeUtmValue(params.get('utm_source')),
    utm_medium: normalizeUtmValue(params.get('utm_medium')),
    utm_campaign: normalizeUtmValue(params.get('utm_campaign')),
    utm_content: normalizeUtmValue(params.get('utm_content')),
    utm_term: normalizeUtmValue(params.get('utm_term')),
  };
}

export function buildTrackedWaText(baseText: string, utm?: UtmContext) {
  if (!utm) return baseText;

  const fields: Array<[string, string | undefined]> = [
    ['Landing', utm.landingPath],
    ['utm_source', utm.utm_source],
    ['utm_medium', utm.utm_medium],
    ['utm_campaign', utm.utm_campaign],
    ['utm_content', utm.utm_content],
    ['utm_term', utm.utm_term],
  ];

  const trackingLines = fields
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => `${label}: ${value}`);

  if (trackingLines.length === 0) {
    return `${baseText}\n\nRef: ${utm.landingPath ?? 'direct'}`;
  }

  return `${baseText}\n\n--- Tracking Ads ---\n${trackingLines.join('\n')}`;
}

export function trackedWaLink(baseText: string, utm?: UtmContext) {
  return waLink(buildTrackedWaText(baseText, utm));
}

export function withUtmParams(basePath: string, utm?: UtmContext) {
  if (!utm) return basePath;

  const params = new URLSearchParams();

  if (utm.utm_source) params.set('utm_source', utm.utm_source);
  if (utm.utm_medium) params.set('utm_medium', utm.utm_medium);
  if (utm.utm_campaign) params.set('utm_campaign', utm.utm_campaign);
  if (utm.utm_content) params.set('utm_content', utm.utm_content);
  if (utm.utm_term) params.set('utm_term', utm.utm_term);

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}
