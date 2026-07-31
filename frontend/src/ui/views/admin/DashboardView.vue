<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { StatsApiAdapter, type DashboardStats } from '@/core/infrastructure/adapters/StatsApiAdapter'

const adapter = new StatsApiAdapter()
const stats = ref<DashboardStats | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    stats.value = await adapter.getDashboard()
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Error al cargar estadísticas'
  } finally {
    loading.value = false
  }
})

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v)

const formatDate = (d: Date | string) =>
  new Date(d).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })

const statusConfig: Record<string, { label: string; class: string }> = {
  PENDING: { label: 'Pendiente', class: 'bg-yellow-100 text-yellow-700' },
  PAID: { label: 'Pagada', class: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Cancelada', class: 'bg-red-100 text-red-600' },
}
</script>

<template>
  <div class="p-8 space-y-6">
    <h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>

    <!-- Error -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <!-- Skeleton loading -->
    <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="bg-white rounded-xl border p-6 animate-pulse">
        <div class="h-3 w-24 bg-gray-200 rounded mb-3" />
        <div class="h-7 w-16 bg-gray-200 rounded" />
      </div>
    </div>

    <template v-else-if="stats">
      <!-- ── Tarjetas de estadísticas ──────────────────── -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl border shadow-sm p-5">
          <p class="text-xs text-gray-500 uppercase tracking-wide font-medium">Productos activos</p>
          <p class="text-3xl font-bold text-primary-600 mt-2">{{ stats.activeProducts }}</p>
          <p class="text-xs text-gray-400 mt-1">de {{ stats.totalProducts }} en total</p>
        </div>
        <div class="bg-white rounded-xl border shadow-sm p-5">
          <p class="text-xs text-gray-500 uppercase tracking-wide font-medium">Cajeros activos</p>
          <p class="text-3xl font-bold text-blue-600 mt-2">{{ stats.activeCashiers }}</p>
          <p class="text-xs text-gray-400 mt-1">usuarios con rol cajero</p>
        </div>
        <div class="bg-white rounded-xl border shadow-sm p-5">
          <p class="text-xs text-gray-500 uppercase tracking-wide font-medium">Facturas hoy</p>
          <p class="text-3xl font-bold text-green-600 mt-2">{{ stats.todayInvoices }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ stats.totalInvoices }} en total</p>
        </div>
        <div class="bg-white rounded-xl border shadow-sm p-5">
          <p class="text-xs text-gray-500 uppercase tracking-wide font-medium">Ventas hoy</p>
          <p class="text-2xl font-bold text-purple-600 mt-2">{{ formatCurrency(stats.todayRevenue) }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ formatCurrency(stats.totalRevenue) }} historial</p>
        </div>
      </div>

      <!-- ── Fila inferior ─────────────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Stock bajo -->
        <div class="bg-white rounded-xl border shadow-sm p-5">
          <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-orange-400 inline-block" />
            Productos con stock bajo (≤ 5)
          </h3>
          <div v-if="!stats.lowStockProducts.length" class="text-sm text-gray-400 py-2">
            No hay productos con stock crítico.
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="product in stats.lowStockProducts"
              :key="product.id"
              class="flex items-center justify-between text-sm"
            >
              <span class="text-gray-700 truncate max-w-xs">{{ product.name }}</span>
              <span
                :class="product.quantity === 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'"
                class="px-2 py-0.5 rounded-full text-xs font-semibold ml-2 flex-shrink-0"
              >
                {{ product.quantity === 0 ? 'Sin stock' : `${product.quantity} uds` }}
              </span>
            </div>
          </div>
        </div>

        <!-- Últimas facturas -->
        <div class="bg-white rounded-xl border shadow-sm p-5">
          <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-primary-400 inline-block" />
            Últimas facturas
          </h3>
          <div v-if="!stats.recentInvoices.length" class="text-sm text-gray-400 py-2">
            No hay facturas registradas.
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="invoice in stats.recentInvoices"
              :key="invoice.id"
              class="flex items-center justify-between text-sm"
            >
              <div class="min-w-0">
                <p class="font-mono text-xs text-gray-500">#{{ invoice.invoiceNumber.slice(-8).toUpperCase() }}</p>
                <p class="text-gray-400 text-xs truncate">
                  {{ invoice.clientName ?? 'Sin cliente' }} · {{ invoice.cashierName }}
                </p>
                <p class="text-gray-300 text-xs">{{ formatDate(invoice.createdAt) }}</p>
              </div>
              <div class="text-right ml-3 flex-shrink-0">
                <p class="font-semibold text-gray-900">{{ formatCurrency(invoice.total) }}</p>
                <span
                  :class="statusConfig[invoice.status]?.class ?? 'bg-gray-100 text-gray-600'"
                  class="px-2 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ statusConfig[invoice.status]?.label ?? invoice.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
