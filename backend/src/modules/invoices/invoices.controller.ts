import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateInvoiceUseCase, GetInvoicesUseCase } from '../../core/application/use-cases/invoices/invoice.use-cases'
import { CreateInvoiceDto } from './dto/create-invoice.dto'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { JwtPayload } from '../auth/strategies/jwt.strategy'

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(
    private readonly createInvoiceUseCase: CreateInvoiceUseCase,
    private readonly getInvoicesUseCase: GetInvoicesUseCase,
  ) {}

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    // El cajero solo ve sus facturas; el admin ve todas
    const cashierId = user.role === 'CASHIER' ? user.sub : undefined
    return this.getInvoicesUseCase.execute(cashierId)
  }

  @Post()
  create(@Body() dto: CreateInvoiceDto, @CurrentUser() user: JwtPayload) {
    return this.createInvoiceUseCase.execute({ ...dto, cashierId: user.sub })
  }
}
