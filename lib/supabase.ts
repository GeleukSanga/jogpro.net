import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://issvevormawbcqkrhvhg.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

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
  recipient_name: string | null
  recipient_phone: string | null
  recipient_address: string | null
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('jogpro_products')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Get products error:', error)
    return []
  }
  return data || []
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from('jogpro_products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Get product error:', error)
    return undefined
  }
  return data
}

export async function createOrder(order: Omit<Order, 'id' | 'created_at'>): Promise<number | null> {
  const { data, error } = await supabase
    .from('jogpro_orders')
    .insert({
      product_id: order.product_id,
      custom_name: order.custom_name,
      color: order.color,
      origin_city: order.origin_city,
      destination_city: order.destination_city,
      courier: order.courier,
      shipping_cost: order.shipping_cost,
      total: order.total,
      status: order.status,
      payment_method: order.payment_method,
      recipient_name: order.recipient_name,
      recipient_phone: order.recipient_phone,
      recipient_address: order.recipient_address,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Create order error:', error)
    return null
  }
  return data?.id
}

export async function getOrder(id: number): Promise<Order | undefined> {
  const { data, error } = await supabase
    .from('jogpro_orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Get order error:', error)
    return undefined
  }
  return data
}
