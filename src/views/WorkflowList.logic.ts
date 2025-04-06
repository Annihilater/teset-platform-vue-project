import { format } from "date-fns";
import type { Workflow } from "@/mock/types/workflow";
import workflowService from "@/mock/services/workflow";

export const fetchWorkflows = async (): Promise<Workflow[]> => {
  try {
    return await workflowService.getWorkflows();
  } catch (error) {
    console.error("获取工作流列表失败:", error);
    throw error;
  }
};

export const deleteWorkflow = async (id: string): Promise<boolean> => {
  try {
    return await workflowService.deleteWorkflow(id);
  } catch (error) {
    console.error("删除工作流失败:", error);
    throw error;
  }
};

export const formatDate = (dateString: string) => {
  return format(new Date(dateString), "yyyy-MM-dd HH:mm:ss");
};

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("复制失败:", error);
    return false;
  }
};

export const showCopyStatus = (text: string, success: boolean) => {
  return {
    text,
    success,
    timestamp: Date.now()
  };
};

export const handleSelectAll = (
  event: Event,
  workflows: Workflow[],
  selectedWorkflows: any
) => {
  const checked = (event.target as HTMLInputElement).checked;
  selectedWorkflows.value = checked ? workflows.map((w) => w.id) : [];
};

export const handleBatchAction = async (
  action: "delete" | "export",
  selectedWorkflows: string[],
  workflows: Workflow[]
): Promise<Workflow[]> => {
  try {
    if (action === "delete") {
      const success = await Promise.all(
        selectedWorkflows.map((id) => workflowService.deleteWorkflow(id))
      );
      if (success.every(Boolean)) {
        return workflows.filter((w) => !selectedWorkflows.includes(w.id));
      }
    }
    return workflows;
  } catch (error) {
    console.error(`批量${action}失败:`, error);
    throw error;
  }
};