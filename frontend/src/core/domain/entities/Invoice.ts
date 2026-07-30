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
  // Datos opcionales del cliente
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  clientId?: string
  // Cajero que generó la factura
  cashierId: string
  cashierName: string
  items: InvoiceItem[]
  createdAt: Date
  updatedAt: Date
}

// Calcula el total de la factura a partir de sus ítems
export function calculateInvoiceTotal(items: InvoiceItem[]): number {
  return items.reduce((acc, item) => acc + item.subtotal, 0)
}
