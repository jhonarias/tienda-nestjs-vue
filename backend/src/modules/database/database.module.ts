// ============================================================
// DATABASE MODULE
// Provee PrismaService y todos los repositorios como tokens
// Exported para que cualquier módulo pueda usarlos
// ============================================================

import { Module } from '@nestjs/common'
import { PrismaService } from '../../infrastructure/database/prisma.service'
import { PrismaUserRepository } from '../../infrastructure/database/repositories/prisma-user.repository'
import { PrismaProductRepository } from '../../infrastructure/database/repositories/prisma-product.repository'
import { PrismaInvoiceRepository } from '../../infrastructure/database/repositories/prisma-invoice.repository'
import { USER_REPOSITORY } from '../../core/domain/ports/user-repository.port'
import { PRODUCT_REPOSITORY } from '../../core/domain/ports/product-repository.port'
import { INVOICE_REPOSITORY } from '../../core/domain/ports/invoice-repository.port'

@Module({
  providers: [
    PrismaService,
    // Registramos las implementaciones con sus tokens (DI hexagonal)
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: PRODUCT_REPOSITORY, useClass: PrismaProductRepository },
    { provide: INVOICE_REPOSITORY, useClass: PrismaInvoiceRepository },
  ],
  exports: [
    PrismaService,
    USER_REPOSITORY,
    PRODUCT_REPOSITORY,
    INVOICE_REPOSITORY,
  ],
})
export class DatabaseModule {}
