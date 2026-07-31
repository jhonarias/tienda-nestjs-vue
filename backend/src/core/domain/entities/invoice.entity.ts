export type InvoiceStatus = 'PENDING' | 'PAID' | 'CANCELLED'

export interface InvoiceItem {
  id: string
  quantity: number
  unitPrice: number
  subtotal: number
  productId: string
  productName: string
  invoiceId: string
  createdAt: Date
}

export interface Invoice {
  id: string
  invoiceNumber: string
  total: number
  status: InvoiceStatus
  clientName?: string | null
  clientEmail?: string | null
  clientPhone?: string | null
  clientId?: string | null
  cashierId: string
  cashierName?: string
  items: InvoiceItem[]
  createdAt: Date
  updatedAt: Date
}
