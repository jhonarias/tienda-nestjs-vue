import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @MinLength(6)
  password: string

  @IsEmail()
  email: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsEnum(['ADMIN', 'CASHIER'])
  @IsOptional()
  role?: 'ADMIN' | 'CASHIER'
}
