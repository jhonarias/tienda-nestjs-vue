// ============================================================
// CASOS DE USO: Productos
// ============================================================

import { Injectable, Inject, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common'
import {
  PRODUCT_REPOSITORY,
  IProductRepository,
  CreateProductData,
  UpdateProductData,
} from '../../../domain/ports/product-repository.port'
import { STORAGE_SERVICE, IStorageService } from '../../../domain/ports/storage-service.port'
import type { Product } from '../../../domain/entities/product.entity'

export interface ImageFile {
  buffer: Buffer
  mimeType: string
  originalname: string
}

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(search?: string): Promise<Product[]> {
    return this.productRepo.findAll(search)
  }
}

@Injectable()
export class GetProductByIdUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(id: string): Promise<Product> {
    const product = await this.productRepo.findById(id)
    if (!product) throw new NotFoundException('Producto no encontrado')
    return product
  }
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
    @Inject(STORAGE_SERVICE)
    private readonly storage: IStorageService,
  ) {}

  async execute(data: CreateProductData, imageFile?: ImageFile): Promise<Product> {
    if (data.unitPrice <= 0) throw new BadRequestException('El precio debe ser mayor a cero')
    if (data.quantity < 0) throw new BadRequestException('La cantidad no puede ser negativa')

    if (data.sku) {
      const existing = await this.productRepo.findBySku(data.sku)
      if (existing) throw new ConflictException('El SKU ya está en uso')
    }

    let imageUrl: string | undefined
    if (imageFile) {
      const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? 'products'
      const path = `products/${Date.now()}-${imageFile.originalname}`
      imageUrl = await this.storage.upload(bucket, path, imageFile.buffer, imageFile.mimeType)
    }

    return this.productRepo.create({ ...data, imageUrl })
  }
}

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
    @Inject(STORAGE_SERVICE)
    private readonly storage: IStorageService,
  ) {}

  async execute(id: string, data: UpdateProductData, imageFile?: ImageFile): Promise<Product> {
    const product = await this.productRepo.findById(id)
    if (!product) throw new NotFoundException('Producto no encontrado')

    let imageUrl = data.imageUrl
    if (imageFile) {
      const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? 'products'
      const path = `products/${Date.now()}-${imageFile.originalname}`
      imageUrl = await this.storage.upload(bucket, path, imageFile.buffer, imageFile.mimeType)
    }

    return this.productRepo.update(id, { ...data, imageUrl })
  }
}

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const product = await this.productRepo.findById(id)
    if (!product) throw new NotFoundException('Producto no encontrado')
    return this.productRepo.delete(id)
  }
}
