// ============================================================
// ADAPTADOR: AuthApiAdapter
// Capa: Infrastructure
// ============================================================

import type { IAuthService, LoginDTO, AuthResponse } from '../../domain/ports/IAuthService'
import type { User } from '../../domain/entities/User'
import httpClient from '../http/httpClient'

export class AuthApiAdapter implements IAuthService {
  async login(payload: LoginDTO): Promise<AuthResponse> {
    const { data } = await httpClient.post<AuthResponse>('/auth/login', payload)
    return data
  }

  async logout(): Promise<void> {
    await httpClient.post('/auth/logout')
    localStorage.removeItem('accessToken')
  }

  async me(): Promise<User> {
    const { data } = await httpClient.get<User>('/auth/me')
    return data
  }
}
