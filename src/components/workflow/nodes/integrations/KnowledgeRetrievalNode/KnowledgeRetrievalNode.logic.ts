import { computed } from "vue";
import useNodeFactory from "@/components/workflow/nodes/useNodeFactory";

export interface KnowledgeRetrievalNodeProps {
  id: string;
  type: string;
  data: {
    title: string;
    config?: {
      database?: string;
      topK?: number;
      threshold?: number;
    };
    [key: string]: any;
  };
  selected: boolean;
}

export function useKnowledgeRetrievalNodeLogic(props: KnowledgeRetrievalNodeProps) {
  // 使用节点工厂获取通用事件处理方法
  const { handleNodeClick, handleDeleteClick, updateNodeData } = useNodeFactory(props.id);

  // 计算知识库名称
  const database = computed(() => props.data.config?.database || "默认知识库");
  
  // 计算检索结果数量
  const topK = computed(() => props.data.config?.topK || 3);
  
  // 计算相似度阈值
  const threshold = computed(() => props.data.config?.threshold || 0.7);
  
  // 更新知识库
  const updateDatabase = (newDatabase: string) => {
    updateNodeData({
      config: {
        ...props.data.config,
        database: newDatabase
      }
    });
  };
  
  // 更新检索结果数量
  const updateTopK = (newTopK: number) => {
    updateNodeData({
      config: {
        ...props.data.config,
        topK: newTopK
      }
    });
  };
  
  // 更新相似度阈值
  const updateThreshold = (newThreshold: number) => {
    updateNodeData({
      config: {
        ...props.data.config,
        threshold: newThreshold
      }
    });
  };

  return {
    handleNodeClick,
    handleDeleteClick,
    database,
    topK,
    threshold,
    updateDatabase,
    updateTopK,
    updateThreshold
  };
} 