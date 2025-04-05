import { Position } from "@vue-flow/core";

// 节点基础属性
export interface NodeData {
  id: string;
  title?: string;
  label?: string;
  description?: string;
  config?: Record<string, any>;
  [key: string]: any;
}

// 节点属性接口
export interface NodeProps {
  id: string;
  data: NodeData;
  selected: boolean;
}

// 连接点位置类型
export type HandlePosition = 'left' | 'right' | 'top' | 'bottom';

// 连接点类型
export type HandleType = 'source' | 'target';

// 连接点属性
export interface HandleProps {
  handleId: string;
  type: HandleType;
  position: HandlePosition;
  className?: string;
}

// 节点类别枚举
export enum NodeCategoryEnum {
  CONTROL_FLOW = 'control_flow',
  AI_MODELS = 'ai_models',
  DATA_PROCESSING = 'data_processing',
  TOOLS = 'tools',
  INTEGRATIONS = 'integrations'
}

// 节点类型枚举
export enum NodeTypeEnum {
  // 控制流节点
  START = 'start',
  END = 'end',
  CONDITION = 'condition',
  LOOP = 'loop',
  
  // AI模型节点
  LLM = 'llm',
  AGENT = 'agent',
  
  // 数据处理节点
  ANSWER = 'answer',
  
  // 工具节点
  CODE_EXECUTION = 'code_execution',
  
  // 集成节点
  KNOWLEDGE_RETRIEVAL = 'knowledge_retrieval',
  HTTP_REQUEST = 'http_request'
}
