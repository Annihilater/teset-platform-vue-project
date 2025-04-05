import { Position } from "@vue-flow/core";
import useNodeFactory from "@/components/workflow/nodes/useNodeFactory";

interface EndNodeProps {
  id: string;
  data: Record<string, any>;
  selected: boolean;
}

export function useEndNodeLogic(props: EndNodeProps) {
  // 使用节点工厂函数 - 获取业务逻辑和UI事件处理方法
  const { handleNodeClick, handleDeleteClick } = useNodeFactory(props.id);

  // 结束节点可能有的特有逻辑
  const getResponseType = () => {
    return props.data?.config?.responseType || "default";
  };

  return {
    handleNodeClick,
    handleDeleteClick,
    getResponseType
  };
} 