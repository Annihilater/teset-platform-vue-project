<template>
  <BaseNode
    :id="id"
    :title="data.title"
    nodeType="answer-node"
    :selected="selected"
    @click="handleNodeClick"
    @delete="handleDeleteClick"
  >
    <div class="answer-node-content">
      <div v-for="(answer, index) in answers" :key="index" class="answer-item">
        <div class="answer-text">
          <input
            v-model="answer.text"
            class="answer-input"
            placeholder="添加回复"
            @input="updateNodeData"
          />
        </div>
      </div>

      <button v-if="answers.length < 3" class="add-answer-btn" @click="addAnswer">
        <span class="i-carbon-add"></span>
        添加回复
      </button>
    </div>

    <template #handles>
      <!-- 使用Vue Flow默认连接点 - 输入连接点 -->
      <div
        :class="[
          'vue-flow__handle vue-flow__handle-left vue-flow__handle-connecting',
          { 'vue-flow__handle-valid': true },
        ]"
        data-handleid="target"
        :data-nodeid="id"
        data-handlepos="left"
        data-id="target"
        :style="{
          top: '50%',
          left: '-8px',
          transform: 'translateY(-50%)',
          background: 'var(--color-workflow-handle)',
          width: '12px',
          height: '12px',
          border: '2px solid #fff',
        }"
      ></div>

      <!-- 输出连接点 -->
      <div
        v-for="(answer, index) in answers"
        :key="`source-${index}`"
        :class="[
          'vue-flow__handle vue-flow__handle-right vue-flow__handle-connecting',
          { 'vue-flow__handle-valid': true },
        ]"
        :data-handleid="`source-${index}`"
        :data-nodeid="id"
        data-handlepos="right"
        :data-id="`source-${index}`"
        :style="{
          top: `${getSourceHandlePosition(index)}%`,
          right: '-8px',
          background: 'var(--color-workflow-handle)',
          width: '12px',
          height: '12px',
          border: '2px solid #fff',
        }"
      ></div>
    </template>
  </BaseNode>
</template>

<script setup lang="ts">
import BaseNode from "@/components/workflow/nodes/BaseNode.vue";
import { useAnswerNodeLogic } from "./AnswerNode.logic";
import "./AnswerNode.styles.scss";

const props = defineProps<{
  id: string;
  type: string;
  data: {
    title: string;
    config?: {
      answers?: Array<{ text: string }>;
    };
    [key: string]: any;
  };
  selected: boolean;
}>();

// 使用节点特有逻辑
const {
  handleNodeClick,
  handleDeleteClick,
  updateNodeData,
  addAnswer,
  answers,
  getSourceHandlePosition,
} = useAnswerNodeLogic(props);
</script>
