import { format } from "date-fns";
import type { TestExecution } from "@/mock/types/execution";
import { ExecutionService } from "@/mock/services/execution";

export const formatDate = (dateString: string) => {
  return format(new Date(dateString), "yyyy-MM-dd HH:mm");
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "running":
      return "RefreshCw";
    case "completed":
      return "CheckCircle2";
    case "failed":
      return "XCircle";
    default:
      return "AlertCircle";
  }
};

export const getStatusForBadge = (
  status: string
): "running" | "passed" | "failed" | "pending" | "blocked" | "queued" => {
  switch (status) {
    case "running":
      return "running";
    case "completed":
      return "passed";
    case "failed":
      return "failed";
    case "initializing":
      return "queued";
    default:
      return "pending";
  }
};

export const isQueuedOrInitializing = (status: string) => {
  return status === "initializing";
};

export const loadExecutions = async (
  searchQuery: string,
  environment: string,
  status: string,
  sortField: string,
  sortOrder: "asc" | "desc"
): Promise<TestExecution[]> => {
  try {
    return await ExecutionService.getAllExecutions(
      searchQuery,
      environment,
      status,
      sortField,
      sortOrder
    );
  } catch (error) {
    console.error("加载测试执行列表失败:", error);
    return [];
  }
};

export const loadExecution = async (id: string): Promise<TestExecution | null> => {
  try {
    return await ExecutionService.getExecutionById(id);
  } catch (error) {
    console.error("加载测试执行失败", error);
    return null;
  }
};

export const stopExecution = async (id: string) => {
  try {
    await ExecutionService.stopExecution(id);
  } catch (error) {
    console.error("停止执行失败:", error);
  }
};

export const startExecution = async (id: string) => {
  try {
    await ExecutionService.startExecution(id);
  } catch (error) {
    console.error("开始执行失败:", error);
  }
};

export const handleSelectAll = (
  event: Event,
  executions: TestExecution[],
  selectedExecutions: any
) => {
  const checked = (event.target as HTMLInputElement).checked;
  selectedExecutions.value = checked ? executions.map((e) => e.id) : [];
};

export const handleBatchAction = (
  action: "start" | "stop" | "export" | "delete",
  selectedExecutions: string[]
) => {
  if (selectedExecutions.length === 0) return;
  console.log(`批量操作: ${action}`, selectedExecutions);
};

export const navigateToExecutionDetails = (router: any, id: string) => {
  router.push({ name: "executionDetails", params: { id } });
};

export const goBack = (router: any) => {
  router.push({ name: "testExecution" });
};

export const copyToClipboard = async (
  text: string | undefined,
  showCopyStatus: (text: string, success: boolean) => void
) => {
  if (text === undefined) text = "-";
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      showCopyStatus(text, true);
      return;
    }
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    showCopyStatus(text, successful);
  } catch (err) {
    console.error("复制失败:", err);
    showCopyStatus(text, false);
  }
};