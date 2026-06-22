import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Use service role key if available, fall back to anon key (bucket is public)
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getSupabase() {
  return createClient(supabaseUrl, supabaseKey);
}

async function uploadToSupabase(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  file: File,
  path: string
): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabase.storage
    .from("gadai-docs")
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(`Upload gagal: ${error.message}`);

  const { data } = supabase.storage.from("gadai-docs").getPublicUrl(path);
  return data.publicUrl;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const formData = await req.formData();

    const nama = formData.get("nama") as string;
    const nik = formData.get("nik") as string;
    const alamat = formData.get("alamat") as string;
    const nomor_wa = formData.get("nomor_wa") as string;
    const jenis_hp = formData.get("jenis_hp") as string;
    const kondisi = formData.get("kondisi") as string;
    const harga_pasar = 0;
    const nominal_pinjaman = parseInt(formData.get("nominal_pinjaman") as string);

    const fotoSelfie = formData.get("foto_selfie") as File | null;
    const fotoDpn = formData.get("foto_depan") as File | null;
    const fotoBelakang = formData.get("foto_belakang") as File | null;

    // Validate
    if (!nama || !nik || nik.length !== 16 || !alamat || !nomor_wa || !jenis_hp || !kondisi || !nominal_pinjaman) {
      return NextResponse.json({ error: "Data tidak lengkap." }, { status: 400 });
    }
    if (!fotoSelfie || !fotoDpn || !fotoBelakang) {
      return NextResponse.json({ error: "Semua foto wajib diupload." }, { status: 400 });
    }

    // Generate timestamp prefix for unique filenames
    const ts = Date.now();
    const selfieExt = fotoSelfie.name.split(".").pop() || "jpg";
    const depanExt = fotoDpn.name.split(".").pop() || "jpg";
    const belakangExt = fotoBelakang.name.split(".").pop() || "jpg";

    // Upload photos first to get a temp prefix (we'll use timestamp)
    const [selfieUrl, depanUrl, belakangUrl] = await Promise.all([
      uploadToSupabase(supabase, fotoSelfie, `${ts}/selfie.${selfieExt}`),
      uploadToSupabase(supabase, fotoDpn, `${ts}/depan.${depanExt}`),
      uploadToSupabase(supabase, fotoBelakang, `${ts}/belakang.${belakangExt}`),
    ]);

    // Insert to DB
    const { data: inserted, error: dbError } = await supabase
      .from("gadai_applications")
      .insert({
        nama,
        nik,
        alamat,
        nomor_wa,
        jenis_hp,
        kondisi,
        harga_pasar,
        nominal_pinjaman,
        foto_selfie_url: selfieUrl,
        foto_depan_url: depanUrl,
        foto_belakang_url: belakangUrl,
        klausul_disetujui: true,
        status: "pending",
      })
      .select("id")
      .single();

    if (dbError || !inserted) {
      throw new Error(dbError?.message || "Gagal menyimpan data.");
    }

    const id = inserted.id as string;
    const link = `https://jogpro.net/perjanjian/${id}`;

    // Rename files to use actual UUID
    await Promise.all([
      supabase.storage.from("gadai-docs").move(`${ts}/selfie.${selfieExt}`, `${id}/selfie.${selfieExt}`),
      supabase.storage.from("gadai-docs").move(`${ts}/depan.${depanExt}`, `${id}/depan.${depanExt}`),
      supabase.storage.from("gadai-docs").move(`${ts}/belakang.${belakangExt}`, `${id}/belakang.${belakangExt}`),
    ]).catch(() => {
      // Non-fatal: files still accessible via timestamp path
    });

    const joMessage = `🔔 *Pengajuan Gadai Baru*\n\nNama: ${nama}\nNIK: ${nik}\nWA: ${nomor_wa}\nHP: ${jenis_hp}\nKondisi: ${kondisi}\nNominal: Rp${nominal_pinjaman.toLocaleString("id-ID")}\nAlamat: ${alamat}\n\n📎 Perjanjian: ${link}`;
    const userMessage = `Halo Kak ${nama}, pengajuan gadai Jogpro Finance sudah masuk ya.\n\nLink perjanjian/bukti pengajuan:\n${link}\n\nTim Jogpro akan cek data dan hubungi Kakak lewat WhatsApp ini.`;

    const { error: outboxError } = await supabase.from("whatsapp_outbox").insert([
      {
        application_id: id,
        to_number: "120363430478132753@g.us",
        message: joMessage,
        type: "owner_notification",
      },
      {
        application_id: id,
        to_number: nomor_wa,
        message: userMessage,
        type: "customer_confirmation",
      },
    ]);

    if (outboxError) {
      console.error("[gadai/submit] whatsapp outbox", outboxError);
    }

    // WA link fallback for Jo notification (if local sender is offline)
    const joMsg = encodeURIComponent(joMessage);
    const waJoLink = `https://wa.me/628972523968?text=${joMsg}`;

    return NextResponse.json({
      id,
      link,
      link_bukti: link,
      wa_link: waJoLink,
      whatsapp_queued: !outboxError,
    });
  } catch (err: unknown) {
    console.error("[gadai/submit]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error." },
      { status: 500 }
    );
  }
}
