import { Position } from "@vue-flow/core";
import useNodeFactory from "@/components/workflow/nodes/useNodeFactory";

interface AgentNodeProps {
  id: string;
  data: Record<string, any>;
  selected: boolean;
}

export function useAgentNodeLogic(props: AgentNodeProps) {
  // 使用节点工厂函数 - 获取业务逻辑和UI事件处理方法
  const { handleNodeClick, handleDeleteClick } = useNodeFactory(props.id);

  // 这里可以添加Agent节点特有的业务逻辑
  const getAgentType = () => {
    return props.data?.config?.agentType || "通用Agent";
  };

  return {
    handleNodeClick,
    handleDeleteClick,
    getAgentType
  };
} 