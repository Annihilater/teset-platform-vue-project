<template>
  <div
    :id="`node-${id}`"
    :class="['base-node', nodeType, { selected }]"
    :data-id="id"
    @click="handleNodeClick"
  >
    <!-- 标题栏 -->
    <div class="node-header">
      <div class="node-title">{{ title }}</div>
      <div class="node-buttons">
        <slot name="header-buttons">
          <button class="node-btn node-delete-btn" @click.stop="handleDeleteClick">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        </slot>
      </div>
    </div>

    <!-- 节点内容 -->
    <div class="node-content">
      <slot></slot>
    </div>

    <!-- 连接点插槽 -->
    <slot name="handles"></slot>
  </div>
</template>

<script setup lang="ts">
import "./styles/node-common.scss"; // 导入通用样式

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  nodeType: {
    type: String,
    default: "default",
  },
  selected: {
    type: Boolean,
    default: false,
  },
});

// 定义事件，通知父组件处理业务逻辑
const emit = defineEmits(["click", "delete"]);

/**
 * 处理节点点击事件
 * UI层面的操作: 触发事件通知父组件
 */
const handleNodeClick = () => {
  console.log("handleNodeClick", props.id);
  emit("click", props.id);
};

/**
 * 处理删除按钮点击事件
 * UI层面的操作: 触发事件通知父组件
 */
const handleDeleteClick = (event: MouseEvent) => {
  console.log("handleDeleteClick", event);
  event.stopPropagation();
  emit("delete", props.id);
};
</script>
