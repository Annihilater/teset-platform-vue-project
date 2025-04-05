<template>
  <BaseNode
    :id="id"
    :title="data.title"
    nodeType="code-execution-node"
    :selected="selected"
    @click="handleNodeClick"
    @delete="handleDeleteClick"
  >
    <div class="code-execution-node-content">
      <div class="language-info">
        <div class="language-label">语言:</div>
        <div class="language-value">{{ language }}</div>
      </div>
    </div>

    <template #handles>
      <NodeHandle :handleId="`target-${id}`" type="target" position="left" :nodeId="id" />
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
import { useCodeExecutionNodeLogic } from "./CodeExecutionNode.logic";
import "./CodeExecutionNode.styles.scss";

const props = defineProps<{
  id: string;
  type: string;
  data: {
    title: string;
    config?: {
      language?: string;
    };
    [key: string]: any;
  };
  selected: boolean;
}>();

// 使用节点特有逻辑
const {
  handleNodeClick,
  handleDeleteClick,
  language,
  code,
  updateCode,
  updateLanguage,
} = useCodeExecutionNodeLogic(props);
</script>
