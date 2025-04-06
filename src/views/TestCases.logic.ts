import { format } from "date-fns";
import type { TestCase, TestStatus, TestPriority } from "@/mock/types/testCase";
import { TestCaseService } from "@/mock/services/testCase";

export const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case "critical":
      return "紧急";
    case "high":
      return "高";
    case "medium":
      return "中";
    case "low":
      return "低";
    default:
      return priority;
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical":
      return "bg-red-100 text-red-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "";
  }
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return format(new Date(dateString), "yyyy-MM-dd");
};

export const loadTestCases = async (
  searchQuery: string,
  filters: any,
  sortField: string,
  sortOrder: "asc" | "desc"
): Promise<TestCase[]> => {
  try {
    const result = await TestCaseService.getTestCaseList(
      searchQuery,
      filters,
      sortField,
      sortOrder
    );
    return result;
  } catch (error) {
    console.error("加载测试用例失败:", error);
    return [];
  }
};

export const handleSortChange = (
  sortFieldRef: any,
  sortOrderRef: any,
  field: string,
  order: "asc" | "desc",
  loadFn: () => void
) => {
  sortFieldRef.value = field;
  sortOrderRef.value = order;
  loadFn();
};

export const handleSelectAll = (
  event: Event,
  testCases: TestCase[],
  selectedTestCaseIds: any
) => {
  const checked = (event.target as HTMLInputElement).checked;
  selectedTestCaseIds.value = checked ? testCases.map((t) => t.id) : [];
};

export const handleBatchAction = (
  action: string,
  selectedTestCaseIds: string[]
) => {
  if (selectedTestCaseIds.length === 0) return;
  console.log(`批量操作: ${action}`, selectedTestCaseIds);
};

export const resetFilters = (
  searchQueryRef: any,
  priorityFilterRef: any,
  statusFilterRef: any,
  automationFilterRef: any,
  resetPageFn: () => void,
  loadFn: () => void
) => {
  searchQueryRef.value = "";
  priorityFilterRef.value = "all";
  statusFilterRef.value = "all";
  automationFilterRef.value = "all";
  resetPageFn();
  loadFn();
};