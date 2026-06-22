import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import PixelEvent from "@/components/PixelEvent";

export const metadata = {
  title: "Pencairan Shopee & TikTok Paylater — Jogpro Finance",
  description:
    "Cairkan limit Shopee PayLater dan TikTok Paylater dengan mudah. Hanya untuk pemilik akun aktif dengan limit. Proses 1-2 hari kerja via WhatsApp.",
};

const WA_URL =
  "https://wa.me/628972523968?text=Halo%20Jogpro%20Finance%2C%20saya%20ingin%20info%20pencairan%20paylater.";

const S = {
  section: { padding: "80px 0" } as React.CSSProperties,
  container: { maxWidth: "1100px", margin: "0 auto", padding: "0 24px" } as React.CSSProperties,
  card: {
    border: "1px solid #e5e5e5",
    borderRadius: "12px",
    padding: "32px",
    background: "#ffffff",
  } as React.CSSProperties,
  btnPrimary: {
    display: "inline-block",
    background: "#0a0a0a",
    color: "#ffffff",
    padding: "14px 28px",
    borderRadius: "10px",
    fontWeight: 600,
    fontSize: "15px",
    textDecoration: "none",
  } as React.CSSProperties,
};

const platforms = [
  {
    logo: "/logo-shopee.jpg",
    name: "Shopee PayLater (SPayLater)",
    desc: "Punya limit SPayLater yang tidak terpakai? Kami bantu cairkan menjadi uang tunai yang langsung bisa digunakan.",
  },
  {
    logo: "/logo-tiktok.jpg",
    name: "TikTok Shop Paylater",
    desc: "Limit TikTok Shop Paylater Anda bisa dicairkan menjadi dana tunai. Proses mudah dan aman via WhatsApp.",
  },
];

const steps = [
  { n: "01", title: "Hubungi via WhatsApp", desc: "Chat kami dan sebutkan platform paylater serta nominal yang ingin dicairkan." },
  { n: "02", title: "Tim Jelaskan Prosedur", desc: "Kami menjelaskan seluruh prosedur dan biaya secara terbuka sebelum proses dimulai." },
  { n: "03", title: "Proses 1-2 Hari Kerja", desc: "Proses pencairan berjalan setelah semua pihak sepakat." },
  { n: "04", title: "Dana Cair", desc: "Dana tunai langsung ke rekening atau dompet digital Anda." },
];

const faqs = [
  {
    q: "Siapa yang bisa menggunakan layanan ini?",
    a: "Hanya pemilik akun aktif Shopee atau TikTok dengan limit paylater yang tersedia. Akun harus atas nama sendiri.",
  },
  {
    q: "Berapa biaya pencairan?",
    a: "Biaya variatif tergantung nominal dan platform. Semua dijelaskan transparan via WhatsApp sebelum proses dimulai — tidak ada biaya tersembunyi.",
  },
  {
    q: "Berapa lama prosesnya?",
    a: "Estimasi 1-2 hari kerja setelah semua pihak sepakat dan proses berjalan.",
  },
];

export default function PaylaterPage() {
  return (
    <>
      <PixelEvent event="ViewContent" params={{ content_name: 'Pencairan Paylater', content_category: 'Finance' }} />
      <Navbar />
      <WhatsAppFloat />

      {/* ── HERO ── */}
      <section style={{ ...S.section, paddingTop: "120px", paddingBottom: "60px" }}>
        <div style={S.container}>
          <div style={{ maxWidth: "640px" }}>
            <span
              style={{
                display: "inline-block",
                background: "#f5f5f5",
                color: "#6b7280",
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                padding: "6px 14px",
                borderRadius: "99px",
                marginBottom: "20px",
              }}
            >
              Layanan 2
            </span>
            <h1
              style={{
                fontSize: "clamp(28px, 5vw, 48px)",
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: "-1px",
                color: "#0a0a0a",
                marginBottom: "16px",
              }}
            >
              Pencairan Shopee &amp; TikTok Paylater
            </h1>
            <p
              style={{
                fontSize: "17px",
                color: "#6b7280",
                lineHeight: 1.7,
                marginBottom: "28px",
              }}
            >
              Punya limit paylater tapi butuh uang tunai? Kami bantu cairkan dengan proses sederhana,
              transparan, dan aman via WhatsApp.
            </p>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={S.btnPrimary}>
              💬 Hubungi via WhatsApp →
            </a>
          </div>
        </div>
      </section>

      {/* ── INFO PENTING ── */}
      <div style={{ background: "#fff8e7" }}>
        <div style={{ ...S.container, padding: "20px 24px" }}>
          <p style={{ fontSize: "14px", color: "#92400e", lineHeight: 1.6 }}>
            <strong>⚠️ Info Penting:</strong> Layanan ini hanya untuk pemilik akun aktif Shopee/TikTok
            dengan limit paylater yang sudah tersedia. Akun harus atas nama sendiri.
          </p>
        </div>
      </div>

      {/* ── PLATFORM ── */}
      <section style={S.section}>
        <div style={S.container}>
          <h2
            style={{
              fontSize: "clamp(22px, 3.5vw, 32px)",
              fontWeight: 700,
              letterSpacing: "-0.4px",
              marginBottom: "8px",
            }}
          >
            Platform yang Tersedia
          </h2>
          <p style={{ color: "#6b7280", fontSize: "15px", marginBottom: "36px" }}>
            Kami melayani pencairan dari dua platform paylater populer.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
            }}
          >
            {platforms.map((p) => (
              <div key={p.name} style={S.card}>
                <div style={{ width: 80, height: 80, borderRadius: 12, overflow: "hidden", marginBottom: "16px", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Image src={p.logo} alt={p.name} width={80} height={80} style={{ objectFit: "contain" }} />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>{p.name}</h3>
                <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CARA PENGAJUAN ── */}
      <section style={{ ...S.section, background: "#f5f5f5" }}>
        <div style={S.container}>
          <h2
            style={{
              fontSize: "clamp(22px, 3.5vw, 32px)",
              fontWeight: 700,
              letterSpacing: "-0.4px",
              marginBottom: "8px",
            }}
          >
            Cara Pengajuan
          </h2>
          <p style={{ color: "#6b7280", fontSize: "15px", marginBottom: "36px" }}>
            Semua cukup lewat WhatsApp. Tidak perlu datang langsung.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            {steps.map((s) => (
              <div
                key={s.n}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e5e5",
                  borderRadius: "12px",
                  padding: "28px 24px",
                }}
              >
                <div
                  style={{
                    fontSize: "40px",
                    fontWeight: 800,
                    color: "#e5e5e5",
                    lineHeight: 1,
                    marginBottom: "14px",
                  }}
                >
                  {s.n}
                </div>
                <h4 style={{ fontWeight: 700, fontSize: "15px", marginBottom: "8px", lineHeight: 1.4 }}>
                  {s.title}
                </h4>
                <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Estimasi */}
          <div
            style={{
              marginTop: "32px",
              background: "#0a0a0a",
              borderRadius: "12px",
              padding: "24px 28px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "28px" }}>⏱️</span>
            <div>
              <div style={{ color: "#ffffff", fontWeight: 700, fontSize: "16px" }}>
                Estimasi Proses: 1-2 Hari Kerja
              </div>
              <div style={{ color: "#9ca3af", fontSize: "13px", marginTop: "4px" }}>
                Setelah semua pihak sepakat dan proses dimulai.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={S.section}>
        <div style={S.container}>
          <h2
            style={{
              fontSize: "clamp(22px, 3.5vw, 32px)",
              fontWeight: 700,
              letterSpacing: "-0.4px",
              marginBottom: "8px",
            }}
          >
            Pertanyaan Umum
          </h2>
          <p style={{ color: "#6b7280", fontSize: "15px", marginBottom: "36px" }}>
            Hal yang sering ditanyakan tentang layanan pencairan paylater.
          </p>

          <div style={{ maxWidth: "680px" }}>
            {faqs.map((faq, i) => (
              <div
                key={faq.q}
                style={{
                  padding: "24px 0",
                  borderBottom: i < faqs.length - 1 ? "1px solid #e5e5e5" : "none",
                }}
              >
                <h4 style={{ fontWeight: 700, fontSize: "15px", marginBottom: "8px", color: "#0a0a0a" }}>
                  {faq.q}
                </h4>
                <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ ...S.section, background: "#f5f5f5" }}>
        <div style={S.container}>
          <div
            style={{
              background: "#0a0a0a",
              borderRadius: "16px",
              padding: "64px 48px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(22px, 4vw, 36px)",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.8px",
                marginBottom: "14px",
              }}
            >
              Siap Cairkan Paylater?
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "16px", marginBottom: "32px", maxWidth: "400px", margin: "0 auto 32px" }}>
              Chat langsung via WhatsApp. Kami respon cepat dan jelaskan semua prosedur secara terbuka.
            </p>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "#25d366",
                color: "#ffffff",
                padding: "16px 36px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "16px",
                textDecoration: "none",
              }}
            >
              💬 Chat WhatsApp Sekarang
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
