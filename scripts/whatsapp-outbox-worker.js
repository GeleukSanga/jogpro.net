#!/usr/bin/env node
/* Poll Supabase whatsapp_outbox and send through local Hermes WhatsApp bridge. */
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const bridgeUrl = process.env.WHATSAPP_BRIDGE_URL || 'http://localhost:3000';
const intervalMs = Number(process.env.WHATSAPP_OUTBOX_INTERVAL_MS || 5000);

if (!supabaseUrl || !supabaseKey) {
  console.error('[wa-outbox] Missing Supabase env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function normalizeWa(raw) {
  const value = String(raw || '').trim();
  if (value.includes('@')) return value;
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('62')) return digits;
  return digits;
}

async function sendWa(to, message) {
  const number = normalizeWa(to);
  if (!number) throw new Error('Nomor WA kosong');
  const chatId = number.includes('@') ? number : `${number}@s.whatsapp.net`;
  const res = await fetch(`${bridgeUrl}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Bridge HTTP ${res.status}: ${text}`);
  const data = JSON.parse(text);
  if (!data.success) throw new Error(data.error || text);
  return data.messageId;
}

async function tick() {
  const { data: jobs, error } = await supabase
    .from('whatsapp_outbox')
    .select('*')
    .is('sent_at', null)
    .lt('attempts', 5)
    .order('created_at', { ascending: true })
    .limit(10);

  if (error) throw error;
  if (!jobs?.length) return;

  for (const job of jobs) {
    try {
      await supabase.from('whatsapp_outbox').update({ attempts: (job.attempts || 0) + 1, last_error: null }).eq('id', job.id);
      const messageId = await sendWa(job.to_number, job.message);
      await supabase
        .from('whatsapp_outbox')
        .update({ sent_at: new Date().toISOString(), message_id: messageId, last_error: null })
        .eq('id', job.id);
      console.log(`[wa-outbox] sent ${job.id} -> ${job.to_number}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await supabase.from('whatsapp_outbox').update({ last_error: msg }).eq('id', job.id);
      console.error(`[wa-outbox] failed ${job.id}: ${msg}`);
    }
  }
}

console.log(`[wa-outbox] started, interval=${intervalMs}ms, bridge=${bridgeUrl}`);
setInterval(() => tick().catch((e) => console.error('[wa-outbox] tick error', e)), intervalMs);
tick().catch((e) => console.error('[wa-outbox] first tick error', e));
