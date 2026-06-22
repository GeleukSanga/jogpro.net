import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      background: "#0a0a0a",
      color: "#ffffff",
      padding: "48px 24px 32px",
      marginTop: "auto",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Top */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "40px",
          marginBottom: "40px",
        }}>
          {/* Brand */}
          <div>
            <div style={{ fontWeight: 700, fontSize: "18px", marginBottom: "12px", letterSpacing: "-0.3px" }}>
              Jogpro <span style={{ color: "#6b7280", fontWeight: 400 }}>Finance</span>
            </div>
            <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.7, maxWidth: "240px" }}>
              Gadai HP & pencairan Paylater terpercaya. Proses cepat, transparan, dan amanah. Melayani Daerah Istimewa Yogyakarta.
            </p>
          </div>

          {/* Links */}
          <div>
            <div style={{ fontWeight: 600, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b7280", marginBottom: "16px" }}>
              Layanan
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link href="/gadai" style={{ color: "#d1d5db", fontSize: "14px", textDecoration: "none" }}>Gadai HP</Link>
              <Link href="/paylater" style={{ color: "#d1d5db", fontSize: "14px", textDecoration: "none" }}>Pencairan Paylater</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontWeight: 600, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b7280", marginBottom: "16px" }}>
              Kontak
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a
                href="https://wa.me/628972523968"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#d1d5db", fontSize: "14px", textDecoration: "none" }}
              >
                WhatsApp: 0897-2523-968
              </a>
              <span style={{ color: "#9ca3af", fontSize: "14px" }}>Daerah Istimewa Yogyakarta</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: "1px solid #1f2937",
          paddingTop: "24px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "8px",
          alignItems: "center",
        }}>
          <p style={{ color: "#6b7280", fontSize: "13px" }}>
            © {new Date().getFullYear()} Jogpro Finance. Hak cipta dilindungi.
          </p>
          <p style={{ color: "#4b5563", fontSize: "12px" }}>
            Melayani Daerah Istimewa Yogyakarta · Proses 1 Hari · Amanah
          </p>
        </div>
      </div>
    </footer>
  );
}
