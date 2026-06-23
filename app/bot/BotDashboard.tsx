"use client";

import { useEffect, useState, useCallback } from "react";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ── helpers ──
function fmt(n: number, dec = 2) {
  return n?.toFixed(dec) ?? "—";
}

// ── types ──
interface SignalRow {
  id: number;
  created_at: string;
  symbol: string;
  direction: string;
  confidence: number;
  session_name: string;
  vix: number;
  qqq_move_pct: number;
  stocks_aligned: number;
  chk_vix: boolean;
  chk_qqq: boolean;
  chk_stocks: boolean;
  chk_futures: boolean;
  chk_session: boolean;
  reason: string;
  us30_bid: number;
  us30_ask: number;
  spx_bid: number;
  spx_ask: number;
}

const CHECKS = [
  { key: "chk_vix", label: "VIX", detail: "below 20" },
  { key: "chk_qqq", label: "QQQ", detail: "aligned" },
  { key: "chk_stocks", label: "MAG7", detail: "aligned" },
  { key: "chk_futures", label: "Futures", detail: "ES/NQ" },
  { key: "chk_session", label: "Session", detail: "NYSE cash" },
] as const;

// ── component ──
export default function BotDashboard() {
  const [signals, setSignals] = useState<SignalRow[]>([]);
  const [updatedAt, setUpdatedAt] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSignals = useCallback(async () => {
    try {
      const res = await fetch(
        `${SUPA_URL}/rest/v1/bot_signals?select=*&order=created_at.desc&limit=50`,
        {
          headers: { apikey: SUPA_ANON, Authorization: `Bearer ${SUPA_ANON}` },
          cache: "no-store",
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows: SignalRow[] = await res.json();
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
    const t = setInterval(fetchSignals, 15_000);
    return () => clearInterval(t);
  }, [fetchSignals]);

  // ── loading / error / empty ──
  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-[#6b6b8a]">
      Loading...
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-[#ff5252]">
      Error: {error}
    </div>
  );
  if (!signals.length) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-[#6b6b8a]">
      Waiting for first signal...
    </div>
  );

  const latest = signals[0];
  const checkedCount = CHECKS.filter((c) => (latest as unknown as Record<string, boolean>)[c.key] === true).length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e2e2f0] font-sans text-sm">
      {/* HEADER — exact copy of Conf Bot */}
      <header className="sticky top-0 z-50 bg-[#111118] border-b border-[#242433] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_#00e676] animate-pulse ${
            latest.confidence >= 75 ? "bg-[#00e676]" : "bg-[#ffd740]"
          }`} />
          <h1 className="font-semibold text-base tracking-wide">
            Signal <span className="text-[#448aff]">Bot</span>
          </h1>
        </div>
        <div className="text-xs text-[#6b6b8a]">
          Last update: {updatedAt} WIB
          &nbsp;·&nbsp; {latest.session_name}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* STAT CARDS — same grid as Conf Bot */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "US30 Bid", value: fmt(latest.us30_bid, 2), color: "text-[#00e676]" },
            { label: "US30 Ask", value: fmt(latest.us30_ask, 2), color: "text-[#ff5252]" },
            { label: "Spread 30", value: fmt((latest.us30_ask ?? 0) - (latest.us30_bid ?? 0), 2), color: "text-[#448aff]" },
            { label: "SPX Bid", value: fmt(latest.spx_bid, 2), color: "text-[#00e676]" },
            { label: "SPX Ask", value: fmt(latest.spx_ask, 2), color: "text-[#ff5252]" },
            { label: "Confidence", value: `${latest.confidence}%`, color: latest.confidence >= 75 ? "text-[#00e676]" : "text-[#ffd740]" },
          ].map((c) => (
            <div key={c.label} className="bg-[#16161f] border border-[#242433] rounded-xl p-4">
              <div className="text-xs text-[#6b6b8a] mb-1">{c.label}</div>
              <div className={`text-2xl font-bold ${c.color}`}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* DIRECTION + CONTEXT row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Direction", value: latest.direction, color: latest.direction === "LONG" ? "text-[#00e676]" : "text-[#ff5252]" },
            { label: "VIX", value: latest.vix, color: "text-[#e2e2f0]" },
            { label: "QQQ", value: `${latest.qqq_move_pct >= 0 ? "+" : ""}${latest.qqq_move_pct}%`, color: latest.qqq_move_pct >= 0 ? "text-[#00e676]" : "text-[#ff5252]" },
            { label: "MAG7 Aligned", value: `${latest.stocks_aligned}/7`, color: "text-[#448aff]" },
          ].map((c) => (
            <div key={c.label} className="bg-[#16161f] border border-[#242433] rounded-xl p-4">
              <div className="text-xs text-[#6b6b8a] mb-1">{c.label}</div>
              <div className={`text-2xl font-bold ${c.color}`}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* CONFLUENCE CHECKLIST — Open Trades style */}
        <section>
          <h2 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-widest mb-3">
            Confluence Checklist
            <span className="ml-2 text-[#448aff]">({checkedCount}/{CHECKS.length})</span>
          </h2>
          <div className="space-y-3">
            {CHECKS.map((c) => {
              const v = latest as unknown as Record<string, boolean>;
              const ok = v[c.key] === true;
              return (
                <div key={c.key} className="bg-[#16161f] border border-[#242433] rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${ok ? "text-[#00e676]" : "text-[#3a3a4a]"}`}>
                        {ok ? "●" : "○"}
                      </span>
                      <div>
                        <div className="font-semibold text-sm">{c.label}</div>
                        <div className="text-xs text-[#6b6b8a]">{c.detail}</div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      ok ? "bg-[#00e67620] text-[#00e676]" : "bg-[#24243320] text-[#6b6b8a]"
                    }`}>
                      {ok ? "CONFIRMED" : "PENDING"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CONFIDENCE + REASON */}
        <section>
          <h2 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-widest mb-3">
            Signal Confidence
          </h2>
          <div className="bg-[#16161f] border border-[#242433] rounded-xl p-4">
            <div className="flex items-center gap-4 mb-3">
              <span className={`text-4xl font-bold ${
                latest.confidence >= 75 ? "text-[#00e676]" : latest.confidence >= 50 ? "text-[#ffd740]" : "text-[#ff5252]"
              }`}>
                {latest.confidence}%
              </span>
              <div className="flex-1">
                <div className="w-full bg-[#242433] rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      latest.confidence >= 75 ? "bg-[#00e676]" : latest.confidence >= 50 ? "bg-[#ffd740]" : "bg-[#ff5252]"
                    }`}
                    style={{ width: `${Math.min(latest.confidence, 100)}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="text-xs text-[#6b6b8a]">{latest.reason || "—"}</div>
          </div>
        </section>

        {/* SIGNAL HISTORY TABLE — copy Recent Trades style */}
        <section>
          <h2 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-widest mb-3">
            Signal History
            <span className="ml-2 text-[#448aff]">({signals.length})</span>
          </h2>
          <div className="bg-[#16161f] border border-[#242433] rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#242433] text-[#6b6b8a]">
                  {["Time", "Symbol", "Dir", "Conf", "VIX", "QQQ", "MAG7", "Confluence"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {signals.slice(0, 20).map((s, i) => {
                  const cnt = CHECKS.filter((c) => (s as unknown as Record<string, boolean>)[c.key] === true).length;
                  return (
                    <tr key={s.id || i} className="border-b border-[#1a1a26] hover:bg-[#1a1a26]">
                      <td className="px-3 py-2 text-[#6b6b8a]">
                        {new Date(s.created_at).toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta" })}
                      </td>
                      <td className="px-3 py-2 font-semibold">{s.symbol}</td>
                      <td className={`px-3 py-2 font-semibold ${s.direction === "LONG" ? "text-[#00e676]" : "text-[#ff5252]"}`}>
                        {s.direction}
                      </td>
                      <td className={`px-3 py-2 font-semibold ${s.confidence >= 75 ? "text-[#00e676]" : "text-[#ffd740]"}`}>
                        {s.confidence}%
                      </td>
                      <td className="px-3 py-2">{s.vix}</td>
                      <td className={`px-3 py-2 ${s.qqq_move_pct >= 0 ? "text-[#00e676]" : "text-[#ff5252]"}`}>
                        {s.qqq_move_pct > 0 ? "+" : ""}{s.qqq_move_pct}%
                      </td>
                      <td className="px-3 py-2 text-[#e2e2f0]">{s.stocks_aligned}/7</td>
                      <td className="px-3 py-2">
                        <span className={`px-1.5 py-0.5 rounded font-semibold ${
                          cnt >= 4 ? "bg-[#00e67620] text-[#00e676]" : "bg-[#ffd74020] text-[#ffd740]"
                        }`}>
                          {cnt}/{CHECKS.length}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* FOOTER */}
        <div className="text-center text-xs text-[#6b6b8a] pb-4">
          Auto-refresh 15s · Signal Bot · {signals.length} signals loaded
          &nbsp;·&nbsp; Updated {updatedAt} WIB
        </div>

      </main>
    </div>
  );
}
