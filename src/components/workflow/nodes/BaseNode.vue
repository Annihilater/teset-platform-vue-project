<script setup>
import { Handle } from "@vue-flow/core";

import { onMounted } from "vue";
const emit = defineEmits(["updateNodeInternals"]);
onMounted(() => {
  emit("updateNodeInternals");
});
defineProps(["id", "sourcePosition", "targetPosition", "data"]);
</script>

<template>
  <Handle type="source" :position="sourcePosition" />

  <span>{{ data.label }}</span>

  <Handle type="target" :position="targetPosition" />
</template>
