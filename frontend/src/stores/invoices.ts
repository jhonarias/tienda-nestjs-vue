// ============================================================
// STORE: useInvoiceStore (Pinia)
// ============================================================

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Invoice } from '@/core/domain/entities/Invoice'
import { InvoiceApiAdapter } from '@/core/infrastructure/adapters/InvoiceApiAdapter'
import { GetInvoicesUseCase } from '@/core/application/use-cases/invoices/ManageInvoiceUseCase'

const invoiceService = new InvoiceApiAdapter()
const getInvoicesUseCase = new GetInvoicesUseCase(invoiceService)

export const useInvoiceStore = defineStore('invoices', () => {
  const invoices = ref<Invoice[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      invoices.value = await getInvoicesUseCase.execute()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Error al cargar facturas'
    } finally {
      loading.value = false
    }
  }

  return { invoices, loading, error, fetchAll }
})
