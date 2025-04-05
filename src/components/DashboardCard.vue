<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="border-b p-4 flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
      <slot name="actions"></slot>
    </div>
    <div class="p-4">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>
