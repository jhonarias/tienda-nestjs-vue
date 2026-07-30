// ============================================================
// ADAPTADOR: ProductApiAdapter
// Capa: Infrastructure
// ============================================================

import type { IProductService, CreateProductDTO, UpdateProductDTO } from '../../domain/ports/IProductService'
import type { Product } from '../../domain/entities/Product'
import httpClient from '../http/httpClient'

export class ProductApiAdapter implements IProductService {
  async getAll(): Promise<Product[]> {
    const { data } = await httpClient.get<Product[]>('/products')
    return data
  }

  async getById(id: string): Promise<Product> {
    const { data } = await httpClient.get<Product>(`/products/${id}`)
    return data
  }

  async search(query: string): Promise<Product[]> {
    const { data } = await httpClient.get<Product[]>('/products', {
      params: { search: query },
    })
    return data
  }

  async create(payload: CreateProductDTO): Promise<Product> {
    // Si hay imagen, usamos FormData (multipart)
    if (payload.image) {
      const formData = new FormData()
      formData.append('name', payload.name)
      if (payload.description) formData.append('description', payload.description)
      formData.append('quantity', String(payload.quantity))
      formData.append('unitPrice', String(payload.unitPrice))
      if (payload.sku) formData.append('sku', payload.sku)
      formData.append('image', payload.image)

      const { data } = await httpClient.post<Product>('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    }

    const { data } = await httpClient.post<Product>('/products', payload)
    return data
  }

  async update(id: string, payload: UpdateProductDTO): Promise<Product> {
    if (payload.image) {
      const formData = new FormData()
      if (payload.name) formData.append('name', payload.name)
      if (payload.description) formData.append('description', payload.description)
      if (payload.quantity !== undefined) formData.append('quantity', String(payload.quantity))
      if (payload.unitPrice !== undefined) formData.append('unitPrice', String(payload.unitPrice))
      if (payload.sku) formData.append('sku', payload.sku)
      if (payload.isActive !== undefined) formData.append('isActive', String(payload.isActive))
      formData.append('image', payload.image)

      const { data } = await httpClient.patch<Product>(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    }

    const { data } = await httpClient.patch<Product>(`/products/${id}`, payload)
    return data
  }

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/products/${id}`)
  }
}
