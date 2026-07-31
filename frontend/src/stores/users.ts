// ============================================================
// STORE: useUserStore (Pinia)
// ============================================================

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/core/domain/entities/User'
import { UserApiAdapter } from '@/core/infrastructure/adapters/UserApiAdapter'
import {
  GetUsersUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from '@/core/application/use-cases/users/ManageUsersUseCase'
import type { CreateUserDTO, UpdateUserDTO } from '@/core/domain/ports/IUserService'

const userService = new UserApiAdapter()
const getUsersUseCase = new GetUsersUseCase(userService)
const createUserUseCase = new CreateUserUseCase(userService)
const updateUserUseCase = new UpdateUserUseCase(userService)
const deleteUserUseCase = new DeleteUserUseCase(userService)

export const useUserStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      users.value = await getUsersUseCase.execute()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error al cargar usuarios'
    } finally {
      loading.value = false
    }
  }

  async function create(data: CreateUserDTO) {
    const user = await createUserUseCase.execute(data)
    users.value.unshift(user)
    return user
  }

  async function update(id: string, data: UpdateUserDTO) {
    const updated = await updateUserUseCase.execute(id, data)
    const idx = users.value.findIndex((u) => u.id === id)
    if (idx !== -1) users.value[idx] = updated
    return updated
  }

  async function remove(id: string) {
    await deleteUserUseCase.execute(id)
    users.value = users.value.filter((u) => u.id !== id)
  }

  return { users, loading, error, fetchAll, create, update, remove }
})
