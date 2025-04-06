import type { TestExecution } from "@/mock/types/execution";
import { ExecutionService } from "@/mock/services/execution";

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
};

export const mapExecutionStatus = (status: string) => {
  switch (status) {
    case "completed":
      return "passed";
    case "running":
      return "running";
    case "failed":
      return "failed";
    case "initializing":
    case "environment-setup":
    case "environment-cleanup":
    case "collecting-results":
      return "pending";
    default:
      return "pending";
  }
};

export const isQueuedOrInitializing = (status: string) => {
  return status === "initializing";
};

export const loadExecutions = async (
  searchQuery: string,
  selectedEnvironment: string,
  selectedStatus: string
): Promise<TestExecution[]> => {
  return await ExecutionService.getRecentExecutions({
    search: searchQuery,
    environment: selectedEnvironment,
    status: selectedStatus,
  });
};