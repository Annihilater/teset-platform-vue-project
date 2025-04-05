import { Position } from "@vue-flow/core";
import useNodeFactory from "@/components/workflow/nodes/useNodeFactory";

interface LLMNodeProps {
  id: string;
  data: Record<string, any>;
  selected: boolean;
}

export function useLLMNodeLogic(props: LLMNodeProps) {
  // 使用节点工厂函数 - 获取业务逻辑和UI事件处理方法
  const { handleNodeClick, handleDeleteClick } = useNodeFactory(props.id);

  // LLM节点特有的逻辑
  const getPrompt = () => {
    return props.data?.prompt || "未设置提示词";
  };

  // 其他可能的LLM相关方法
  const getModel = () => {
    return props.data?.config?.model || "默认模型";
  };

  const getTemperature = () => {
    return props.data?.config?.temperature || 0.7;
  };

  return {
    handleNodeClick,
    handleDeleteClick,
    getPrompt,
    getModel,
    getTemperature
  };
} 