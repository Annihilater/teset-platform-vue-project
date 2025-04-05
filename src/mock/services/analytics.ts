import type { 
  TestTrendData, 
  TestDurationData, 
  TestTypeData, 
  FailedTestData,
  AnalyticsOverview 
} from '../types/analytics';
import {
  analyticsOverview,
  testTrendData,
  testDurationData,
  testTypeData,
  topFailedTests
} from '../data/analytics';

export const AnalyticsService = {
  // 获取统计概览数据
  getOverview(): Promise<AnalyticsOverview> {
    return Promise.resolve(analyticsOverview);
  },

  // 获取测试趋势数据
  getTrendData(dateRange: '7d' | '30d' | '90d'): Promise<TestTrendData[]> {
    // 这里可以根据 dateRange 返回不同的数据
    return Promise.resolve(testTrendData);
  },

  // 获取测试耗时数据
  getDurationData(): Promise<TestDurationData[]> {
    return Promise.resolve(testDurationData);
  },

  // 获取测试类型分布数据
  getTypeData(): Promise<TestTypeData[]> {
    return Promise.resolve(testTypeData);
  },

  // 获取最常失败的测试数据
  getTopFailedTests(): Promise<FailedTestData[]> {
    return Promise.resolve(topFailedTests);
  }
}; 