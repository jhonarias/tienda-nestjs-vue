// ============================================================
// PUERTO: IInvoiceService
// Capa: Domain → Ports
// ============================================================

import type { Invoice } from '../entities/Invoice'

export interface CreateInvoiceDTO {
  items: Array<{
    productId: string
    quantity: number
  }>
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  clientId?: string
}

export interface IInvoiceService {
  getAll(): Promise<Invoice[]>
  getById(id: string): Promise<Invoice>
  create(data: CreateInvoiceDTO): Promise<Invoice>
  cancel(id: string): Promise<Invoice>
}
