import Database from 'better-sqlite3'
import path from 'path'

let _db: Database.Database | null = null

function getDb(): Database.Database {
  if (_db) return _db

  const dbPath = path.join(process.cwd(), 'jogpro.db')
  _db = new Database(dbPath)
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')

  _db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      kind TEXT NOT NULL CHECK(kind IN ('case_motif', 'case_custom')),
      price INTEGER NOT NULL,
      description TEXT,
      tag TEXT,
      accent TEXT,
      colors TEXT NOT NULL,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      custom_name TEXT,
      color TEXT,
      origin_city TEXT,
      destination_city TEXT,
      courier TEXT,
      shipping_cost INTEGER,
      total INTEGER NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
      payment_method TEXT DEFAULT 'bca_transfer',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  const seedProducts = _db.prepare(`
    INSERT OR IGNORE INTO products (id, name, kind, price, description, tag, accent, colors, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const products = [
    ['neon-drip', 'Neon Drip', 'case_motif', 20000, 'Tekstur soft-touch dengan karakter neon yang berani.', 'Best seller', 'violet', JSON.stringify(['Violet', 'Lime', 'Midnight']), 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_42_05%20PM-2gUW7il51MvD8mqs27gsvaugVsVJ6C.png'],
    ['dragon-duo', 'Dragon Duo', 'case_motif', 20000, 'Relief naga 3D untuk statement piece yang ikonik.', 'Limited', 'blue', JSON.stringify(['Ivory', 'Obsidian']), 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_45_40%20PM-tJyA6aPHDrHuxAPCtmKQ090M8rwsUk.png'],
    ['your-name', 'Your Name', 'case_custom', 25000, 'Nama kamu, di-emboss langsung ke case favoritmu.', 'Custom', 'lime', JSON.stringify(['Black', 'Stone', 'Lime']), 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_49_25%20PM-vYnuJFMY7Ne117XB3x1tj5GZsxzgkL.png'],
    ['gothic-guardian', 'Gothic Guardian', 'case_motif', 20000, 'Detail relief gelap, dibuat untuk koleksi yang beda.', 'New drop', 'red', JSON.stringify(['Obsidian', 'Wine']), 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_43_40%20PM-LSxDzqXc7EloDpwQ906cQvdFUA14ie.png'],
  ]

  const insertMany = _db.transaction((items: typeof products) => {
    for (const item of items) {
      seedProducts.run(...item)
    }
  })

  insertMany(products)

  return _db
}

export interface Product {
  id: string
  name: string
  kind: 'case_motif' | 'case_custom'
  price: number
  description: string
  tag: string
  accent: string
  colors: string
  image_url: string
}

export interface Order {
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
}

export function getProducts(): Product[] {
  return getDb().prepare('SELECT * FROM products').all() as Product[]
}

export function getProduct(id: string): Product | undefined {
  return getDb().prepare('SELECT * FROM products WHERE id = ?').get(id) as Product | undefined
}

export function createOrder(order: Omit<Order, 'id' | 'created_at'>): number {
  const stmt = getDb().prepare(`
    INSERT INTO orders (product_id, custom_name, color, origin_city, destination_city, courier, shipping_cost, total, status, payment_method)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const result = stmt.run(
    order.product_id,
    order.custom_name,
    order.color,
    order.origin_city,
    order.destination_city,
    order.courier,
    order.shipping_cost,
    order.total,
    order.status,
    order.payment_method
  )
  return result.lastInsertRowid as number
}

export function getOrder(id: number): Order | undefined {
  return getDb().prepare('SELECT * FROM orders WHERE id = ?').get(id) as Order | undefined
}
