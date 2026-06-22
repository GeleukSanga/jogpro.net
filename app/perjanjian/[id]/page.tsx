import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WAFloat from "@/components/WAFloat";

interface GadaiApp {
  id: string;
  nama: string;
  nik?: string;
  alamat?: string;
  nomor_wa: string;
  jenis_hp: string;
  kondisi: string;
  harga_pasar: number;
  nominal_pinjaman: number;
  foto_selfie_url: string | null;
  foto_depan_url: string | null;
  foto_belakang_url: string | null;
  status: string;
  created_at: string;
}

async function getApplication(id: string): Promise<GadaiApp | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://jogpro.net"}/api/gadai/${id}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.application || null;
  } catch {
    return null;
  }
}

function formatRp(val: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadge(status: string) {
  const map: Record<string, { label: string; color: string }> = {
    pending: { label: "Menunggu Verifikasi", color: "bg-yellow-50 text-yellow-700 border-yellow-100" },
    verified: { label: "Terverifikasi", color: "bg-green-50 text-green-700 border-green-100" },
    active: { label: "Gadai Aktif", color: "bg-blue-50 text-blue-700 border-blue-100" },
    redeemed: { label: "Sudah Ditebus", color: "bg-gray-50 text-gray-600 border-gray-100" },
    auctioned: { label: "Dilelang", color: "bg-red-50 text-red-700 border-red-100" },
  };
  const s = map[status] || { label: status, color: "bg-gray-50 text-gray-600 border-gray-100" };
  return (
    <span className={`inline-block text-xs px-3 py-1 rounded-full border font-medium ${s.color}`}>
      {s.label}
    </span>
  );
}

export default async function PerjanjianPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const app = await getApplication(id);

  if (!app) notFound();

  const bunga = Math.max(100000, app.nominal_pinjaman * 0.1);
  const totalTebus = app.nominal_pinjaman + bunga;

  return (
    <>
      <Navbar />
      <WAFloat />

      <div className="pt-24 pb-4 px-4 max-w-3xl mx-auto">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-medium tracking-widest uppercase text-gray-400">
            Bukti Perjanjian Gadai
          </span>
          {statusBadge(app.status)}
        </div>
        <h1 className="text-2xl font-bold mb-1">Perjanjian #{app.id.slice(0, 8).toUpperCase()}</h1>
        <p className="text-sm text-gray-400">Dibuat: {formatDate(app.created_at)}</p>
      </div>

      <section className="py-8 px-4 max-w-3xl mx-auto space-y-6">
        {/* Identitas */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold">Data Peminjam</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { label: "Nama Lengkap", value: app.nama },
              { label: "NIK", value: app.nik || "-" },
              { label: "Nomor WhatsApp", value: app.nomor_wa },
              { label: "Alamat", value: app.alamat || "-" },
            ].map((r) => (
              <div key={r.label} className="flex px-6 py-3">
                <span className="text-sm text-gray-400 w-40 flex-shrink-0">{r.label}</span>
                <span className="text-sm font-medium">{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* HP Info */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold">Barang Gadai</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { label: "Jenis HP", value: app.jenis_hp },
              { label: "Kondisi", value: app.kondisi },
            ].map((r) => (
              <div key={r.label} className="flex px-6 py-3">
                <span className="text-sm text-gray-400 w-40 flex-shrink-0">{r.label}</span>
                <span className="text-sm font-medium">{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Keuangan */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold">Detail Pinjaman</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { label: "Nominal Pinjaman", value: formatRp(app.nominal_pinjaman) },
              { label: "Bunga (10%)", value: formatRp(bunga) },
              { label: "Total Tebus", value: formatRp(totalTebus), bold: true },
              { label: "Tenor", value: "2 Minggu" },
              { label: "Masa Tenggang", value: "3 Hari" },
            ].map((r) => (
              <div key={r.label} className="flex px-6 py-3">
                <span className="text-sm text-gray-400 w-40 flex-shrink-0">{r.label}</span>
                <span className={`text-sm ${r.bold ? "font-bold" : "font-medium"}`}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Foto */}
        {(app.foto_selfie_url || app.foto_depan_url || app.foto_belakang_url) && (
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold">Dokumentasi Foto</h3>
            </div>
            <div className="grid grid-cols-3 gap-3 p-6">
              {[
                { url: app.foto_selfie_url, label: "Selfie" },
                { url: app.foto_depan_url, label: "Tampak Depan" },
                { url: app.foto_belakang_url, label: "Tampak Belakang" },
              ].map(
                ({ url, label }) =>
                  url && (
                    <div key={label} className="text-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={label}
                        className="w-full aspect-square object-cover rounded-xl mb-1"
                      />
                      <p className="text-xs text-gray-400">{label}</p>
                    </div>
                  )
              )}
            </div>
          </div>
        )}

        {/* Ketentuan */}
        <div className="bg-gray-50 rounded-2xl p-6 text-sm text-gray-500 space-y-2">
          <p className="font-semibold text-black mb-3">Ketentuan yang Disetujui</p>
          <p>✓ Barang adalah milik sah peminjam, bukan barang curian atau hasil kejahatan.</p>
          <p>✓ Bunga gadai 10% dari nominal pinjaman, minimum Rp100.000 untuk tenor 2 minggu.</p>
          <p>✓ Tenor gadai maksimal 2 minggu dengan masa tenggang 3 hari.</p>
          <p>✓ Jika tidak ditebus sampai masa tenggang berakhir, barang menjadi hak Jogpro Finance/Jo untuk dimiliki, dijual, atau dilelang tanpa kompensasi tambahan.</p>
        </div>

        {/* CTA WA */}
        <div className="text-center pt-4 pb-8">
          <a
            href={`https://wa.me/628972523968?text=Halo%20Jogpro%2C%20saya%20ingin%20konfirmasi%20perjanjian%20gadai%20%23${app.id.slice(0, 8).toUpperCase()}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Hubungi Jo via WhatsApp →
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
