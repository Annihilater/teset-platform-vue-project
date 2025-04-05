import { defineStore } from 'pinia';
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import type { Edge, Node } from '@vue-flow/core';

const useStore = defineStore('vue-flow-pinia', () => {
  const nodes = ref<Node[]>([
    {
      id: '1',
      type: 'input',
      label: '开始',
      position: { x: 250, y: 5 },
      class: 'light',
      data: {
        title: '开始',
      },
    },
    {
      id: '2',
      label: 'LLM2',
      position: { x: 100, y: 100 },
      class: 'light',
      data: {
        title: 'LLM2',
      },
    },
    {
      id: '3',
      label: '条件',
      position: { x: 400, y: 100 },
      class: 'light',
      data: {
        title: '条件',
      },
    },
    {
      id: '4',
      label: '结束',
      position: { x: 400, y: 200 },
      class: 'light',
      data: {
        title: '结束',
      },
    },
  ]);

  const edges = ref<Edge[]>([
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },
    { id: 'e3-4', source: '3', target: '4' },
  ]);

  const reset = () => {
    edges.value = [];
    nodes.value = [];
  };

  const log = () => {
    console.log('nodes', nodes.value, 'edges', edges.value);
  };

  const toggleClass = () => {
    nodes.value = nodes.value.map((node) => {
      return {
        ...node,
        class: node.class === 'dark' ? 'light' : 'dark',
      };
    });
  };

  const updatePositions = () => {
    nodes.value = nodes.value.map((node) => {
      return {
        ...node,
        position: {
          x: Math.random() * 400,
          y: Math.random() * 400,
        },
      };
    });
  };

  return {
    nodes,
    edges,
    reset,
    log,
    toggleClass,
    updatePositions,
  };
});



// 块类型枚举
export enum BlockEnum {
  START = "start-node",
  END = "end-node",
  ANSWER = "answer-node",
  LLM = "llm-node",
  CONDITION = "condition-node",
  KNOWLEDGE_RETRIEVAL = "knowledge-retrieval-node",
  AGENT = "agent-node",
  QUESTION_CLASSIFIER = "question-classifier-node",
  CODE_EXECUTION = "code-execution-node",
  TEMPLATE_TRANSFORM = "template-transform-node",
  LOOP = "loop-node",
  VARIABLE_AGGREGATOR = "variable-aggregator-node",
  DOCUMENT_EXTRACTOR = "document-extractor-node",
  VARIABLE_ASSIGNER = "variable-assigner-node",
  PARAMETER_EXTRACTOR = "parameter-extractor-node",
  HTTP_REQUEST = "http-request-node",
  LIST_OPERATOR = "list-operator-node",
  ITERATION = "iteration-node"
}

// 节点分类枚举
export enum NodeCategoryEnum {
  CONTROL_FLOW = "control_flow",
  AI_MODELS = "ai_models",
  DATA_PROCESSING = "data_processing",
  TOOLS = "tools",
  INTEGRATIONS = "integrations"
}

// 节点类型到分类的映射
export const NODE_TYPE_CATEGORY_MAP: Record<BlockEnum, NodeCategoryEnum> = {
  [BlockEnum.START]: NodeCategoryEnum.CONTROL_FLOW,
  [BlockEnum.END]: NodeCategoryEnum.CONTROL_FLOW,
  [BlockEnum.CONDITION]: NodeCategoryEnum.CONTROL_FLOW,
  [BlockEnum.LOOP]: NodeCategoryEnum.CONTROL_FLOW,
  [BlockEnum.ITERATION]: NodeCategoryEnum.CONTROL_FLOW,
  
  [BlockEnum.LLM]: NodeCategoryEnum.AI_MODELS,
  [BlockEnum.AGENT]: NodeCategoryEnum.AI_MODELS,
  [BlockEnum.QUESTION_CLASSIFIER]: NodeCategoryEnum.AI_MODELS,
  
  [BlockEnum.ANSWER]: NodeCategoryEnum.DATA_PROCESSING,
  [BlockEnum.TEMPLATE_TRANSFORM]: NodeCategoryEnum.DATA_PROCESSING,
  [BlockEnum.VARIABLE_AGGREGATOR]: NodeCategoryEnum.DATA_PROCESSING,
  [BlockEnum.DOCUMENT_EXTRACTOR]: NodeCategoryEnum.DATA_PROCESSING,
  [BlockEnum.VARIABLE_ASSIGNER]: NodeCategoryEnum.DATA_PROCESSING,
  [BlockEnum.PARAMETER_EXTRACTOR]: NodeCategoryEnum.DATA_PROCESSING,
  [BlockEnum.LIST_OPERATOR]: NodeCategoryEnum.DATA_PROCESSING,
  
  [BlockEnum.CODE_EXECUTION]: NodeCategoryEnum.TOOLS,
  
  [BlockEnum.KNOWLEDGE_RETRIEVAL]: NodeCategoryEnum.INTEGRATIONS,
  [BlockEnum.HTTP_REQUEST]: NodeCategoryEnum.INTEGRATIONS,
};

/**
 * 根据分类获取节点类型列表
 * @param category 节点分类
 * @returns 该分类下的节点类型列表
 */
export function getNodeTypesByCategory(category: NodeCategoryEnum): BlockEnum[] {
  return Object.entries(NODE_TYPE_CATEGORY_MAP)
    .filter(([_, cat]) => cat === category)
    .map(([type, _]) => type as BlockEnum);
}

// 分类显示名称
export const CATEGORY_DISPLAY_NAMES: Record<NodeCategoryEnum, string> = {
  [NodeCategoryEnum.CONTROL_FLOW]: "控制流",
  [NodeCategoryEnum.AI_MODELS]: "AI模型",
  [NodeCategoryEnum.DATA_PROCESSING]: "数据处理",
  [NodeCategoryEnum.TOOLS]: "工具",
  [NodeCategoryEnum.INTEGRATIONS]: "集成",
};

const useWorkflowStore = defineStore('workflow', () => {
  // 节点数据
  const nodes = ref<Node[]>([]);
  
  // 连接线数据
  const edges = ref<Edge[]>([]);
  
  // 历史记录
  const history = ref<Array<{ nodes: Node[]; edges: Edge[] }>>([]);
  const historyIndex = ref(-1);
  
  // 撤销/重做状态
  const canUndo = ref(false);
  const canRedo = ref(false);
  
  // 初始化工作流
  const initializeWorkflow = () => {
    try {      
      // 添加开始节点
      const startNode = {
        id: "start-node",
        type: BlockEnum.START,
        position: { x: 100, y: 100 },
        data: { title: "开始" },
        connectable: true,
        draggable: true,
        selectable: true,
      };
      
      // 添加流转节点
      const answerNode = {
        id: `answer-${uuidv4()}`,
        type: BlockEnum.ANSWER,
        position: { x: 300, y: 100 },
        data: { 
          title: "流转",
          config: { answers: [{ text: "高级精读" }] }
        },
        connectable: true,
        draggable: true,
        selectable: true,
      };
      
      // 添加问题分发节点
      const conditionNode = {
        id: `condition-${uuidv4()}`,
        type: BlockEnum.CONDITION,
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
      };
      
      // 设置节点
      nodes.value = [startNode, answerNode, conditionNode, llmNode1, llmNode2];
      
      // 设置连接
      edges.value = [
        {
          id: `edge-1-${uuidv4()}`,
          source: startNode.id,
          target: answerNode.id,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#94a3b8', strokeWidth: 2 },
          sourceHandle: 'source',
          targetHandle: 'target'
        },
        {
          id: `edge-2-${uuidv4()}`,
          source: answerNode.id,
          target: conditionNode.id,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#94a3b8', strokeWidth: 2 },
          sourceHandle: 'source-0',
          targetHandle: 'target'
        },
        {
          id: `edge-3-${uuidv4()}`,
          source: conditionNode.id,
          target: llmNode1.id,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#94a3b8', strokeWidth: 2 },
          sourceHandle: 'source-0', // 连接到条件节点的第一个选项
          targetHandle: 'target'
        },
        {
          id: `edge-4-${uuidv4()}`,
          source: conditionNode.id,
          target: llmNode2.id,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#94a3b8', strokeWidth: 2 },
          sourceHandle: 'source-1', // 连接到条件节点的第二个选项
          targetHandle: 'target'
        }
      ];
      
      // 保存初始状态到历史记录
      saveToHistory();
    } catch (error) {
      console.error('初始化工作流出错:', error);
    }
  };
  
  // 添加新节点
  const addNode = (type: BlockEnum, position?: { x: number, y: number }) => {
    console.log('添加节点:', type);
    try {
      const newNode = {
        id: `${type}-${uuidv4()}`,
        type,
        position: position || { x: 250, y: 200 },
        data: {
          title: getNodeTitle(type),
          config: getDefaultNodeConfig(type),
        },
        connectable: true,
        draggable: true,
        selectable: true,
      };

      nodes.value.push(newNode);
      saveToHistory();
      return newNode;
    } catch (error) {
      console.error('添加节点出错:', error);
      return null;
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
      case BlockEnum.KNOWLEDGE_RETRIEVAL:
        return { 
          database: "默认知识库",
          similarity_threshold: 0.7,
          top_k: 3
        };
      case BlockEnum.AGENT:
        return { model: "DeepSeek V3", max_steps: 5 };
      case BlockEnum.QUESTION_CLASSIFIER:
        return { classes: [{ name: "类别1" }] };
      case BlockEnum.CODE_EXECUTION:
        return { language: "python", code: "# 在此编写代码\n" };
      case BlockEnum.TEMPLATE_TRANSFORM:
        return { template: "{{input}}" };
      case BlockEnum.VARIABLE_AGGREGATOR:
        return { variables: [] };
      case BlockEnum.DOCUMENT_EXTRACTOR:
        return { fields: [{ name: "字段1", path: "" }] };
      case BlockEnum.VARIABLE_ASSIGNER:
        return { variables: [{ name: "变量1", value: "" }] };
      case BlockEnum.PARAMETER_EXTRACTOR:
        return { parameters: [{ name: "参数1", path: "" }] };
      case BlockEnum.HTTP_REQUEST:
        return { method: "GET", url: "https://", headers: {}, body: "" };
      case BlockEnum.LIST_OPERATOR:
        return { operation: "map", input: "", output: "" };
      case BlockEnum.LOOP:
        return { condition: "", max_iterations: 10 };
      case BlockEnum.ITERATION:
        return { items: "", item_variable: "item" };
      default:
        return {};
    }
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
        return "条件分支";
      case BlockEnum.KNOWLEDGE_RETRIEVAL:
        return "知识检索";
      case BlockEnum.AGENT:
        return "Agent";
      case BlockEnum.QUESTION_CLASSIFIER:
        return "问题分类器";
      case BlockEnum.CODE_EXECUTION:
        return "代码执行";
      case BlockEnum.TEMPLATE_TRANSFORM:
        return "模板转换";
      case BlockEnum.VARIABLE_AGGREGATOR:
        return "变量聚合器";
      case BlockEnum.DOCUMENT_EXTRACTOR:
        return "文档提取器";
      case BlockEnum.VARIABLE_ASSIGNER:
        return "变量赋值";
      case BlockEnum.PARAMETER_EXTRACTOR:
        return "参数提取器";
      case BlockEnum.HTTP_REQUEST:
        return "HTTP请求";
      case BlockEnum.LIST_OPERATOR:
        return "列表操作";
      case BlockEnum.LOOP:
        return "循环";
      case BlockEnum.ITERATION:
        return "迭代";
      default:
        return type;
    }
  };
  
  // 更新节点数据
  const updateNodeData = (nodeId: string, data: any) => {
    const nodeIndex = nodes.value.findIndex(node => node.id === nodeId);
    if (nodeIndex !== -1) {
      nodes.value[nodeIndex] = {
        ...nodes.value[nodeIndex],
        data: { ...nodes.value[nodeIndex].data, ...data }
      };
      saveToHistory();
    }
  };
  
  // 删除节点
  const deleteNode = (nodeId: string) => {
    try {
      // 删除与该节点相关的边
      edges.value = edges.value.filter(
        edge => edge.source !== nodeId && edge.target !== nodeId
      );
      
      // 删除节点
      nodes.value = nodes.value.filter(node => node.id !== nodeId);
      
      saveToHistory();
    } catch (error) {
      console.error('删除节点出错:', error);
    }
  };
  
  // 复制节点
  const duplicateNode = (nodeId: string) => {
    try {
      const nodeToDuplicate = nodes.value.find(node => node.id === nodeId);
      
      if (!nodeToDuplicate) {
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
      
      nodes.value.push(newNode);
      saveToHistory();
    } catch (error) {
      console.error('复制节点出错:', error);
    }
  };
  
  // 保存当前状态到历史记录
  const saveToHistory = () => {
    try {      
      // 清除历史记录中当前索引之后的状态（如果有）
      if (historyIndex.value < history.value.length - 1) {
        history.value = history.value.slice(0, historyIndex.value + 1);
      }

      // 保存当前状态
      const historyItem = {
        nodes: JSON.parse(JSON.stringify(nodes.value || [])),
        edges: JSON.parse(JSON.stringify(edges.value || [])),
      };
      
      history.value.push(historyItem);
      historyIndex.value = history.value.length - 1;

      // 更新撤销/重做按钮状态
      canUndo.value = historyIndex.value > 0;
      canRedo.value = historyIndex.value < history.value.length - 1;
    } catch (error) {
      console.error('保存历史记录出错:', error);
    }
  };
  
  // 从历史记录恢复状态
  const restoreFromHistory = () => {
    try {
      const state = history.value[historyIndex.value];
      
      if (state) {
        // 更新节点和边
        nodes.value = JSON.parse(JSON.stringify(state.nodes || []));
        edges.value = JSON.parse(JSON.stringify(state.edges || []));

        // 更新撤销/重做按钮状态
        canUndo.value = historyIndex.value > 0;
        canRedo.value = historyIndex.value < history.value.length - 1;
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
  
  // 重置工作流
  const resetWorkflow = () => {
    nodes.value = [];
    edges.value = [];
    history.value = [];
    historyIndex.value = -1;
    canUndo.value = false;
    canRedo.value = false;
    initializeWorkflow();
  };
  
  // 导出DSL
  const exportDsl = () => {
    return {
      nodes: nodes.value,
      edges: edges.value
    };
  };
  
  // 导入DSL
  const importDSL = (dsl: { nodes: Node[]; edges: Edge[] }) => {
    try {
      // 更新节点和边
      nodes.value = dsl.nodes;
      edges.value = dsl.edges;
      
      // 保存历史记录
      saveToHistory();
      
      return true;
    } catch (error) {
      console.error('导入DSL失败:', error);
      return false;
    }
  };
  
  // 随机更新节点位置
  const updatePositions = () => {
    nodes.value = nodes.value.map(node => {
      return {
        ...node,
        position: {
          x: Math.random() * 800 + 50,
          y: Math.random() * 400 + 50,
        },
      };
    });
    saveToHistory();
  };

  return {
    nodes,
    edges,
    history,
    historyIndex,
    canUndo,
    canRedo,
    initializeWorkflow,
    addNode,
    updateNodeData,
    deleteNode,
    duplicateNode,
    saveToHistory,
    undo,
    redo,
    resetWorkflow,
    exportDsl,
    importDSL,
    updatePositions
  };
});

export default useWorkflowStore;
export { useWorkflowStore }; 
