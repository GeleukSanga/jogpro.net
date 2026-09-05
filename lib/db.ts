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

const products: Product[] = [
  { id: 'neon-drip', name: 'Neon Drip', kind: 'case_motif', price: 20000, description: 'Tekstur soft-touch dengan karakter neon yang berani.', tag: 'Best seller', accent: 'violet', colors: JSON.stringify(['Violet', 'Lime', 'Midnight']), image_url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_42_05%20PM-2gUW7il51MvD8mqs27gsvaugVsVJ6C.png' },
  { id: 'dragon-duo', name: 'Dragon Duo', kind: 'case_motif', price: 20000, description: 'Relief naga 3D untuk statement piece yang ikonik.', tag: 'Limited', accent: 'blue', colors: JSON.stringify(['Ivory', 'Obsidian']), image_url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_45_40%20PM-tJyA6aPHDrHuxAPCtmKQ090M8rwsUk.png' },
  { id: 'your-name', name: 'Your Name', kind: 'case_custom', price: 25000, description: 'Nama kamu, di-emboss langsung ke case favoritmu.', tag: 'Custom', accent: 'lime', colors: JSON.stringify(['Black', 'Stone', 'Lime']), image_url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_49_25%20PM-vYnuJFMY7Ne117XB3x1tj5GZsxzgkL.png' },
  { id: 'gothic-guardian', name: 'Gothic Guardian', kind: 'case_motif', price: 20000, description: 'Detail relief gelap, dibuat untuk koleksi yang beda.', tag: 'New drop', accent: 'red', colors: JSON.stringify(['Obsidian', 'Wine']), image_url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%205%2C%202026%20at%2009_43_40%20PM-LSxDzqXc7EloDpwQ906cQvdFUA14ie.png' },
]

let orders: Order[] = []
let orderCounter = 1

export function getProducts(): Product[] {
  return products
}

export function getProduct(id: string): Product | undefined {
  return products.find(p => p.id === id)
}

export function createOrder(order: Omit<Order, 'id' | 'created_at'>): number {
  const newOrder: Order = {
    ...order,
    id: orderCounter++,
    created_at: new Date().toISOString(),
  }
  orders.push(newOrder)
  return newOrder.id
}

export function getOrder(id: number): Order | undefined {
  return orders.find(o => o.id === id)
}
