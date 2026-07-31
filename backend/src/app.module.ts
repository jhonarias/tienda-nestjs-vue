// ============================================================
// APP MODULE — Módulo raíz de la aplicación
// Importa ConfigModule para las variables de entorno y
// todos los módulos de dominio.
// ============================================================

import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { ProductsModule } from './modules/products/products.module'
import { InvoicesModule } from './modules/invoices/invoices.module'
import { StatsModule } from './modules/stats/stats.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    ProductsModule,
    InvoicesModule,
    StatsModule,
  ],
})
export class AppModule {}
