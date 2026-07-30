// ============================================================
// CASO DE USO: GetProductsUseCase
// Capa: Application
// Descripción: Orquesta la obtención de productos.
//              Recibe el puerto (interfaz) como dependencia → DI.
//              No sabe nada de Axios ni del backend, solo del puerto.
// ============================================================

import type { IProductService } from '../../../domain/ports/IProductService'
import type { Product } from '../../../domain/entities/Product'

export class GetProductsUseCase {
  constructor(private readonly productService: IProductService) {}

  async execute(): Promise<Product[]> {
    return this.productService.getAll()
  }
}

export class SearchProductsUseCase {
  constructor(private readonly productService: IProductService) {}

  async execute(query: string): Promise<Product[]> {
    if (!query.trim()) {
      return this.productService.getAll()
    }
    return this.productService.search(query)
  }
}
