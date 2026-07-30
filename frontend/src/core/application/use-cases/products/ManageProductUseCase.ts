// ============================================================
// CASO DE USO: ManageProductUseCase
// Capa: Application
// ============================================================

import type { IProductService, CreateProductDTO, UpdateProductDTO } from '../../domain/ports/IProductService'
import type { Product } from '../../domain/entities/Product'

export class CreateProductUseCase {
  constructor(private readonly productService: IProductService) {}

  async execute(data: CreateProductDTO): Promise<Product> {
    // Aquí podría haber validaciones de negocio antes de delegar
    if (data.quantity < 0) throw new Error('La cantidad no puede ser negativa')
    if (data.unitPrice <= 0) throw new Error('El precio debe ser mayor a cero')
    return this.productService.create(data)
  }
}

export class UpdateProductUseCase {
  constructor(private readonly productService: IProductService) {}

  async execute(id: string, data: UpdateProductDTO): Promise<Product> {
    if (data.unitPrice !== undefined && data.unitPrice <= 0) {
      throw new Error('El precio debe ser mayor a cero')
    }
    return this.productService.update(id, data)
  }
}

export class DeleteProductUseCase {
  constructor(private readonly productService: IProductService) {}

  async execute(id: string): Promise<void> {
    return this.productService.remove(id)
  }
}
