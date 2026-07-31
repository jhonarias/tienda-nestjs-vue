import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { LoginUseCase } from '../../core/application/use-cases/auth/login.use-case'
import { LoginDto } from './dto/login.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import type { JwtPayload } from './strategies/jwt.strategy'

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto.username, dto.password)
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  logout() {
    // JWT es stateless: el cliente descarta el token.
    // El endpoint existe para que el frontend pueda hacer la llamada limpiamente.
    return { message: 'Sesión cerrada correctamente' }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: JwtPayload) {
    return user
  }
}
