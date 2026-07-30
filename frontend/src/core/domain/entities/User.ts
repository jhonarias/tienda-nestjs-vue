// ============================================================
// ENTIDAD: User
// Capa: Domain
// Descripción: Representa el objeto de negocio central "Usuario"
//              Sin dependencias externas, solo lógica pura.
// ============================================================

export type UserRole = 'ADMIN' | 'CASHIER'

export interface User {
  id: string
  username: string
  email: string
  phone?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

// Value Object: garantiza que el rol sea válido
export const VALID_ROLES: UserRole[] = ['ADMIN', 'CASHIER']

export function isValidRole(role: string): role is UserRole {
  return VALID_ROLES.includes(role as UserRole)
}
