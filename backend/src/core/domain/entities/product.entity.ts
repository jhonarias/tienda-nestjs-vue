export interface Product {
  id: string
  name: string
  description?: string | null
  quantity: number
  unitPrice: number
  imageUrl?: string | null
  sku?: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
