import { Module } from '@nestjs/common'
import { StatsController } from './stats.controller'
import { GetDashboardStatsUseCase } from '../../core/application/use-cases/stats/get-dashboard-stats.use-case'
import { PrismaService } from '../../infrastructure/database/prisma.service'

@Module({
  controllers: [StatsController],
  providers: [GetDashboardStatsUseCase, PrismaService],
})
export class StatsModule {}
