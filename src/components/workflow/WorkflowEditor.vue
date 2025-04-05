<template>
  <div class="workflow-editor-container">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-section">
        <h3>节点工具箱</h3>
        <div class="toolbar-buttons">
          <button
            class="toolbar-btn"
            @click="addNode(BlockEnum.ANSWER)"
            title="添加流转节点"
          >
            <span class="i-carbon-document-add"></span>
            流转
          </button>
          <button class="toolbar-btn" @click="addNode(BlockEnum.LLM)" title="添加LLM节点">
            <span class="i-carbon-ai-status"></span>
            LLM
          </button>
          <button
            class="toolbar-btn"
            @click="addNode(BlockEnum.CONDITION)"
            title="添加条件节点"
          >
            <span class="i-carbon-branch"></span>
            条件
          </button>
        </div>
      </div>

      <div class="toolbar-section">
        <h3>操作</h3>
        <div class="toolbar-buttons">
          <button class="toolbar-btn" @click="addDebugEdge" title="添加测试连线">
            <span class="i-carbon-connect"></span>
            添加测试连线
          </button>
          <button class="toolbar-btn" @click="resetWorkflow" title="重置工作流">
            <span class="i-carbon-reset"></span>
            重置
          </button>
          <button class="toolbar-btn" @click="updatePositions" title="随机调整位置">
            <span class="i-carbon-shuffle"></span>
            随机位置
          </button>
          <button
            class="toolbar-btn"
            :disabled="!canUndo"
            @click="undo"
            title="撤销"
            :class="{ disabled: !canUndo }"
          >
            <span class="i-carbon-undo"></span>
            撤销
          </button>
          <button
            class="toolbar-btn"
            :disabled="!canRedo"
            @click="redo"
            title="重做"
            :class="{ disabled: !canRedo }"
          >
            <span class="i-carbon-redo"></span>
            重做
          </button>
        </div>
      </div>
    </div>

    <!-- 工作流画布 -->
    <div class="workflow-canvas" @contextmenu.prevent="showContextMenu">
      <VueFlow
        connectable
        class="workflow-view"
        ref="vueFlowRef"
        :nodes="nodes"
        :edges="edges"
        :default-viewport="{ x: 0, y: 0, zoom: 1 }"
        :node-types="nodeTypes"
        :connect-on-click="false"
        :disable-keyboard="false"
        :snap-to-grid="true"
        :snap-grid="[10, 10]"
        :delete-key-code="['Backspace', 'Delete']"
        :connection-line-type="connectionLineType"
        :connection-line-style="{
          stroke: 'var(--color-workflow-link-line-hover)',
          strokeWidth: 2,
          strokeDasharray: '5 5',
        }"
        :default-edge-options="{
          type: 'default',
          animated: true,
          style: {
            stroke: 'var(--color-workflow-link-line-normal)',
            strokeWidth: 2,
          },
        }"
        @connect="onConnect"
        @edge-click="onEdgeClick"
        @pane-click="onPaneClick"
        @node-drag-stop="onNodeDragStop"
        @node-click="onNodeClick"
        @mousemove="onCanvasMouseMove"
        @error="(error: any) => console.error('VueFlow错误:', error)"
      >
        <Background pattern-color="#aaa" gap="20" />
        <MiniMap />
        <Controls />

        <Panel position="top-right">
          <div class="buttons-panel">
            <button @click="store.updatePositions">
              <Icon name="shuffle" />
            </button>
            <button @click="store.toggleClass">
              <Icon name="moon" />
            </button>
            <button @click="store.log">
              <Icon name="log" />
            </button>
            <button @click="store.reset">
              <Icon name="reset" />
            </button>
          </div>
        </Panel>
      </VueFlow>
    </div>

    <!-- 全局右键菜单 -->
    <div
      v-show="contextMenu.visible"
      class="context-menu"
      :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
      @click.stop
    >
      <div class="context-menu-items">
        <button class="context-menu-item" @click="showNodeSelectionMenu">
          <span class="i-carbon-add"></span>
          <span>添加节点</span>
        </button>
        <button class="context-menu-item" @click="addComment">
          <span class="i-carbon-document-blank"></span>
          <span>添加注释</span>
        </button>
        <button class="context-menu-item" @click="runWorkflow">
          <span class="i-carbon-play"></span>
          <span>运行</span>
        </button>
        <button class="context-menu-item" @click="pasteHere">
          <span class="i-carbon-paste"></span>
          <span>粘贴到这里</span>
        </button>
        <button class="context-menu-item" @click="exportDSL">
          <span class="i-carbon-export"></span>
          <span>导出DSL</span>
        </button>
        <button class="context-menu-item" @click="importDSL">
          <span class="i-carbon-import"></span>
          <span>导入DSL</span>
        </button>
      </div>
    </div>

    <!-- 节点选择菜单 - 移动到最外层 -->
    <div
      v-show="nodeSelectionMenu.visible"
      class="node-selection-menu"
      :style="{ left: `${nodeSelectionMenu.x}px`, top: `${nodeSelectionMenu.y}px` }"
      @click.stop
    >
      <div class="node-selection-header">选择节点类型</div>

      <!-- 基础节点 -->
      <div class="node-category">
        <div class="node-category-title">基础节点</div>
        <div class="node-selection-items">
          <button
            v-for="nodeType in basicNodeTypes"
            :key="nodeType"
            class="node-selection-item"
            @click="addNodeAtPosition(nodeType, contextMenu.position)"
          >
            <span :class="getNodeIconClass(nodeType)"></span>
            <span>{{ getNodeTitle(nodeType) }}</span>
          </button>
        </div>
      </div>

      <!-- 逻辑节点 -->
      <div class="node-category">
        <div class="node-category-title">逻辑节点</div>
        <div class="node-selection-items">
          <button
            v-for="nodeType in logicNodeTypes"
            :key="nodeType"
            class="node-selection-item"
            @click="addNodeAtPosition(nodeType, contextMenu.position)"
          >
            <span :class="getNodeIconClass(nodeType)"></span>
            <span>{{ getNodeTitle(nodeType) }}</span>
          </button>
        </div>
      </div>

      <!-- 工具节点 -->
      <div class="node-category">
        <div class="node-category-title">工具节点</div>
        <div class="node-selection-items">
          <button
            v-for="nodeType in toolNodeTypes"
            :key="nodeType"
            class="node-selection-item"
            @click="addNodeAtPosition(nodeType, contextMenu.position)"
          >
            <span :class="getNodeIconClass(nodeType)"></span>
            <span>{{ getNodeTitle(nodeType) }}</span>
          </button>
        </div>
      </div>

      <!-- 数据处理节点 -->
      <div class="node-category">
        <div class="node-category-title">数据处理</div>
        <div class="node-selection-items">
          <button
            v-for="nodeType in dataNodeTypes"
            :key="nodeType"
            class="node-selection-item"
            @click="addNodeAtPosition(nodeType, contextMenu.position)"
          >
            <span :class="getNodeIconClass(nodeType)"></span>
            <span>{{ getNodeTitle(nodeType) }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 属性面板 -->
    <div class="properties-panel">
      <h3>节点属性</h3>
      <div v-if="selectedNode" class="properties-content">
        <div class="property-group">
          <label>标题</label>
          <input
            v-model="selectedNode.data.title"
            class="properties-input"
            @input="updateSelectedNode"
          />
        </div>

        <div class="property-group" v-if="selectedNode.type === BlockEnum.LLM">
          <label>LLM 模型</label>
          <select
            v-model="selectedNode.data.config.model"
            class="properties-select"
            @change="updateSelectedNode"
          >
            <option value="DeepSeek V3">DeepSeek V3</option>
            <option value="GPT-4">GPT-4</option>
            <option value="Claude 3">Claude 3</option>
          </select>
        </div>

        <!-- 条件节点配置 -->
        <div class="property-group" v-if="selectedNode.type === BlockEnum.CONDITION">
          <label>条件选项</label>
          <div
            v-for="(condition, index) in selectedNode.data.config.conditions"
            :key="index"
            class="condition-item"
          >
            <input
              v-model="condition.name"
              class="properties-input"
              placeholder="分支名称"
              @input="updateSelectedNode"
            />
            <button
              v-if="selectedNode.data.config.conditions.length > 1"
              class="remove-btn"
              @click="removeCondition(index)"
              title="删除条件"
            >
              <span class="i-carbon-close"></span>
            </button>
          </div>

          <button
            v-if="selectedNode.data.config.conditions.length < 5"
            class="add-btn"
            @click="addCondition"
          >
            <span class="i-carbon-add"></span>
            添加条件
          </button>
        </div>
      </div>
      <div v-else class="no-selection">请选择一个节点进行配置</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useStore from "@/stores/workflowStore";
const store = useStore();

import { ref, computed, onMounted, watch, reactive, nextTick, markRaw } from "vue";
import type { Node, Edge } from "@vue-flow/core";
import { VueFlow, useVueFlow, Position, MarkerType, Panel } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { MiniMap } from "@vue-flow/minimap";
import { Controls } from "@vue-flow/controls";
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import "@vue-flow/controls/dist/style.css";
import "@vue-flow/minimap/dist/style.css";
import { ZoomIn, ZoomOut, Maximize } from "lucide-vue-next";
import { v4 as uuidv4 } from "uuid";
import "./nodes/styles/node-common.scss";

import useWorkflowStore, { BlockEnum } from "@/stores/workflowStore";
import StartNode from "@/components/workflow/nodes/control_flow/StartNode/StartNode.vue";
import EndNode from "@/components/workflow/nodes/control_flow/EndNode/EndNode.vue";
import ConditionNode from "@/components/workflow/nodes/control_flow/ConditionNode/ConditionNode.vue";
import LoopNode from "@/components/workflow/nodes/control_flow/LoopNode/LoopNode.vue";
import AnswerNode from "@/components/workflow/nodes/data_processing/AnswerNode/AnswerNode.vue";
import LLMNode from "@/components/workflow/nodes/ai_models/LLMNode/LLMNode.vue";
import AgentNode from "@/components/workflow/nodes/ai_models/AgentNode/AgentNode.vue";
import KnowledgeRetrievalNode from "@/components/workflow/nodes/integrations/KnowledgeRetrievalNode/KnowledgeRetrievalNode.vue";
import HttpRequestNode from "@/components/workflow/nodes/integrations/HttpRequestNode/HttpRequestNode.vue";
import CodeExecutionNode from "@/components/workflow/nodes/tools/CodeExecutionNode/CodeExecutionNode.vue";

// 使用Pinia状态管理
const workflowStore = useWorkflowStore();
const {
  nodes,
  edges,
  canUndo,
  canRedo,
  initializeWorkflow,
  addNode: storeAddNode,
  updateNodeData,
  resetWorkflow: storeResetWorkflow,
  undo: storeUndo,
  redo: storeRedo,
  updatePositions: storeUpdatePositions,
} = workflowStore;

// 定义所有节点类型
const nodeTypes = {
  [BlockEnum.START]: markRaw(StartNode),
  [BlockEnum.END]: markRaw(EndNode),
  [BlockEnum.ANSWER]: markRaw(AnswerNode),
  [BlockEnum.LLM]: markRaw(LLMNode),
  [BlockEnum.CONDITION]: markRaw(ConditionNode),
  [BlockEnum.KNOWLEDGE_RETRIEVAL]: markRaw(KnowledgeRetrievalNode),
  [BlockEnum.AGENT]: markRaw(AgentNode),
  [BlockEnum.LOOP]: markRaw(LoopNode),
  [BlockEnum.CODE_EXECUTION]: markRaw(CodeExecutionNode),
  [BlockEnum.HTTP_REQUEST]: markRaw(HttpRequestNode),
};

// 当前选中的节点
const selectedNode = ref<any>(null);

// 鼠标在画布上的位置
const mousePosition = reactive({
  x: 0,
  y: 0,
  canvasX: 0,
  canvasY: 0,
});

// 右键菜单状态
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  position: { x: 0, y: 0 },
});

// 节点选择菜单状态
const nodeSelectionMenu = ref({
  visible: false,
  x: 0,
  y: 0,
});

// 导入DSL对话框状态
const dslImportDialog = ref({
  visible: false,
  text: "",
});

// 使用组件实例类型
const vueFlowRef = ref<any>(null);

// Vue Flow API - 使用async setup模式获取实例
let vueFlowInstance: any = null;
try {
  // 尝试获取Vue Flow实例，如果失败则稍后再获取
  const { findNode, addEdges, zoomIn, zoomOut, setViewport } = useVueFlow();

  vueFlowInstance = {
    findNode,
    addEdges,
    zoomIn,
    zoomOut,
    setViewport,
  };
} catch (error) {
  console.warn("Vue Flow API 初始化失败，将在组件挂载后重试", error);
}

// 获取节点图标类名
const getNodeIconClass = (type: BlockEnum): string => {
  const iconMap: Record<string, string> = {
    [BlockEnum.START]: "i-carbon-play-filled-alt",
    [BlockEnum.END]: "i-carbon-stop-filled",
    [BlockEnum.ANSWER]: "i-carbon-chat",
    [BlockEnum.LLM]: "i-carbon-machine-learning-model",
    [BlockEnum.CONDITION]: "i-carbon-flow",
    [BlockEnum.KNOWLEDGE_RETRIEVAL]: "i-carbon-document-search",
    [BlockEnum.AGENT]: "i-carbon-bot",
    [BlockEnum.QUESTION_CLASSIFIER]: "i-carbon-category",
    [BlockEnum.CODE_EXECUTION]: "i-carbon-code",
    [BlockEnum.TEMPLATE_TRANSFORM]: "i-carbon-template",
    [BlockEnum.VARIABLE_AGGREGATOR]: "i-carbon-data-share",
    [BlockEnum.DOCUMENT_EXTRACTOR]: "i-carbon-document",
    [BlockEnum.VARIABLE_ASSIGNER]: "i-carbon-data-set",
    [BlockEnum.PARAMETER_EXTRACTOR]: "i-carbon-data-view",
    [BlockEnum.HTTP_REQUEST]: "i-carbon-api",
    [BlockEnum.LIST_OPERATOR]: "i-carbon-list",
    [BlockEnum.LOOP]: "i-carbon-repeat",
    [BlockEnum.ITERATION]: "i-carbon-iterate",
  };

  return iconMap[type] || "i-carbon-unknown";
};

// 获取节点标题
const getNodeTitle = (type: BlockEnum): string => {
  switch (type) {
    case BlockEnum.START:
      return "开始";
    case BlockEnum.END:
      return "结束";
    case BlockEnum.ANSWER:
      return "流转";
    case BlockEnum.LLM:
      return "LLM";
    case BlockEnum.CONDITION:
      return "条件";
    default:
      return type;
  }
};

// 连接线类型
const connectionLineType = "default";

// 边类型
const edgeTypes = {};

// 连接事件处理
const onConnect = (connection: {
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
}) => {
  console.log("★★★ 连接事件触发，完整连接数据:", connection);
  console.log("★★★ 源节点ID:", connection.source);
  console.log("★★★ 目标节点ID:", connection.target);
  console.log("★★★ 源连接点ID:", connection.sourceHandle);
  console.log("★★★ 目标连接点ID:", connection.targetHandle);

  try {
    // 验证连接点是否存在
    const sourceNode = workflowStore.nodes.find((n) => n.id === connection.source);
    const targetNode = workflowStore.nodes.find((n) => n.id === connection.target);

    console.log("★★★ 源节点:", sourceNode);
    console.log("★★★ 目标节点:", targetNode);

    if (!sourceNode || !targetNode) {
      console.error("★★★ 连接失败: 源节点或目标节点不存在");
      return;
    }

    // 创建新的边
    const newEdge = {
      id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      type: "default", // 使用默认类型
      animated: true,
      style: {
        stroke: "var(--color-workflow-link-line-normal)",
        strokeWidth: 2,
      },
      data: { animated: true },
    };

    console.log("★★★ 准备添加新连线:", newEdge);

    // 添加到store
    workflowStore.edges.push(newEdge);

    // 确保Vue Flow实例更新
    if (vueFlowRef.value) {
      console.log("★★★ 更新Vue Flow边数据，当前边数量:", workflowStore.edges.length);
      vueFlowRef.value.setEdges([...workflowStore.edges]);

      // 检查是否成功更新
      setTimeout(() => {
        console.log("★★★ 更新后的Vue Flow边:", vueFlowRef.value.edges);
      }, 100);
    } else {
      console.error("★★★ Vue Flow实例不存在，无法更新边");
    }

    console.log("★★★ 已添加连线，当前edges数量:", workflowStore.edges.length);

    // 保存到历史记录
    workflowStore.saveToHistory();
  } catch (error) {
    console.error("★★★ 添加连线失败:", error);
  }
};

// 边点击事件
const onEdgeClick = (params: any) => {
  console.log("边点击:", params);
};

// 节点拖动结束事件
const onNodeDragStop = () => {
  workflowStore.saveToHistory();
};

// 监听鼠标移动，记录鼠标在画布上的位置
const onCanvasMouseMove = (event: MouseEvent) => {
  // 获取画布边界
  const bounds = document.querySelector(".workflow-vue-flow")?.getBoundingClientRect();
  if (!bounds) return;

  // 记录鼠标在屏幕上的位置
  mousePosition.x = event.clientX;
  mousePosition.y = event.clientY;

  // 简单计算相对位置，不使用project方法
  mousePosition.canvasX = event.clientX - bounds.left;
  mousePosition.canvasY = event.clientY - bounds.top;
};

// 右键菜单事件
const onContextMenu = (event: MouseEvent) => {
  event.preventDefault();
  showContextMenu(event);
};

// 新的右键菜单显示函数
const showContextMenu = (event: MouseEvent) => {
  console.log("showContextMenu", event);
  // 确保事件不是从控件或子菜单产生的
  const target = event.target as HTMLElement;
  const isFromControl =
    target.closest(".zoom-controls") ||
    target.closest(".context-menu") ||
    target.closest(".node-selection-menu");

  if (isFromControl) {
    return; // 如果是控件区域的右键点击，忽略
  }

  // 获取画布边界
  const bounds = document.querySelector(".workflow-canvas")?.getBoundingClientRect();
  if (!bounds) return;

  // 设置右键菜单位置（屏幕坐标）
  contextMenu.value.x = event.clientX;
  contextMenu.value.y = event.clientY;

  // 计算相对于画布的位置
  const canvasX =
    event.clientX -
    bounds.left +
    (document.querySelector(".workflow-canvas")?.scrollLeft || 0);
  const canvasY =
    event.clientY -
    bounds.top +
    (document.querySelector(".workflow-canvas")?.scrollTop || 0);

  // 更新菜单位置
  contextMenu.value.position = {
    x: canvasX,
    y: canvasY,
  };

  // 显示菜单
  contextMenu.value.visible = true;
  nodeSelectionMenu.value.visible = false;

  console.log("显示右键菜单:", {
    visible: contextMenu.value.visible,
    position: contextMenu.value.position,
    screenPos: { x: contextMenu.value.x, y: contextMenu.value.y },
  });

  // 点击其他地方关闭菜单
  setTimeout(() => {
    window.addEventListener("click", closeContextMenu, { once: true });
  }, 0);
};

// 关闭右键菜单
const closeContextMenu = () => {
  contextMenu.value.visible = false;
  nodeSelectionMenu.value.visible = false;
};

// 显示节点选择菜单 - 确保能看到节点选择菜单
const showNodeSelectionMenu = () => {
  // 关闭右键菜单并在同样位置显示节点选择菜单
  nodeSelectionMenu.value.x = contextMenu.value.x;
  nodeSelectionMenu.value.y = contextMenu.value.y;

  // 先关闭右键菜单，再显示节点选择菜单
  contextMenu.value.visible = false;

  // 延迟显示节点选择菜单，避免被click事件立即关闭
  setTimeout(() => {
    nodeSelectionMenu.value.visible = true;

    console.log("显示节点选择菜单:", {
      visible: nodeSelectionMenu.value.visible,
      position: { x: nodeSelectionMenu.value.x, y: nodeSelectionMenu.value.y },
    });

    // 防止菜单在点击外部时过早关闭
    const preventMenuClose = (e: MouseEvent) => {
      e.stopPropagation();
    };

    // 添加临时事件处理程序，确保第一次点击不会关闭菜单
    window.addEventListener("click", preventMenuClose, { once: true });

    // 之后再添加关闭事件处理程序
    setTimeout(() => {
      window.addEventListener("click", closeNodeSelectionMenu, { once: true });
    }, 100);
  }, 10);
};

// 关闭节点选择菜单
const closeNodeSelectionMenu = () => {
  nodeSelectionMenu.value.visible = false;
  console.log("关闭节点选择菜单");
};

// 添加节点位置的函数 - 确保正确处理
const addNodeAtPosition = (type: BlockEnum, position: { x: number; y: number }) => {
  try {
    // 添加节点
    const newNode = storeAddNode(type, position);

    // 手动关闭菜单
    nodeSelectionMenu.value.visible = false;

    console.log("添加节点:", {
      type,
      position,
    });

    // 确保节点显示在VueFlow中
    nextTick(() => {
      if (vueFlowRef.value && vueFlowRef.value.addNodes) {
        vueFlowRef.value.addNodes([newNode]);
      }
    });
  } catch (error) {
    console.error("添加节点失败:", error);
  }
};

// 画布点击事件
const onPaneClick = () => {
  selectedNode.value = null;
  // 不需要在这里关闭右键菜单，因为已经通过全局点击事件来处理了
};

// 添加节点
const addNode = (type: BlockEnum) => {
  try {
    // 计算画布中心位置
    let centerPosition = { x: 200, y: 200 }; // 默认位置

    if (vueFlowRef.value) {
      try {
        const { x = 0, y = 0, zoom = 1 } = vueFlowRef.value.toObject() || {};
        const viewportWidth =
          document.querySelector(".workflow-vue-flow")?.clientWidth || window.innerWidth;
        const viewportHeight =
          document.querySelector(".workflow-vue-flow")?.clientHeight ||
          window.innerHeight;

        centerPosition = {
          x: (viewportWidth / 2 - x) / zoom,
          y: (viewportHeight / 2 - y) / zoom,
        };
      } catch (e) {
        console.error("无法获取流程图视口信息:", e);
      }
    }

    // 添加节点
    const newNode = storeAddNode(type, centerPosition);
    console.log("节点已添加:", newNode);

    // 确保节点显示在可视区域内
    nextTick(() => {
      console.log("Vue Flow实例:", vueFlowRef.value);

      // 注册节点类型
      if (vueFlowRef.value && vueFlowRef.value.addNodes) {
        // 手动将节点添加到VueFlow实例
        vueFlowRef.value.addNodes([newNode]);
      }

      // 调整视图
      setTimeout(() => {
        if (vueFlowRef.value && vueFlowRef.value.fitView) {
          console.log("调整视图以显示所有节点");
          vueFlowRef.value.fitView();
        }
      }, 200);
    });
  } catch (error) {
    console.error("添加节点失败:", error);
  }
};

// 更新选中节点
const updateSelectedNode = () => {
  if (selectedNode.value) {
    updateNodeData(selectedNode.value.id, selectedNode.value.data);
  }
};

// 添加条件
const addCondition = () => {
  if (selectedNode.value && selectedNode.value.type === BlockEnum.CONDITION) {
    selectedNode.value.data.config.conditions.push({
      name: `选项${selectedNode.value.data.config.conditions.length + 1}`,
    });
    updateSelectedNode();
  }
};

// 移除条件
const removeCondition = (index: number) => {
  if (selectedNode.value && selectedNode.value.type === BlockEnum.CONDITION) {
    if (selectedNode.value.data.config.conditions.length > 1) {
      selectedNode.value.data.config.conditions.splice(index, 1);
      updateSelectedNode();
    }
  }
};

// 观察节点选择
watch(
  () => workflowStore.nodes,
  (newNodes) => {
    if (!newNodes) return;

    const selected = newNodes.find((node: any) => node.selected);
    if (selected) {
      // 使用深拷贝避免直接修改store
      selectedNode.value = JSON.parse(JSON.stringify(selected));
    }
  },
  { deep: true }
);

// 重置工作流
const resetWorkflow = () => {
  if (confirm("确定要重置工作流吗？这将删除所有节点和连接。")) {
    storeResetWorkflow();
  }
};

// 撤销操作
const undo = () => {
  storeUndo();
};

// 重做操作
const redo = () => {
  storeRedo();
};

// 随机更新位置
const updatePositions = () => {
  storeUpdatePositions();
};

// 缩放控制
const zoomIn = () => {
  if (vueFlowInstance) {
    vueFlowInstance.zoomIn();
  }
};

const zoomOut = () => {
  if (vueFlowInstance) {
    vueFlowInstance.zoomOut();
  }
};

const zoomReset = () => {
  if (vueFlowInstance) {
    vueFlowInstance.setViewport({ x: 0, y: 0, zoom: 1 });
  }
};

// 节点点击事件
const onNodeClick = (params: any) => {
  // 发送节点选择事件
  const event = new CustomEvent("node-selected", {
    detail: { nodeId: params.node.id },
  });
  window.dispatchEvent(event);

  // 设置节点选中状态
  nodes.forEach((node: any) => {
    if (node.id === params.node.id) {
      node.selected = true;
    } else {
      node.selected = false;
    }
  });
};

// 添加注释
const addComment = () => {
  // 实现添加注释的逻辑，暂时使用alert提示
  alert("添加注释功能即将推出");
  closeContextMenu();
};

// 运行工作流
const runWorkflow = () => {
  // 实现运行工作流的逻辑，暂时使用alert提示
  alert("运行工作流功能即将推出");
  closeContextMenu();
};

// 粘贴到这里
const pasteHere = () => {
  // 实现粘贴到这里的逻辑，暂时使用alert提示
  alert("粘贴功能即将推出");
  closeContextMenu();
};

// 导出DSL
const exportDSL = () => {
  try {
    // 创建DSL对象
    const dsl = {
      nodes: nodes,
      edges: edges,
    };

    // 转换为JSON字符串
    const dslString = JSON.stringify(dsl, null, 2);

    // 创建下载链接
    const blob = new Blob([dslString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workflow-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();

    // 清理
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);

    closeContextMenu();
  } catch (error) {
    console.error("导出DSL失败:", error);
    alert("导出DSL失败");
  }
};

// 导入DSL
const importDSL = () => {
  // 显示导入对话框
  dslImportDialog.value.visible = true;
  dslImportDialog.value.text = "";
  closeContextMenu();
};

// 确认导入DSL
const confirmImportDSL = () => {
  try {
    if (!dslImportDialog.value.text.trim()) {
      alert("请输入有效的DSL内容");
      return;
    }

    // 解析DSL
    const dsl = JSON.parse(dslImportDialog.value.text);

    // 验证DSL格式
    if (
      !dsl.nodes ||
      !Array.isArray(dsl.nodes) ||
      !dsl.edges ||
      !Array.isArray(dsl.edges)
    ) {
      alert("无效的DSL格式");
      return;
    }

    // 更新工作流
    const result = workflowStore.importDSL(dsl);

    // 关闭对话框
    dslImportDialog.value.visible = false;

    if (result) {
      alert("DSL导入成功");
    } else {
      alert("导入DSL失败");
    }
  } catch (error) {
    console.error("导入DSL失败:", error);
    alert("导入DSL失败，请检查格式");
  }
};

// 添加一个直接的调试按钮
const addDebugEdge = () => {
  if (workflowStore.nodes.length < 2) {
    console.log("节点数量不足，无法添加调试连线");
    return;
  }

  const source = workflowStore.nodes[0].id;
  const target = workflowStore.nodes[1].id;

  // 假设第一个节点是开始节点，源连接点ID是source
  // 假设第二个节点可能是各种节点，目标连接点ID是target
  const sourceHandle = "source";
  const targetHandle = "target";

  console.log("★★★ 添加调试连线", {
    source,
    target,
    sourceHandle,
    targetHandle,
    sourceNode: workflowStore.nodes[0],
    targetNode: workflowStore.nodes[1],
  });

  const debugEdge = {
    id: `debug-edge-${Date.now()}`,
    source,
    target,
    sourceHandle,
    targetHandle,
    type: "default",
    animated: true,
    style: {
      stroke: "var(--color-workflow-link-line-normal)",
      strokeWidth: 2,
    },
    data: { animated: true, debug: true },
  };

  workflowStore.edges.push(debugEdge);

  // 确保Vue Flow实例更新
  if (vueFlowRef.value) {
    vueFlowRef.value.setEdges([...workflowStore.edges]);
    setTimeout(() => {
      if (vueFlowRef.value.fitView) {
        vueFlowRef.value.fitView();
        console.log("★★★ 已添加测试连线并调整视图");
      }
    }, 100);
  }

  console.log("★★★ 现有连线数:", workflowStore.edges.length);
  console.log("★★★ 连线详情:", workflowStore.edges);
};

// 添加一个函数来检查连接点是否正确注册
const checkHandles = () => {
  console.log("====== 开始检查连接点 =======");
  // 获取所有连接点
  const handles = document.querySelectorAll(".vue-flow__handle");
  console.log(`发现 ${handles.length} 个连接点`);

  handles.forEach((handle, index) => {
    const nodeId = handle.getAttribute("data-nodeid");
    const handleId = handle.getAttribute("data-handleid");
    const handlePos = handle.getAttribute("data-handlepos");
    const dataId = handle.getAttribute("data-id");

    console.log(`连接点 ${index + 1}:`, {
      nodeId,
      handleId,
      handlePos,
      dataId,
      classList: handle.className,
      parentNode: handle.parentElement?.className,
    });
  });

  console.log("====== 连接点检查完成 =======");
};

// 在组件挂载后添加右键菜单事件监听
onMounted(async () => {
  console.log("组件挂载中...");
  // 初始化编辑器
  nodeSelectionMenu.value = { visible: false, x: 0, y: 0 };
  contextMenu.value = { visible: false, x: 0, y: 0, position: { x: 0, y: 0 } };

  // 确保VueFlow组件已经初始化
  setTimeout(() => {
    console.log("初始化工作流...", vueFlowRef.value);
    initializeWorkflow();

    // 确保edgeTypes正确注册
    console.log("★★★ 开始注册边类型:", edgeTypes);

    if (vueFlowRef.value) {
      // 强制更新edgeTypes
      vueFlowRef.value.edgeTypes = edgeTypes;
      console.log("★★★ 边类型已注册到Vue Flow实例");

      // 确保节点正确添加到Vue Flow中
      if (workflowStore.nodes.length) {
        console.log("★★★ 手动添加节点到VueFlow", workflowStore.nodes.length);
        vueFlowRef.value.setNodes(workflowStore.nodes);

        // 调整视图以显示所有节点
        setTimeout(() => {
          if (vueFlowRef.value.fitView) {
            vueFlowRef.value.fitView();
            console.log("★★★ 已自动调整视图");
          }

          // 检查连接点
          setTimeout(checkHandles, 500);
        }, 500);
      }
    }
  }, 1000);

  // 添加对画布区域的右键事件监听
  setTimeout(() => {
    const paneElement = document.querySelector(".vue-flow__pane");
    if (paneElement) {
      console.log("添加画布右键菜单监听");
      paneElement.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        showContextMenu(event as MouseEvent);
      });
    } else {
      console.warn("未找到画布元素 .vue-flow__pane");
    }
  }, 500); // 稍微延迟确保DOM已完全加载

  // 初始化Vue Flow
  vueFlowInstance = useVueFlow({
    id: "workflow-editor",
    nodes: nodes,
    edges: edges,
  });

  // 打印edgeTypes检查
  console.log("★★★ edgeTypes定义:", edgeTypes);

  // 添加测试连线来验证边渲染
  await nextTick();
});

// 节点类型分类
const basicNodeTypes = [BlockEnum.ANSWER, BlockEnum.LLM, BlockEnum.END];

const logicNodeTypes = [BlockEnum.CONDITION, BlockEnum.LOOP, BlockEnum.ITERATION];

const toolNodeTypes = [
  BlockEnum.KNOWLEDGE_RETRIEVAL,
  BlockEnum.AGENT,
  BlockEnum.HTTP_REQUEST,
  BlockEnum.CODE_EXECUTION,
];

const dataNodeTypes = [
  BlockEnum.TEMPLATE_TRANSFORM,
  BlockEnum.VARIABLE_AGGREGATOR,
  BlockEnum.DOCUMENT_EXTRACTOR,
  BlockEnum.VARIABLE_ASSIGNER,
  BlockEnum.PARAMETER_EXTRACTOR,
  BlockEnum.QUESTION_CLASSIFIER,
  BlockEnum.LIST_OPERATOR,
];
</script>

<style scoped>
.workflow-editor-container {
  display: grid;
  grid-template-columns: 220px 1fr 280px;
  grid-template-rows: 100%;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #f9fafb;
}

.toolbar {
  padding: 16px;
  border-right: 1px solid #e5e7eb;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
}

.toolbar-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toolbar-section h3 {
  font-size: 14px;
  color: #4b5563;
  font-weight: 600;
  margin-bottom: 8px;
}

.toolbar-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 13px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.toolbar-btn:active {
  background-color: #e5e7eb;
}

.toolbar-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.workflow-canvas {
  position: relative;
  background-color: #f9fafb;
  height: 100%;
}

.workflow-vue-flow {
  height: 100%;
}

.properties-panel {
  padding: 16px;
  border-left: 1px solid #e5e7eb;
  background-color: white;
  overflow-y: auto;
}

.properties-panel h3 {
  font-size: 14px;
  color: #4b5563;
  font-weight: 600;
  margin-bottom: 16px;
}

.properties-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.property-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.property-group label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.properties-input,
.properties-select {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 8px;
  font-size: 13px;
  color: #1f2937;
  background-color: #f9fafb;
}

.properties-input:focus,
.properties-select:focus {
  outline: none;
  border-color: #93c5fd;
  background-color: white;
}

.condition-item {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #9ca3af;
  cursor: pointer;
}

.remove-btn:hover {
  color: #ef4444;
  background-color: #fee2e2;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: transparent;
  border: 1px dashed #e5e7eb;
  border-radius: 4px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  margin-top: 4px;
}

.add-btn:hover {
  background-color: #f3f4f6;
  color: #4b5563;
}

.no-selection {
  color: #9ca3af;
  font-size: 13px;
  font-style: italic;
}

.zoom-controls {
  display: flex;
  gap: 4px;
  background-color: white;
  border-radius: 4px;
  padding: 4px;
  border: 1px solid #e5e7eb;
}

.zoom-controls button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  color: #4b5563;
}

.zoom-controls button:hover {
  background-color: #f3f4f6;
}

.zoom-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.context-menu {
  position: fixed;
  z-index: 1000;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.context-menu-header {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.context-menu-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.context-menu-item:hover {
  background-color: #f3f4f6;
}

.node-selection-menu {
  position: fixed;
  z-index: 1000;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-height: 70vh;
  overflow-y: auto;
  width: 280px;
}

.node-selection-header {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e5e7eb;
  color: #111827;
}

.node-category {
  margin-bottom: 12px;
}

.node-category-title {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 6px;
  padding-left: 4px;
}

.node-selection-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.node-selection-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.node-selection-item:hover {
  background-color: #f3f4f6;
}

.dsl-import-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dsl-import-content {
  background-color: white;
  padding: 16px;
  border-radius: 4px;
  width: 400px;
  max-height: 80%;
  overflow-y: auto;
}

.dsl-import-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.dsl-import-header h3 {
  font-size: 14px;
  font-weight: 600;
}

.dsl-import-close-btn {
  background: none;
  border: none;
  font-size: 16px;
  color: #6b7280;
  cursor: pointer;
}

.dsl-import-textarea {
  width: 100%;
  height: 100px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 8px;
  font-size: 13px;
  color: #1f2937;
  background-color: #f9fafb;
}

.dsl-import-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

.dsl-import-cancel-btn,
.dsl-import-confirm-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dsl-import-cancel-btn {
  background-color: #f3f4f6;
}

.dsl-import-confirm-btn {
  background-color: #007bff;
  color: white;
}
</style>
