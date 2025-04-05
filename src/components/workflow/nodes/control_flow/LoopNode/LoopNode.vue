<template>
  <BaseNode
    :id="id"
    :title="data.title"
    nodeType="loop-node"
    :selected="selected"
    @click="handleNodeClick"
    @delete="handleDeleteClick"
  >
    <div class="loop-node-content">
      <div class="loop-info">
        <div class="loop-label">循环条件:</div>
        <div class="loop-value">{{ loopCondition }}</div>
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
import { useLoopNodeLogic } from "./LoopNode.logic";
import "./LoopNode.styles.scss";

const props = defineProps<{
  id: string;
  type: string;
  data: {
    title: string;
    config?: {
      condition?: string;
    };
    [key: string]: any;
  };
  selected: boolean;
}>();

// 使用节点特有逻辑
const { handleNodeClick, handleDeleteClick, loopCondition } = useLoopNodeLogic(props);
</script>
