// ============================================================
// CASOS DE USO: Autenticación
// Capa: Application — Sin decoradores NestJS, lógica pura.
// ============================================================

import { Injectable, UnauthorizedException, Inject } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { USER_REPOSITORY, IUserRepository } from '../../../domain/ports/user-repository.port'
import type { UserPublic } from '../../../domain/entities/user.entity'

export interface LoginResult {
  user: UserPublic
  accessToken: string
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(username: string, password: string): Promise<LoginResult> {
    const user = await this.userRepo.findByUsername(username)

    // Mensaje genérico → no revelar si el usuario existe
    if (!user) throw new UnauthorizedException('Credenciales inválidas')
    if (!user.isActive) throw new UnauthorizedException('Usuario inactivo. Contacta al administrador')

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new UnauthorizedException('Credenciales inválidas')

    const { password: _pwd, ...userPublic } = user

    const accessToken = this.jwtService.sign({
      sub: user.id,
      role: user.role,
      username: user.username,
    })

    return { user: userPublic, accessToken }
  }
}
