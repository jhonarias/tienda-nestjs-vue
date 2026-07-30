// ============================================================
// PRISMA SERVICE — NestJS singleton del PrismaClient
// Al extender OnModuleInit y OnModuleDestroy, NestJS gestiona
// automáticamente la conexión durante el ciclo de vida de la app.
// ============================================================

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
