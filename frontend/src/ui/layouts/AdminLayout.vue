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
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-primary-800 text-white flex flex-col">
      <div class="p-6 border-b border-primary-700">
        <h1 class="text-xl font-bold">Tienda Productos</h1>
        <p class="text-primary-300 text-sm mt-1">Panel Administrador</p>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        <RouterLink
          to="/admin/dashboard"
          class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          active-class="bg-primary-700"
        >
          <span>Dashboard</span>
        </RouterLink>
        <RouterLink
          to="/admin/products"
          class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          active-class="bg-primary-700"
        >
          <span>Productos</span>
        </RouterLink>
        <RouterLink
          to="/admin/users"
          class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          active-class="bg-primary-700"
        >
          <span>Usuarios</span>
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-primary-700">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-sm font-bold">
            {{ auth.user?.username?.[0]?.toUpperCase() }}
          </div>
          <div class="text-sm">
            <p class="font-medium">{{ auth.user?.username }}</p>
            <p class="text-primary-300 text-xs">Administrador</p>
          </div>
        </div>
        <button
          class="w-full text-left px-4 py-2 text-sm text-primary-300 hover:text-white hover:bg-primary-700 rounded-lg transition-colors"
          @click="handleLogout"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-auto">
      <RouterView />
    </main>
  </div>
</template>
