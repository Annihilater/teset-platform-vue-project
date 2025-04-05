<template>
  <div
    v-if="selectedCount > 0"
    class="flex justify-between items-center bg-blue-50 p-4 rounded-lg"
  >
    <div class="flex items-center space-x-2">
      <span class="text-sm text-blue-700"
        >已选择 {{ selectedCount }} 个{{ itemName }}</span
      >
      <button @click="$emit('clear')" class="text-sm text-blue-600 hover:text-blue-800">
        取消选择
      </button>
    </div>
    <div class="flex space-x-2">
      <slot>
        <!-- 默认操作按钮 -->
        <button
          v-for="(action, index) in actions"
          :key="index"
          @click="$emit('action', action.type)"
          :class="[
            'px-3 py-1 text-sm border border-gray-300 rounded-md',
            action.type === 'delete'
              ? 'text-red-600 bg-white hover:bg-red-50'
              : 'bg-white hover:bg-gray-50',
          ]"
        >
          {{ action.label }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Action {
  type: string;
  label: string;
}

const props = defineProps<{
  selectedCount: number;
  itemName: string;
  actions?: Action[];
}>();

defineEmits<{
  (e: "clear"): void;
  (e: "action", type: string): void;
}>();
</script>
