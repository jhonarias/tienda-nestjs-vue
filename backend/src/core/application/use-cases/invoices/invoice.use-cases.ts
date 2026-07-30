// ============================================================
// CASOS DE USO: Facturas
// ============================================================

import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common'
import {
  INVOICE_REPOSITORY,
  IInvoiceRepository,
  CreateInvoiceData,
} from '../../../domain/ports/invoice-repository.port'
import { PRODUCT_REPOSITORY, IProductRepository } from '../../../domain/ports/product-repository.port'
import type { Invoice } from '../../../domain/entities/invoice.entity'

export interface CreateInvoiceInput {
  cashierId: string
  items: Array<{ productId: string; quantity: number }>
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  clientId?: string
}

@Injectable()
export class CreateInvoiceUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepo: IInvoiceRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(input: CreateInvoiceInput): Promise<Invoice> {
    if (!input.items?.length) {
      throw new BadRequestException('La factura debe tener al menos un producto')
    }

    let total = 0
    const invoiceItems: CreateInvoiceData['items'] = []

    for (const item of input.items) {
      if (item.quantity <= 0) throw new BadRequestException('La cantidad debe ser mayor a cero')

      const product = await this.productRepo.findById(item.productId)
      if (!product) throw new NotFoundException(`Producto ${item.productId} no encontrado`)
      if (!product.isActive) throw new BadRequestException(`El producto "${product.name}" no está disponible`)
      if (product.quantity < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para "${product.name}". Disponible: ${product.quantity}`,
        )
      }

      const subtotal = Number(product.unitPrice) * item.quantity
      total += subtotal
      invoiceItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: Number(product.unitPrice),
        subtotal,
      })
    }

    const invoice = await this.invoiceRepo.create({
      cashierId: input.cashierId,
      total,
      items: invoiceItems,
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      clientPhone: input.clientPhone,
      clientId: input.clientId,
    })

    // Decrementar stock después de crear la factura
    for (const item of input.items) {
      await this.productRepo.decrementStock(item.productId, item.quantity)
    }

    return invoice
  }
}

@Injectable()
export class GetInvoicesUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepo: IInvoiceRepository,
  ) {}

  async execute(cashierId?: string): Promise<Invoice[]> {
    return this.invoiceRepo.findAll(cashierId)
  }
}
