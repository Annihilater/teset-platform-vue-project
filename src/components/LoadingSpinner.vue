<template>
  <div class="py-20 flex justify-center items-center">
    <div class="flex flex-col items-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"
      ></div>
      <p class="text-gray-500">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string;
}>();
</script>
