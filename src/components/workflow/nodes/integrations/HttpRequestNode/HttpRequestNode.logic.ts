import { computed } from "vue";
import useNodeFactory from "@/components/workflow/nodes/useNodeFactory";

export interface HttpRequestNodeProps {
  id: string;
  type: string;
  data: {
    title: string;
    config?: {
      method?: string;
      url?: string;
      headers?: Record<string, string>;
      body?: string;
    };
    [key: string]: any;
  };
  selected: boolean;
}

export function useHttpRequestNodeLogic(props: HttpRequestNodeProps) {
  // 使用节点工厂获取通用事件处理方法
  const { handleNodeClick, handleDeleteClick, updateNodeData } = useNodeFactory(props.id);

  // 计算请求方法
  const method = computed(() => props.data.config?.method || "GET");
  
  // 计算请求URL
  const url = computed(() => props.data.config?.url || "https://api.example.com");
  
  // 获取请求头信息
  const headers = computed(() => props.data.config?.headers || {});
  
  // 获取请求体
  const body = computed(() => props.data.config?.body || "");
  
  // 更新请求方法
  const updateMethod = (newMethod: string) => {
    updateNodeData({
      config: {
        ...props.data.config,
        method: newMethod
      }
    });
  };
  
  // 更新URL
  const updateUrl = (newUrl: string) => {
    updateNodeData({
      config: {
        ...props.data.config,
        url: newUrl
      }
    });
  };
  
  // 更新请求头
  const updateHeaders = (newHeaders: Record<string, string>) => {
    updateNodeData({
      config: {
        ...props.data.config,
        headers: newHeaders
      }
    });
  };
  
  // 更新请求体
  const updateBody = (newBody: string) => {
    updateNodeData({
      config: {
        ...props.data.config,
        body: newBody
      }
    });
  };

  return {
    handleNodeClick,
    handleDeleteClick,
    method,
    url,
    headers,
    body,
    updateMethod,
    updateUrl,
    updateHeaders,
    updateBody
  };
} 