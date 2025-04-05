import { Position } from "@vue-flow/core";
import { computed } from "vue";
import useNodeFactory from "@/components/workflow/nodes/useNodeFactory";

export interface LoopNodeProps {
  id: string;
  type: string;
  data: {
    title: string;
    config?: {
      condition?: string;
    };
    [key: string]: any;
  };
  selected: boolean;
}

export function useLoopNodeLogic(props: LoopNodeProps) {
  // 使用节点工厂获取通用事件处理方法
  const { handleNodeClick, handleDeleteClick } = useNodeFactory(props.id);

  // 计算循环条件
  const loopCondition = computed(() => {
    return props.data.config?.condition || "默认条件";
  });

  return {
    handleNodeClick,
    handleDeleteClick,
    loopCondition
  };
} 