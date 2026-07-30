// ============================================================
// PUERTO: IUserRepository — Token para inyección de dependencias
// NestJS utiliza tokens para identificar qué implementación
// inyectar cuando se solicita la interfaz.
// ============================================================

import type { User, UserPublic } from '../entities/user.entity'

export const USER_REPOSITORY = 'USER_REPOSITORY'

export interface CreateUserData {
  username: string
  password: string // ya hasheado
  email: string
  phone?: string
  role?: 'ADMIN' | 'CASHIER'
}

export interface UpdateUserData {
  username?: string
  email?: string
  phone?: string
  role?: 'ADMIN' | 'CASHIER'
  isActive?: boolean
}

export interface IUserRepository {
  findAll(): Promise<UserPublic[]>
  findById(id: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(data: CreateUserData): Promise<UserPublic>
  update(id: string, data: UpdateUserData): Promise<UserPublic>
  delete(id: string): Promise<void>
}
