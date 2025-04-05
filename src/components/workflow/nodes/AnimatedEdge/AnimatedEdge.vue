<template>
  <g
    class="vue-flow__edge vue-flow__edge-custom nopan"
    :class="{ selected, animated: animated || data?.animated }"
  >
    <path :id="`edge-${id}`" :d="edgePath" class="vue-flow__edge-path" :style="style" />
  </g>
</template>

<script setup lang="ts">
import { computed, onMounted, onUpdated } from "vue";

const props = defineProps({
  id: String,
  sourceX: Number,
  sourceY: Number,
  targetX: Number,
  targetY: Number,
  sourcePosition: String,
  targetPosition: String,
  selected: { type: Boolean, default: false },
  animated: { type: Boolean, default: false },
  style: { type: Object, default: () => ({}) },
  data: { type: Object, default: () => ({}) },
});

// 计算边路径
const edgePath = computed(() => {
  if (!props.sourceX || !props.sourceY || !props.targetX || !props.targetY) {
    return "";
  }

  const sourceX = props.sourceX;
  const sourceY = props.sourceY;
  const targetX = props.targetX;
  const targetY = props.targetY;

  // 计算控制点，创建平滑的贝塞尔曲线
  const midX = (sourceX + targetX) / 2;

  // 创建S型曲线
  return `M${sourceX},${sourceY} C${midX},${sourceY} ${midX},${targetY} ${targetX},${targetY}`;
});

onMounted(() => {
  console.log("边已挂载:", props.id);
});

onUpdated(() => {
  console.log("边已更新:", props.id);
});

// 导出组件，确保在Vue Flow中可使用
defineExpose({
  getEdgePath: () => edgePath.value,
});
</script>

<style scoped>
/* 通过全局样式设置连接线样式 - 在node-common.scss中 */
</style>
