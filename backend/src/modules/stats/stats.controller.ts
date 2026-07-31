import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard, Roles } from '../auth/guards/roles.guard'
import { GetDashboardStatsUseCase } from '../../core/application/use-cases/stats/get-dashboard-stats.use-case'

@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class StatsController {
  constructor(private readonly getStats: GetDashboardStatsUseCase) {}

  @Get()
  getDashboard() {
    return this.getStats.execute()
  }
}
