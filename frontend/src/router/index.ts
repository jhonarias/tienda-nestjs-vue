// ============================================================
// ROUTER: Vue Router con guards de autenticación y roles
// ============================================================

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/ui/views/auth/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    // ── Rutas del Administrador ──────────────────────────────
    {
      path: '/admin',
      component: () => import('@/ui/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true, role: 'ADMIN' },
      children: [
        {
          path: '',
          redirect: '/admin/dashboard',
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/ui/views/admin/DashboardView.vue'),
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/ui/views/admin/UsersView.vue'),
        },
        {
          path: 'products',
          name: 'admin-products',
          component: () => import('@/ui/views/admin/ProductsView.vue'),
        },
      ],
    },
    // ── Rutas del Cajero ─────────────────────────────────────
    {
      path: '/cashier',
      component: () => import('@/ui/layouts/CashierLayout.vue'),
      meta: { requiresAuth: true, role: 'CASHIER' },
      children: [
        {
          path: '',
          redirect: '/cashier/invoice',
        },
        {
          path: 'invoice',
          name: 'cashier-invoice',
          component: () => import('@/ui/views/cashier/InvoiceView.vue'),
        },
        {
          path: 'history',
          name: 'cashier-history',
          component: () => import('@/ui/views/cashier/InvoiceHistoryView.vue'),
        },
      ],
    },
    // ── Ruta raíz → redirige según rol ───────────────────────
    {
      path: '/',
      redirect: () => {
        const auth = useAuthStore()
        if (!auth.isAuthenticated) return '/login'
        return auth.isAdmin ? '/admin' : '/cashier'
      },
    },
    // ── 404 ──────────────────────────────────────────────────
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// Guard global: verifica autenticación y rol
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Intentar recuperar el usuario si hay token guardado
  if (auth.token && !auth.user) {
    await auth.fetchCurrentUser()
  }

  // Ruta requiere estar autenticado
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }

  // Ruta solo para invitados (login)
  if (to.meta.requiresGuest && auth.isAuthenticated) {
    return auth.isAdmin ? '/admin' : '/cashier'
  }

  // Verificar rol requerido
  if (to.meta.role && auth.user?.role !== to.meta.role) {
    return auth.isAdmin ? '/admin' : '/cashier'
  }
})

export default router
