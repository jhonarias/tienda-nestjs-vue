import type { Invoice, InvoiceStatus } from '../entities/invoice.entity'

export const INVOICE_REPOSITORY = 'INVOICE_REPOSITORY'

export interface CreateInvoiceItemData {
  productId: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface CreateInvoiceData {
  cashierId: string
  total: number
  items: CreateInvoiceItemData[]
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  clientId?: string
}

export interface IInvoiceRepository {
  findAll(cashierId?: string): Promise<Invoice[]>
  findById(id: string): Promise<Invoice | null>
  create(data: CreateInvoiceData): Promise<Invoice>
  updateStatus(id: string, status: InvoiceStatus): Promise<Invoice>
}
