// 导出基础组件
import BaseNode from '@/components/workflow/nodes/BaseNode.vue';
import NodeHandle from '@/components/workflow/nodes/NodeHandle.vue';
import useNodeFactory from '@/components/workflow/nodes/useNodeFactory';

// 导入各类节点
import * as ControlFlowNodes from '@/components/workflow/nodes/control_flow';
import * as AIModelNodes from '@/components/workflow/nodes/ai_models';
import * as DataProcessingNodes from '@/components/workflow/nodes/data_processing';
import * as ToolNodes from '@/components/workflow/nodes/tools';
import * as IntegrationNodes from '@/components/workflow/nodes/integrations';

// 导出基础组件
export {
  BaseNode,
  NodeHandle,
  useNodeFactory
};

// 导出节点类型
export {
  ControlFlowNodes,
  AIModelNodes,
  DataProcessingNodes,
  ToolNodes,
  IntegrationNodes
};

// 导出所有节点类型的平铺集合
export default {
  // 基础组件
  BaseNode,
  NodeHandle,
  useNodeFactory,
  
  // 控制流节点
  ...ControlFlowNodes.default,
  
  // AI模型节点
  ...AIModelNodes.default,
  
  // 数据处理节点
  ...DataProcessingNodes.default,
  
  // 工具节点
  ...ToolNodes.default,
  
  // 集成节点
  ...IntegrationNodes.default
};
