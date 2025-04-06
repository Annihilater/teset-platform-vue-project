import type { TestReport } from "../mock/types/report";
import { ReportService, reports as mockReports } from "../mock/services/report";

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "已完成";
    case "failed":
      return "失败";
    case "initializing":
      return "初始化中";
    case "running":
      return "运行中";
    default:
      return status;
  }
};

export const getReportId = (executionId: string) => {
  return `RPT-${executionId.split("-")[1]}`;
};

export const loadReports = async (
  searchQuery: string,
  selectedEnvironment: string,
  selectedDateRange: string
): Promise<TestReport[]> => {
  const result = await ReportService.getReports({
    search: searchQuery,
    environment: selectedEnvironment,
    dateRange: selectedDateRange,
  });
  return result;
};

export const resetFilters = (
  searchQueryRef: any,
  selectedEnvironmentRef: any,
  selectedDateRangeRef: any,
  loadReportsFn: () => void
) => {
  searchQueryRef.value = "";
  selectedEnvironmentRef.value = "all";
  selectedDateRangeRef.value = "30d";
  loadReportsFn();
};

export const handleSelectAll = (
  event: Event,
  reports: TestReport[],
  selectedReportIds: any
) => {
  const checked = (event.target as HTMLInputElement).checked;
  selectedReportIds.value = checked ? reports.map((r) => r.id) : [];
};

export const handleBatchAction = (
  action: "download" | "archive" | "share" | "delete",
  selectedReportIds: string[]
) => {
  if (selectedReportIds.length === 0) return;
  console.log(`批量操作: ${action}`, selectedReportIds);
};

export const copyToClipboard = async (
  text: string | undefined,
  showCopyStatusFn: (text: string, success: boolean) => void
) => {
  if (text === undefined) text = "-";
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      showCopyStatusFn(text, true);
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
    showCopyStatusFn(text, successful);
  } catch {
    showCopyStatusFn(text, false);
  }
};

export const showCopyStatus = (
  copyStatusRef: any,
  text: string,
  success: boolean
) => {
  copyStatusRef.value = {
    text,
    success,
    timestamp: Date.now(),
  };
  setTimeout(() => {
    if (copyStatusRef.value?.timestamp === Date.now()) {
      copyStatusRef.value = null;
    }
  }, 2000);
};