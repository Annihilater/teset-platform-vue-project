// 测试趋势数据类型
export interface TestTrendData {
  date: string;
  total: number;
  passed: number;
  failed: number;
}

// 测试耗时数据类型
export interface TestDurationData {
  name: string;
  duration: number;
}

// 测试类型数据类型
export interface TestTypeData {
  name: string;
  value: number;
}

// 失败测试数据类型
export interface FailedTestData {
  name: string;
  count: number;
  increase: boolean;
}

// 统计概览数据类型
export interface AnalyticsOverview {
  totalTests: number;
  totalIncrease: number;
  passRate: number;
  passRateIncrease: number;
  avgDuration: number;
  durationChange: number;
  failedTests: number;
  failedTestsChange: number;
} 