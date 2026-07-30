// ============================================================
// PUERTO: IProductService
// Capa: Domain → Ports
// ============================================================

import type { Product } from '../entities/Product'

export interface CreateProductDTO {
  name: string
  description?: string
  quantity: number
  unitPrice: number
  sku?: string
  image?: File
}

export interface UpdateProductDTO {
  name?: string
  description?: string
  quantity?: number
  unitPrice?: number
  sku?: string
  isActive?: boolean
  image?: File
}

export interface IProductService {
  getAll(): Promise<Product[]>
  getById(id: string): Promise<Product>
  search(query: string): Promise<Product[]>
  create(data: CreateProductDTO): Promise<Product>
  update(id: string, data: UpdateProductDTO): Promise<Product>
  remove(id: string): Promise<void>
}
