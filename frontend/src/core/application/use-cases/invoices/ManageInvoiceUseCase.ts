// ============================================================
// CASO DE USO: CreateInvoiceUseCase
// Capa: Application
// Descripción: Crea una factura validando que existan ítems
// ============================================================

import type { IInvoiceService, CreateInvoiceDTO } from '../../../domain/ports/IInvoiceService'
import type { Invoice } from '../../../domain/entities/Invoice'

export class CreateInvoiceUseCase {
  constructor(private readonly invoiceService: IInvoiceService) {}

  async execute(data: CreateInvoiceDTO): Promise<Invoice> {
    if (!data.items || data.items.length === 0) {
      throw new Error('La factura debe tener al menos un producto')
    }
    for (const item of data.items) {
      if (item.quantity <= 0) {
        throw new Error('La cantidad de cada producto debe ser mayor a cero')
      }
    }
    return this.invoiceService.create(data)
  }
}

export class GetInvoicesUseCase {
  constructor(private readonly invoiceService: IInvoiceService) {}

  async execute(): Promise<Invoice[]> {
    return this.invoiceService.getAll()
  }
}
