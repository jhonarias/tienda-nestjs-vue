import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { ProductsController } from './products.controller'
import { GetProductsUseCase, CreateProductUseCase, UpdateProductUseCase, DeleteProductUseCase, GetProductByIdUseCase } from '../../core/application/use-cases/products/product.use-cases'
import { STORAGE_SERVICE } from '../../core/domain/ports/storage-service.port'
import { SupabaseStorageService } from '../../infrastructure/storage/supabase-storage.service'

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController],
  providers: [
    GetProductsUseCase,
    GetProductByIdUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    { provide: STORAGE_SERVICE, useClass: SupabaseStorageService },
  ],
})
export class ProductsModule {}
