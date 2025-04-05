<template>
  <BaseNode
    :id="id"
    :title="data.title"
    nodeType="agent-node"
    :selected="selected"
    @click="handleNodeClick"
    @delete="handleDeleteClick"
  >
    <div class="agent-info">
      <div class="agent-label">Agent:</div>
      <div class="agent-value">{{ getAgentType() }}</div>
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
import { useAgentNodeLogic } from "./AgentNode.logic";
import "./AgentNode.styles.scss";

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

// 使用节点特有逻辑
const { handleNodeClick, handleDeleteClick, getAgentType } = useAgentNodeLogic(props);
</script>
