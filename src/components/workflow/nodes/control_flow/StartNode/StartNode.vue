<template>
  <BaseNode
    :id="id"
    :title="data?.title ?? '开始'"
    :nodeType="'start'"
    :selected="selected"
    @click="handleClick"
    @delete="handleDelete"
  >
    <!-- 节点内容 -->
    <div class="start-node-content">
      <div class="start-icon">
        <span class="i-carbon-play-filled-alt"></span>
      </div>
    </div>

    <!-- 使用Vue Flow的默认连接点 -->
    <div
      class="vue-flow__handle vue-flow__handle-right"
      data-handleid="source"
      :data-nodeid="id"
      data-handlepos="right"
      data-id="source"
      style="
        width: 10px;
        height: 10px;
        background: var(--color-workflow-handle);
        right: -5px;
        top: 50%;
        position: absolute;
        border-radius: 50%;
      "
    ></div>
  </BaseNode>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseNode from "../../BaseNode.vue";
// 不再导入NodeHandle

// 接收props
const props = defineProps<{
  id: string;
  data?: {
    title?: string;
  };
  selected?: boolean;
}>();

// 定义事件
const emit = defineEmits(["click", "delete"]);

// 事件处理函数
const handleClick = () => {
  emit("click", props.id);
};

const handleDelete = () => {
  emit("delete", props.id);
};
</script>

<style scoped>
.start-node-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
}

.start-icon {
  font-size: 24px;
  color: var(--color-workflow-node-start);
}
</style>
