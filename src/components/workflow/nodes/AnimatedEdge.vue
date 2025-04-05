<template>
  <path
    :d="getEdgePath()"
    class="workflow-edge"
    :class="{ animated: data?.animated }"
    :marker-end="`url(#${id})`"
    :style="style"
  />
  <defs>
    <marker
      :id="id"
      viewBox="0 0 10 10"
      refX="8"
      refY="5"
      markerUnits="strokeWidth"
      markerWidth="6"
      markerHeight="6"
      orient="auto"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" :fill="style?.stroke || '#94a3b8'" />
    </marker>
  </defs>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";

// 定义边属性
const props = defineProps({
  id: { type: String, required: true },
  sourceX: { type: Number, required: true },
  sourceY: { type: Number, required: true },
  targetX: { type: Number, required: true },
  targetY: { type: Number, required: true },
  sourcePosition: { type: String, default: "right" },
  targetPosition: { type: String, default: "left" },
  data: { type: Object, default: () => ({}) },
  style: { type: Object, default: () => ({ stroke: "#94a3b8", strokeWidth: 2 }) },
});

// 记录组件加载
onMounted(() => {
  console.log("★★★ AnimatedEdge组件已挂载", {
    id: props.id,
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    targetX: props.targetX,
    targetY: props.targetY,
    data: props.data,
  });
});

// 监听属性变化
watch(
  () => [props.sourceX, props.sourceY, props.targetX, props.targetY],
  () => {
    console.log("★★★ AnimatedEdge路径已更新", {
      id: props.id,
      path: getEdgePath(),
    });
  }
);

// 自定义贝塞尔曲线路径计算
const getEdgePath = () => {
  const { sourceX, sourceY, targetX, targetY } = props;

  // 计算控制点
  const offset = Math.abs(targetX - sourceX) * 0.4;

  // 平滑曲线路径
  const d = `M ${sourceX} ${sourceY} 
                C ${sourceX + offset} ${sourceY}, 
                  ${targetX - offset} ${targetY}, 
                  ${targetX} ${targetY}`;

  return d;
};

// 导出组件，确保在Vue Flow中可使用
defineExpose({
  getEdgePath,
});
</script>

<style scoped>
.workflow-edge {
  fill: none;
  stroke-width: 2px;
}

.workflow-edge.animated {
  stroke-dasharray: 5;
  animation: flowEdgeDash 0.5s linear infinite;
}

@keyframes flowEdgeDash {
  to {
    stroke-dashoffset: 10;
  }
}
</style>
