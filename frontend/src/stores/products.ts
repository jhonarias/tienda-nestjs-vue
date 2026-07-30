// ============================================================
// STORE: useProductStore (Pinia)
// ============================================================

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '@/core/domain/entities/Product'
import { ProductApiAdapter } from '@/core/infrastructure/adapters/ProductApiAdapter'
import { GetProductsUseCase, SearchProductsUseCase } from '@/core/application/use-cases/products/GetProductsUseCase'
import { CreateProductUseCase, UpdateProductUseCase, DeleteProductUseCase } from '@/core/application/use-cases/products/ManageProductUseCase'
import type { CreateProductDTO, UpdateProductDTO } from '@/core/domain/ports/IProductService'

const productService = new ProductApiAdapter()
const getProductsUseCase = new GetProductsUseCase(productService)
const searchProductsUseCase = new SearchProductsUseCase(productService)
const createProductUseCase = new CreateProductUseCase(productService)
const updateProductUseCase = new UpdateProductUseCase(productService)
const deleteProductUseCase = new DeleteProductUseCase(productService)

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      products.value = await getProductsUseCase.execute()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error al cargar productos'
    } finally {
      loading.value = false
    }
  }

  async function search(query: string) {
    loading.value = true
    error.value = null
    try {
      products.value = await searchProductsUseCase.execute(query)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error en la búsqueda'
    } finally {
      loading.value = false
    }
  }

  async function create(data: CreateProductDTO) {
    const product = await createProductUseCase.execute(data)
    products.value.unshift(product)
    return product
  }

  async function update(id: string, data: UpdateProductDTO) {
    const updated = await updateProductUseCase.execute(id, data)
    const idx = products.value.findIndex((p) => p.id === id)
    if (idx !== -1) products.value[idx] = updated
    return updated
  }

  async function remove(id: string) {
    await deleteProductUseCase.execute(id)
    products.value = products.value.filter((p) => p.id !== id)
  }

  return { products, loading, error, fetchAll, search, create, update, remove }
})
