<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/users'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/core/domain/entities/User'

const store = useUserStore()
const auth = useAuthStore()

onMounted(() => store.fetchAll())

// ── Modal ─────────────────────────────────────────────────
type ModalMode = 'create' | 'edit'
const showModal = ref(false)
const showDeleteModal = ref(false)
const modalMode = ref<ModalMode>('create')
const selectedUser = ref<User | null>(null)
const formError = ref<string | null>(null)
const formLoading = ref(false)

const form = reactive({
  username: '',
  email: '',
  phone: '',
  role: 'CASHIER' as 'ADMIN' | 'CASHIER',
  password: '',
  isActive: true,
})

function openCreateModal() {
  modalMode.value = 'create'
  form.username = ''
  form.email = ''
  form.phone = ''
  form.role = 'CASHIER'
  form.password = ''
  form.isActive = true
  formError.value = null
  showModal.value = true
}

function openEditModal(user: User) {
  modalMode.value = 'edit'
  selectedUser.value = user
  form.username = user.username
  form.email = user.email
  form.phone = user.phone ?? ''
  form.role = user.role
  form.password = ''
  form.isActive = user.isActive
  formError.value = null
  showModal.value = true
}

function openDeleteModal(user: User) {
  selectedUser.value = user
  showDeleteModal.value = true
}

async function handleSave() {
  formLoading.value = true
  formError.value = null
  try {
    if (modalMode.value === 'create') {
      await store.create({
        username: form.username,
        email: form.email,
        phone: form.phone || undefined,
        role: form.role,
        password: form.password,
      })
    } else if (selectedUser.value) {
      await store.update(selectedUser.value.id, {
        username: form.username,
        email: form.email,
        phone: form.phone || undefined,
        role: form.role,
      })
    }
    showModal.value = false
  } catch (err: unknown) {
    formError.value = err instanceof Error ? err.message : 'Error al guardar el usuario'
  } finally {
    formLoading.value = false
  }
}

async function toggleActive(user: User) {
  try {
    await store.update(user.id, { isActive: !user.isActive })
  } catch {
    // silencioso
  }
}

async function handleDelete() {
  if (!selectedUser.value) return
  formLoading.value = true
  try {
    await store.remove(selectedUser.value.id)
    showDeleteModal.value = false
  } catch (err: unknown) {
    formError.value = err instanceof Error ? err.message : 'Error al eliminar'
  } finally {
    formLoading.value = false
  }
}

const modalTitle = computed(() => modalMode.value === 'create' ? 'Nuevo Usuario' : 'Editar Usuario')

const roleLabel = (role: string) => role === 'ADMIN' ? 'Administrador' : 'Cajero'
const roleClass = (role: string) =>
  role === 'ADMIN'
    ? 'bg-purple-100 text-purple-700'
    : 'bg-blue-100 text-blue-700'
</script>

<template>
  <div class="p-8">
    <!-- Cabecera -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
        <p class="text-sm text-gray-500 mt-1">Administra los cajeros y administradores del sistema</p>
      </div>
      <button
        class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        @click="openCreateModal"
      >
        + Nuevo usuario
      </button>
    </div>

    <!-- Error global -->
    <div v-if="store.error" class="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
      {{ store.error }}
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div v-if="store.loading" class="text-center py-12 text-gray-400">Cargando usuarios...</div>
      <div v-else-if="!store.users.length" class="text-center py-12 text-gray-400">
        No hay usuarios registrados.
      </div>
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Usuario</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Teléfono</th>
            <th class="text-center px-4 py-3 text-gray-600 font-medium">Rol</th>
            <th class="text-center px-4 py-3 text-gray-600 font-medium">Estado</th>
            <th class="text-center px-4 py-3 text-gray-600 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="user in store.users"
            :key="user.id"
            class="hover:bg-gray-50 transition-colors"
            :class="{ 'opacity-50': !user.isActive }"
          >
            <td class="px-4 py-3">
              <div>
                <p class="font-medium text-gray-900">{{ user.username }}</p>
                <p class="text-gray-400 text-xs">{{ user.email }}</p>
              </div>
            </td>
            <td class="px-4 py-3 text-gray-500">{{ user.phone ?? '—' }}</td>
            <td class="px-4 py-3 text-center">
              <span :class="roleClass(user.role)" class="px-2 py-0.5 rounded-full text-xs font-medium">
                {{ roleLabel(user.role) }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <!-- Toggle activo/inactivo -->
              <button
                :title="user.isActive ? 'Desactivar usuario' : 'Activar usuario'"
                :class="user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                class="px-2 py-0.5 rounded-full text-xs font-medium hover:opacity-80 transition-opacity"
                :disabled="user.id === auth.user?.id"
                @click="toggleActive(user)"
              >
                {{ user.isActive ? 'Activo' : 'Inactivo' }}
              </button>
            </td>
            <td class="px-4 py-3 text-center">
              <div class="flex items-center justify-center gap-2">
                <button
                  class="text-primary-600 hover:text-primary-800 text-xs font-medium transition-colors"
                  @click="openEditModal(user)"
                >
                  Editar
                </button>
                <span class="text-gray-300">|</span>
                <button
                  :disabled="user.id === auth.user?.id"
                  class="text-red-500 hover:text-red-700 text-xs font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  @click="openDeleteModal(user)"
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

  <!-- ── Modal Crear / Editar ───────────────────────────── -->
  <Teleport to="body">
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-bold text-gray-900">{{ modalTitle }}</h3>
          <button class="text-gray-400 hover:text-gray-600 text-xl leading-none" @click="showModal = false">✕</button>
        </div>

        <form class="p-6 space-y-4" @submit.prevent="handleSave">
          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de usuario *</label>
            <input
              v-model="form.username"
              type="text"
              required
              placeholder="usuario123"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="correo@ejemplo.com"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          <!-- Teléfono -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="300 000 0000"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          <!-- Contraseña (solo en creación) -->
          <div v-if="modalMode === 'create'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
            <input
              v-model="form.password"
              type="password"
              required
              minlength="6"
              placeholder="Mínimo 6 caracteres"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          <!-- Rol -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
            <select
              v-model="form.role"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-400 bg-white"
            >
              <option value="CASHIER">Cajero</option>
              <option value="ADMIN">Administrador</option>
            </select>
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
              {{ formLoading ? 'Guardando...' : (modalMode === 'create' ? 'Crear usuario' : 'Guardar cambios') }}
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
        <h3 class="text-lg font-bold text-gray-900 mb-2">¿Eliminar usuario?</h3>
        <p class="text-gray-500 text-sm mb-6">
          Estás a punto de eliminar a <strong>{{ selectedUser?.username }}</strong>. Esta acción no se puede deshacer.
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
