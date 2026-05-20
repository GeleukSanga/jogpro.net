import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "LumiMemo — Kenangan dalam Cahaya",
  description: "Ubah foto orang tersayang jadi lampu tidur custom. Mulai Rp99.000, proses 3–5 hari, kirim se-Indonesia.",
  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  },
  openGraph: {
    title: "LumiMemo — Kenangan dalam Cahaya",
    description: "Ubah foto orang tersayang jadi lampu tidur custom. Mulai Rp99.000, proses 3–5 hari, kirim se-Indonesia.",
    url: "https://www.jogpro.net",
    siteName: "LumiMemo",
    images: [
      {
        url: "https://www.jogpro.net/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LumiMemo — Lampu Kenangan dari Fotomu",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LumiMemo — Kenangan dalam Cahaya",
    description: "Ubah foto orang tersayang jadi lampu tidur custom. Mulai Rp99.000, kirim se-Indonesia.",
    images: ["https://www.jogpro.net/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.jogpro.net",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Meta Pixel */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1333558018471897');
              fbq('track', 'PageView');
            `,
          }}
        />\n        {/* TikTok Pixel */}\n        <Script\n          id=\"tiktok-pixel\"\n          strategy=\"afterInteractive\"\n          dangerouslySetInnerHTML={{\n            __html: `\n              !function (w, d, t) {\n                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=[\"page\",\"track\",\"identify\",\"instances\",\"debug\",\"on\",\"off\",\"once\",\"ready\",\"alias\",\"group\",\"enableCookie\",\"disableCookie\",\"holdConsent\",\"revokeConsent\",\"grantConsent\"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(\n                var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r=\"https://analytics.tiktok.com/i18n/pixel/events.js\",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement(\"script\")\n                ;n.type=\"text/javascript\",n.async=!0,n.src=r+\"?sdkid=\"+e+\"&lib=\"+t;e=document.getElementsByTagName(\"script\")[0];e.parentNode.insertBefore(n,e)};\n                ttq.load('D86N95JC77UF0TO7TCG0');\n                ttq.page();\n              }(window, document, 'ttq');\n            `,\n          }}\n        />\n      </head>
      <body>{children}</body>
    </html>
  );
}
