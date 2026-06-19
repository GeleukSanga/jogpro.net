"use client";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";

const SUPA_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const INITIAL   = 500;

interface Trade {
  symbol: string; direction: string; entry: number; tp: number; sl: number;
  risk: number; score: number; reason: string; open_ts: string;
  current_price?: number; unrealized_pnl?: number;
}
interface ClosedTrade extends Trade {
  exit: number; outcome: string; pnl: number; close_ts: string;
}
interface ScanResult {
  symbol: string; direction: string | null; signal: boolean;
  mark_price: number; score?: number;
  tier1: string[]; tier2: string[]; tier3: string[];
  entry_status?: string; skip_reason?: string;
  raw: { lsr?: { buy: number }; fg?: number; oi_chg_pct?: number; vol_ratio?: number };
}
interface ResearchProgress {
  entry_rows: number;
  scan_rows: number;
  path_rows: number;
  open_events?: number;
  close_events?: number;
  entered_signals?: number;
  skipped_signals?: number;
  no_signal_rows?: number;
  updated_at: string;
}
interface BotState {
  balance: number; peak_balance: number; total_pnl: number;
  wins: number; losses: number;
  open_trades: Record<string, Trade>;
  closed_trades: ClosedTrade[];
  scan_results: ScanResult[];
  last_scan: string | null; scan_count: number; scan_results_count: number;
  research_progress?: ResearchProgress;
  coin_bias_top20?: CoinBias[];
}

interface CoinBias {
  symbol: string;
  bias: "LONG" | "SHORT" | "NEUTRAL";
  score: number;
  win_rate: number;
  avg_move: number;
  timeframe: string;
  best_combo: string;
  updated_at: string;
  samples: number;
}

const fmt    = (n: number, d = 2) => Number(n ?? 0).toFixed(d);
const fmtPx  = (n: number) => n >= 1 ? fmt(n, 4) : fmt(n, 6);
const fmtPnl = (n: number) => `${n >= 0 ? "+" : ""}$${fmt(Math.abs(n))}`;

function DirBadge({ d }: { d: string }) {
  return d === "LONG"
    ? <span className="dir-long">LONG</span>
    : <span className="dir-short">SHORT</span>;
}
function Tag({ text, cls }: { text: string; cls: string }) {
  return <span className={`tag ${cls}`}>{text}</span>;
}

export default function BotDashboard() {
  const [state,     setState]     = useState<BotState | null>(null);
  const [updatedAt, setUpdatedAt] = useState("");
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(true);
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const canvasEq = useRef<HTMLCanvasElement>(null);
  const canvasWL = useRef<HTMLCanvasElement>(null);
  const chartEq  = useRef<unknown>(null);
  const chartWL  = useRef<unknown>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchState = useCallback(async () => {
    try {
      const res = await fetch(
        `${SUPA_URL}/rest/v1/conf_bot_state?id=eq.1&select=state,updated_at`,
        { headers: { apikey: SUPA_ANON, Authorization: `Bearer ${SUPA_ANON}` }, cache: "no-store" }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows = await res.json();
      if (!rows?.length) throw new Error("No data");
      setState(rows[0].state as BotState);
      setUpdatedAt(rows[0].updated_at);
      setError("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchState();
    const t = setInterval(fetchState, 15000);
    return () => clearInterval(t);
  }, [fetchState]);

  useEffect(() => {
    const symbols = Object.keys(state?.open_trades || {});
    if (!symbols.length) return;
    const ws = new WebSocket("wss://stream.bybit.com/v5/public/linear");
    ws.onopen = () => {
      ws.send(JSON.stringify({ op: "subscribe", args: symbols.map((s) => `tickers.${s}`) }));
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const topic = data?.topic || "";
        if (!topic.startsWith("tickers.")) return;
        const sym = topic.split(".")[1];
        const payload = Array.isArray(data?.data) ? data.data[0] : data?.data;
        const px = Number(payload?.lastPrice || payload?.markPrice || payload?.indexPrice || 0);
        if (!sym || !px) return;
        setLivePrices((prev) => ({ ...prev, [sym]: px }));
      } catch {}
    };
    return () => ws.close();
  }, [state?.open_trades]);

  const openList = useMemo(() => {
    const base = Object.values(state?.open_trades || {});
    return base.map((t) => {
      const live = livePrices[t.symbol];
      if (!live) return t;
      const slDist = Math.abs(t.entry - t.sl);
      let unrealized = t.unrealized_pnl ?? 0;
      if (slDist > 0) {
        const size = t.risk / slDist;
        unrealized = t.direction === "LONG"
          ? size * (live - t.entry)
          : size * (t.entry - live);
      }
      return {
        ...t,
        current_price: live,
        unrealized_pnl: Number(unrealized.toFixed(2)),
      };
    });
  }, [state?.open_trades, livePrices]);

  // ── Charts (Chart.js via CDN) ───────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    // @ts-expect-error Chart loaded via CDN script
    if (!window.Chart) return;
    // @ts-expect-error CDN
    const Chart = window.Chart;

    if (!chartEq.current && canvasEq.current) {
      chartEq.current = new Chart(canvasEq.current, {
        type: "line",
        data: { labels: [], datasets: [{ label: "Balance ($)", data: [INITIAL],
          borderColor: "#448aff", backgroundColor: "rgba(68,138,255,0.08)",
          borderWidth: 2, pointRadius: 2, fill: true, tension: 0.3 }] },
        options: { responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { display: false },
            y: { grid: { color: "#1a1a28" },
              ticks: { color: "#6b6b8a", callback: (v: number) => "$" + v.toFixed(0) } } } }
      });
    }
    if (!chartWL.current && canvasWL.current) {
      chartWL.current = new Chart(canvasWL.current, {
        type: "doughnut",
        data: { labels: ["Win", "Loss"],
          datasets: [{ data: [0, 0],
            backgroundColor: ["rgba(0,230,118,0.7)", "rgba(255,82,82,0.7)"],
            borderColor: ["#00e676", "#ff5252"], borderWidth: 1 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: "65%",
          plugins: { legend: { labels: { color: "#e2e2f0", font: { size: 11 } } } } }
      });
    }
  });

  // ── Update charts on state change ─────────────────────────────────────────
  useEffect(() => {
    if (!state) return;
    const eq = chartEq.current as { data: { labels: string[]; datasets: { data: number[] }[] }; update: (m: string) => void } | null;
    const wl = chartWL.current as { data: { datasets: { data: number[] }[] }; update: (m: string) => void } | null;
    if (eq && state.closed_trades?.length) {
      let running = INITIAL;
      const labels = ["Start", ...state.closed_trades.map(t => t.symbol.replace("USDT","") + " " + t.outcome)];
      const vals   = [INITIAL, ...state.closed_trades.map(t => { running += t.pnl; return +running.toFixed(2); })];
      eq.data.labels = labels;
      eq.data.datasets[0].data = vals;
      eq.update("none");
    }
    if (wl) { wl.data.datasets[0].data = [state.wins, state.losses]; wl.update("none"); }
  }, [state]);

  // ── Derived ────────────────────────────────────────────────────────────────
  if (loading) return <div className="dash-loading">Loading...</div>;
  if (error)   return <div className="dash-error">Error: {error}</div>;
  if (!state)  return null;

  const closedList = [...(state.closed_trades || [])].reverse().slice(0, 50);
  const scanList   = state.scan_results || [];
  const coinBiasList = state.coin_bias_top20 || [];
  const total      = state.wins + state.losses;
  const winRate    = total > 0 ? (state.wins / total * 100).toFixed(1) : "—";
  const pnlPct     = (state.total_pnl / INITIAL * 100).toFixed(2);
  const drawdown   = state.peak_balance > 0
    ? ((state.peak_balance - state.balance) / state.peak_balance * 100).toFixed(2) : "0.00";
  const wibTime    = updatedAt
    ? new Date(updatedAt).toLocaleString("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "—";

  function rr(entry: number, tp: number, sl: number) {
    const reward = Math.abs(tp - entry), risk = Math.abs(sl - entry);
    return risk > 0 ? (reward / risk).toFixed(2) : "—";
  }

  return (
    <>
      {/* Chart.js CDN */}
      <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js" async />

      <div className="dash-root">
        {/* ── Header ── */}
        <header className="dash-header">
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div className="live-dot" />
            <h1>LLM<span>Bot</span> — Paper Trading Dashboard</h1>
          </div>
          <div className="last-scan">Last scan: {state.last_scan ?? "—"} · {wibTime} WIB</div>
        </header>

        <main className="dash-main">

          {/* ── Stat Cards ── */}
          <div className="stats-grid">
            {[
              { label:"Balance",       value:`$${fmt(state.balance)}`,                          cls: "blue" },
              { label:"Total PnL",     value:`${state.total_pnl>=0?"+":""}$${fmt(Math.abs(state.total_pnl))}`, cls: state.total_pnl>=0?"green":"red", sub: `${state.total_pnl>=0?"+":""}${pnlPct}%` },
              { label:"Win Rate",      value: winRate!=="—" ? winRate+"%" : "—",                cls: parseFloat(winRate)>=50?"green":"red", sub: `${state.wins}W / ${state.losses}L` },
              { label:"Open Trades",   value: String(openList.length),                          cls: "blue",   sub: `Scan #${state.scan_count}` },
              { label:"Max Drawdown",  value: drawdown+"%",                                     cls: parseFloat(drawdown)>10?"red":"muted", sub: "from peak" },
              { label:"Dataset Entry", value: String(state.research_progress?.entry_rows ?? 0), cls: "blue",   sub: `open ${state.research_progress?.open_events ?? 0} · close ${state.research_progress?.close_events ?? 0}` },
              { label:"Dataset Scan",  value: String(state.research_progress?.scan_rows ?? 0),  cls: "green",  sub: `entered ${state.research_progress?.entered_signals ?? 0} · skipped ${state.research_progress?.skipped_signals ?? 0}` },
              { label:"Path Rows",     value: String(state.research_progress?.path_rows ?? 0),  cls: "yellow", sub: `no-signal ${state.research_progress?.no_signal_rows ?? 0}` },
            ].map(c => (
              <div key={c.label} className="stat-card">
                <div className="label">{c.label}</div>
                <div className={`value ${c.cls}`}>{c.value}</div>
                {c.sub && <div className="sub">{c.sub}</div>}
              </div>
            ))}
          </div>

          {/* ── Charts ── */}
          <div className="charts-row">
            <div className="chart-card">
              <h3>📈 Equity Curve</h3>
              <canvas ref={canvasEq} style={{ maxHeight:200 }} />
            </div>
            <div className="chart-card">
              <h3>🎯 Win / Loss</h3>
              <canvas ref={canvasWL} style={{ maxHeight:200 }} />
            </div>
          </div>

          {/* ── Open Trades ── */}
          <div className="section-header">Open Trades <span className="badge">{openList.length}</span></div>
          <div className="table-card">
            <div className="table-x-scroll">
              <table>
                <thead><tr>
                  <th>Symbol</th><th>Dir</th><th>Entry</th><th>Now</th><th>uPnL</th>
                  <th>TP</th><th>SL</th><th>Risk</th><th>Score</th><th>RR</th>
                  <th>Konfirmasi</th><th>Buka</th>
                </tr></thead>
                <tbody>
                  {openList.length === 0
                    ? <tr className="empty-row"><td colSpan={12}>Belum ada trade terbuka</td></tr>
                    : openList.map(t => {
                      const upnl = t.unrealized_pnl ?? 0;
                      return (
                        <tr key={t.symbol}>
                          <td><b>{t.symbol}</b></td>
                          <td><DirBadge d={t.direction} /></td>
                          <td>{fmtPx(t.entry)}</td>
                          <td>{t.current_price ? fmtPx(t.current_price) : "—"}</td>
                          <td className={upnl>=0?"green":"red"}>{fmtPnl(upnl)}</td>
                          <td className="green">{fmtPx(t.tp)}</td>
                          <td className="red">{fmtPx(t.sl)}</td>
                          <td>${fmt(t.risk)}</td>
                          <td>{fmt(t.score)}</td>
                          <td>{rr(t.entry, t.tp, t.sl)}</td>
                          <td style={{ fontSize:"0.72rem", maxWidth:220, lineHeight:1.5 }}>{t.reason}</td>
                          <td style={{ color:"var(--muted)", fontSize:"0.72rem" }}>{t.open_ts}</td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Closed Trades ── */}
          <div className="section-header">Closed Trades <span className="badge">{closedList.length}</span></div>
          <div className="table-card">
            <div className="table-scroll">
              <div className="table-x-scroll">
                <table>
                  <thead><tr>
                    <th>Symbol</th><th>Dir</th><th>Outcome</th><th>Entry</th><th>Exit</th>
                    <th>PnL</th><th>Risk</th><th>RR</th><th>Score</th><th>Buka</th><th>Tutup</th>
                  </tr></thead>
                  <tbody>
                    {closedList.length === 0
                      ? <tr className="empty-row"><td colSpan={11}>Belum ada trade tertutup</td></tr>
                      : closedList.map((t, i) => (
                        <tr key={i}>
                          <td><b>{t.symbol}</b></td>
                          <td><DirBadge d={t.direction} /></td>
                          <td><span className={t.outcome === "TP" ? "out-tp" : "out-sl"}>{t.outcome}</span></td>
                          <td>{fmtPx(t.entry)}</td>
                          <td>{fmtPx(t.exit)}</td>
                          <td className={t.pnl >= 0 ? "green" : "red"}>{fmtPnl(t.pnl)}</td>
                          <td>${fmt(t.risk)}</td>
                          <td>{rr(t.entry, t.tp, t.sl)}</td>
                          <td>{fmt(t.score)}</td>
                          <td style={{ color:"var(--muted)", fontSize:"0.72rem" }}>{t.open_ts}</td>
                          <td style={{ color:"var(--muted)", fontSize:"0.72rem" }}>{t.close_ts}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── Scan Results ── */}
          <div className="section-header">Scan Results <span className="badge">{scanList.length}</span></div>
          {scanList.length === 0
            ? <div style={{ color:"var(--muted)", padding:16 }}>Belum ada data scan</div>
            : <div className="scan-grid">
                {scanList.map(r => {
                  const cls = r.signal
                    ? (r.direction==="SHORT" ? "scan-card signal-short" : "scan-card signal")
                    : "scan-card";
                  const lsr = r.raw?.lsr ? `LSR ${(r.raw.lsr.buy*100).toFixed(0)}%` : "";
                  const fg  = r.raw?.fg !== undefined ? `F&G ${r.raw.fg}` : "";
                  const oi  = r.raw?.oi_chg_pct !== undefined
                    ? `OI ${r.raw.oi_chg_pct>=0?"+":""}${Number(r.raw.oi_chg_pct).toFixed(2)}%` : "";
                  const entryScore = Number((r as ScanResult & { entry_score?: number }).entry_score ?? r.score ?? 0);
                  const biasScore  = Number((r as ScanResult & { bias_score?: number }).bias_score ?? 0);
                  return (
                    <div key={r.symbol} className={cls}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span className="sym">{r.symbol.replace("USDT","")}</span>
                        {r.direction ? <DirBadge d={r.direction} /> : <span style={{ color:"var(--muted)", fontSize:"0.72rem" }}>—</span>}
                      </div>
                      <div className="price">
                        ${r.mark_price ? fmtPx(r.mark_price) : "—"}
                        {lsr && <> &nbsp;{lsr}</>}
                        {fg  && <> &nbsp;{fg}</>}
                        {oi  && <> &nbsp;{oi}</>}
                      </div>
                      <div style={{ color:"var(--muted)", fontSize:"0.72rem", marginTop:4 }}>
                        Entry {entryScore.toFixed(2)} &nbsp;·&nbsp; Bias {biasScore.toFixed(2)}
                      </div>
                      <div style={{ color:"var(--muted)", fontSize:"0.72rem", marginTop:6, lineHeight:1.4 }}>
                        {r.entry_status === "entered"
                          ? "status: entered"
                          : r.skip_reason
                            ? `status: ${r.skip_reason}`
                            : r.signal
                              ? "status: signal_not_taken"
                              : "status: no_signal"}
                      </div>
                      {(r.tier1.length+r.tier2.length+r.tier3.length) > 0 && (
                        <div className="tags">
                          {r.tier1.map((t,i)=><Tag key={i} text={t} cls="tag-t1"/>)}
                          {r.tier2.map((t,i)=><Tag key={i} text={t} cls="tag-t2"/>)}
                          {r.tier3.map((t,i)=><Tag key={i} text={t} cls="tag-t3"/>)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
          }

          {/* ── Coin Bias Ranking ── */}
          <div className="section-header">
            🎯 Coin Bias Ranking <span className="badge">{coinBiasList.length}</span>
            <span style={{ color:"var(--muted)", fontSize:"0.72rem", textTransform:"none", letterSpacing:0 }}>update tiap 4 jam</span>
          </div>
          <div className="table-card">
            <div className="table-scroll">
              <table>
                <thead><tr>
                  <th>#</th><th>Symbol</th><th>Bias</th><th>Score</th>
                  <th>Win Rate</th><th>Avg Move</th><th>TF</th><th>Samples</th>
                </tr></thead>
                <tbody>
                  {coinBiasList.length === 0
                    ? <tr className="empty-row"><td colSpan={8}>Belum ada bias data</td></tr>
                    : coinBiasList.map((c, i) => (
                      <tr key={c.symbol}>
                        <td style={{ color:"var(--muted)" }}>{i + 1}</td>
                        <td><b>{c.symbol.replace("USDT","")}</b><span style={{ color:"var(--muted)", fontSize:"0.7rem" }}>USDT</span></td>
                        <td>
                          <span className={c.bias === "LONG" ? "tag tag-t2" : c.bias === "SHORT" ? "tag tag-t1" : "tag"}>
                            {c.bias}
                          </span>
                        </td>
                        <td className="yellow">{fmt(c.score, 1)}</td>
                        <td>{fmt(c.win_rate, 1)}%</td>
                        <td className={c.avg_move >= 0 ? "green" : "red"}>
                          {c.avg_move >= 0 ? "+" : ""}{fmt(c.avg_move, 2)}%
                        </td>
                        <td style={{ color:"var(--muted)" }}>{c.timeframe}</td>
                        <td style={{ color:"var(--muted)" }}>{c.samples}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ color:"var(--muted)", fontSize:"0.78rem", textAlign:"center", padding:"10px 0 4px" }}>
            Auto-refresh 15s · {state.scan_results_count ?? 0} symbols monitored
            {state.research_progress?.updated_at ? ` · dataset ${state.research_progress.updated_at} WIB` : ""}
          </div>

        </main>
      </div>

      <style>{`
        :root {
          --bg:#0a0a0f; --surface:#111118; --card:#16161f; --border:#242433;
          --text:#e2e2f0; --muted:#6b6b8a;
          --green:#00e676; --red:#ff5252; --blue:#448aff; --yellow:#ffd740;
        }
        .dash-root { min-height:100vh; background:var(--bg); color:var(--text); font-family:'Segoe UI',system-ui,sans-serif; font-size:14px; }
        .dash-loading,.dash-error { min-height:100vh; background:var(--bg); display:flex; align-items:center; justify-content:center; color:var(--muted); }
        .dash-error { color:var(--red); }

        .dash-header {
          display:flex; align-items:center; justify-content:space-between;
          padding:16px 24px; background:var(--surface);
          border-bottom:1px solid var(--border); position:sticky; top:0; z-index:100;
        }
        .dash-header h1 { font-size:1.2rem; font-weight:600; letter-spacing:.5px; }
        .dash-header h1 span { color:var(--blue); }
        .live-dot { width:10px; height:10px; border-radius:50%; background:var(--green); box-shadow:0 0 8px var(--green); animation:pulse 1.5s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .last-scan { color:var(--muted); font-size:.78rem; }

        .dash-main { max-width:1400px; margin:0 auto; padding:20px 16px; }

        .stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:12px; margin-bottom:20px; }
        .stat-card { background:var(--card); border:1px solid var(--border); border-radius:12px; padding:16px 20px; }
        .stat-card .label { color:var(--muted); font-size:.72rem; text-transform:uppercase; letter-spacing:.8px; margin-bottom:6px; }
        .stat-card .value { font-size:1.55rem; font-weight:700; line-height:1; }
        .stat-card .sub { color:var(--muted); font-size:.72rem; margin-top:4px; }

        .green { color:var(--green); } .red { color:var(--red); }
        .blue  { color:var(--blue);  } .yellow { color:var(--yellow); }
        .muted { color:var(--muted); }

        .charts-row { display:grid; grid-template-columns:2fr 1fr; gap:12px; margin-bottom:20px; }
        .chart-card { background:var(--card); border:1px solid var(--border); border-radius:12px; padding:16px; }
        .chart-card h3 { font-size:.8rem; color:var(--muted); margin-bottom:12px; text-transform:uppercase; letter-spacing:.8px; }

        .section-header { display:flex; align-items:center; gap:8px; font-size:.85rem; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin:24px 0 10px; }
        .badge { background:var(--border); border-radius:20px; padding:2px 8px; font-size:.7rem; color:var(--text); }

        .table-card { background:var(--card); border:1px solid var(--border); border-radius:12px; overflow:hidden; margin-bottom:16px; }
        table { width:100%; border-collapse:collapse; }
        thead th { background:#0d0d14; padding:10px 14px; font-size:.72rem; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:.8px; text-align:left; border-bottom:1px solid var(--border); }
        tbody td { padding:9px 14px; border-bottom:1px solid #1a1a28; }
        tbody tr:last-child td { border-bottom:none; }
        tbody tr:hover td { background:#1a1a28; }
        .empty-row td { color:var(--muted); text-align:center; padding:24px; font-style:italic; }
        .table-scroll { max-height:320px; overflow-y:auto; }
        .table-x-scroll { overflow-x:auto; -webkit-overflow-scrolling:touch; }
        .table-x-scroll table { min-width:1100px; }

        .tag { display:inline-block; padding:2px 7px; border-radius:4px; font-size:.68rem; font-weight:600; margin:1px; }
        .tag-t1 { background:rgba(255,82,82,.15); color:var(--red); border:1px solid rgba(255,82,82,.3); }
        .tag-t2 { background:rgba(68,138,255,.15); color:var(--blue); border:1px solid rgba(68,138,255,.3); }
        .tag-t3 { background:rgba(0,230,118,.15); color:var(--green); border:1px solid rgba(0,230,118,.3); }

        .dir { display:inline-block; padding:2px 8px; border-radius:4px; font-size:.72rem; font-weight:700; }
        .dir-long  { background:rgba(0,230,118,.15); color:var(--green); border:1px solid rgba(0,230,118,.3); }
        .dir-short { background:rgba(255,82,82,.15); color:var(--red); border:1px solid rgba(255,82,82,.3); }
        .out-tp { color:var(--green); font-weight:700; }
        .out-sl { color:var(--red); font-weight:700; }

        .scan-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:8px; margin-bottom:16px; }
        .scan-card { background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:10px 12px; }
        .scan-card.signal { border-color:rgba(0,230,118,.4); background:rgba(0,230,118,.04); }
        .scan-card.signal-short { border-color:rgba(255,82,82,.4); background:rgba(255,82,82,.04); }
        .scan-card .sym { font-weight:700; font-size:.88rem; }
        .scan-card .price { color:var(--muted); font-size:.78rem; }
        .scan-card .tags { margin-top:5px; }

        @media(max-width:700px) { .charts-row { grid-template-columns:1fr; } }
      `}</style>
    </>
  );
}
