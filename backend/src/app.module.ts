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

@Module({
  imports: [
    // ConfigModule disponible globalmente → process.env accesible en toda la app
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    ProductsModule,
    InvoicesModule,
  ],
})
export class AppModule {}
