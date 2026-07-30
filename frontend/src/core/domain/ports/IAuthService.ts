// ============================================================
// PUERTO: IAuthService
// Capa: Domain → Ports
// ============================================================

import type { User } from '../entities/User'

export interface LoginDTO {
  username: string
  password: string
}

export interface AuthResponse {
  user: User
  accessToken: string
}

export interface IAuthService {
  login(data: LoginDTO): Promise<AuthResponse>
  logout(): Promise<void>
  me(): Promise<User>
}
