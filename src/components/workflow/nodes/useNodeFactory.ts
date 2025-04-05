import { ref } from 'vue';
import useWorkflowStore from '@/stores/workflowStore';

/**
 * 节点工厂函数，提供通用节点逻辑和业务操作
 * @param nodeId 节点ID
 * @returns 节点通用方法
 */
export function useNodeFactory(nodeId: string) {
  const workflowStore = useWorkflowStore();
  
  /**
   * 选择节点
   * 业务逻辑: 在store中更新节点选中状态，可能触发侧边栏等UI更新
   */
  const selectNode = () => {
    console.log("选中节点:", nodeId);
    
    // 更新所有节点的选中状态
    if (workflowStore.nodes) {
      workflowStore.nodes.forEach((node: any) => {
        if (node.id === nodeId) {
          node.selected = true;
          
          // 发送节点选择事件 - 用于通知面板更新
          try {
            const event = new CustomEvent("node-selected", {
              detail: { nodeId: nodeId }
            });
            window.dispatchEvent(event);
          } catch (error) {
            console.error("无法发送节点选择事件", error);
          }
        } else {
          node.selected = false;
        }
      });
    }
  };
  
  /**
   * 处理节点UI点击事件，调用业务选择逻辑
   * 衔接UI和业务逻辑的桥梁函数
   */
  const handleNodeClick = () => {
    selectNode();
  };
  
  /**
   * 删除节点
   * 业务逻辑: 从store中删除节点和相关连接
   */
  const deleteNode = (event?: MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    workflowStore.deleteNode(nodeId);
  };
  
  /**
   * 处理删除按钮点击事件，调用业务删除逻辑
   * 衔接UI和业务逻辑的桥梁函数
   */
  const handleDeleteClick = (event: MouseEvent) => {
    deleteNode(event);
  };
  
  /**
   * 复制节点
   * 业务逻辑: 在store中创建节点副本
   */
  const duplicateNode = (event?: MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    if (workflowStore.duplicateNode) {
      workflowStore.duplicateNode(nodeId);
    }
  };
  
  /**
   * 处理复制按钮点击事件，调用业务复制逻辑
   * 衔接UI和业务逻辑的桥梁函数
   */
  const handleDuplicateClick = (event: MouseEvent) => {
    duplicateNode(event);
  };
  
  /**
   * 更新节点数据
   * 业务逻辑: 在store中更新节点配置
   */
  const updateNodeData = (data: any) => {
    workflowStore.updateNodeData(nodeId, data);
  };
  
  /**
   * 获取节点数据
   * 业务逻辑: 从store获取完整节点数据
   */
  const getNodeData = () => {
    return workflowStore.nodes.find((node: any) => node.id === nodeId);
  };
  
  return {
    // 核心业务逻辑方法
    selectNode,
    deleteNode,
    duplicateNode,
    updateNodeData,
    getNodeData,
    
    // UI事件处理方法 - 桥接UI组件和业务逻辑
    handleNodeClick,
    handleDeleteClick,
    handleDuplicateClick
  };
}

export default useNodeFactory; 