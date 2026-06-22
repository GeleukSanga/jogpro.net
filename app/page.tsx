import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export const metadata = {
  title: "Jogpro Finance — Gadai HP & Pencairan Paylater Daerah Istimewa Yogyakarta",
  description:
    "Gadai HP proses 1 hari, bunga ringan 10%. Pencairan limit Shopee & TikTok Paylater. Aman, transparan, amanah. Melayani Daerah Istimewa Yogyakarta.",
};

const WA_URL =
  "https://wa.me/628972523968?text=Halo%20Jogpro%20Finance%2C%20saya%20ingin%20bertanya.";

const S = {
  section: {
    padding: "80px 0",
  } as React.CSSProperties,
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 24px",
  } as React.CSSProperties,
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
    letterSpacing: "0.1px",
  } as React.CSSProperties,
  btnSecondary: {
    display: "inline-block",
    background: "transparent",
    color: "#0a0a0a",
    padding: "14px 28px",
    borderRadius: "10px",
    fontWeight: 600,
    fontSize: "15px",
    textDecoration: "none",
    border: "1.5px solid #0a0a0a",
    letterSpacing: "0.1px",
  } as React.CSSProperties,
};

const faqs = [
  {
    q: "Berapa bunga gadai?",
    a: "10% dari nominal pinjaman, minimum Rp100.000 untuk 2 minggu.",
  },
  {
    q: "Berapa lama tenor gadai?",
    a: "Maksimal 2 minggu + 3 hari masa tenggang. Jika lewat, barang menjadi hak Jogpro Finance/Jo untuk dimiliki, dijual, atau dilelang.",
  },
  {
    q: "HP apa saja yang diterima?",
    a: "Semua merek diterima. Kondisi dinilai saat cek fisik langsung.",
  },
  {
    q: "Apakah aman?",
    a: "Kami tidak menerima barang curian. Setiap transaksi dilindungi perjanjian digital.",
  },
];

const whyUs = [
  { icon: "⚡", title: "Proses Cepat 1 Hari", desc: "Dari pengajuan hingga dana cair, selesai dalam 1 hari kerja." },
  { icon: "🤝", title: "Transparan & Amanah", desc: "Semua syarat dan bunga dijelaskan terbuka sebelum proses dimulai." },
  { icon: "📊", title: "Bunga Jelas", desc: "10% dari nominal, minimum Rp100.000 untuk tenor 2 minggu. Tidak ada biaya lain." },
  { icon: "🔒", title: "Tanpa Biaya Tersembunyi", desc: "Yang kami sampaikan di awal adalah yang Anda bayar. Tidak ada kejutan." },
];

const steps = [
  { n: "01", title: "Hubungi via WA & Kirim Foto HP", desc: "Chat kami di WhatsApp, kirimkan foto kondisi HP yang ingin digadaikan." },
  { n: "02", title: "Cek Fisik & Kesepakatan Nilai", desc: "Kami nilai kondisi HP dan sepakati nominal pinjaman bersama-sama." },
  { n: "03", title: "Isi Form Perjanjian Online", desc: "Tanda tangani perjanjian digital yang melindungi kedua pihak." },
  { n: "04", title: "Dana Cair ke Rekeningmu", desc: "Dana ditransfer langsung ke rekening Anda hari itu juga." },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <WhatsAppFloat />

      {/* ── HERO ── */}
      <section style={{ ...S.section, paddingTop: "120px", background: "#ffffff" }}>
        <div style={S.container}>
          <div style={{ maxWidth: "720px" }}>
            {/* Badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "28px" }}>
              {["✓ Proses 1 Hari", "✓ Amanah", "✓ Transparan"].map((b) => (
                <span
                  key={b}
                  style={{
                    background: "#f5f5f5",
                    color: "#0a0a0a",
                    fontSize: "13px",
                    fontWeight: 500,
                    padding: "6px 14px",
                    borderRadius: "99px",
                    border: "1px solid #e5e5e5",
                  }}
                >
                  {b}
                </span>
              ))}
            </div>

            <h1
              style={{
                fontSize: "clamp(36px, 6vw, 56px)",
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-1.5px",
                color: "#0a0a0a",
                marginBottom: "20px",
              }}
            >
              Gadai HP & Paylater,{" "}
              <span style={{ color: "#6b7280" }}>Cair Hari Ini</span>
            </h1>

            <p
              style={{
                fontSize: "18px",
                color: "#6b7280",
                lineHeight: 1.7,
                marginBottom: "36px",
                maxWidth: "560px",
              }}
            >
              Layanan gadai handphone terpercaya dan pencairan Shopee/TikTok Paylater. Proses 1 hari, aman, transparan. Melayani Daerah Istimewa Yogyakarta.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              <Link href="/gadai" style={S.btnPrimary}>Ajukan Gadai →</Link>
              <Link href="/paylater" style={S.btnSecondary}>Info Paylater</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── LAYANAN ── */}
      <section style={{ ...S.section, background: "#f5f5f5" }}>
        <div style={S.container}>
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              marginBottom: "8px",
            }}
          >
            Layanan Kami
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "40px", fontSize: "16px" }}>
            Dua layanan utama untuk kebutuhan finansial Anda.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {/* Card Gadai */}
            <div style={S.card}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>📱</div>
              <h3 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "12px" }}>Gadai HP</h3>
              <p style={{ color: "#6b7280", fontSize: "15px", lineHeight: 1.7, marginBottom: "20px" }}>
                Gadaikan handphone Anda dengan proses mudah via WhatsApp. Cek fisik, sepakat nilai, dana cair hari itu.
              </p>
              <div
                style={{
                  background: "#f5f5f5",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "24px",
                  display: "inline-block",
                }}
              >
                <span style={{ fontWeight: 700, color: "#0a0a0a", fontSize: "15px" }}>Bunga 10%</span>
                <span style={{ color: "#6b7280", fontSize: "13px" }}> / 2 minggu · min Rp100.000</span>
              </div>
              <br />
              <Link href="/gadai" style={S.btnPrimary}>Pelajari & Ajukan →</Link>
            </div>

            {/* Card Paylater */}
            <div style={S.card}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>💳</div>
              <h3 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "12px" }}>Pencairan Paylater</h3>
              <p style={{ color: "#6b7280", fontSize: "15px", lineHeight: 1.7, marginBottom: "20px" }}>
                Punya limit Shopee PayLater atau TikTok Paylater tapi butuh uang tunai? Kami bantu cairkan dengan aman.
              </p>
              <div
                style={{
                  background: "#f5f5f5",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "24px",
                  display: "flex",
                  gap: "16px",
                  alignItems: "center",
                }}
              >
                <Image src="/logo-shopee.jpg" alt="Shopee PayLater" width={36} height={36} style={{ objectFit: "contain", borderRadius: 6 }} />
                <span style={{ fontSize: "13px", color: "#6b7280" }}>Shopee PayLater</span>
                <Image src="/logo-tiktok.jpg" alt="TikTok Paylater" width={36} height={36} style={{ objectFit: "contain", borderRadius: 6 }} />
                <span style={{ fontSize: "13px", color: "#6b7280" }}>TikTok Paylater</span>
              </div>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={S.btnPrimary}>
                Hubungi via WA →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CARA KERJA ── */}
      <section style={S.section}>
        <div style={S.container}>
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              marginBottom: "8px",
            }}
          >
            Cara Kerja Gadai
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "48px", fontSize: "16px" }}>
            Empat langkah mudah dari WhatsApp hingga dana cair.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "24px",
            }}
          >
            {steps.map((s) => (
              <div key={s.n} style={{ ...S.card, position: "relative" }}>
                <div
                  style={{
                    fontSize: "48px",
                    fontWeight: 800,
                    color: "#e5e5e5",
                    lineHeight: 1,
                    marginBottom: "16px",
                  }}
                >
                  {s.n}
                </div>
                <h4 style={{ fontWeight: 700, fontSize: "16px", marginBottom: "10px", lineHeight: 1.4 }}>
                  {s.title}
                </h4>
                <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KENAPA PILIH KAMI ── */}
      <section style={{ ...S.section, background: "#0a0a0a" }}>
        <div style={S.container}>
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              marginBottom: "8px",
              color: "#ffffff",
            }}
          >
            Kenapa Pilih Kami?
          </h2>
          <p style={{ color: "#9ca3af", marginBottom: "48px", fontSize: "16px" }}>
            Kami dibangun di atas kepercayaan dan transparansi.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "24px",
            }}
          >
            {whyUs.map((w) => (
              <div
                key={w.title}
                style={{
                  border: "1px solid #1f2937",
                  borderRadius: "12px",
                  padding: "32px",
                  background: "#111111",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "14px" }}>{w.icon}</div>
                <h4 style={{ fontWeight: 700, fontSize: "16px", marginBottom: "10px", color: "#ffffff" }}>
                  {w.title}
                </h4>
                <p style={{ fontSize: "14px", color: "#9ca3af", lineHeight: 1.7 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={S.section}>
        <div style={S.container}>
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              marginBottom: "8px",
            }}
          >
            Pertanyaan Umum
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "40px", fontSize: "16px" }}>
            Jawaban untuk pertanyaan yang sering ditanyakan.
          </p>

          <div style={{ maxWidth: "720px" }}>
            {faqs.map((faq, i) => (
              <div
                key={faq.q}
                style={{
                  padding: "24px 0",
                  borderBottom: i < faqs.length - 1 ? "1px solid #e5e5e5" : "none",
                }}
              >
                <h4 style={{ fontWeight: 700, fontSize: "16px", marginBottom: "8px", color: "#0a0a0a" }}>
                  {faq.q}
                </h4>
                <p style={{ fontSize: "15px", color: "#6b7280", lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BOTTOM ── */}
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
                fontSize: "clamp(24px, 4vw, 40px)",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.8px",
                marginBottom: "16px",
              }}
            >
              Siap Mengajukan?
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "17px", marginBottom: "32px" }}>
              Hubungi kami sekarang via WhatsApp. Respon cepat, proses cepat.
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
                letterSpacing: "0.1px",
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
