// ============================================================
// CASO DE USO: GetDashboardStatsUseCase
// ============================================================

import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../../infrastructure/database/prisma.service'

export interface DashboardStats {
  totalProducts: number
  activeProducts: number
  activeCashiers: number
  totalInvoices: number
  todayInvoices: number
  totalRevenue: number
  todayRevenue: number
  lowStockProducts: Array<{ id: string; name: string; quantity: number }>
  recentInvoices: Array<{
    id: string
    invoiceNumber: string
    total: number
    status: string
    clientName: string | null
    cashierName: string
    createdAt: Date
  }>
}

@Injectable()
export class GetDashboardStatsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<DashboardStats> {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const [
      totalProducts,
      activeProducts,
      activeCashiers,
      totalInvoices,
      todayInvoices,
      revenueAll,
      revenueToday,
      lowStockProducts,
      recentInvoices,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { role: 'CASHIER', isActive: true } }),
      this.prisma.invoice.count(),
      this.prisma.invoice.count({
        where: { createdAt: { gte: startOfToday } },
      }),
      this.prisma.invoice.aggregate({ _sum: { total: true } }),
      this.prisma.invoice.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: startOfToday } },
      }),
      this.prisma.product.findMany({
        where: { isActive: true, quantity: { lte: 5 } },
        select: { id: true, name: true, quantity: true },
        orderBy: { quantity: 'asc' },
        take: 6,
      }),
      this.prisma.invoice.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { cashier: { select: { username: true } } },
      }),
    ])

    return {
      totalProducts,
      activeProducts,
      activeCashiers,
      totalInvoices,
      todayInvoices,
      totalRevenue: Number(revenueAll._sum.total ?? 0),
      todayRevenue: Number(revenueToday._sum.total ?? 0),
      lowStockProducts,
      recentInvoices: recentInvoices.map((inv) => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        total: Number(inv.total),
        status: inv.status,
        clientName: inv.clientName,
        cashierName: inv.cashier.username,
        createdAt: inv.createdAt,
      })),
    }
  }
}
