import { ref, watch } from "vue";
import useNodeFactory from "@/components/workflow/nodes/useNodeFactory";

export interface AnswerNodeProps {
  id: string;
  type: string;
  data: {
    title: string;
    config?: {
      answers?: Array<{ text: string }>;
    };
    [key: string]: any;
  };
  selected: boolean;
}

export function useAnswerNodeLogic(props: AnswerNodeProps) {
  // 使用节点工厂函数 - 获取业务逻辑和UI事件处理方法
  const {
    handleNodeClick,
    handleDeleteClick,
    updateNodeData: factoryUpdateData,
  } = useNodeFactory(props.id);

  // 获取回复数据
  const answers = ref<Array<{ text: string }>>(
    props.data.config?.answers || [{ text: "" }]
  );

  // 监听外部数据变化
  watch(
    () => props.data.config?.answers,
    (newAnswers) => {
      if (newAnswers && JSON.stringify(newAnswers) !== JSON.stringify(answers.value)) {
        answers.value = JSON.parse(JSON.stringify(newAnswers));
      }
    }
  );

  // 更新节点数据
  const updateNodeData = () => {
    factoryUpdateData({
      config: { answers: answers.value },
    });
  };

  // 添加新回复
  const addAnswer = () => {
    if (answers.value.length < 3) {
      answers.value.push({ text: "" });
      updateNodeData();
    }
  };

  // 根据索引计算输出连接点位置
  const getSourceHandlePosition = (index: number) => {
    const answerCount = answers.value.length;
    if (answerCount === 1) return 50;

    const segmentSize = 100 / (answerCount + 1);
    return (index + 1) * segmentSize;
  };

  return {
    handleNodeClick,
    handleDeleteClick,
    updateNodeData,
    addAnswer,
    answers,
    getSourceHandlePosition
  };
} 