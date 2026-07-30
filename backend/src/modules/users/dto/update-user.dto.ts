import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator'

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string

  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsEnum(['ADMIN', 'CASHIER'])
  @IsOptional()
  role?: 'ADMIN' | 'CASHIER'

  @IsOptional()
  isActive?: boolean
}
