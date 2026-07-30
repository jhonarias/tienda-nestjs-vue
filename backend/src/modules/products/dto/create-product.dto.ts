import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description?: string

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  quantity: number

  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  unitPrice: number

  @IsString()
  @IsOptional()
  sku?: string
}
