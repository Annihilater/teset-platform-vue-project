<template>
  <BaseNode
    :id="id"
    :title="data.title"
    nodeType="knowledge-retrieval-node"
    :selected="selected"
    @click="handleNodeClick"
    @delete="handleDeleteClick"
  >
    <div class="knowledge-retrieval-node-content">
      <div class="database-info">
        <div class="database-label">知识库:</div>
        <div class="database-value">{{ database }}</div>
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
import { useKnowledgeRetrievalNodeLogic } from "./KnowledgeRetrievalNode.logic";
import "./KnowledgeRetrievalNode.styles.scss";

const props = defineProps<{
  id: string;
  type: string;
  data: {
    title: string;
    config?: {
      database?: string;
    };
    [key: string]: any;
  };
  selected: boolean;
}>();

// 使用节点特有逻辑
const {
  handleNodeClick,
  handleDeleteClick,
  database,
  topK,
  threshold,
  updateDatabase,
  updateTopK,
  updateThreshold,
} = useKnowledgeRetrievalNodeLogic(props);
</script>
