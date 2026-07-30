import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class InvoiceItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity: number
}

export class CreateInvoiceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[]

  @IsString()
  @IsOptional()
  clientName?: string

  @IsEmail()
  @IsOptional()
  clientEmail?: string

  @IsString()
  @IsOptional()
  clientPhone?: string

  @IsString()
  @IsOptional()
  clientId?: string
}
