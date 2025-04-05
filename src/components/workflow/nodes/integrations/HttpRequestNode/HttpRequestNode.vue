<template>
  <BaseNode
    :id="id"
    :title="data.title"
    nodeType="http-request-node"
    :selected="selected"
    @click="handleNodeClick"
    @delete="handleDeleteClick"
  >
    <div class="http-request-node-content">
      <div class="method-info">
        <div class="method-label">方法:</div>
        <div class="method-value">{{ method }}</div>
      </div>
      <div class="url-info">
        <div class="url-label">URL:</div>
        <div class="url-value">{{ url }}</div>
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
import { useHttpRequestNodeLogic } from "./HttpRequestNode.logic";
import "./HttpRequestNode.styles.scss";

const props = defineProps<{
  id: string;
  type: string;
  data: {
    title: string;
    config?: {
      method?: string;
      url?: string;
    };
    [key: string]: any;
  };
  selected: boolean;
}>();

// 使用节点特有逻辑
const {
  handleNodeClick,
  handleDeleteClick,
  method,
  url,
  headers,
  body,
  updateMethod,
  updateUrl,
  updateHeaders,
  updateBody,
} = useHttpRequestNodeLogic(props);
</script>
