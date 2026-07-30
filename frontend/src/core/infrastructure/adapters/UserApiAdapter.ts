// ============================================================
// ADAPTADOR: UserApiAdapter
// Capa: Infrastructure
// Descripción: IMPLEMENTA IUserService usando Axios hacia el backend.
//              Es el único lugar que sabe de HTTP para usuarios.
// ============================================================

import type { IUserService, CreateUserDTO, UpdateUserDTO } from '../../domain/ports/IUserService'
import type { User } from '../../domain/entities/User'
import httpClient from '../http/httpClient'

export class UserApiAdapter implements IUserService {
  async getAll(): Promise<User[]> {
    const { data } = await httpClient.get<User[]>('/users')
    return data
  }

  async getById(id: string): Promise<User> {
    const { data } = await httpClient.get<User>(`/users/${id}`)
    return data
  }

  async create(payload: CreateUserDTO): Promise<User> {
    const { data } = await httpClient.post<User>('/users', payload)
    return data
  }

  async update(id: string, payload: UpdateUserDTO): Promise<User> {
    const { data } = await httpClient.patch<User>(`/users/${id}`, payload)
    return data
  }

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/users/${id}`)
  }
}
