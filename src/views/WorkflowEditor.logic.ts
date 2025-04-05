import { useWorkflowStore } from '@/stores/workflowStore';
const workflowStore = useWorkflowStore();
// 导入通用样式
import "@/styles/common.scss";

import StartNodeComponent from '@/components/workflow/nodes/control_flow/StartNode/StartNode.vue';
import EndNodeComponent from '@/components/workflow/nodes/control_flow/EndNode/EndNode.vue';
import AnswerNodeComponent from '@/components/workflow/nodes/data_processing/AnswerNode/AnswerNode.vue';
import LLMNodeComponent from '@/components/workflow/nodes/ai_models/LLMNode/LLMNode.vue';
import ConditionNodeComponent from '@/components/workflow/nodes/control_flow/ConditionNode/ConditionNode.vue';

import { ref, computed, onMounted, defineAsyncComponent, reactive, nextTick, type Ref, shallowRef } from "vue";
import { useI18n } from "vue-i18n";
import {
  VueFlow,
  useVueFlow,
  Position,
  MarkerType,
  type Node,
  type Edge,
  type Connection,
} from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { MiniMap } from "@vue-flow/minimap";
import { Controls } from "@vue-flow/controls";

import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import { v4 as uuidv4 } from "uuid";
import {
  SaveIcon,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  PlayIcon,
  DatabaseIcon,
  Code,
  BrainCircuit,
  SplitSquareVertical,
  ArrowRightLeft,
  Workflow as WorkflowIcon,
  Plus,
  Check,
  Search as SearchIcon,
  Clipboard,
  FileUp,
  FileDown,
  StickyNote,
  Play,
  Code2,
  Copy,
  Trash2,
} from "lucide-vue-next";

import PageLayout from "@/components/layout/PageLayout.vue";
import PageHeader from "@/components/layout/PageHeader.vue";
import DashboardCard from "@/components/DashboardCard.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { useToast } from "vue-toastification";

const { t  } = useI18n();

// 懒加载节点组件
const StartNode = defineAsyncComponent(
  () => import("@/components/workflow/nodes/control_flow/StartNode/StartNode.vue")
);
const EndNode = defineAsyncComponent(
  () => import("@/components/workflow/nodes/control_flow/EndNode/EndNode.vue")
);
const AnswerNode = defineAsyncComponent(
  () => import("@/components/workflow/nodes/data_processing/AnswerNode/AnswerNode.vue")
);
const LLMNode = defineAsyncComponent(
  () => import("@/components/workflow/nodes/ai_models/LLMNode/LLMNode.vue")
);
const ConditionNode = defineAsyncComponent(
  () => import("@/components/workflow/nodes/control_flow/ConditionNode/ConditionNode.vue")
);
const ConnectionLine = defineAsyncComponent(
  () => import("@/components/workflow/nodes/ConnectionLine.vue")
);

// 懒加载配置面板组件
const StartPanel = defineAsyncComponent(
  () => import("@/components/workflow/panels/StartPanel.vue")
);
const EndPanel = defineAsyncComponent(
  () => import("@/components/workflow/panels/EndPanel.vue")
);
const AnswerPanel = defineAsyncComponent(
  () => import("@/components/workflow/panels/AnswerPanel.vue")
);
const LLMPanel = defineAsyncComponent(
  () => import("@/components/workflow/panels/LLMPanel.vue")
);
const ConditionPanel = defineAsyncComponent(
  () => import("@/components/workflow/panels/ConditionPanel.vue")
);

// 节点类型枚举
enum BlockEnum {
  START = "start",
  END = "end",
  ANSWER = "answer",
  LLM = "llm",
  CONDITION = "condition",
}

// 节点面板映射
const panelMap: Record<BlockEnum, any> = {
  [BlockEnum.START]: StartPanel,
  [BlockEnum.END]: EndPanel,
  [BlockEnum.ANSWER]: AnswerPanel,
  [BlockEnum.LLM]: LLMPanel,
  [BlockEnum.CONDITION]: ConditionPanel,
};

// 节点图标映射
const nodeIcons: Record<BlockEnum, any> = {
  [BlockEnum.START]: PlayIcon,
  [BlockEnum.END]: WorkflowIcon,
  [BlockEnum.ANSWER]: ArrowRightLeft,
  [BlockEnum.LLM]: BrainCircuit,
  [BlockEnum.CONDITION]: SplitSquareVertical,
};

// 节点标题映射
const nodeTitles = computed(() => ({
  [BlockEnum.START]: t("workflow.nodes.start"),
  [BlockEnum.END]: t("workflow.nodes.end"),
  [BlockEnum.ANSWER]: t("workflow.nodes.answer"),
  [BlockEnum.LLM]: t("workflow.nodes.llm"),
  [BlockEnum.CONDITION]: t("workflow.nodes.condition"),
}));

// 可用的节点类型
const availableBlocks = [
  BlockEnum.ANSWER,
  BlockEnum.LLM,
  BlockEnum.CONDITION,
  BlockEnum.END,
];

// VueFlow节点和边
const flowState = reactive<{
  nodes: Node[]
  edges: Edge[]
}>({
  nodes: [],
  edges: []
});

// 使用VueFlow composable
const {
  findNode,
  getNode,
  addNodes,
  addEdges,
  zoomIn,
  zoomOut,
  setViewport,
  updateNode,
} = useVueFlow({
  id: 'workflow',
  nodes: flowState.nodes,
  edges: flowState.edges,
});

// 当前页面状态
const loading = ref(false);
const selectedNode = ref<Node | null>(null);
const canUndo = ref(false);
const canRedo = ref(false);
const history = ref<Array<{ nodes: Node[]; edges: Edge[] }>>([]);
const historyIndex = ref(-1);

// 搜索相关
const searchQuery = ref("");

// 右键菜单相关状态
const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  targetPosition: { x: 0, y: 0 }
});

// 右键菜单项
const contextMenuItems = [
  { label: "添加节点", icon: Plus, action: "addNode" },
  { label: "添加注释", icon: StickyNote, action: "addComment" },
  { label: "运行", icon: Play, action: "run" },
  { label: "粘贴到这里", icon: Clipboard, action: "paste" },
  { label: "导出DSL", icon: FileDown, action: "exportDsl" },
  { label: "导入DSL", icon: FileUp, action: "importDsl" }
];

// 导入DSL对话框
const showImportDialog = ref(false);
const importDslText = ref("");

// 事件处理函数
const onConnect = (params: Connection) => {
  console.log('连接参数:', params);
  const newEdge: Edge = {
    id: `edge-${Date.now()}`,
    source: params.source,
    target: params.target,
    sourceHandle: params.sourceHandle,
    targetHandle: params.targetHandle
  };
  flowState.edges.push(newEdge);
  workflowStore.saveToHistory();
};

const onNodeClick = (event: MouseEvent, node: Node) => {
  console.log('点击节点:', node);
  selectedNode.value = node;
};

const onPaneReady = () => {
  console.log('画布已就绪');
  setViewport({ x: 0, y: 0, zoom: 1.5 });
};

// 获取节点图标组件
const getNodeIcon = (type: BlockEnum) => {
  return nodeIcons[type] || null;
};

// 获取节点标题
const getNodeTitle = (type: BlockEnum): string => {
  return nodeTitles.value[type] || type;
};

// 获取节点配置面板组件
const getNodePanel = (type: BlockEnum) => {
  return panelMap[type] || null;
};

// 初始化工作流钩子
onMounted(async () => {
  loading.value = true;
  try {
    console.log("工作流页面开始加载");

    // 初始化工作流（这里可以替换为从API获取工作流数据）
    console.log("初始化工作流");
    initializeWorkflow();

    // 记录初始状态到历史记录
    workflowStore.saveToHistory();
    console.log("工作流加载完成");
  } catch (error) {
    console.error("加载工作流失败:", error);
  } finally {
    loading.value = false;
  }
});

// 初始化工作流
function initializeWorkflow() {
  try {
    console.log('初始化工作流');

    // 添加开始节点
    const startNode = {
      id: "start-node",
      type: 'start',
      position: { x: 100, y: 100 },
      data: { title: "开始" },
      connectable: true,
      draggable: true,
      selectable: true,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };

    // 添加流转节点
    const answerNode = {
      id: `answer-${uuidv4()}`,
      type: 'answer',
      position: { x: 300, y: 100 },
      data: {
        title: "流转",
        config: { answers: [{ text: "高级精读" }] }
      },
      connectable: true,
      draggable: true,
      selectable: true,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };

    // 添加问题分发节点
    const conditionNode = {
      id: `condition-${uuidv4()}`,
      type: 'condition',
      position: { x: 550, y: 100 },
      data: {
        title: "问题分发",
        config: {
          conditions: [
            { name: "选项1" },
            { name: "选项2" }
          ]
        }
      },
      connectable: true,
      draggable: true,
      selectable: true,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };

    // 添加LLM节点1
    const llmNode1 = {
      id: `llm-${uuidv4()}`,
      type: BlockEnum.LLM,
      position: { x: 800, y: 50 },
      data: {
        title: "LLM - 选项1",
        config: { model: "DeepSeek V3" }
      },
      connectable: true,
      draggable: true,
      selectable: true,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };

    // 添加LLM节点2
    const llmNode2 = {
      id: `llm-${uuidv4()}`,
      type: BlockEnum.LLM,
      position: { x: 800, y: 180 },
      data: {
        title: "LLM - 选项2",
        config: { model: "GPT-4" }
      },
      connectable: true,
      draggable: true,
      selectable: true,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };

    // 设置节点
    flowState.nodes = [startNode, answerNode, conditionNode, llmNode1, llmNode2];

    // 设置连接
    flowState.edges = [
      {
        id: `edge-1-${uuidv4()}`,
        source: startNode.id,
        target: answerNode.id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#94a3b8', strokeWidth: 2 },
        sourceHandle: 'right',
        targetHandle: 'left'
      },
      {
        id: `edge-2-${uuidv4()}`,
        source: answerNode.id,
        target: conditionNode.id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#94a3b8', strokeWidth: 2 },
        sourceHandle: 'right',
        targetHandle: 'left'
      },
      {
        id: `edge-3-${uuidv4()}`,
        source: conditionNode.id,
        target: llmNode1.id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#94a3b8', strokeWidth: 2 },
        sourceHandle: 'right',
        targetHandle: 'left'
      },
      {
        id: `edge-4-${uuidv4()}`,
        source: conditionNode.id,
        target: llmNode2.id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#94a3b8', strokeWidth: 2 },
        sourceHandle: 'source-1',
        targetHandle: 'left'
      }
    ];
  } catch (error) {
    console.error('初始化工作流出错:', error);
  }
}

// 添加新节点
const addNode = (type: BlockEnum) => {
  console.log('添加节点:', type);
  try {
    const newNode = {
      id: `${type}-${uuidv4()}`,
      type,
      position: {
        x: contextMenu.visible ? contextMenu.targetPosition.x : 250,
        y: contextMenu.visible ? contextMenu.targetPosition.y : 200
      },
      data: {
        title: getNodeTitle(type),
        config: getDefaultNodeConfig(type),
      },
      connectable: true,
      draggable: true,
      selectable: true,
    };

    console.log('新节点:', newNode);
    flowState.nodes.push(newNode);
    workflowStore.saveToHistory();
  } catch (error) {
    console.error('添加节点出错:', error);
  }
};

// 获取默认节点配置
const getDefaultNodeConfig = (type: BlockEnum): any => {
  switch (type) {
    case BlockEnum.ANSWER:
      return { answers: [{ text: "添加回复" }] };
    case BlockEnum.CONDITION:
      return { conditions: [{ name: "选项1" }] };
    case BlockEnum.LLM:
      return { model: "DeepSeek V3" };
    default:
      return {};
  }
};

// 关闭节点配置面板
const closeNodePanel = () => {
  selectedNode.value = null;
};

// 更新节点数据
const updateNodeData = (nodeId: string, data: any) => {
  const node = getNode(nodeId);
  if (node) {
    updateNode(nodeId, { data: { ...node.data, ...data } });
    workflowStore.saveToHistory();
  }
};

// 保存当前状态到历史记录
const saveToHistory = () => {
  try {
    console.log('保存历史记录 - 当前nodes和edges:', { nodes: flowState.nodes, edges: flowState.edges });

    // 清除历史记录中当前索引之后的状态（如果有）
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1);
    }

    // 保存当前状态
    const historyItem = {
      nodes: JSON.parse(JSON.stringify(flowState.nodes || [])),
      edges: JSON.parse(JSON.stringify(flowState.edges || [])),
    };
    console.log('添加历史记录项:', historyItem);

    history.value.push(historyItem);
    historyIndex.value = history.value.length - 1;

    // 更新撤销/重做按钮状态
    canUndo.value = historyIndex.value > 0;
    canRedo.value = historyIndex.value < history.value.length - 1;

    console.log('历史记录保存成功, 当前索引:', historyIndex.value);
  } catch (error) {
    console.error('保存历史记录出错:', error);
  }
};

// 从历史记录恢复状态
const restoreFromHistory = () => {
  try {
    console.log('还原历史记录 - 当前索引:', historyIndex.value);
    const state = history.value[historyIndex.value];

    if (state) {
      console.log('还原到状态:', state);

      // 更新节点和边
      flowState.nodes = JSON.parse(JSON.stringify(state.nodes || []));
      flowState.edges = JSON.parse(JSON.stringify(state.edges || []));

      // 更新撤销/重做按钮状态
      canUndo.value = historyIndex.value > 0;
      canRedo.value = historyIndex.value < history.value.length - 1;

      console.log('历史记录还原成功');
    } else {
      console.warn('没有找到对应索引的历史记录');
    }
  } catch (error) {
    console.error('还原历史记录出错:', error);
  }
};

// 撤销操作
const undo = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--;
    restoreFromHistory();
  }
};

// 重做操作
const redo = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++;
    restoreFromHistory();
  }
};

// 缩放相关函数
const zoomInView = () => {
  zoomIn();
};

const zoomOutView = () => {
  zoomOut();
};

// 重置视图
const resetView = () => {
  setViewport({ x: 0, y: 0, zoom: 1 });
};

// 提示工具
const toast = useToast();

// 完成工作流设计
const finishWorkflow = () => {
  toast.success('工作流已保存');
};

// 关闭右键菜单
const closeContextMenu = () => {
  contextMenu.visible = false;
};

// 画布点击事件
const onPaneClick = () => {
  closeContextMenu();
};

// 右键菜单事件
const onContextMenu = (event: MouseEvent) => {
  event.preventDefault();

  // 获取画布中的鼠标位置
  const bounds = (event.target as HTMLElement).closest('.vue-flow')?.getBoundingClientRect();
  if (!bounds) return;

  // 设置右键菜单位置（屏幕坐标）
  contextMenu.x = event.clientX;
  contextMenu.y = event.clientY;

  // 简单估算画布中的位置（默认位置）
  contextMenu.targetPosition = {
    x: 250,
    y: 200
  };

  contextMenu.visible = true;

  // 添加全局点击事件监听器
  setTimeout(() => {
    window.addEventListener('click', closeContextMenu, { once: true });
  }, 0);
};

// 处理右键菜单操作
const handleContextMenuAction = (action: string) => {
  closeContextMenu();

  switch (action) {
    case "addNode":
      // 打开一个简单的选择节点类型的子菜单或对话框
      const randomType = availableBlocks[Math.floor(Math.random() * availableBlocks.length)];
      addNodeAtPosition(randomType, contextMenu.targetPosition);
      break;

    case "addComment":
      // 添加注释节点
      toast.info("注释功能即将推出");
      break;

    case "run":
      // 运行工作流
      toast.info("工作流运行功能即将推出");
      break;

    case "paste":
      // 粘贴到指定位置
      toast.info("粘贴功能即将推出");
      break;

    case "exportDsl":
      // 导出DSL
      exportDsl();
      break;

    case "importDsl":
      // 导入DSL
      showImportDialog.value = true;
      break;
  }
};

// 在指定位置添加节点
const addNodeAtPosition = (type: BlockEnum, position: { x: number, y: number }) => {
  console.log('在位置添加节点:', type, position);
  const newNode = {
    id: `${type}-${Date.now()}`,
    type,
    position,
    data: {
      label: '新节点',
      title: '新节点'
    },
  };
  addNodes([newNode]);
  flowState.nodes.push(newNode);
  console.log('已push节点到flowState.nodes:', newNode);
  console.log('已添加节点:', newNode);

  try {
    const newNode = {
      id: `${type}-${uuidv4()}`,
      type,
      position,
      data: {
        title: getNodeTitle(type),
        description: "",
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    };

    console.log('新节点:', newNode);
    flowState.nodes.push(newNode);
    workflowStore.saveToHistory();
  } catch (error) {
    console.error('添加节点出错:', error);
  }
};

// 导出DSL
const exportDsl = () => {
  try {
    const dsl = {
      nodes: flowState.nodes,
      edges: flowState.edges
    };

    // 转换为JSON字符串
    const dslString = JSON.stringify(dsl, null, 2);

    // 创建下载链接
    const blob = new Blob([dslString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();

    // 清理
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);

    toast.success('DSL导出成功');
  } catch (error) {
    console.error('导出DSL出错:', error);
    toast.error('导出DSL失败');
  }
};

// 导入DSL
const importDsl = () => {
  try {
    if (!importDslText.value.trim()) {
      toast.error('请输入有效的DSL内容');
      return;
    }

    // 解析DSL
    const dsl = JSON.parse(importDslText.value);

    // 验证DSL格式
    if (!dsl.nodes || !Array.isArray(dsl.nodes) ||
        !dsl.edges || !Array.isArray(dsl.edges)) {
      toast.error('无效的DSL格式');
      return;
    }

    // 更新工作流
    flowState.nodes = dsl.nodes;
    flowState.edges = dsl.edges;

    // 保存到历史记录
    workflowStore.saveToHistory();

    // 关闭对话框
    showImportDialog.value = false;
    importDslText.value = "";

    toast.success('DSL导入成功');
  } catch (error) {
    console.error('导入DSL出错:', error);
    toast.error('导入DSL失败，请检查格式');
  }
};

// 删除节点
const deleteNode = (nodeId: string) => {
  try {
    // 删除与该节点相关的边
    const relatedEdges = flowState.edges.filter(
      edge => edge.source === nodeId || edge.target === nodeId
    );

    flowState.edges = flowState.edges.filter(
      edge => edge.source !== nodeId && edge.target !== nodeId
    );

    // 删除节点
    flowState.nodes = flowState.nodes.filter(node => node.id !== nodeId);

    // 如果当前选中的节点被删除，则清空选中状态
    if (selectedNode.value && selectedNode.value.id === nodeId) {
      selectedNode.value = null;
    }

    workflowStore.saveToHistory();
    toast.success('节点已删除');
  } catch (error) {
    console.error('删除节点出错:', error);
    toast.error('删除节点失败');
  }
};

// 复制节点
const duplicateNode = (nodeId: string) => {
  try {
    const nodeToDuplicate = flowState.nodes.find(node => node.id === nodeId);

    if (!nodeToDuplicate) {
      toast.error('未找到要复制的节点');
      return;
    }

    // 创建新的节点ID
    const newNodeId = `${nodeToDuplicate.type}-${uuidv4()}`;

    // 复制节点，并在原节点位置右下方创建
    const newNode = {
      ...JSON.parse(JSON.stringify(nodeToDuplicate)),
      id: newNodeId,
      position: {
        x: nodeToDuplicate.position.x + 50,
        y: nodeToDuplicate.position.y + 50
      }
    };

    flowState.nodes.push(newNode);
    workflowStore.saveToHistory();
    toast.success('节点已复制');
  } catch (error) {
    console.error('复制节点出错:', error);
    toast.error('复制节点失败');
  }
};

export {
  BlockEnum,
  flowState,
  loading,
  searchQuery,
  selectedNode,
  contextMenu,
  contextMenuItems,
  showImportDialog,
  importDslText,
  onConnect,
  onNodeClick,
  onPaneReady,
  getNodeIcon,
  getNodeTitle,
  getNodePanel,
  initializeWorkflow,
  addNode,
  getDefaultNodeConfig,
  closeNodePanel,
  updateNodeData,
  undo,
  redo,
  zoomInView,
  zoomOutView,
  resetView,
  finishWorkflow,
  closeContextMenu,
  onPaneClick,
  onContextMenu,
  handleContextMenuAction,
  addNodeAtPosition,
  exportDsl,
  importDsl,
  deleteNode,
  duplicateNode,
  canUndo,
  canRedo,
  availableBlocks
};
