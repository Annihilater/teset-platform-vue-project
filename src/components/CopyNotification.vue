<template>
  <div
    v-if="status"
    class="fixed bottom-4 right-4 px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg z-50"
    :class="status.success ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
  >
    <component :is="status.success ? Check : AlertTriangle" class="w-4 h-4" />
    <span
      >{{ status.success ? "已复制" : "复制失败" }}:
      {{
        status.text.length > 20 ? status.text.substring(0, 20) + "..." : status.text
      }}</span
    >
  </div>
</template>

<script setup lang="ts">
import { Check, AlertTriangle } from "lucide-vue-next";
import type { CopyStatus } from "@/composables/useCopyToClipboard";

defineProps<{
  status: CopyStatus | null;
}>();
</script>
