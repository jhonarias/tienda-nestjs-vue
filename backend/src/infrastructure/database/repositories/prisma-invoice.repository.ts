import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import type { IInvoiceRepository, CreateInvoiceData } from '../../../core/domain/ports/invoice-repository.port'
import type { Invoice, InvoiceStatus } from '../../../core/domain/entities/invoice.entity'

function toInvoice(inv: Record<string, unknown>): Invoice {
  return {
    ...inv,
    total: (inv.total as { toNumber(): number }).toNumber(),
    items: ((inv.items ?? []) as Array<Record<string, unknown>>).map((item) => ({
      ...item,
      unitPrice: (item.unitPrice as { toNumber(): number }).toNumber(),
      subtotal: (item.subtotal as { toNumber(): number }).toNumber(),
    })),
  } as unknown as Invoice
}

@Injectable()
export class PrismaInvoiceRepository implements IInvoiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(cashierId?: string): Promise<Invoice[]> {
    const invoices = await this.prisma.invoice.findMany({
      where: cashierId ? { cashierId } : undefined,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    })
    return invoices.map((inv) => toInvoice(inv as unknown as Record<string, unknown>))
  }

  async findById(id: string): Promise<Invoice | null> {
    const inv = await this.prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    })
    return inv ? toInvoice(inv as unknown as Record<string, unknown>) : null
  }

  async create(data: CreateInvoiceData): Promise<Invoice> {
    const inv = await this.prisma.invoice.create({
      data: {
        cashierId: data.cashierId,
        total: data.total,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        clientId: data.clientId,
        items: { create: data.items },
      },
      include: { items: true },
    })
    return toInvoice(inv as unknown as Record<string, unknown>)
  }

  async updateStatus(id: string, status: InvoiceStatus): Promise<Invoice> {
    const inv = await this.prisma.invoice.update({
      where: { id },
      data: { status },
      include: { items: true },
    })
    return toInvoice(inv as unknown as Record<string, unknown>)
  }
}
