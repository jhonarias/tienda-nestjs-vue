export type UserRole = 'ADMIN' | 'CASHIER'

export interface User {
  id: string
  username: string
  password: string
  email: string
  phone?: string | null
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type UserPublic = Omit<User, 'password'>
