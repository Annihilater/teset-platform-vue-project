import { Position } from "@vue-flow/core";
import useNodeFactory from "@/components/workflow/nodes/useNodeFactory";

interface StartNodeProps {
  id: string;
  data: Record<string, any>;
  selected: boolean;
}

export function useStartNodeLogic(props: StartNodeProps) {
  // 使用节点工厂函数 - 获取业务逻辑和UI事件处理方法
  const { handleNodeClick, handleDeleteClick } = useNodeFactory(props.id);

  // 这里可以添加起始节点特有的业务逻辑
  const getInitialVariables = () => {
    return props.data?.variables || [];
  };

  return {
    handleNodeClick,
    handleDeleteClick,
    getInitialVariables
  };
} 