"use client";

import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";

const CONDITIONS = ["Mulus", "Bekas Mulus", "Ada Cacat Ringan"] as const;

const CLAUSES = [
  "Saya menyatakan barang yang digadaikan adalah milik sah saya dan BUKAN barang curian atau hasil kejahatan",
  "Saya memahami bunga gadai 10% dari nominal pinjaman per 2 minggu, minimum Rp100.000",
  "Saya memahami tenor gadai maksimal 2 minggu dengan masa tenggang 3 hari setelah jatuh tempo",
  "Jika tidak ditebus sampai masa tenggang berakhir, barang menjadi hak Jogpro Finance/Jo untuk dimiliki, dijual, atau dilelang tanpa kompensasi tambahan",
  "HP yang saya ajukan memiliki RAM minimal 8GB dan kondisi maksimal cacat ringan",
  "Saya menyetujui seluruh ketentuan dan perjanjian gadai Jogpro Finance",
];

type WilayahItem = { id: string; name: string };

function formatRp(raw: string): string {
  const num = raw.replace(/\D/g, "");
  if (!num) return "";
  return new Intl.NumberFormat("id-ID").format(Number(num));
}

function parseRp(val: string): number {
  return Number(val.replace(/\D/g, "")) || 0;
}

interface FileState {
  file: File | null;
  preview: string;
}

const inputStyle: React.CSSProperties = {
  border: "1px solid #e5e5e5",
  borderRadius: 8,
  padding: "12px 16px",
  width: "100%",
  fontSize: 16,
  fontFamily: "inherit",
  outline: "none",
  transition: "border-color 0.15s",
  background: "#fff",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 600,
  fontSize: 14,
  marginBottom: 6,
};

const errorTextStyle: React.CSSProperties = {
  color: "#dc2626",
  fontSize: 13,
  marginTop: 4,
};

export default function GadaiForm() {
  // Personal data
  const [nama, setNama] = useState("");
  const [nik, setNik] = useState("");
  const [nomorWa, setNomorWa] = useState("");
  const [jenisHp, setJenisHp] = useState("");
  const [kondisi, setKondisi] = useState<string>(CONDITIONS[0]);
  const [nominalStr, setNominalStr] = useState("");
  const [clauses, setClauses] = useState<boolean[]>(CLAUSES.map(() => false));

  // Address
  const [provinces, setProvinces] = useState<WilayahItem[]>([]);
  const [regencies, setRegencies] = useState<WilayahItem[]>([]);
  const [districts, setDistricts] = useState<WilayahItem[]>([]);
  const [villages, setVillages] = useState<WilayahItem[]>([]);
  const [selProv, setSelProv] = useState("");
  const [selReg, setSelReg] = useState("");
  const [selDist, setSelDist] = useState("");
  const [selVill, setSelVill] = useState("");
  const [jalan, setJalan] = useState("");

  // Photos
  const [selfie, setSelfie] = useState<FileState>({ file: null, preview: "" });
  const [fotoDpn, setFotoDpn] = useState<FileState>({ file: null, preview: "" });
  const [fotoBelakang, setFotoBelakang] = useState<FileState>({ file: null, preview: "" });
  const selfieRef = useRef<HTMLInputElement>(null);
  const depanRef = useRef<HTMLInputElement>(null);
  const belakangRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState<{ id: string; nama: string; link_bukti: string } | null>(null);
  const [focused, setFocused] = useState<Record<string, boolean>>({});

  function onFocus(key: string) { setFocused(prev => ({ ...prev, [key]: true })); }
  function onBlur(key: string) { setFocused(prev => ({ ...prev, [key]: false })); }
  function dynInput(key: string, isError = false): React.CSSProperties {
    return {
      ...inputStyle,
      borderColor: isError ? "#dc2626" : focused[key] ? "#0a0a0a" : "#e5e5e5",
    };
  }

  // Load provinces on mount
  useEffect(() => {
    fetch("/api-wilayah/provinces.json").then(r => r.json()).then(setProvinces).catch(() => {});
  }, []);

  function onProvinceChange(id: string) {
    setSelProv(id); setSelReg(""); setSelDist(""); setSelVill("");
    setRegencies([]); setDistricts([]); setVillages([]);
    if (id) fetch(`/api/wilayah/regencies/${id}`).then(r => r.json()).then(setRegencies).catch(() => {});
  }
  function onRegencyChange(id: string) {
    setSelReg(id); setSelDist(""); setSelVill("");
    setDistricts([]); setVillages([]);
    if (id) fetch(`/api/wilayah/districts/${id}`).then(r => r.json()).then(setDistricts).catch(() => {});
  }
  function onDistrictChange(id: string) {
    setSelDist(id); setSelVill(""); setVillages([]);
    if (id) fetch(`/api/wilayah/villages/${id}`).then(r => r.json()).then(setVillages).catch(() => {});
  }

  const alamatLengkap = [
    jalan,
    villages.find(v => v.id === selVill)?.name,
    districts.find(d => d.id === selDist)?.name,
    regencies.find(r => r.id === selReg)?.name,
    provinces.find(p => p.id === selProv)?.name,
  ].filter(Boolean).join(", ");

  const nominal = parseRp(nominalStr);
  const nikError = nik.length > 0 && nik.length !== 16;

  function handleFile(e: ChangeEvent<HTMLInputElement>, setter: (v: FileState) => void) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setSubmitError("Ukuran file maksimal 5MB."); return; }
    setSubmitError("");
    const reader = new FileReader();
    reader.onload = (ev) => setter({ file, preview: ev.target?.result as string });
    reader.readAsDataURL(file);
  }

  function toggleClause(i: number) {
    setClauses((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  const allClausesChecked = clauses.every(Boolean);
  const allPhotos = !!(selfie.file && fotoDpn.file && fotoBelakang.file);
  const addressValid = !!(selProv && selReg && selDist && selVill && jalan.trim());
  const canSubmit =
    !!(nama && nik.length === 16 && nomorWa && jenisHp && kondisi &&
    nominal > 0 && addressValid && allPhotos && allClausesChecked);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setSubmitError("");

    try {
      const fd = new FormData();
      fd.append("nama", nama);
      fd.append("nik", nik);
      fd.append("nomor_wa", nomorWa);
      fd.append("jenis_hp", jenisHp);
      fd.append("kondisi", kondisi);
      fd.append("nominal_pinjaman", String(nominal));
      fd.append("alamat", alamatLengkap);
      fd.append("foto_selfie", selfie.file!);
      fd.append("foto_depan", fotoDpn.file!);
      fd.append("foto_belakang", fotoBelakang.file!);

      const res = await fetch("/api/gadai/submit", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim pengajuan.");
      setSuccess({ id: data.id, nama, link_bukti: data.link_bukti });
      // Meta Pixel — Lead event on successful gadai submission
      if (typeof window !== 'undefined' && (window as unknown as { fbq?: Function }).fbq) {
        (window as unknown as { fbq: Function }).fbq('track', 'Lead', { content_name: 'Gadai HP', currency: 'IDR', value: nominal });
      }
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (success) {
    const waMsg = encodeURIComponent(
      `Halo Jogpro Finance, saya telah mengajukan gadai HP.\nID Pengajuan: ${success.id}\nNama: ${success.nama}`
    );
    const waLink = `https://wa.me/628972523968?text=${waMsg}`;
    return (
      <div style={{ border: "1px solid #e5e5e5", borderRadius: 16, padding: "40px 32px", textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Pengajuan Berhasil Dikirim!</h3>
        <p style={{ color: "#525252", fontSize: 15, marginBottom: 24 }}>
          Kami akan menghubungi <strong>{success.nama}</strong> via WhatsApp dalam waktu dekat.
        </p>
        <div style={{ background: "#fafafa", border: "1px solid #e5e5e5", borderRadius: 12, padding: 20, textAlign: "left", marginBottom: 28 }}>
          <p style={{ fontSize: 12, color: "#a3a3a3", marginBottom: 4 }}>ID Pengajuan</p>
          <p style={{ fontWeight: 700, fontSize: 18, letterSpacing: 1, marginBottom: 16 }}>{success.id}</p>
          <p style={{ fontSize: 12, color: "#a3a3a3", marginBottom: 4 }}>Nama</p>
          <p style={{ fontWeight: 600, marginBottom: 16 }}>{success.nama}</p>
          <p style={{ fontSize: 12, color: "#a3a3a3", marginBottom: 4 }}>Link Bukti Perjanjian</p>
          <a href={success.link_bukti} style={{ fontSize: 13, fontFamily: "monospace", color: "#0a0a0a", wordBreak: "break-all", textDecoration: "underline" }}>
            {success.link_bukti}
          </a>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <a href={success.link_bukti} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ justifyContent: "center", borderRadius: 8, textDecoration: "none" }}>
            Lihat Bukti Perjanjian
          </a>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ justifyContent: "center", borderRadius: 8, textDecoration: "none" }}>
            Hubungi via WhatsApp
          </a>
        </div>
      </div>
    );
  }

  const selectStyle = (key: string): React.CSSProperties => ({
    ...dynInput(key),
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23525252' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: 36,
    cursor: "pointer",
    color: "#0a0a0a",
  });

  const uploadFields = [
    { label: "Foto Selfie (pegang HP)", key: "selfie", state: selfie, setter: setSelfie, ref: selfieRef, note: "Maks 5MB" },
    { label: "Foto HP Tampak Depan", key: "depan", state: fotoDpn, setter: setFotoDpn, ref: depanRef, note: "" },
    { label: "Foto HP Tampak Belakang", key: "belakang", state: fotoBelakang, setter: setFotoBelakang, ref: belakangRef, note: "" },
  ];

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 640, margin: "0 auto" }}>

      {/* ── Data Diri ── */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid #e5e5e5" }}>
          Data Diri
        </p>

        {/* Nama */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Nama Lengkap <span style={{ color: "#dc2626" }}>*</span></label>
          <input type="text" value={nama} onChange={e => setNama(e.target.value)}
            placeholder="Nama sesuai KTP" required
            style={dynInput("nama")} onFocus={() => onFocus("nama")} onBlur={() => onBlur("nama")} />
        </div>

        {/* NIK */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>NIK (Nomor Induk Kependudukan) <span style={{ color: "#dc2626" }}>*</span></label>
          <input type="text" inputMode="numeric" value={nik}
            onChange={e => setNik(e.target.value.replace(/\D/g, "").slice(0, 16))}
            placeholder="16 digit nomor KTP" required maxLength={16}
            style={dynInput("nik", nikError)}
            onFocus={() => onFocus("nik")} onBlur={() => onBlur("nik")} />
          {nikError && <p style={errorTextStyle}>NIK harus 16 digit</p>}
          {nik.length === 16 && !nikError && (
            <p style={{ fontSize: 13, color: "#16a34a", marginTop: 4 }}>✓ NIK valid</p>
          )}
        </div>

        {/* Nomor WA */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Nomor WhatsApp <span style={{ color: "#dc2626" }}>*</span></label>
          <input type="tel" value={nomorWa} onChange={e => setNomorWa(e.target.value)}
            placeholder="08xxxxxxxxxx" required
            style={dynInput("wa")} onFocus={() => onFocus("wa")} onBlur={() => onBlur("wa")} />
        </div>
      </div>

      {/* ── Alamat ── */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid #e5e5e5" }}>
          Alamat KTP
        </p>

        {/* Provinsi */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Provinsi <span style={{ color: "#dc2626" }}>*</span></label>
          <select value={selProv} onChange={e => onProvinceChange(e.target.value)} required
            style={selectStyle("prov")} onFocus={() => onFocus("prov")} onBlur={() => onBlur("prov")}>
            <option value="">-- Pilih Provinsi --</option>
            {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        {/* Kabupaten/Kota */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Kabupaten / Kota <span style={{ color: "#dc2626" }}>*</span></label>
          <select value={selReg} onChange={e => onRegencyChange(e.target.value)} required
            disabled={!regencies.length}
            style={{ ...selectStyle("reg"), opacity: !regencies.length ? 0.5 : 1 }}
            onFocus={() => onFocus("reg")} onBlur={() => onBlur("reg")}>
            <option value="">-- Pilih Kabupaten/Kota --</option>
            {regencies.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>

        {/* Kecamatan */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Kecamatan <span style={{ color: "#dc2626" }}>*</span></label>
          <select value={selDist} onChange={e => onDistrictChange(e.target.value)} required
            disabled={!districts.length}
            style={{ ...selectStyle("dist"), opacity: !districts.length ? 0.5 : 1 }}
            onFocus={() => onFocus("dist")} onBlur={() => onBlur("dist")}>
            <option value="">-- Pilih Kecamatan --</option>
            {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        {/* Kelurahan/Desa */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Kelurahan / Desa <span style={{ color: "#dc2626" }}>*</span></label>
          <select value={selVill} onChange={e => setSelVill(e.target.value)} required
            disabled={!villages.length}
            style={{ ...selectStyle("vill"), opacity: !villages.length ? 0.5 : 1 }}
            onFocus={() => onFocus("vill")} onBlur={() => onBlur("vill")}>
            <option value="">-- Pilih Kelurahan/Desa --</option>
            {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>

        {/* Alamat spesifik */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Alamat Spesifik <span style={{ color: "#dc2626" }}>*</span></label>
          <input type="text" value={jalan} onChange={e => setJalan(e.target.value)}
            placeholder="Nama jalan, nomor rumah, RT/RW, blok" required
            style={dynInput("jalan")} onFocus={() => onFocus("jalan")} onBlur={() => onBlur("jalan")} />
        </div>

        {/* Preview alamat */}
        {alamatLengkap && (
          <div style={{ background: "#f5f5f5", border: "1px solid #e5e5e5", borderRadius: 8, padding: "10px 14px" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#a3a3a3", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
              Alamat Lengkap
            </p>
            <p style={{ fontSize: 13, color: "#525252", lineHeight: 1.5 }}>{alamatLengkap}</p>
          </div>
        )}
      </div>

      {/* ── Info HP ── */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid #e5e5e5" }}>
          Informasi HP
        </p>

        {/* Jenis HP */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Jenis HP <span style={{ color: "#dc2626" }}>*</span></label>
          <input type="text" value={jenisHp} onChange={e => setJenisHp(e.target.value)}
            placeholder="contoh: Samsung Galaxy A54 8/256GB" required
            style={dynInput("hp")} onFocus={() => onFocus("hp")} onBlur={() => onBlur("hp")} />
          <p style={{ fontSize: 12, color: "#a3a3a3", marginTop: 4 }}>Sertakan RAM dan storage jika diketahui. Minimal RAM 8GB.</p>
        </div>

        {/* Kondisi */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Kondisi HP <span style={{ color: "#dc2626" }}>*</span></label>
          <select value={kondisi} onChange={e => setKondisi(e.target.value)}
            style={selectStyle("kondisi")} onFocus={() => onFocus("kondisi")} onBlur={() => onBlur("kondisi")}>
            {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <p style={{ fontSize: 12, color: "#a3a3a3", marginTop: 4 }}>HP dengan kerusakan lebih dari cacat ringan tidak dapat kami terima.</p>
        </div>

        {/* Nominal Pinjaman */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Nominal Pinjaman yang Diinginkan (Rp) <span style={{ color: "#dc2626" }}>*</span></label>
          <input type="text" inputMode="numeric" value={nominalStr}
            onChange={e => setNominalStr(formatRp(e.target.value))}
            placeholder="1.000.000" required
            style={dynInput("nominal")}
            onFocus={() => onFocus("nominal")} onBlur={() => onBlur("nominal")} />
        </div>
      </div>

      {/* ── Upload Foto ── */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid #e5e5e5" }}>
          Upload Foto
        </p>
        {uploadFields.map(({ label, key, state, setter, ref, note }) => (
          <div key={key} style={{ marginBottom: 20 }}>
            <label style={labelStyle}>{label} <span style={{ color: "#dc2626" }}>*</span></label>
            <div onClick={() => ref.current?.click()}
              style={{
                border: "2px dashed",
                borderColor: state.preview ? "#0a0a0a" : "#e5e5e5",
                borderRadius: 8, padding: "24px 16px", textAlign: "center",
                cursor: "pointer", transition: "border-color 0.15s",
                background: state.preview ? "#fafafa" : "#fff",
              }}>
              {state.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={state.preview} alt="preview"
                  style={{ maxHeight: 160, margin: "0 auto", borderRadius: 6, display: "block", objectFit: "contain" }} />
              ) : (
                <>
                  <p style={{ fontSize: 14, color: "#525252" }}>Klik untuk upload foto</p>
                  <p style={{ fontSize: 12, color: "#a3a3a3", marginTop: 4 }}>JPG / PNG{note ? `, ${note}` : ""}</p>
                </>
              )}
            </div>
            <input ref={ref} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => handleFile(e, setter)} />
          </div>
        ))}
      </div>

      {/* ── Klausul ── */}
      <div style={{ background: "#fafafa", border: "1px solid #e5e5e5", borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>
          Pernyataan &amp; Persetujuan <span style={{ color: "#dc2626" }}>*</span>
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {CLAUSES.map((clause, i) => (
            <label key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
              <div onClick={() => toggleClause(i)}
                style={{
                  flexShrink: 0, width: 20, height: 20,
                  border: "2px solid",
                  borderColor: clauses[i] ? "#0a0a0a" : "#d4d4d4",
                  borderRadius: 4,
                  background: clauses[i] ? "#0a0a0a" : "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginTop: 1, transition: "all 0.15s",
                }}>
                {clauses[i] && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: 13, color: "#525252", lineHeight: 1.6 }}>{clause}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Error global */}
      {submitError && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 16px", marginBottom: 16, color: "#dc2626", fontSize: 14 }}>
          {submitError}
        </div>
      )}

      {/* Submit */}
      <button type="submit" disabled={!canSubmit || loading} className="btn-primary"
        style={{ width: "100%", justifyContent: "center", opacity: !canSubmit || loading ? 0.5 : 1, cursor: !canSubmit || loading ? "not-allowed" : "pointer" }}>
        {loading ? "Mengirim Pengajuan…" : "Kirim Pengajuan Gadai →"}
      </button>

      <p style={{ fontSize: 12, color: "#a3a3a3", textAlign: "center", marginTop: 12 }}>
        Dengan mengirim form ini, Anda menyetujui seluruh ketentuan gadai Jogpro Finance.
      </p>
    </form>
  );
}
