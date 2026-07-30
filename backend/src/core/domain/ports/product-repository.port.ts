import type { Product } from '../entities/product.entity'

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY'

export interface CreateProductData {
  name: string
  description?: string
  quantity: number
  unitPrice: number
  imageUrl?: string
  sku?: string
}

export interface UpdateProductData {
  name?: string
  description?: string
  quantity?: number
  unitPrice?: number
  imageUrl?: string
  sku?: string
  isActive?: boolean
}

export interface IProductRepository {
  findAll(search?: string): Promise<Product[]>
  findById(id: string): Promise<Product | null>
  findBySku(sku: string): Promise<Product | null>
  create(data: CreateProductData): Promise<Product>
  update(id: string, data: UpdateProductData): Promise<Product>
  decrementStock(id: string, quantity: number): Promise<Product>
  delete(id: string): Promise<void>
}
