<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useInvoiceStore } from '@/stores/invoices'
import type { Invoice, InvoiceStatus } from '@/core/domain/entities/Invoice'

const store = useInvoiceStore()
onMounted(() => store.fetchAll())

// ── Detalle ───────────────────────────────────────────────
const selectedInvoice = ref<Invoice | null>(null)

function viewDetail(invoice: Invoice) {
  selectedInvoice.value = invoice
}

// ── Filtro por estado ─────────────────────────────────────
const filterStatus = ref<InvoiceStatus | 'ALL'>('ALL')

const filtered = computed(() => {
  if (filterStatus.value === 'ALL') return store.invoices
  return store.invoices.filter((inv) => inv.status === filterStatus.value)
})

// ── Formateo ──────────────────────────────────────────────
const formatCurrency = (v: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v)

const formatDate = (d: Date | string) =>
  new Date(d).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })

const statusConfig: Record<InvoiceStatus, { label: string; class: string }> = {
  PENDING: { label: 'Pendiente', class: 'bg-yellow-100 text-yellow-700' },
  PAID: { label: 'Pagada', class: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Cancelada', class: 'bg-red-100 text-red-600' },
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Historial de Facturas</h2>
      <div class="flex gap-2">
        <button
          v-for="opt in [{ value: 'ALL', label: 'Todas' }, { value: 'PENDING', label: 'Pendientes' }, { value: 'PAID', label: 'Pagadas' }, { value: 'CANCELLED', label: 'Canceladas' }]"
          :key="opt.value"
          :class="filterStatus === opt.value
            ? 'bg-primary-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          @click="filterStatus = opt.value as InvoiceStatus | 'ALL'"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Error -->
    <div v-if="store.error" class="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
      {{ store.error }}
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="text-center py-12 text-gray-400">Cargando facturas...</div>

    <!-- Sin resultados -->
    <div v-else-if="!filtered.length" class="text-center py-12 text-gray-400">
      No hay facturas {{ filterStatus !== 'ALL' ? 'con este estado' : 'registradas' }}.
    </div>

    <!-- Tabla -->
    <div v-else class="bg-white rounded-xl shadow-sm border overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">N° Factura</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Fecha</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Cliente</th>
            <th class="text-center px-4 py-3 text-gray-600 font-medium">Ítems</th>
            <th class="text-right px-4 py-3 text-gray-600 font-medium">Total</th>
            <th class="text-center px-4 py-3 text-gray-600 font-medium">Estado</th>
            <th class="text-center px-4 py-3 text-gray-600 font-medium"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="invoice in filtered"
            :key="invoice.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 py-3 font-mono text-xs text-gray-600">
              #{{ invoice.invoiceNumber.slice(-8).toUpperCase() }}
            </td>
            <td class="px-4 py-3 text-gray-500 text-xs">{{ formatDate(invoice.createdAt) }}</td>
            <td class="px-4 py-3">
              <span v-if="invoice.clientName" class="text-gray-800">{{ invoice.clientName }}</span>
              <span v-else class="text-gray-400 italic text-xs">Sin datos</span>
            </td>
            <td class="px-4 py-3 text-center text-gray-600">{{ invoice.items.length }}</td>
            <td class="px-4 py-3 text-right font-semibold text-gray-900">{{ formatCurrency(invoice.total) }}</td>
            <td class="px-4 py-3 text-center">
              <span
                :class="statusConfig[invoice.status].class"
                class="px-2 py-0.5 rounded-full text-xs font-medium"
              >
                {{ statusConfig[invoice.status].label }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <button
                class="text-primary-600 hover:text-primary-800 text-xs font-medium"
                @click="viewDetail(invoice)"
              >
                Ver detalle
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ── Modal Detalle de Factura ───────────────────────── -->
  <Teleport to="body">
    <div v-if="selectedInvoice" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b">
          <div>
            <h3 class="text-lg font-bold text-gray-900">
              Factura #{{ selectedInvoice.invoiceNumber.slice(-8).toUpperCase() }}
            </h3>
            <p class="text-xs text-gray-400 mt-0.5">{{ formatDate(selectedInvoice.createdAt) }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span
              :class="statusConfig[selectedInvoice.status].class"
              class="px-2 py-0.5 rounded-full text-xs font-medium"
            >
              {{ statusConfig[selectedInvoice.status].label }}
            </span>
            <button class="text-gray-400 hover:text-gray-600 text-xl leading-none" @click="selectedInvoice = null">✕</button>
          </div>
        </div>

        <div class="p-6 space-y-4">
          <!-- Datos del cliente -->
          <div v-if="selectedInvoice.clientName || selectedInvoice.clientEmail || selectedInvoice.clientPhone"
            class="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
            <p class="font-medium text-gray-700 text-xs uppercase tracking-wide mb-2">Datos del cliente</p>
            <p v-if="selectedInvoice.clientName" class="text-gray-800">{{ selectedInvoice.clientName }}</p>
            <p v-if="selectedInvoice.clientEmail" class="text-gray-500">{{ selectedInvoice.clientEmail }}</p>
            <p v-if="selectedInvoice.clientPhone" class="text-gray-500">{{ selectedInvoice.clientPhone }}</p>
          </div>

          <!-- Cajero -->
          <div v-if="selectedInvoice.cashierName" class="text-xs text-gray-400">
            Emitida por: <span class="text-gray-600 font-medium">{{ selectedInvoice.cashierName }}</span>
          </div>

          <!-- Ítems -->
          <div>
            <p class="font-medium text-gray-700 text-xs uppercase tracking-wide mb-3">Productos</p>
            <div class="space-y-2">
              <div
                v-for="item in selectedInvoice.items"
                :key="item.id"
                class="flex items-center justify-between text-sm"
              >
                <div class="flex-1">
                  <p class="text-gray-800 font-medium">{{ item.productName }}</p>
                  <p class="text-gray-400 text-xs">{{ item.quantity }} × {{ formatCurrency(item.unitPrice) }}</p>
                </div>
                <p class="font-semibold text-gray-900 ml-4">{{ formatCurrency(item.subtotal) }}</p>
              </div>
            </div>
          </div>

          <!-- Total -->
          <div class="border-t pt-4 flex justify-between items-center">
            <span class="font-bold text-gray-900 text-lg">Total</span>
            <span class="font-bold text-primary-700 text-xl">{{ formatCurrency(selectedInvoice.total) }}</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
