<template>
  <router-link
    v-if="to"
    :to="to"
    class="flex items-center px-4 py-2 rounded-md text-sm font-medium"
    :class="[
      active
        ? 'bg-gray-800 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
    ]"
  >
    <component :is="icon" class="w-5 h-5 mr-3 flex-shrink-0" />
    {{ text }}
  </router-link>
  <a
    v-else
    href="#"
    @click.prevent="$emit('click')"
    class="flex items-center px-4 py-2 rounded-md text-sm font-medium"
    :class="[
      active
        ? 'bg-gray-800 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
    ]"
  >
    <component :is="icon" class="w-5 h-5 mr-3 flex-shrink-0" />
    {{ text }}
  </a>
</template>

<script setup lang="ts">
import type { Component } from "vue";

defineProps<{
  icon: Component;
  text: string;
  active?: boolean;
  to?: string;
}>();

defineEmits<{
  (e: "click"): void;
}>();
</script>
