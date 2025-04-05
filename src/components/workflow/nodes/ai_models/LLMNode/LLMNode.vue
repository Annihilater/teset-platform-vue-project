<template>
  <BaseNode
    :id="id"
    :title="data.label"
    nodeType="llm-node"
    :selected="selected"
    @click="handleNodeClick"
    @delete="handleDeleteClick"
  >
    <div class="llm-node-prompt">
      <div class="prompt-label">提示词模板</div>
      <div class="prompt-value">{{ getPrompt() }}</div>
    </div>

    <template #handles>
      <!-- 输入连接点 -->
      <NodeHandle :handleId="`target-${id}`" type="target" position="left" :nodeId="id" />

      <!-- 输出连接点 -->
      <NodeHandle
        :handleId="`source-${id}`"
        type="source"
        position="right"
        :nodeId="id"
      />
    </template>
  </BaseNode>
</template>

<script setup lang="ts">
import BaseNode from "@/components/workflow/nodes/BaseNode.vue";
import NodeHandle from "@/components/workflow/nodes/NodeHandle.vue";
import { useLLMNodeLogic } from "./LLMNode.logic";
import "./LLMNode.styles.scss";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
});

// 使用特有逻辑
const {
  handleNodeClick,
  handleDeleteClick,
  getPrompt,
  getModel,
  getTemperature,
} = useLLMNodeLogic(props);
</script>
