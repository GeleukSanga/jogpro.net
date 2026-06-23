"use client";

import { useEffect, useState, useCallback } from "react";

/* eslint-disable @typescript-eslint/no-non-null-assertion */
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ── helpers ──
function fmt(n: number | null | undefined, dec = 2) {
  return n != null ? n.toFixed(dec) : "—";
}
function countAgo(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return `${Math.floor(s)}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  return `${Math.floor(s / 3600)}h`;
}
const dirColor = (d: string) =>
  d === "LONG" ? "text-[#00e676]" : d === "SHORT" ? "text-[#ff5252]" : "text-[#ffd740]";

const dirBg = (d: string) =>
  d === "LONG"
    ? "bg-[#00e67620]"
    : d === "SHORT"
      ? "bg-[#ff525220]"
      : "bg-[#ffd74020]";

interface Signal {
  id: number;
  created_at: string;
  symbol: string;
  direction: string;
  confidence: number;
  session_name: string;
  reason: string;
  us30_bid: number | null;
  us30_ask: number | null;
  spx_bid: number | null;
  spx_ask: number | null;
}

export default function BotDashboard() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [updatedAt, setUpdatedAt] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSignals = useCallback(async () => {
    try {
      const res = await fetch(
        `${SUPA_URL}/rest/v1/bot_signals?select=id,created_at,symbol,direction,confidence,session_name,reason,us30_bid,us30_ask,spx_bid,spx_ask&order=created_at.desc&limit=40`,
        { headers: { apikey: SUPA_ANON, Authorization: `Bearer ${SUPA_ANON}` }, cache: "no-store" }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows: Signal[] = await res.json();
      setSignals(rows || []);
      setUpdatedAt(new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta" }));
      setError("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSignals();
    const t = setInterval(fetchSignals, 10_000);
    return () => clearInterval(t);
  }, [fetchSignals]);

  // ── loading / error / empty ──
  if (loading)
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-[#6b6b8a] text-sm">
        Loading signals…
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-[#ff5252] text-sm px-4 text-center">
        Error: {error}
      </div>
    );
  if (!signals.length)
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-3 text-sm">
        <span className="w-4 h-4 rounded-full bg-[#6b6b8a] animate-pulse" />
        <span className="text-[#6b6b8a]">Waiting for first signal…</span>
      </div>
    );

  // latest overall + per-symbol
  const latest = signals[0];
  const us30 = signals.filter((s) => s.symbol === "US30");
  const spx = signals.filter((s) => s.symbol === "USSPX500");
  const us30Latest = us30[0] ?? null;
  const spxLatest = spx[0] ?? null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e2e2f0] font-mono text-sm">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-[#111118] border-b border-[#242433] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_#00e676] animate-pulse ${
              latest.direction !== "NEUTRAL" ? "bg-[#00e676]" : "bg-[#6b6b8a]"
            }`}
          />
          <h1 className="font-semibold text-base tracking-wide">
            PSAR <span className="text-[#448aff]">Bot</span>
          </h1>
          <span className="text-xs text-[#6b6b8a] bg-[#16161f] px-2 py-0.5 rounded">
            {latest.session_name}
          </span>
        </div>
        <div className="text-xs text-[#6b6b8a]">
          Updated {updatedAt} WIB · {signals.length} signals
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* ── INSTRUMENT CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* US30 */}
          <div className="bg-[#16161f] border border-[#242433] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-widest">
                US30
              </span>
              {us30Latest ? (
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold ${dirBg(us30Latest.direction)} ${dirColor(us30Latest.direction)}`}
                >
                  {us30Latest.direction}
                </span>
              ) : (
                <span className="text-xs text-[#6b6b8a]">NO SIGNAL</span>
              )}
            </div>
            {us30Latest ? (
              <>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl font-bold text-[#e2e2f0]">
                    {fmt(us30Latest.us30_bid ?? us30Latest.us30_ask, 2)}
                  </span>
                  <span className="text-xs text-[#6b6b8a]">bid</span>
                </div>
                <p className="text-xs text-[#6b6b8a] truncate">
                  {us30Latest.reason}
                </p>
                <p className="text-xs text-[#52525b] mt-1">
                  {countAgo(us30Latest.created_at)} ago
                </p>
              </>
            ) : (
              <p className="text-sm text-[#6b6b8a]">No US30 signals yet.</p>
            )}
          </div>

          {/* USSPX500 */}
          <div className="bg-[#16161f] border border-[#242433] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-widest">
                USSPX500
              </span>
              {spxLatest ? (
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold ${dirBg(spxLatest.direction)} ${dirColor(spxLatest.direction)}`}
                >
                  {spxLatest.direction}
                </span>
              ) : (
                <span className="text-xs text-[#6b6b8a]">NO SIGNAL</span>
              )}
            </div>
            {spxLatest ? (
              <>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl font-bold text-[#e2e2f0]">
                    {fmt(spxLatest.spx_bid ?? spxLatest.spx_ask, 2)}
                  </span>
                  <span className="text-xs text-[#6b6b8a]">bid</span>
                </div>
                <p className="text-xs text-[#6b6b8a] truncate">
                  {spxLatest.reason}
                </p>
                <p className="text-xs text-[#52525b] mt-1">
                  {countAgo(spxLatest.created_at)} ago
                </p>
              </>
            ) : (
              <p className="text-sm text-[#6b6b8a]">No SPX signals yet.</p>
            )}
          </div>
        </div>

        {/* ── LATEST SIGNAL ── */}
        <section className="bg-[#16161f] border border-[#242433] rounded-xl p-5">
          <h2 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-widest mb-3">
            Latest Signal
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <span
              className={`text-lg font-bold px-3 py-1 rounded ${dirBg(latest.direction)} ${dirColor(latest.direction)}`}
            >
              {latest.direction}
            </span>
            <span className="text-lg font-bold text-[#e2e2f0]">{latest.symbol}</span>
            <span className="text-lg font-bold text-[#448aff]">{latest.confidence}%</span>
          </div>
          <p className="text-sm text-[#a0a0b8] mt-3 leading-relaxed">{latest.reason}</p>
          <p className="text-xs text-[#52525b] mt-2">
            {new Date(latest.created_at).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })} WIB
          </p>
        </section>

        {/* ── SIGNAL HISTORY TABLE ── */}
        <section>
          <h2 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-widest mb-3">
            Signal History{" "}
            <span className="text-[#448aff]">({signals.length})</span>
          </h2>
          <div className="bg-[#16161f] border border-[#242433] rounded-xl overflow-x-auto">
            <table className="w-full text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#242433] text-[#6b6b8a]">
                  {["Time", "Symbol", "Dir", "Conf", "Price", "Reason"].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {signals.slice(0, 30).map((s) => {
                  const price =
                    s.symbol === "US30"
                      ? s.us30_bid ?? s.us30_ask
                      : s.spx_bid ?? s.spx_ask;
                  return (
                    <tr key={s.id} className="border-b border-[#1a1a26] hover:bg-[#1a1a26]">
                      <td className="px-3 py-2 text-[#6b6b8a]">
                        {new Date(s.created_at).toLocaleTimeString("id-ID", {
                          timeZone: "Asia/Jakarta",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="px-3 py-2 font-semibold">{s.symbol}</td>
                      <td className={`px-3 py-2 font-bold ${dirColor(s.direction)}`}>
                        {s.direction}
                      </td>
                      <td className="px-3 py-2 text-[#448aff] font-semibold">{s.confidence}%</td>
                      <td className="px-3 py-2">{fmt(price, 2)}</td>
                      <td className="px-3 py-2 text-[#6b6b8a] max-w-xs truncate">
                        {s.reason}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <div className="text-center text-xs text-[#52525b] pb-6">
          Auto-refresh 10s · PSAR M1 · US30 + USSPX500 · Updated {updatedAt} WIB
        </div>
      </main>
    </div>
  );
}
