import { computed } from "vue";
import useNodeFactory from "@/components/workflow/nodes/useNodeFactory";

export interface CodeExecutionNodeProps {
  id: string;
  type: string;
  data: {
    title: string;
    config?: {
      language?: string;
      code?: string;
    };
    [key: string]: any;
  };
  selected: boolean;
}

export function useCodeExecutionNodeLogic(props: CodeExecutionNodeProps) {
  // 使用节点工厂函数 - 获取业务逻辑和UI事件处理方法
  const { handleNodeClick, handleDeleteClick, updateNodeData } = useNodeFactory(props.id);

  // 计算当前使用的代码语言
  const language = computed(() => props.data.config?.language || "Python");
  
  // 获取代码内容
  const code = computed(() => props.data.config?.code || "");
  
  // 更新代码内容
  const updateCode = (newCode: string) => {
    updateNodeData({
      config: {
        ...props.data.config,
        code: newCode
      }
    });
  };
  
  // 更新代码语言
  const updateLanguage = (newLanguage: string) => {
    updateNodeData({
      config: {
        ...props.data.config,
        language: newLanguage
      }
    });
  };

  return {
    handleNodeClick,
    handleDeleteClick,
    language,
    code,
    updateCode,
    updateLanguage
  };
} 