"use client";

import { useEffect, useState, useCallback } from "react";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface Signal {
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
  // Supabase returns snake_case by default
  [key: string]: unknown;
}

const CHECKS = [
  { key: "chk_vix", label: "VIX", detail: "below 20" },
  { key: "chk_qqq", label: "QQQ", detail: "aligned" },
  { key: "chk_stocks", label: "MAG7", detail: "aligned" },
  { key: "chk_futures", label: "Futures", detail: "ES/NQ" },
  { key: "chk_session", label: "Session", detail: "NYSE cash" },
] as const;

export default function BotDashboard() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [chartData, setChartData] = useState<{ time: string; us30: number; spx: number }[]>([]);
  const [updatedAt, setUpdatedAt] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSignals = useCallback(async () => {
    try {
      const res = await fetch(
        `${SUPA_URL}/rest/v1/bot_signals?select=*&order=created_at.desc&limit=50`,
        {
          headers: {
            apikey: SUPA_ANON,
            Authorization: `Bearer ${SUPA_ANON}`,
          },
          cache: "no-store",
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows: SignalRow[] = await res.json();
      if (!rows?.length) {
        setSignals([]);
        setError("");
        setLoading(false);
        return;
      }

      const parsed: Signal[] = rows.map((r) => ({
        id: r.id,
        created_at: r.created_at,
        symbol: r.symbol,
        direction: r.direction,
        confidence: r.confidence,
        session_name: r.session_name,
        vix: r.vix,
        qqq_move_pct: r.qqq_move_pct,
        stocks_aligned: r.stocks_aligned,
        chk_vix: (r as Record<string, unknown>).chk_vix as boolean,
        chk_qqq: (r as Record<string, unknown>).chk_qqq as boolean,
        chk_stocks: (r as Record<string, unknown>).chk_stocks as boolean,
        chk_futures: (r as Record<string, unknown>).chk_futures as boolean,
        chk_session: (r as Record<string, unknown>).chk_session as boolean,
        reason: r.reason,
        us30_bid: r.us30_bid,
        us30_ask: r.us30_ask,
        spx_bid: r.spx_bid,
        spx_ask: r.spx_ask,
      }));

      setSignals(parsed);

      // Build chart from oldest → newest
      const points = [...parsed].reverse().map((s) => ({
        time: new Date(s.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        us30: s.us30_bid,
        spx: s.spx_bid,
      }));
      setChartData(points);
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

  // ---------------------------------------------------------------
  // LOADING / ERROR / EMPTY
  // ---------------------------------------------------------------
  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-[#6b6b8a] text-sm">
      Loading...
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-[#ff5252] text-sm">
      Error: {error}
    </div>
  );
  if (!signals.length) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-[#6b6b8a] text-sm">
      Waiting for first signal...
    </div>
  );

  const latest = signals[0];
  const us30 = latest.us30_bid ?? 0;
  const spx = latest.spx_bid ?? 0;
  const spread30 = (latest.us30_ask ?? 0) - (latest.us30_bid ?? 0);
  const spreadSpx = (latest.spx_ask ?? 0) - (latest.spx_bid ?? 0);
  const checkedCount = CHECKS.filter((c) => {
    const v = latest as unknown as Record<string, boolean>;
    return v[c.key] === true;
  }).length;
  const totalChecks = CHECKS.length;

  // ---------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e2e2f0] font-sans text-sm">
      {/* HEADER */}
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

        {/* PRICE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              symbol: "US30",
              price: us30,
              spread: spread30,
              bid: latest.us30_bid,
              ask: latest.us30_ask,
            },
            {
              symbol: "USSPX500",
              price: spx,
              spread: spreadSpx,
              bid: latest.spx_bid,
              ask: latest.spx_ask,
            },
          ].map((p) => (
            <div key={p.symbol} className="bg-[#16161f] border border-[#242433] rounded-xl p-5">
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs text-[#6b6b8a] uppercase tracking-widest">{p.symbol}</div>
                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                  latest.direction === "LONG"
                    ? "bg-[#00e67620] text-[#00e676]"
                    : "bg-[#ff525220] text-[#ff5252]"
                }`}>
                  {latest.direction}
                </span>
              </div>
              <div className="text-3xl font-bold text-[#e2e2f0]">
                {p.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="flex gap-4 mt-2 text-xs text-[#6b6b8a]">
                <span>Bid <span className="text-[#00e676]">{(p.bid ?? 0).toFixed(2)}</span></span>
                <span>Ask <span className="text-[#ff5252]">{(p.ask ?? 0).toFixed(2)}</span></span>
                <span>Spread {p.spread.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CHART */}
        <section>
          <h2 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-widest mb-3">
            Price Trend ({chartData.length} points)
          </h2>
          {chartData.length < 2 ? (
            <div className="bg-[#16161f] border border-[#242433] rounded-xl p-6 text-center text-[#6b6b8a] italic">
              Collecting data — need 2+ signals for chart
            </div>
          ) : (
            <div className="bg-[#16161f] border border-[#242433] rounded-xl p-4 overflow-x-auto">
              {/* Simple SVG sparkline */}
              <svg
                viewBox={`0 0 ${Math.max(chartData.length * 40, 200)} 120`}
                className="w-full h-48"
                preserveAspectRatio="none"
              >
                {/* Grid lines */}
                {[0, 30, 60, 90, 120].map((y) => (
                  <line key={y} x1={0} y1={y} x2={chartData.length * 40} y2={y} stroke="#242433" strokeWidth="0.5" />
                ))}
                {/* US30 line */}
                {(() => {
                  const vals = chartData.map((d) => d.us30);
                  const min = Math.min(...vals);
                  const max = Math.max(...vals);
                  const range = max - min || 1;
                  const points = vals
                    .map((v, i) => `${i * 40},${120 - ((v - min) / range) * 100 - 10}`)
                    .join(" ");
                  return <polyline points={points} fill="none" stroke="#00e676" strokeWidth="1.5" />;
                })()}
                {/* SPX line */}
                {(() => {
                  const vals = chartData.map((d) => d.spx);
                  const min = Math.min(...vals);
                  const max = Math.max(...vals);
                  const range = max - min || 1;
                  const points = vals
                    .map((v, i) => `${i * 40},${120 - ((v - min) / range) * 100 - 10}`)
                    .join(" ");
                  return <polyline points={points} fill="none" stroke="#448aff" strokeWidth="1.5" />;
                })()}
              </svg>
              <div className="flex justify-center gap-6 mt-2 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#00e676] inline-block" /> US30</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#448aff] inline-block" /> SPX500</span>
              </div>
            </div>
          )}
        </section>

        {/* CONFLUENCE + CONFIDENCE */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Confluence Checklist */}
          <div className="lg:col-span-3 bg-[#16161f] border border-[#242433] rounded-xl p-5">
            <h2 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-widest mb-4">
              Confluence &nbsp;
              <span className="text-[#448aff]">{checkedCount}/{totalChecks}</span>
            </h2>
            <div className="space-y-3">
              {CHECKS.map((c) => {
                const v = latest as unknown as Record<string, boolean>;
                const ok = v[c.key] === true;
                return (
                  <div key={c.key} className="flex items-center justify-between py-2 border-b border-[#1a1a26] last:border-0">
                    <div className="flex items-center gap-3">
                      <span className={`text-lg ${ok ? "text-[#00e676]" : "text-[#3a3a4a]"}`}>
                        {ok ? "●" : "○"}
                      </span>
                      <div>
                        <div className="font-medium text-sm">{c.label}</div>
                        <div className="text-xs text-[#6b6b8a]">{c.detail}</div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded font-semibold ${
                      ok
                        ? "bg-[#00e67620] text-[#00e676]"
                        : "bg-[#24243320] text-[#6b6b8a]"
                    }`}>
                      {ok ? "✓ OK" : "PENDING"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Confidence + Market Context */}
          <div className="lg:col-span-2 space-y-4">
            {/* Confidence Card */}
            <div className="bg-[#16161f] border border-[#242433] rounded-xl p-5">
              <div className="text-xs text-[#6b6b8a] uppercase tracking-widest mb-3">Confidence</div>
              <div className="text-center mb-3">
                <span className={`text-5xl font-bold ${
                  latest.confidence >= 75
                    ? "text-[#00e676]"
                    : latest.confidence >= 50
                    ? "text-[#ffd740]"
                    : "text-[#ff5252]"
                }`}>
                  {latest.confidence}%
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-[#242433] rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    latest.confidence >= 75
                      ? "bg-[#00e676]"
                      : latest.confidence >= 50
                      ? "bg-[#ffd740]"
                      : "bg-[#ff5252]"
                  }`}
                  style={{ width: `${Math.min(latest.confidence, 100)}%` }}
                />
              </div>
              <div className="text-xs text-[#6b6b8a]">
                {latest.reason || "—"}
              </div>
            </div>

            {/* Market Context Card */}
            <div className="bg-[#16161f] border border-[#242433] rounded-xl p-5">
              <div className="text-xs text-[#6b6b8a] uppercase tracking-widest mb-3">Market Context</div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-[#6b6b8a] text-xs mb-1">VIX</div>
                  <div className="text-xl font-bold text-[#e2e2f0]">{latest.vix}</div>
                </div>
                <div className="text-center">
                  <div className="text-[#6b6b8a] text-xs mb-1">QQQ</div>
                  <div className={`text-xl font-bold ${latest.qqq_move_pct >= 0 ? "text-[#00e676]" : "text-[#ff5252]"}`}>
                    {latest.qqq_move_pct > 0 ? "+" : ""}{latest.qqq_move_pct}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[#6b6b8a] text-xs mb-1">MAG7</div>
                  <div className="text-xl font-bold text-[#448aff]">{latest.stocks_aligned}/7</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIGNAL HISTORY TABLE */}
        <section>
          <h2 className="text-xs font-semibold text-[#6b6b8a] uppercase tracking-widest mb-3">
            Signal History ({signals.length})
          </h2>
          <div className="bg-[#16161f] border border-[#242433] rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#242433] text-[#6b6b8a]">
                  {["Time", "Symbol", "Dir", "Confidence", "VIX", "QQQ", "MAG7", "Confluence"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {signals.slice(0, 20).map((s) => {
                  const cnt = CHECKS.filter((c) => {
                    const v = s as unknown as Record<string, boolean>;
                    return v[c.key] === true;
                  }).length;
                  return (
                    <tr key={s.id} className="border-b border-[#1a1a26] hover:bg-[#1a1a26]">
                      <td className="px-3 py-2 text-[#6b6b8a]">
                        {new Date(s.created_at).toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta" })}
                      </td>
                      <td className="px-3 py-2 font-semibold">{s.symbol}</td>
                      <td className={`px-3 py-2 font-semibold ${
                        s.direction === "LONG" ? "text-[#00e676]" : "text-[#ff5252]"
                      }`}>
                        {s.direction}
                      </td>
                      <td className={`px-3 py-2 font-semibold ${
                        s.confidence >= 75 ? "text-[#00e676]" : "text-[#ffd740]"
                      }`}>
                        {s.confidence}%
                      </td>
                      <td className="px-3 py-2">{s.vix}</td>
                      <td className={`px-3 py-2 ${s.qqq_move_pct >= 0 ? "text-[#00e676]" : "text-[#ff5252]"}`}>
                        {s.qqq_move_pct > 0 ? "+" : ""}{s.qqq_move_pct}%
                      </td>
                      <td className="px-3 py-2 text-[#448aff]">{s.stocks_aligned}/7</td>
                      <td className="px-3 py-2">
                        <span className={`px-1.5 py-0.5 rounded font-semibold ${
                          cnt >= 4
                            ? "bg-[#00e67620] text-[#00e676]"
                            : "bg-[#ffd74020] text-[#ffd740]"
                        }`}>
                          {cnt}/{totalChecks}
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
