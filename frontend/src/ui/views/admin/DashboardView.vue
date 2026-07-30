<script setup lang="ts">
import { onMounted } from 'vue'
import { useProductStore } from '@/stores/products'

const productStore = useProductStore()
onMounted(() => productStore.fetchAll())
</script>

<template>
  <div class="p-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow-sm border p-6">
        <p class="text-sm text-gray-500">Total Productos</p>
        <p class="text-3xl font-bold text-primary-600 mt-2">{{ productStore.products.length }}</p>
      </div>
    </div>
  </div>
</template>
