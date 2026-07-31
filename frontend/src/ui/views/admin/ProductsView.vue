<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useProductStore } from '@/stores/products'
import type { Product } from '@/core/domain/entities/Product'

const store = useProductStore()

onMounted(() => store.fetchAll())

// ── Estado del modal ──────────────────────────────────────
type ModalMode = 'create' | 'edit'
const showModal = ref(false)
const showDeleteModal = ref(false)
const modalMode = ref<ModalMode>('create')
const selectedProduct = ref<Product | null>(null)
const formError = ref<string | null>(null)
const formLoading = ref(false)
const imagePreview = ref<string | null>(null)

const form = reactive({
  name: '',
  description: '',
  quantity: 0,
  unitPrice: 0,
  sku: '',
  isActive: true,
  image: null as File | null,
})

// ── Búsqueda ──────────────────────────────────────────────
const searchQuery = ref('')

function handleSearch() {
  store.search(searchQuery.value)
}

// ── Formateo ──────────────────────────────────────────────
const formatCurrency = (v: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v)

// ── Abrir modal ───────────────────────────────────────────
function openCreateModal() {
  modalMode.value = 'create'
  form.name = ''
  form.description = ''
  form.quantity = 0
  form.unitPrice = 0
  form.sku = ''
  form.isActive = true
  form.image = null
  imagePreview.value = null
  formError.value = null
  showModal.value = true
}

function openEditModal(product: Product) {
  modalMode.value = 'edit'
  selectedProduct.value = product
  form.name = product.name
  form.description = product.description ?? ''
  form.quantity = product.quantity
  form.unitPrice = product.unitPrice
  form.sku = product.sku ?? ''
  form.isActive = product.isActive
  form.image = null
  imagePreview.value = product.imageUrl ?? null
  formError.value = null
  showModal.value = true
}

function openDeleteModal(product: Product) {
  selectedProduct.value = product
  showDeleteModal.value = true
}

// ── Imagen ────────────────────────────────────────────────
function handleImageChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  form.image = file
  imagePreview.value = URL.createObjectURL(file)
}

// ── Guardar ───────────────────────────────────────────────
async function handleSave() {
  formLoading.value = true
  formError.value = null
  try {
    if (modalMode.value === 'create') {
      await store.create({
        name: form.name,
        description: form.description || undefined,
        quantity: form.quantity,
        unitPrice: form.unitPrice,
        sku: form.sku || undefined,
        image: form.image ?? undefined,
      })
    } else if (selectedProduct.value) {
      await store.update(selectedProduct.value.id, {
        name: form.name,
        description: form.description || undefined,
        quantity: form.quantity,
        unitPrice: form.unitPrice,
        sku: form.sku || undefined,
        isActive: form.isActive,
        image: form.image ?? undefined,
      })
    }
    showModal.value = false
  } catch (err: unknown) {
    formError.value = err instanceof Error ? err.message : 'Error al guardar el producto'
  } finally {
    formLoading.value = false
  }
}

// ── Eliminar ──────────────────────────────────────────────
async function handleDelete() {
  if (!selectedProduct.value) return
  formLoading.value = true
  try {
    await store.remove(selectedProduct.value.id)
    showDeleteModal.value = false
  } catch (err: unknown) {
    formError.value = err instanceof Error ? err.message : 'Error al eliminar'
  } finally {
    formLoading.value = false
  }
}

const modalTitle = computed(() => modalMode.value === 'create' ? 'Nuevo Producto' : 'Editar Producto')
</script>

<template>
  <div class="p-8">
    <!-- Cabecera -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
      <button
        class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        @click="openCreateModal"
      >
        + Nuevo producto
      </button>
    </div>

    <!-- Búsqueda -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por nombre, descripción o SKU..."
        class="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
        @input="handleSearch"
      />
    </div>

    <!-- Error global -->
    <div v-if="store.error" class="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
      {{ store.error }}
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div v-if="store.loading" class="text-center py-12 text-gray-400">Cargando productos...</div>
      <div v-else-if="!store.products.length" class="text-center py-12 text-gray-400">
        No hay productos. Crea el primero.
      </div>
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Producto</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">SKU</th>
            <th class="text-right px-4 py-3 text-gray-600 font-medium">Precio</th>
            <th class="text-right px-4 py-3 text-gray-600 font-medium">Stock</th>
            <th class="text-center px-4 py-3 text-gray-600 font-medium">Estado</th>
            <th class="text-center px-4 py-3 text-gray-600 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="product in store.products" :key="product.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img
                  v-if="product.imageUrl"
                  :src="product.imageUrl"
                  :alt="product.name"
                  class="w-10 h-10 rounded-lg object-cover flex-shrink-0 border"
                />
                <div v-else class="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-400 text-xs border">
                  sin img
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ product.name }}</p>
                  <p v-if="product.description" class="text-gray-400 text-xs truncate max-w-xs">{{ product.description }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-gray-500">{{ product.sku ?? '—' }}</td>
            <td class="px-4 py-3 text-right font-medium text-gray-900">{{ formatCurrency(product.unitPrice) }}</td>
            <td class="px-4 py-3 text-right">
              <span :class="product.quantity === 0 ? 'text-red-500 font-medium' : 'text-gray-900'">
                {{ product.quantity }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <span :class="product.isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'"
                class="px-2 py-0.5 rounded-full text-xs font-medium"
              >
                {{ product.isActive ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <div class="flex items-center justify-center gap-2">
                <button
                  class="text-primary-600 hover:text-primary-800 text-xs font-medium transition-colors"
                  @click="openEditModal(product)"
                >
                  Editar
                </button>
                <span class="text-gray-300">|</span>
                <button
                  class="text-red-500 hover:text-red-700 text-xs font-medium transition-colors"
                  @click="openDeleteModal(product)"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ── Modal Crear / Editar ──────────────────────────── -->
  <Teleport to="body">
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-bold text-gray-900">{{ modalTitle }}</h3>
          <button class="text-gray-400 hover:text-gray-600 text-xl leading-none" @click="showModal = false">✕</button>
        </div>

        <form class="p-6 space-y-4" @submit.prevent="handleSave">
          <!-- Imagen -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Imagen (opcional)</label>
            <div class="flex items-center gap-4">
              <div class="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                <img v-if="imagePreview" :src="imagePreview" alt="preview" class="w-full h-full object-cover" />
                <span v-else class="text-gray-400 text-xs text-center px-1">Sin imagen</span>
              </div>
              <label class="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg transition-colors">
                Subir imagen
                <input type="file" accept="image/*" class="hidden" @change="handleImageChange" />
              </label>
            </div>
          </div>

          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Nombre del producto"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          <!-- Descripción -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              v-model="form.description"
              rows="2"
              placeholder="Descripción del producto"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-400 resize-none"
            />
          </div>

          <!-- Precio y Stock -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Precio unitario *</label>
              <input
                v-model.number="form.unitPrice"
                type="number"
                min="0.01"
                step="0.01"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad en stock *</label>
              <input
                v-model.number="form.quantity"
                type="number"
                min="0"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
          </div>

          <!-- SKU -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">SKU (código único)</label>
            <input
              v-model="form.sku"
              type="text"
              placeholder="Ej: PROD-001"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          <!-- Estado (solo en edición) -->
          <div v-if="modalMode === 'edit'" class="flex items-center gap-3">
            <input id="isActive" v-model="form.isActive" type="checkbox" class="w-4 h-4 text-primary-600 rounded" />
            <label for="isActive" class="text-sm text-gray-700">Producto activo</label>
          </div>

          <!-- Error -->
          <div v-if="formError" class="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            {{ formError }}
          </div>

          <!-- Botones -->
          <div class="flex gap-3 pt-2">
            <button
              type="button"
              class="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 rounded-lg text-sm transition-colors"
              @click="showModal = false"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="formLoading"
              class="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {{ formLoading ? 'Guardando...' : (modalMode === 'create' ? 'Crear producto' : 'Guardar cambios') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- ── Modal Confirmar Eliminar ───────────────────────── -->
  <Teleport to="body">
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-2">¿Eliminar producto?</h3>
        <p class="text-gray-500 text-sm mb-6">
          Estás a punto de eliminar <strong>{{ selectedProduct?.name }}</strong>. Esta acción no se puede deshacer.
        </p>
        <div class="flex gap-3">
          <button
            class="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 rounded-lg text-sm transition-colors"
            @click="showDeleteModal = false"
          >
            Cancelar
          </button>
          <button
            :disabled="formLoading"
            class="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            @click="handleDelete"
          >
            {{ formLoading ? 'Eliminando...' : 'Sí, eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
