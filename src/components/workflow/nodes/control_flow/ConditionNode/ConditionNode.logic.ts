import { computed } from "vue";
import useNodeFactory from "@/components/workflow/nodes/useNodeFactory";
import useWorkflowStore from "@/stores/workflowStore";

interface ConditionNodeProps {
  id: string;
  type: string;
  data: {
    title: string;
    config?: {
      conditions?: Array<{ name: string }>;
    };
    [key: string]: any;
  };
  selected: boolean;
}

export function useConditionNodeLogic(props: ConditionNodeProps) {
  // 使用节点工厂函数 - 获取业务逻辑和UI事件处理方法
  const { handleNodeClick, handleDeleteClick } = useNodeFactory(props.id);

  const workflowStore = useWorkflowStore();

  // 获取条件数据
  const conditions = computed(() => {
    return props.data.config?.conditions || [{ name: "选项1" }];
  });

  // 根据索引计算输出连接点位置
  const getSourceHandlePosition = (index: number) => {
    const conditionCount = conditions.value.length;
    if (conditionCount === 1) return 50;

    const segmentSize = 100 / (conditionCount + 1);
    return (index + 1) * segmentSize;
  };

  return {
    handleNodeClick,
    handleDeleteClick,
    conditions,
    getSourceHandlePosition
  };
} 