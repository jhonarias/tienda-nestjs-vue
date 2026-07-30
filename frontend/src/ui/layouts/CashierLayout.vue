<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <h1 class="text-lg font-semibold text-gray-900">Tienda Productos — Cajero</h1>
        <nav class="flex items-center gap-4">
          <RouterLink
            to="/cashier/invoice"
            class="text-sm text-gray-600 hover:text-primary-600 transition-colors"
            active-class="text-primary-600 font-medium"
          >
            Nueva Factura
          </RouterLink>
          <RouterLink
            to="/cashier/history"
            class="text-sm text-gray-600 hover:text-primary-600 transition-colors"
            active-class="text-primary-600 font-medium"
          >
            Historial
          </RouterLink>
          <span class="text-sm text-gray-500">{{ auth.user?.username }}</span>
          <button
            class="text-sm text-red-500 hover:text-red-700 transition-colors"
            @click="handleLogout"
          >
            Salir
          </button>
        </nav>
      </div>
    </header>

    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
      <RouterView />
    </main>
  </div>
</template>
