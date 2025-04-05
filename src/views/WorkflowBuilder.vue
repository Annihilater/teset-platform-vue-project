<template>
  <div class="app-container">
    <div id="workflow-container" class="workflow-container">
      <!-- 头部 -->
      <div class="workflow-header">
        <div class="workflow-header-title">
          <h1>我的工作流</h1>
        </div>
        <div class="workflow-header-buttons">
          <button class="btn">
            <span class="i-carbon-list mr-1"></span>
            变量管理
          </button>
          <button class="btn">
            <span class="i-carbon-add mr-1"></span>
            功能
          </button>
          <button class="btn">
            <span class="i-carbon-earth mr-1"></span>
            运行
          </button>
          <button class="btn">
            <span class="i-carbon-time mr-1"></span>
            历史版本
          </button>
          <button class="btn btn-primary">发布</button>
        </div>
      </div>

      <div class="workflow-main-content">
        <!-- 工作流编辑器区域 -->
        <div class="workflow-editor-area">
          <WorkflowEditor />
        </div>

        <!-- 节点属性面板(卡片式) -->
        <div v-if="selectedNodeId" class="node-panel-card">
          <div class="node-panel">
            <div class="node-panel-header">
              <div class="node-panel-title">
                <div class="node-panel-icon">
                  <span class="i-carbon-document"></span>
                </div>
                <input type="text" class="node-panel-title-input" v-model="nodeTitle" />
                <div class="node-panel-actions">
                  <span class="i-carbon-information" style="margin-right: 4px"></span>
                  <span class="i-carbon-edit" style="margin-right: 4px"></span>
                  <div
                    style="
                      width: 1px;
                      height: 14px;
                      background-color: var(--color-divider-regular);
                      margin: 0 12px;
                    "
                  ></div>
                  <span class="i-carbon-close" @click="closePanel"></span>
                </div>
              </div>
              <div class="node-panel-description">
                <textarea
                  placeholder="描述"
                  class="node-panel-description-textarea"
                  v-model="nodeDescription"
                ></textarea>
              </div>
            </div>

            <!-- 节点配置内容 -->
            <div class="node-panel-content">
              <component
                :is="getNodeConfigPanel()"
                :node="selectedNode"
                @update="updateNodeData"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import WorkflowEditor from "@/components/workflow/WorkflowEditor.vue";
import useWorkflowStore from "@/stores/workflowStore";
import { BlockEnum } from "@/stores/workflowStore";

// 导入所有配置面板组件
import StartPanel from "@/components/workflow/panels/StartPanel.vue";
import EndPanel from "@/components/workflow/panels/EndPanel.vue";
import AnswerPanel from "@/components/workflow/panels/AnswerPanel.vue";
import LLMPanel from "@/components/workflow/panels/LLMPanel.vue";
import ConditionPanel from "@/components/workflow/panels/ConditionPanel.vue";
import KnowledgeRetrievalPanel from "@/components/workflow/panels/KnowledgeRetrievalPanel.vue";
import VariableAssignerPanel from "@/components/workflow/panels/VariableAssignerPanel.vue";
import HttpRequestPanel from "@/components/workflow/panels/HttpRequestPanel.vue";
import LoopPanel from "@/components/workflow/panels/LoopPanel.vue";
import AgentPanel from "@/components/workflow/panels/AgentPanel.vue";
import QuestionClassifierPanel from "@/components/workflow/panels/QuestionClassifierPanel.vue";
import CodeExecutionPanel from "@/components/workflow/panels/CodeExecutionPanel.vue";
import TemplateTransformPanel from "@/components/workflow/panels/TemplateTransformPanel.vue";
import VariableAggregatorPanel from "@/components/workflow/panels/VariableAggregatorPanel.vue";
import DocumentExtractorPanel from "@/components/workflow/panels/DocumentExtractorPanel.vue";
import ParameterExtractorPanel from "@/components/workflow/panels/ParameterExtractorPanel.vue";
import ListOperatorPanel from "@/components/workflow/panels/ListOperatorPanel.vue";
import IterationPanel from "@/components/workflow/panels/IterationPanel.vue";

const workflowStore = useWorkflowStore();
const { nodes, updateNodeData } = workflowStore;

// 当前选中的节点ID
const selectedNodeId = ref<string | null>(null);

// 通过计算属性获取选中的节点
const selectedNode = computed(() => {
  if (!selectedNodeId.value) return null;
  return nodes.find((node) => node.id === selectedNodeId.value) || null;
});

// 节点标题
const nodeTitle = computed({
  get: () => selectedNode.value?.data?.title || "",
  set: (value) => {
    if (selectedNode.value) {
      updateNodeData(selectedNode.value.id, { title: value });
    }
  },
});

// 节点描述
const nodeDescription = computed({
  get: () => selectedNode.value?.data?.description || "",
  set: (value) => {
    if (selectedNode.value) {
      updateNodeData(selectedNode.value.id, { description: value });
    }
  },
});

// 根据节点类型获取对应的配置面板组件
const getNodeConfigPanel = () => {
  if (!selectedNode.value) return null;

  switch (selectedNode.value.type) {
    case BlockEnum.START:
      return StartPanel;
    case BlockEnum.END:
      return EndPanel;
    case BlockEnum.ANSWER:
      return AnswerPanel;
    case BlockEnum.LLM:
      return LLMPanel;
    case BlockEnum.CONDITION:
      return ConditionPanel;
    case BlockEnum.KNOWLEDGE_RETRIEVAL:
      return KnowledgeRetrievalPanel;
    case BlockEnum.VARIABLE_ASSIGNER:
      return VariableAssignerPanel;
    case BlockEnum.HTTP_REQUEST:
      return HttpRequestPanel;
    case BlockEnum.LOOP:
      return LoopPanel;
    case BlockEnum.AGENT:
      return AgentPanel;
    case BlockEnum.QUESTION_CLASSIFIER:
      return QuestionClassifierPanel;
    case BlockEnum.CODE_EXECUTION:
      return CodeExecutionPanel;
    case BlockEnum.TEMPLATE_TRANSFORM:
      return TemplateTransformPanel;
    case BlockEnum.VARIABLE_AGGREGATOR:
      return VariableAggregatorPanel;
    case BlockEnum.DOCUMENT_EXTRACTOR:
      return DocumentExtractorPanel;
    case BlockEnum.PARAMETER_EXTRACTOR:
      return ParameterExtractorPanel;
    case BlockEnum.LIST_OPERATOR:
      return ListOperatorPanel;
    case BlockEnum.ITERATION:
      return IterationPanel;
    default:
      console.warn(`未找到节点类型 ${selectedNode.value.type} 的配置面板`);
      return null;
  }
};

// 关闭面板
const closePanel = () => {
  selectedNodeId.value = null;
};

// 监听节点选择事件
const onNodeSelected = (nodeId: string) => {
  selectedNodeId.value = nodeId;
};

// 添加事件监听
window.addEventListener("node-selected", ((event: CustomEvent) => {
  onNodeSelected(event.detail.nodeId);
}) as EventListener);
</script>

<style scoped>
:root {
  --color-primary-600: #155eef;
  --color-border-secondary: #e5e7eb;
  --color-bg-primary: #ffffff;
  --color-text-secondary: #4b5563;
  --color-text-tertiary: #6b7280;
  --color-components-panel-border: rgba(0, 0, 0, 0.05);
  --color-components-panel-bg: #ffffff;
  --color-workflow-canvas-workflow-bg: #f9fafb;
  --color-workflow-canvas-workflow-dot-color: #e5e7eb;
  --color-divider-regular: #e5e7eb;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.workflow-container {
  position: relative;
  height: 100%;
  width: 100%;
  min-width: 960px;
  display: flex;
  flex-direction: column;
}

.workflow-header {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 20;
  display: flex;
  height: 3.5rem;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  background-color: rgba(249, 250, 251, 0.95);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.workflow-header-title {
  display: flex;
  align-items: center;
}

.workflow-header-title h1 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.workflow-header-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-border-secondary);
  background-color: white;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.btn-primary {
  background-color: var(--color-primary-600);
  border-color: var(--color-primary-600);
  color: white;
}

.workflow-main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  overflow: hidden;
}

.workflow-editor-area {
  flex: 1;
  height: 100%;
}

.node-panel-card {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 400px;
  z-index: 10;
}

.node-panel {
  background-color: var(--color-components-panel-bg);
  border-radius: 1rem;
  border: 0.5px solid var(--color-components-panel-border);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  overflow-y: auto;
  max-height: calc(100vh - 120px);
}

.node-panel-header {
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.05);
  background-color: var(--color-components-panel-bg);
}

.node-panel-title {
  display: flex;
  align-items: center;
  padding: 1rem;
  padding-bottom: 0.25rem;
  padding-top: 1rem;
}

.node-panel-icon {
  margin-right: 0.25rem;
  flex-shrink: 0;
}

.node-panel-title-input {
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  font-weight: 500;
  background: transparent;
}

.node-panel-actions {
  display: flex;
  align-items: center;
  color: #6b7280;
}

.node-panel-description {
  padding: 0.5rem;
}

.node-panel-description-textarea {
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  background: transparent;
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
}

.node-panel-content {
  padding: 1rem;
}

/* 额外工作流样式 */
.workflow-nodes {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
