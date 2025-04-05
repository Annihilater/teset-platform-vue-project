import type { DashboardData, TestStats, Activity } from '../types/dashboard';
import { dashboardData } from '../data/dashboard';

export const DashboardService = {
  // 获取仪表盘所有数据
  getDashboardData(): Promise<DashboardData> {
    return Promise.resolve(dashboardData);
  },

  // 获取测试统计数据
  getTestStats(): Promise<TestStats> {
    return Promise.resolve(dashboardData.stats);
  },

  // 获取最近活动数据
  getRecentActivities(): Promise<Activity[]> {
    return Promise.resolve(dashboardData.recentActivities);
  },

  // 获取用户名
  getUserName(): Promise<string> {
    return Promise.resolve(dashboardData.userName);
  },

  // 更新测试统计数据
  updateTestStats(stats: TestStats): Promise<TestStats> {
    dashboardData.stats = stats;
    return Promise.resolve(stats);
  },

  // 添加新活动
  addActivity(activity: Activity): Promise<Activity[]> {
    dashboardData.recentActivities.unshift(activity);
    // 保持最近活动列表不超过10条
    if (dashboardData.recentActivities.length > 10) {
      dashboardData.recentActivities.pop();
    }
    return Promise.resolve(dashboardData.recentActivities);
  }
}; 