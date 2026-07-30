<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import { InvoiceApiAdapter } from '@/core/infrastructure/adapters/InvoiceApiAdapter'
import { CreateInvoiceUseCase } from '@/core/application/use-cases/invoices/ManageInvoiceUseCase'
import type { Product } from '@/core/domain/entities/Product'

const productStore = useProductStore()
const invoiceService = new InvoiceApiAdapter()
const createInvoiceUseCase = new CreateInvoiceUseCase(invoiceService)

onMounted(() => productStore.fetchAll())

interface CartItem {
  product: Product
  quantity: number
}

const cart = ref<CartItem[]>([])
const searchQuery = ref('')
const loading = ref(false)
const success = ref(false)
const errorMsg = ref<string | null>(null)

const clientName = ref('')
const clientEmail = ref('')
const clientPhone = ref('')

const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return productStore.products
  return productStore.products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const cartTotal = computed(() =>
  cart.value.reduce((acc, item) => acc + item.product.unitPrice * item.quantity, 0)
)

function addToCart(product: Product) {
  const existing = cart.value.find((i) => i.product.id === product.id)
  if (existing) {
    if (existing.quantity < product.quantity) existing.quantity++
  } else {
    cart.value.push({ product, quantity: 1 })
  }
}

function removeFromCart(productId: string) {
  cart.value = cart.value.filter((i) => i.product.id !== productId)
}

function changeQty(productId: string, delta: number) {
  const item = cart.value.find((i) => i.product.id === productId)
  if (!item) return
  const newQty = item.quantity + delta
  if (newQty <= 0) {
    removeFromCart(productId)
  } else if (newQty <= item.product.quantity) {
    item.quantity = newQty
  }
}

async function handleCreateInvoice() {
  if (!cart.value.length) return
  loading.value = true
  errorMsg.value = null
  success.value = false
  try {
    await createInvoiceUseCase.execute({
      items: cart.value.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      clientName: clientName.value || undefined,
      clientEmail: clientEmail.value || undefined,
      clientPhone: clientPhone.value || undefined,
    })
    cart.value = []
    clientName.value = ''
    clientEmail.value = ''
    clientPhone.value = ''
    success.value = true
    await productStore.fetchAll()
    setTimeout(() => (success.value = false), 4000)
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : 'Error al crear la factura'
  } finally {
    loading.value = false
  }
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2 space-y-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Nueva Factura</h2>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar producto por nombre..."
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
        />
      </div>
      <div v-if="productStore.loading" class="text-center py-10 text-gray-400">Cargando productos...</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="product in filteredProducts" :key="product.id"
          class="bg-white rounded-xl border shadow-sm p-4 flex gap-4">
          <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name"
            class="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
          <div v-else class="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">Sin img</div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-900 truncate">{{ product.name }}</p>
            <p class="text-sm text-gray-500">Stock: {{ product.quantity }}</p>
            <p class="text-primary-600 font-bold">{{ formatCurrency(product.unitPrice) }}</p>
          </div>
          <button :disabled="product.quantity === 0"
            class="self-end px-3 py-1.5 text-sm bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
            @click="addToCart(product)">
            Agregar
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl border shadow-sm p-5 space-y-4 h-fit sticky top-4">
      <h3 class="text-lg font-bold text-gray-900">Factura</h3>
      <details class="text-sm">
        <summary class="cursor-pointer text-primary-600 font-medium">Datos del cliente (opcional)</summary>
        <div class="mt-3 space-y-2">
          <input v-model="clientName" type="text" placeholder="Nombre" class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-400" />
          <input v-model="clientEmail" type="email" placeholder="Correo" class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-400" />
          <input v-model="clientPhone" type="tel" placeholder="Teléfono" class="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
      </details>

      <div v-if="!cart.length" class="text-center py-6 text-gray-400 text-sm">Agrega productos para comenzar</div>
      <div v-else class="space-y-2 max-h-64 overflow-y-auto">
        <div v-for="item in cart" :key="item.product.id" class="flex items-center gap-2 text-sm">
          <div class="flex-1 min-w-0">
            <p class="font-medium truncate">{{ item.product.name }}</p>
            <p class="text-gray-500">{{ formatCurrency(item.product.unitPrice) }} c/u</p>
          </div>
          <div class="flex items-center gap-1">
            <button class="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200" @click="changeQty(item.product.id, -1)">-</button>
            <span class="w-6 text-center font-semibold">{{ item.quantity }}</span>
            <button class="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200" @click="changeQty(item.product.id, 1)">+</button>
          </div>
          <p class="font-semibold w-20 text-right">{{ formatCurrency(item.product.unitPrice * item.quantity) }}</p>
          <button class="text-red-400 hover:text-red-600 ml-1" @click="removeFromCart(item.product.id)">✕</button>
        </div>
      </div>

      <div class="border-t pt-3 flex justify-between items-center font-bold text-lg">
        <span>Total</span>
        <span class="text-primary-700">{{ formatCurrency(cartTotal) }}</span>
      </div>

      <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">✅ Factura creada exitosamente</div>
      <div v-if="errorMsg" class="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">{{ errorMsg }}</div>

      <button :disabled="!cart.length || loading"
        class="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
        @click="handleCreateInvoice">
        {{ loading ? 'Procesando...' : 'Generar Factura' }}
      </button>
    </div>
  </div>
</template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Nueva Factura</h2>
    <p class="text-gray-500">Próximamente: búsqueda de productos y generación de facturas.</p>
  </div>
</template>
