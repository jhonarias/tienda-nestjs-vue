// ============================================================
// STORE: useAuthStore (Pinia)
// Capa: Interfaces (UI State)
// ============================================================

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/core/domain/entities/User'
import { AuthApiAdapter } from '@/core/infrastructure/adapters/AuthApiAdapter'

const authService = new AuthApiAdapter()

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('accessToken'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isCashier = computed(() => user.value?.role === 'CASHIER')

  async function login(username: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.login({ username, password })
      user.value = response.user
      token.value = response.accessToken
      localStorage.setItem('accessToken', response.accessToken)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error al iniciar sesión'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('accessToken')
    }
  }

  async function fetchCurrentUser() {
    if (!token.value) return
    try {
      user.value = await authService.me()
    } catch {
      // Token inválido → limpiar
      token.value = null
      localStorage.removeItem('accessToken')
    }
  }

  return { user, token, loading, error, isAuthenticated, isAdmin, isCashier, login, logout, fetchCurrentUser }
})
