"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

interface ChartPoint {
  time: string;
  us30: number;
  spx: number;
}

const CONFLUENCE_ITEMS = [
  { key: "chk_vix", label: "VIX", desc: "Volatility Index" },
  { key: "chk_qqq", label: "QQQ", desc: "Nasdaq 100 ETF" },
  { key: "chk_stocks", label: "Stocks", desc: "MAG7 alignment" },
  { key: "chk_futures", label: "Futures", desc: "ES/NQ futures" },
  { key: "chk_session", label: "Session", desc: "NYSE cash session" },
] as const;

export default function BotDashboard() {
  const [latest, setLatest] = useState<Signal | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const fetchData = async () => {
    const { data } = await supabase
      .from("bot_signals")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!data || data.length === 0) {
      setLoading(false);
      return;
    }

    setLatest(data[0]);

    // Build chart points from history (oldest → newest)
    const points: ChartPoint[] = data
      .reverse()
      .map((s) => ({
        time: new Date(s.created_at).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        us30: s.us30_bid,
        spx: s.spx_bid,
      }));
    setChartData(points);
    setLastUpdate(new Date().toLocaleTimeString("id-ID"));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // Poll every 30s
    const interval = setInterval(fetchData, 30_000);

    // Supabase realtime subscription
    const channel = supabase
      .channel("bot_signals_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bot_signals" },
        () => fetchData()
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
        <div className="animate-pulse text-zinc-400">Loading dashboard...</div>
      </div>
    );
  }

  if (!latest) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
        <div className="text-center space-y-4">
          <p className="text-4xl">📡</p>
          <p className="text-zinc-400">Waiting for first signal...</p>
          <p className="text-xs text-zinc-600">
            No signals in bot_signals table yet.
          </p>
        </div>
      </div>
    );
  }

  const confluenceCount = CONFLUENCE_ITEMS.filter(
    (c) => latest[c.key as keyof Signal]
  ).length;
  const totalChecks = CONFLUENCE_ITEMS.length;

  const us30Price = latest.us30_bid;
  const spxPrice = latest.spx_bid;
  const spread30 = latest.us30_ask - latest.us30_bid;
  const spreadSPX = latest.spx_ask - latest.spx_bid;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trading Dashboard</h1>
          <p className="text-sm text-zinc-500">
            Session: {latest.session_name} · Updated {lastUpdate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-zinc-400">LIVE</span>
        </div>
      </div>

      {/* Price Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* US30 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold">US30</h2>
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                latest.direction === "LONG"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {latest.direction}
            </span>
          </div>
          <p className="text-3xl font-bold tracking-tight">
            {us30Price?.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <div className="flex gap-4 mt-2 text-xs text-zinc-500">
            <span>Bid: {latest.us30_bid?.toFixed(2)}</span>
            <span>Ask: {latest.us30_ask?.toFixed(2)}</span>
            <span>Spread: {spread30?.toFixed(2)}</span>
          </div>
        </div>

        {/* SPX500 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold">USSPX500</h2>
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                latest.direction === "LONG"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {latest.direction}
            </span>
          </div>
          <p className="text-3xl font-bold tracking-tight">
            {spxPrice?.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <div className="flex gap-4 mt-2 text-xs text-zinc-500">
            <span>Bid: {latest.spx_bid?.toFixed(2)}</span>
            <span>Ask: {latest.spx_ask?.toFixed(2)}</span>
            <span>Spread: {spreadSPX?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 mb-6">
        <h2 className="text-lg font-bold mb-4">Price Trend</h2>
        {chartData.length < 2 ? (
          <div className="flex items-center justify-center h-48 text-zinc-500 text-sm">
            Collecting data... need 2+ signals for chart.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="time"
                stroke="#52525b"
                tick={{ fontSize: 11 }}
              />
              <YAxis
                stroke="#52525b"
                tick={{ fontSize: 11 }}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="us30"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                name="US30"
              />
              <Line
                type="monotone"
                dataKey="spx"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="SPX500"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Confluence Checklist + Confidence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Checklist */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
          <h2 className="text-lg font-bold mb-4">Confluence Checklist</h2>
          <div className="space-y-3">
            {CONFLUENCE_ITEMS.map((item) => {
              const checked = latest[item.key as keyof Signal] as boolean;
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg ${
                        checked ? "text-green-400" : "text-zinc-600"
                      }`}
                    >
                      {checked ? "✅" : "⬜"}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-zinc-500">{item.desc}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      checked
                        ? "bg-green-500/20 text-green-400"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {checked ? "CONFIRMED" : "PENDING"}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800 text-xs text-zinc-500">
            {confluenceCount}/{totalChecks} confluence checks passed
          </div>
        </div>

        {/* Confidence Gauge */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
          <h2 className="text-lg font-bold mb-4">Signal Confidence</h2>

          {/* Circular gauge */}
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="#27272a"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke={
                    latest.confidence >= 75
                      ? "#22c55e"
                      : latest.confidence >= 50
                      ? "#eab308"
                      : "#ef4444"
                  }
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(latest.confidence / 100) * 327} 327`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{latest.confidence}%</span>
              </div>
            </div>
          </div>

          {/* Confidence bar */}
          <div className="w-full bg-zinc-800 rounded-full h-3 mb-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                latest.confidence >= 75
                  ? "bg-green-500"
                  : latest.confidence >= 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${latest.confidence}%` }}
            />
          </div>

          {/* Reason */}
          <div className="mt-4 p-3 bg-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-500 mb-1">Reason</p>
            <p className="text-sm text-zinc-300">
              {latest.reason || "—"}
            </p>
          </div>

          {/* Market context */}
          <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
            <div className="bg-zinc-800 rounded p-2">
              <p className="text-zinc-500">VIX</p>
              <p className="font-bold text-white">{latest.vix}</p>
            </div>
            <div className="bg-zinc-800 rounded p-2">
              <p className="text-zinc-500">QQQ</p>
              <p
                className={`font-bold ${
                  latest.qqq_move_pct >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {latest.qqq_move_pct > 0 ? "+" : ""}
                {latest.qqq_move_pct}%
              </p>
            </div>
            <div className="bg-zinc-800 rounded p-2">
              <p className="text-zinc-500">Stocks</p>
              <p className="font-bold text-white">
                {latest.stocks_aligned}/7
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
