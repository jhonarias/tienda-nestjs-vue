// ============================================================
// ENTIDAD: Product
// Capa: Domain
// Descripción: Representa el objeto de negocio central "Producto"
// ============================================================

export interface Product {
  id: string
  name: string
  description?: string
  quantity: number
  unitPrice: number
  imageUrl?: string
  sku?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Verifica si hay stock disponible
export function hasStock(product: Product, requested: number): boolean {
  return product.quantity >= requested
}
