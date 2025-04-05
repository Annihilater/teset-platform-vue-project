<template>
  <div
    :id="handleId"
    class="vue-flow__handle nodrag nopan"
    :class="[
      `vue-flow__handle-${type}`,
      position ? `vue-flow__handle-${position}` : '',
      { connecting: isConnecting },
    ]"
    :data-id="handleId"
    :data-nodeid="nodeId"
    :data-handleid="handleId"
    :data-handlepos="position"
    :data-handletype="type"
  ></div>
</template>

<script setup lang="ts">
import "./styles/node-common.scss";
import { onMounted } from "vue";

// 定义属性
const props = defineProps({
  nodeId: { type: String, default: "" },
  handleId: { type: String, required: true },
  type: { type: String, default: "source" }, // source 或 target
  position: { type: String, default: "right" }, // right, left, top, bottom
  isConnecting: { type: Boolean, default: false },
  isConnectable: { type: Boolean, default: true },
});

// 组件挂载后检查连接点
onMounted(() => {
  const element = document.getElementById(props.handleId);
  if (!element) {
    console.warn(`连接点未找到: ${props.handleId}`);
  } else {
    console.log(`连接点注册成功: ${props.handleId}, 类型: ${props.type}`);
  }
});
</script>

<style>
/* 连接点样式 */
.vue-flow__handle {
  width: 10px;
  height: 10px;
  background-color: #2563eb;
  border: 2px solid white;
  border-radius: 50%;
  position: absolute;
}

/* 确保连接点在不同位置的正确渲染 */
.vue-flow__handle-right {
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
}

.vue-flow__handle-left {
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
}

.vue-flow__handle-top {
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
}

.vue-flow__handle-bottom {
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
}

/* 源和目标连接点的特定样式 */
.vue-flow__handle-source {
  background-color: #2563eb;
}

.vue-flow__handle-target {
  background-color: #2563eb;
}

/* 连接状态样式 */
.vue-flow__handle.connecting {
  background-color: #10b981;
}

/* 悬停效果 */
.vue-flow__handle:hover {
  cursor: crosshair;
  transform: scale(1.2) translateY(-50%);
}

.vue-flow__handle-left:hover,
.vue-flow__handle-right:hover {
  transform: scale(1.2) translateY(-50%);
}

.vue-flow__handle-top:hover,
.vue-flow__handle-bottom:hover {
  transform: scale(1.2) translateX(-50%);
}
</style>
