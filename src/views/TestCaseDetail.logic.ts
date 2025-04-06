import { format } from "date-fns";
import { TestCaseService } from "@/mock/services/testCase";
import type { TestCase } from "@/mock/types/testCase";

export const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return format(new Date(dateString), "yyyy-MM-dd HH:mm");
};

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

export const loadTestCase = async (id: string): Promise<TestCase | null> => {
  try {
    const testCase = await TestCaseService.getTestCaseById(id);
    return testCase;
  } catch (error) {
    console.error("加载测试用例详情失败:", error);
    return null;
  }
};