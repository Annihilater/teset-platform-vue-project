<template>
  <div class="px-4 py-6 md:px-6 lg:px-8">
    <header class="mb-8">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ title }}</h1>
          <p class="text-gray-600 mt-2">{{ description }}</p>
        </div>
        <slot name="actions"></slot>
      </div>
    </header>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>
