import httpClient from '../http/httpClient'

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

export class StatsApiAdapter {
  async getDashboard(): Promise<DashboardStats> {
    const { data } = await httpClient.get<DashboardStats>('/stats')
    return data
  }
}
