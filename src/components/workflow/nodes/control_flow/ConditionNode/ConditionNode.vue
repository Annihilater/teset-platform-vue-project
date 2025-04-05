<template>
  <BaseNode
    :id="id"
    :title="data.title"
    nodeType="condition-node"
    :selected="selected"
    @click="handleNodeClick"
    @delete="handleDeleteClick"
  >
    <div class="condition-node-content">
      <div v-for="(condition, index) in conditions" :key="index" class="condition-item">
        <div class="condition-text">{{ condition.name }}</div>
      </div>
    </div>

    <template #handles>
      <!-- 输入连接点 -->
      <NodeHandle :handleId="`target-${id}`" type="target" position="left" :nodeId="id" />

      <!-- 输出连接点 -->
      <NodeHandle
        v-for="(condition, index) in conditions"
        :key="`source-${index}`"
        :handleId="`source-${id}-${index}`"
        type="source"
        position="right"
        :nodeId="id"
        :style="{
          top: `${getSourceHandlePosition(index)}%`,
        }"
      />
    </template>
  </BaseNode>
</template>

<script setup lang="ts">
import { BlockEnum } from "@/stores/workflowStore";
import BaseNode from "@/components/workflow/nodes/BaseNode.vue";
import NodeHandle from "@/components/workflow/nodes/NodeHandle.vue";
import { useConditionNodeLogic } from "./ConditionNode.logic";
import "./ConditionNode.styles.scss";

const props = defineProps<{
  id: string;
  type: string;
  data: {
    title: string;
    config?: {
      conditions?: Array<{ name: string }>;
    };
    [key: string]: any;
  };
  selected: boolean;
}>();

// 使用节点特有逻辑
const {
  handleNodeClick,
  handleDeleteClick,
  conditions,
  getSourceHandlePosition,
} = useConditionNodeLogic(props);
</script>
