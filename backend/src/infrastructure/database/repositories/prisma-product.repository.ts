import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import type { IProductRepository, CreateProductData, UpdateProductData } from '../../../core/domain/ports/product-repository.port'
import type { Product } from '../../../core/domain/entities/product.entity'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toProduct(p: any): Product {
  return { ...p, unitPrice: Number(p.unitPrice) } as Product
}

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
    })
    return products.map((p) => toProduct(p as unknown as Record<string, unknown>))
  }

  async findById(id: string): Promise<Product | null> {
    const p = await this.prisma.product.findUnique({ where: { id } })
    return p ? toProduct(p as unknown as Record<string, unknown>) : null
  }

  async findBySku(sku: string): Promise<Product | null> {
    const p = await this.prisma.product.findUnique({ where: { sku } })
    return p ? toProduct(p as unknown as Record<string, unknown>) : null
  }

  async create(data: CreateProductData): Promise<Product> {
    const p = await this.prisma.product.create({ data })
    return toProduct(p as unknown as Record<string, unknown>)
  }

  async update(id: string, data: UpdateProductData): Promise<Product> {
    const p = await this.prisma.product.update({ where: { id }, data })
    return toProduct(p as unknown as Record<string, unknown>)
  }

  async decrementStock(id: string, quantity: number): Promise<Product> {
    const p = await this.prisma.product.update({
      where: { id },
      data: { quantity: { decrement: quantity } },
    })
    return toProduct(p as unknown as Record<string, unknown>)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } })
  }
}
