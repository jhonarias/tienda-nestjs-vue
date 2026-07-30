// ============================================================
// INFRAESTRUCTURA: httpClient
// Capa: Infrastructure
// Descripción: Instancia de Axios configurada con interceptors.
//              Agrega el token JWT en cada request automáticamente
//              y maneja errores 401 (sesión expirada).
// ============================================================

import axios from 'axios'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de REQUEST: adjunta el token JWT si existe
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de RESPONSE: maneja errores globales
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido → limpiar sesión
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default httpClient
