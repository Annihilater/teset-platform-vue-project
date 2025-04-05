<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="badgeClasses"
  >
    <component :is="statusIcon" class="w-3.5 h-3.5 mr-1" />
    {{ statusLabel }}
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CheckCircle, XCircle, AlertCircle, Clock, AlertTriangle } from "lucide-vue-next";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  status: "passed" | "failed" | "pending" | "blocked" | "running" | "queued";
}>();

const { t } = useI18n();

const badgeClasses = computed(() => {
  switch (props.status) {
    case "passed":
      return "bg-green-100 text-green-800";
    case "failed":
      return "bg-red-100 text-red-800";
    case "pending":
      return "bg-blue-100 text-blue-800";
    case "blocked":
      return "bg-yellow-100 text-yellow-800";
    case "running":
      return "bg-purple-100 text-purple-800";
    case "queued":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
});

const statusIcon = computed(() => {
  switch (props.status) {
    case "passed":
      return CheckCircle;
    case "failed":
      return XCircle;
    case "pending":
      return Clock;
    case "blocked":
      return AlertTriangle;
    case "running":
      return Clock;
    case "queued":
      return Clock;
    default:
      return AlertCircle;
  }
});

const statusLabel = computed(() => {
  return t(`testCase.status.${props.status}`);
});
</script>
