import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WAFloat from "@/components/WAFloat";
import GadaiForm from "./GadaiForm";
import PixelEvent from "@/components/PixelEvent";

export const metadata = {
  title: "Gadai HP — Jogpro Finance",
  description:
    "Ajukan gadai HP online. Proses cepat 1 hari, bunga 10% untuk tenor 2 minggu. Melayani Daerah Istimewa Yogyakarta.",
};

const INFO_CARDS = [
  {
    label: "Bunga",
    value: "10%",
    sub: "per 2 minggu · minimum Rp100.000",
    highlight: true,
  },
  {
    label: "Tenor",
    value: "2 Minggu",
    sub: "+ masa tenggang 3 hari",
    highlight: false,
  },
  {
    label: "Pencairan",
    value: "1 Hari",
    sub: "dari pengajuan disetujui",
    highlight: false,
  },
];

export default function GadaiPage() {
  return (
    <>
      <PixelEvent event="ViewContent" params={{ content_name: 'Gadai HP', content_category: 'Finance' }} />
      <Navbar />
      <WAFloat />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: 96,
          paddingBottom: 48,
          background: "var(--black)",
          color: "var(--white)",
        }}
      >
        <div className="container">
          <span
            style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#a3a3a3",
              marginBottom: 16,
            }}
          >
            Layanan Gadai
          </span>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: 16,
            }}
          >
            Gadai HP Cepat &amp; Amanah
          </h1>
          <p style={{ fontSize: 18, color: "#a3a3a3", maxWidth: 480 }}>
            Bunga ringan 10%, tenor 2 minggu, dana cair dalam 1 hari kerja. Proses transparan tanpa biaya tersembunyi.
          </p>
        </div>
      </section>

      {/* ── Info Cards ────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 40,
            }}
          >
            {INFO_CARDS.map((card) => (
              <div
                key={card.label}
                style={{
                  border: card.highlight ? "2px solid #0a0a0a" : "1px solid #e5e5e5",
                  borderRadius: 12,
                  padding: "24px 20px",
                  background: card.highlight ? "#0a0a0a" : "#fff",
                  position: "relative",
                }}
              >
                {card.highlight && (
                  <span style={{
                    position: "absolute",
                    top: -10,
                    left: 16,
                    background: "#0a0a0a",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "3px 10px",
                    borderRadius: 99,
                    border: "1px solid #fff",
                  }}>Transparan</span>
                )}
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: card.highlight ? "#a3a3a3" : "#a3a3a3",
                    marginBottom: 8,
                  }}
                >
                  {card.label}
                </p>
                <p
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: card.highlight ? "#fff" : "var(--black)",
                    marginBottom: 4,
                  }}
                >
                  {card.value}
                </p>
                <p style={{ fontSize: 13, color: card.highlight ? "#e5e5e5" : "#525252" }}>{card.sub}</p>
              </div>
            ))}
          </div>

          {/* ── Banner bunga ─────────────────────────────────────────────────── */}
          <div style={{
            background: "#fafafa",
            border: "1px solid #e5e5e5",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <span style={{ fontSize: 20 }}>💡</span>
            <p style={{ fontSize: 14, color: "#525252", lineHeight: 1.6 }}>
              <strong>Contoh:</strong> Pinjam Rp1.000.000 selama 2 minggu → bunga Rp100.000 (10%).
              Total kembalikan <strong>Rp1.100.000</strong>. Tidak ada biaya lain.
            </p>
          </div>

          {/* ── Syarat Barang ──────────────────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {/* Diterima */}
            <div
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 12,
                padding: "24px 20px",
              }}
            >
              <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
                ✅ Syarat Barang Diterima
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  "Kondisi maksimal ada cacat ringan (baret halus, lecet kecil)",
                  "RAM minimal 8GB",
                  "Semua merek HP (Apple, Samsung, Xiaomi, OPPO, dll)",
                  "HP masih menyala dan dapat dioperasikan",
                ].map((item) => (
                  <li key={item} style={{ fontSize: 13, color: "#525252", display: "flex", gap: 8 }}>
                    <span style={{ flexShrink: 0, color: "#16a34a" }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tidak diterima */}
            <div
              style={{
                border: "2px solid #fecaca",
                borderRadius: 12,
                padding: "24px 20px",
                background: "#fff5f5",
              }}
            >
              <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: "#dc2626" }}>
                🚫 Tidak Kami Terima
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  "Barang curian atau hasil kejahatan",
                  "HP yang tidak dapat dinyalakan sama sekali",
                  "Barang milik orang lain tanpa surat kuasa",
                ].map((item) => (
                  <li key={item} style={{ fontSize: 13, color: "#7f1d1d", display: "flex", gap: 8 }}>
                    <span style={{ flexShrink: 0 }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p
                style={{
                  marginTop: 16,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#dc2626",
                  background: "#fecaca",
                  padding: "8px 12px",
                  borderRadius: 6,
                }}
              >
                ⚠️ Pengajuan dengan barang curian akan langsung dilaporkan ke pihak berwajib.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Form Pengajuan ────────────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: 48,
          paddingBottom: 96,
          background: "#fafafa",
          borderTop: "1px solid #e5e5e5",
        }}
      >
        <div className="container">
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>
              Formulir Pengajuan Gadai
            </h2>
            <p style={{ fontSize: 14, color: "#525252", marginBottom: 32 }}>
              Isi data di bawah. Tim kami akan menghubungi Anda via WhatsApp untuk verifikasi dan jadwal serah terima.
            </p>
            <GadaiForm />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
