// Guard que verifica el rol del usuario autenticado
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { JwtPayload } from '../strategies/jwt.strategy'

export const ROLES_KEY = 'roles'

// Decorador para marcar qué roles pueden acceder a una ruta
import { SetMetadata } from '@nestjs/common'
export const Roles = (...roles: Array<'ADMIN' | 'CASHIER'>) => SetMetadata(ROLES_KEY, roles)

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Array<'ADMIN' | 'CASHIER'>>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles) return true // Ruta sin restricción de rol

    const user: JwtPayload = context.switchToHttp().getRequest().user
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(`Acceso denegado. Se requiere rol: ${requiredRoles.join(' o ')}`)
    }
    return true
  }
}
