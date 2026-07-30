// ============================================================
// ADAPTADOR: InvoiceApiAdapter
// Capa: Infrastructure
// ============================================================

import type { IInvoiceService, CreateInvoiceDTO } from '../../domain/ports/IInvoiceService'
import type { Invoice } from '../../domain/entities/Invoice'
import httpClient from '../http/httpClient'

export class InvoiceApiAdapter implements IInvoiceService {
  async getAll(): Promise<Invoice[]> {
    const { data } = await httpClient.get<Invoice[]>('/invoices')
    return data
  }

  async getById(id: string): Promise<Invoice> {
    const { data } = await httpClient.get<Invoice>(`/invoices/${id}`)
    return data
  }

  async create(payload: CreateInvoiceDTO): Promise<Invoice> {
    const { data } = await httpClient.post<Invoice>('/invoices', payload)
    return data
  }

  async cancel(id: string): Promise<Invoice> {
    const { data } = await httpClient.patch<Invoice>(`/invoices/${id}/cancel`)
    return data
  }
}
