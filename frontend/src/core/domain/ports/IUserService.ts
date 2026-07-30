// ============================================================
// PUERTO: IUserService
// Capa: Domain → Ports
// Descripción: Contrato (interfaz) que define QUÉ operaciones
//              necesita la aplicación sobre usuarios.
//              La infraestructura IMPLEMENTA este contrato.
// ============================================================

import type { User } from '../entities/User'

export interface CreateUserDTO {
  username: string
  password: string
  email: string
  phone?: string
  role: 'ADMIN' | 'CASHIER'
}

export interface UpdateUserDTO {
  username?: string
  email?: string
  phone?: string
  role?: 'ADMIN' | 'CASHIER'
}

export interface IUserService {
  getAll(): Promise<User[]>
  getById(id: string): Promise<User>
  create(data: CreateUserDTO): Promise<User>
  update(id: string, data: UpdateUserDTO): Promise<User>
  remove(id: string): Promise<void>
}
