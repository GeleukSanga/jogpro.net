'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, ChevronDown, Copy, LayoutDashboard, Menu, Package, Printer, Search, Settings, SlidersHorizontal, Truck, Users, X } from 'lucide-react'

type Order = {
  id: number
  product_id: string
  custom_name: string | null
  color: string | null
  origin_city: string | null
  destination_city: string | null
  courier: string | null
  shipping_cost: number | null
  total: number
  status: string
  payment_method: string
  created_at: string
  recipient_name: string | null
  recipient_phone: string | null
  recipient_address: string | null
}

const formatMoney = (v: number | null) => `Rp${Number(v || 0).toLocaleString('id-ID')}`
const formatDate = (iso: string) => {
  try {
    const d = new Date(iso)
    return d.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch { return iso }
}

const PRINT_SIZES = ['100 × 150 mm', '100 × 100 mm', '80 × 80 mm', 'A6', 'A4', '58 mm'] as const
const sizeToClass: Record<string, string> = {
  '100 × 150 mm': 'print-size-100x150',
  '100 × 100 mm': 'print-size-100x100',
  '80 × 80 mm': 'print-size-80x80',
  'A6': 'print-size-A6',
  'A4': 'print-size-A4',
  '58 mm': 'print-size-58mm',
}

function Badge({ status }: { status: string }) {
  const cls = `status-${status}`
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${cls}`}>{status}</span>
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [courier, setCourier] = useState('all')
  const [selected, setSelected] = useState<number[]>([])
  const [preview, setPreview] = useState<Order | null>(null)
  const [batchPreview, setBatchPreview] = useState<Order[] | null>(null)
  const [printSize, setPrintSize] = useState<string>('100 × 150 mm')
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Order | null>(null)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' })
      const json = await res.json()
      if (json.success) setOrders(json.data)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }
  useEffect(() => { fetchOrders() }, [])

  const filtered = useMemo(() => orders.filter((o) => {
    const q = `${o.id} ${o.recipient_name || ''} ${o.recipient_phone || ''} ${o.product_id}`.toLowerCase()
    const matchQ = q.includes(query.toLowerCase())
    const matchStatus = status === 'all' || o.status === status
    const matchCourier = courier === 'all' || (o.courier || '').toLowerCase() === courier.toLowerCase()
    return matchQ && matchStatus && matchCourier
  }), [orders, query, status, courier])

  const allSelected = filtered.length > 0 && filtered.every((o) => selected.includes(o.id))
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map((o) => o.id))

  const handleDelete = async (order: Order) => {
    const res = await fetch(`/api/admin/orders?id=${order.id}`, { method: 'DELETE' })
    const json = await res.json()
    if (json.success) {
      setOrders((prev) => prev.filter((x) => x.id !== order.id))
      setSelected((prev) => prev.filter((id) => id !== order.id))
    }
    setConfirmDelete(null)
  }

  const handleBatchDelete = async () => {
    if (selected.length === 0) return
    const res = await fetch(`/api/admin/orders?ids=${selected.join(',')}`, { method: 'DELETE' })
    const json = await res.json()
    if (json.success) {
      setOrders((prev) => prev.filter((x) => !selected.includes(x.id)))
      setSelected([])
    }
  }

  const handleBatchPrint = () => {
    const list = orders.filter((o) => selected.includes(o.id))
    setBatchPreview(list)
    setTimeout(() => window.print(), 200)
  }

  const handleSinglePrint = (order: Order) => {
    setPreview(order)
    setTimeout(() => window.print(), 200)
  }

  // KPIs
  const today = useMemo(() => new Date().toDateString(), [])
  const ordersToday = orders.filter((o) => new Date(o.created_at).toDateString() === today).length
  const needPacking = orders.filter((o) => o.status === 'paid').length
  const revenueToday = orders.filter((o) => new Date(o.created_at).toDateString() === today).reduce((s, o) => s + Number(o.total || 0), 0)
  const shipped = orders.filter((o) => o.status === 'shipped').length

  if (loading) return <div className="grid min-h-screen place-items-center bg-[#f5f5f0]">Loading orders…</div>

  const labelClass = sizeToClass[printSize] || 'print-size-100x150'

  return <div className="admin-shell min-h-screen bg-[#f5f5f0] text-[#171717]">
    {/* Hidden print area for batch */}
    <div className="hidden print:block">
      {batchPreview && batchPreview.map((o) => (
        <div key={o.id} className={`label-paper ${labelClass}`} style={{ pageBreakAfter: 'always' }}>
          <LabelPaper order={o} />
        </div>
      ))}
      {preview && !batchPreview && (
        <div className={`label-paper ${labelClass}`}>
          <LabelPaper order={preview} />
        </div>
      )}
    </div>

    <aside className={`admin-sidebar ${menuOpen ? 'is-open' : ''}`}>
      <div className="flex items-center justify-between"><a href="/" className="text-xl font-black tracking-[-0.08em]">JOGPRO<span className="text-[#ef4b32]">.</span></a><button className="admin-mobile-close" onClick={() => setMenuOpen(false)}><X /></button></div>
      <div className="mt-12"><p className="admin-eyebrow">Workspace</p><nav className="mt-4 flex flex-col gap-2"><a className="admin-nav active" href="/admin"><LayoutDashboard /> Overview</a><a className="admin-nav" href="#orders"><Package /> Orders <span className="ml-auto rounded-full bg-[#d7ff3f] px-2 py-0.5 text-[10px]">{orders.length}</span></a><a className="admin-nav" href="#"><Users /> Customers</a></nav></div>
      <div className="mt-10"><p className="admin-eyebrow">Operations</p><nav className="mt-4 flex flex-col gap-2"><a className="admin-nav" href="#"><Truck /> Shipping</a><a className="admin-nav" href="#"><Settings /> Settings</a></nav></div>
      <div className="admin-profile mt-auto"><div className="grid size-9 place-items-center rounded-full bg-[#d7ff3f] text-xs font-black">AR</div><div><p className="text-xs font-black">Admin</p><p className="text-[10px] text-[#888]">Owner</p></div><ChevronDown className="ml-auto size-4 text-[#888]" /></div>
    </aside>
    {menuOpen && <button className="admin-overlay" onClick={() => setMenuOpen(false)} />}

    <main className="admin-main">
      <header className="admin-header"><button className="admin-mobile-menu" onClick={() => setMenuOpen(true)}><Menu /></button><div><p className="admin-eyebrow">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p><h1 className="mt-1 text-3xl font-black tracking-[-0.07em]">Pesanan masuk</h1></div><div className="ml-auto hidden items-center gap-3 sm:flex"><button className="admin-icon-button"><SlidersHorizontal /></button><div className="grid size-10 place-items-center rounded-full bg-[#171717] text-xs font-black text-white">AR</div></div></header>

      <section className="admin-kpis">
        <div className="admin-kpi"><span>Orders today</span><strong>{ordersToday.toString().padStart(2,'0')}</strong><small>{orders.length} total</small></div>
        <div className="admin-kpi"><span>Need packing</span><strong>{needPacking.toString().padStart(2,'0')}</strong><small>Paid, ready to process</small></div>
        <div className="admin-kpi"><span>Revenue today</span><strong>{formatMoney(revenueToday)}</strong><small>Semua status</small></div>
        <div className="admin-kpi"><span>Shipped</span><strong>{shipped.toString().padStart(2,'0')}</strong><small>On their way</small></div>
      </section>

      <section id="orders" className="admin-panel mt-8">
        <div className="flex flex-col gap-4 border-b border-black/10 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="admin-eyebrow">Order management</p><h2 className="mt-1 text-xl font-black tracking-[-0.05em]">All orders <span className="text-[#999]">({filtered.length})</span></h2></div>
          <div className="flex flex-wrap gap-2">
            <div className="admin-search"><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search order, name, phone" /></div>
            <select className="admin-select" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All status</option><option value="pending">Pending</option><option value="paid">Paid</option><option value="packed">Packed</option><option value="shipped">Shipped</option></select>
            <select className="admin-select" value={courier} onChange={(e) => setCourier(e.target.value)}><option value="all">All couriers</option><option>JNE</option><option>J&T</option><option>JNT</option><option>SiCepat</option><option>AnterAja</option></select>
          </div>
        </div>

        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th><input type="checkbox" checked={allSelected} onChange={toggleAll} /></th><th>Order</th><th>Product</th><th>Total</th><th>Courier</th><th>Status</th><th>Created</th><th>Destination</th><th>Action</th></tr></thead>
          <tbody>{filtered.map((o) => <tr key={o.id}><td><input type="checkbox" checked={selected.includes(o.id)} onChange={() => setSelected((c) => c.includes(o.id) ? c.filter((id) => id !== o.id) : [...c, o.id])} /></td>
            <td><p className="font-black">#{o.id}</p><p className="mt-1 text-[10px] text-[#999]">{o.recipient_name || '-'}</p></td>
            <td><p className="font-bold">{o.product_id}</p><p className="mt-1 text-[10px] text-[#888]">{o.color || ''}{o.custom_name ? ` · ${o.custom_name}` : ''}</p></td>
            <td className="font-black">{formatMoney(o.total)}</td>
            <td className="font-bold">{o.courier || '-'}</td>
            <td><Badge status={o.status} /></td>
            <td className="whitespace-nowrap text-[11px] text-[#777]">{formatDate(o.created_at)}</td>
            <td><p className="max-w-[190px] truncate text-xs">{o.recipient_address || o.destination_city || '-'}</p><span className="mt-1 inline-block rounded-full bg-black/5 px-2 py-1 text-[9px] font-bold">{o.destination_city || '-'}</span></td>
            <td><div className="flex items-center gap-1"><button className="admin-action" onClick={() => setPreview(o)}>Preview</button><button className="admin-print" onClick={() => handleSinglePrint(o)}><Printer /></button><button className="admin-delete" onClick={() => setConfirmDelete(o)}>×</button></div></td>
          </tr>)}{filtered.length===0 && <tr><td colSpan={9} className="py-10 text-center text-sm text-[#999]">Tidak ada pesanan</td></tr>}</tbody></table></div>

        <div className="admin-mobile-orders">{filtered.map((o) => <article className="admin-order-card" key={o.id}><div className="flex items-start justify-between"><div><p className="font-black">#{o.id}</p><p className="mt-1 text-xs text-[#888]">{o.recipient_name || '-'} · {o.recipient_phone || '-'}</p></div><Badge status={o.status} /></div><div className="mt-4 flex justify-between gap-3"><div><p className="font-bold">{o.product_id}</p><p className="mt-1 text-xs text-[#888]">{o.color || ''}{o.custom_name ? ` · ${o.custom_name}` : ''}</p></div><p className="font-black">{formatMoney(o.total)}</p></div><p className="mt-4 text-xs leading-5 text-[#777]">{o.recipient_address || '-'}<br /><strong className="text-[#171717]">{o.destination_city || ''}</strong></p><div className="mt-4 flex gap-2"><button className="admin-action flex-1" onClick={() => setPreview(o)}>Preview label</button><button className="admin-print" onClick={() => handleSinglePrint(o)}><Printer /></button><button className="admin-delete" onClick={() => setConfirmDelete(o)}>×</button></div></article>)}</div>

        <div className="flex items-center justify-between border-t border-black/10 px-5 py-4 text-xs text-[#888]"><span>Showing {filtered.length} of {orders.length} orders</span></div>
      </section>
    </main>

    {selected.length > 0 && <div className="admin-batch"><span><strong>{selected.length}</strong> terpilih</span><select value={printSize} onChange={(e) => setPrintSize(e.target.value)}>{PRINT_SIZES.map((s) => <option key={s}>{s}</option>)}</select><button onClick={handleBatchPrint}><Printer /> Cetak terpilih</button><button onClick={handleBatchDelete} className="!bg-transparent !text-white border border-white/20">Hapus terpilih</button><button onClick={() => setSelected([])}><X /></button></div>}

    {preview && <div className="admin-modal-backdrop" role="dialog" aria-modal="true"><div className="admin-modal"><div className="flex items-start justify-between"><div><p className="admin-eyebrow">Label preview</p><h2 className="mt-1 text-2xl font-black tracking-[-0.06em]">#{preview.id} — {preview.product_id}</h2></div><button className="admin-icon-button" onClick={() => { setPreview(null); setBatchPreview(null) }}><X /></button></div>
      <div className={`label-paper ${labelClass}`}><LabelPaper order={preview} /></div>
      <div className="mt-5 flex gap-3"><select className="admin-select flex-1" value={printSize} onChange={(e) => setPrintSize(e.target.value)}>{PRINT_SIZES.map((s) => <option key={s}>{s}</option>)}</select><button className="admin-dark-button flex-1" onClick={() => handleSinglePrint(preview)}><Printer /> Cetak</button></div>
    </div></div>}

    {confirmDelete && <div className="admin-modal-backdrop"><div className="admin-modal max-w-md"><h3 className="text-lg font-black">Hapus pesanan #{confirmDelete.id}?</h3><p className="mt-2 text-sm text-[#777]">Data akan dihapus permanen. Tidak bisa dikembalikan.</p><div className="mt-5 flex gap-3"><button className="admin-action flex-1" onClick={() => setConfirmDelete(null)}>Batal</button><button className="admin-delete flex-1 !bg-[#ef4b32] !text-white" onClick={() => handleDelete(confirmDelete)}>Ya, hapus</button></div></div></div>}

    {/* Batch preview modal */}
    {batchPreview && !preview && <div className="admin-modal-backdrop"><div className="admin-modal"><div className="flex items-start justify-between"><div><p className="admin-eyebrow">Batch preview — {batchPreview.length} label</p><h2 className="mt-1 text-xl font-black">Cetak bersamaan</h2></div><button className="admin-icon-button" onClick={() => setBatchPreview(null)}><X /></button></div><div className="mt-4 flex flex-col gap-4 max-h-[50vh] overflow-auto">{batchPreview.map((o) => <div key={o.id} className={`label-paper ${labelClass} scale-[0.85] origin-top`}><LabelPaper order={o} /></div>)}</div><div className="mt-5 flex gap-3"><select className="admin-select flex-1" value={printSize} onChange={(e) => setPrintSize(e.target.value)}>{PRINT_SIZES.map((s) => <option key={s}>{s}</option>)}</select><button className="admin-dark-button flex-1" onClick={() => window.print()}><Printer /> Print {batchPreview.length}</button></div></div></div>}
  </div>
}

function LabelPaper({ order }: { order: Order }) {
  return <>
    <div className="flex items-start justify-between border-b-2 border-[#171717] pb-4"><div><p className="text-2xl font-black tracking-[-0.08em]">JOGPRO<span className="text-[#ef4b32]">.NET</span></p><p className="mt-1 font-mono text-[9px]">#{order.id} · {formatDate(order.created_at)} · {order.courier || '-'}</p></div><Truck className="size-7" /></div>
    <div className="grid grid-cols-2 gap-4 border-b border-dashed border-black/30 py-5 font-mono text-[11px]">
      <div><p className="mb-2 font-sans text-[9px] font-black uppercase tracking-widest text-[#999]">Dari</p><p className="font-bold">JOGPRO Warehouse</p><p>BSD, Tangerang</p><p>Banten 15311</p><p>0812-xxxx-xxxx</p></div>
      <div><p className="mb-2 font-sans text-[9px] font-black uppercase tracking-widest text-[#999]">Tujuan</p><p className="font-bold">{order.recipient_name || '-'}</p><p>{order.recipient_phone || '-'}</p><p>{order.recipient_address || '-'}</p><p className="font-bold">{order.destination_city || '-'}</p></div>
    </div>
    <div className="pt-4 font-mono text-[10px] leading-5">
      <p><strong>PRODUK</strong> {order.product_id} {order.custom_name ? `(${order.custom_name})` : ''}</p>
      <p><strong>VARIAN</strong> {order.color || '-'}</p>
      <p><strong>KURIR</strong> {order.courier || '-'} · {formatMoney(order.shipping_cost)}</p>
      <p><strong>TOTAL</strong> {formatMoney(order.total)}</p>
      <p className="mt-2 text-[9px] text-[#999]">Alamat sesuai input pembeli di checkout — {order.recipient_address ? 'lengkap' : 'fallback ke destination_city'}</p>
    </div>
  </>
}
