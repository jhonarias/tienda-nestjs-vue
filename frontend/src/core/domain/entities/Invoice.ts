// ============================================================
// ENTIDAD: Invoice
// Capa: Domain
// Descripción: Representa una factura creada por un cajero
// ============================================================

export type InvoiceStatus = 'PENDING' | 'PAID' | 'CANCELLED'

export interface InvoiceItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  total: number
  status: InvoiceStatus
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  clientId?: string
  cashierId: string
  cashierName?: string
  items: InvoiceItem[]
  createdAt: Date
  updatedAt: Date
}

export function calculateInvoiceTotal(items: InvoiceItem[]): number {
  return items.reduce((acc, item) => acc + item.subtotal, 0)
}
