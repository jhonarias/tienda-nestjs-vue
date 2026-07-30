import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { InvoicesController } from './invoices.controller'
import { CreateInvoiceUseCase, GetInvoicesUseCase } from '../../core/application/use-cases/invoices/invoice.use-cases'

@Module({
  imports: [DatabaseModule],
  controllers: [InvoicesController],
  providers: [CreateInvoiceUseCase, GetInvoicesUseCase],
})
export class InvoicesModule {}
