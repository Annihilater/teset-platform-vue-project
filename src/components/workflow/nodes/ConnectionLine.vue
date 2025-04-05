<template>
  <path
    :d="pathData"
    stroke="#4b5563"
    stroke-width="2"
    fill="none"
    :stroke-dasharray="animated ? '5,5' : undefined"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PropType } from "vue";

const props = defineProps({
  sourceX: { type: Number, required: true },
  sourceY: { type: Number, required: true },
  targetX: { type: Number, required: true },
  targetY: { type: Number, required: true },
  animated: { type: Boolean, default: false },
});

// 计算平滑曲线
const pathData = computed(() => {
  const { sourceX, sourceY, targetX, targetY } = props;
  const dx = Math.abs(targetX - sourceX);
  const dy = Math.abs(targetY - sourceY);
  const curvature = 0.5;
  const hx1 = sourceX + dx * curvature;
  const hy1 = sourceY;
  const hx2 = targetX - dx * curvature;
  const hy2 = targetY;
  return `M ${sourceX},${sourceY} C ${hx1},${hy1} ${hx2},${hy2} ${targetX},${targetY}`;
});
</script>

<style scoped>
/* 可根据需要自定义样式 */
</style>
