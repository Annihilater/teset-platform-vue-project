<template>
  <path
    :d="connectionPath"
    fill="none"
    :stroke="stroke"
    :stroke-width="strokeWidth"
    :stroke-dasharray="strokeDasharray"
    class="workflow-connection-path"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition?: string;
  targetPosition?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}>();

// 默认参数值
const stroke = computed(() => props.stroke || "#94a3b8");
const strokeWidth = computed(() => props.strokeWidth || 2);
const strokeDasharray = computed(() => props.strokeDasharray || "5 5");

// 计算贝塞尔曲线路径
const connectionPath = computed(() => {
  const offsetX = Math.abs(props.targetX - props.sourceX) * 0.5;

  const sourceX = props.sourceX;
  const sourceY = props.sourceY;
  const targetX = props.targetX;
  const targetY = props.targetY;

  // 控制点
  const controlPoint1X = sourceX + offsetX;
  const controlPoint1Y = sourceY;
  const controlPoint2X = targetX - offsetX;
  const controlPoint2Y = targetY;

  // 构造贝塞尔曲线路径
  return `M ${sourceX},${sourceY} C ${controlPoint1X},${controlPoint1Y} ${controlPoint2X},${controlPoint2Y} ${targetX},${targetY}`;
});
</script>

<style scoped>
.workflow-connection-path {
  transition: all 0.2s;
  pointer-events: none;
}
</style>
