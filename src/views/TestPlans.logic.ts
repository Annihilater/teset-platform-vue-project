import type { TestPlan } from "@/mock/types/testPlan";
import { TestPlanService } from "@/mock/services/testPlan";

export const loadTestPlans = async (
  searchQuery: string,
  status: string,
  phase: string
): Promise<TestPlan[]> => {
  try {
    return await TestPlanService.getFilteredTestPlans(searchQuery, status, phase);
  } catch (error) {
    console.error("加载测试计划失败:", error);
    return [];
  }
};

export const selectTestPlan = async (id: string): Promise<TestPlan | null> => {
  try {
    return await TestPlanService.getTestPlanById(id);
  } catch (error) {
    console.error("加载测试计划详情失败:", error);
    return null;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "active":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "archived":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case "draft":
      return "草稿";
    case "active":
      return "活跃";
    case "completed":
      return "已完成";
    case "archived":
      return "已归档";
    default:
      return status;
  }
};

export const getPhaseText = (phase: string) => {
  switch (phase) {
    case "planning":
      return "规划";
    case "execution":
      return "执行";
    case "review":
      return "审查";
    case "completed":
      return "完成";
    default:
      return phase;
  }
};

export const getPhaseStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "待处理";
    case "in-progress":
      return "进行中";
    case "completed":
      return "已完成";
    default:
      return status;
  }
};