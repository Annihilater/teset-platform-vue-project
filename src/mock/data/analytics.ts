import type { 
  TestTrendData, 
  TestDurationData, 
  TestTypeData, 
  FailedTestData,
  AnalyticsOverview 
} from '../types/analytics';

// 统计概览数据
export const analyticsOverview: AnalyticsOverview = {
  totalTests: 1234,
  totalIncrease: 12.5,
  passRate: 98.2,
  passRateIncrease: 2.4,
  avgDuration: 45,
  durationChange: -5.2,
  failedTests: 23,
  failedTestsChange: -8.1
};

// 测试趋势数据
export const testTrendData: TestTrendData[] = [
  { date: '3月1日', total: 120, passed: 110, failed: 10 },
  { date: '3月2日', total: 132, passed: 125, failed: 7 },
  { date: '3月3日', total: 145, passed: 140, failed: 5 },
  { date: '3月4日', total: 150, passed: 142, failed: 8 },
  { date: '3月5日', total: 160, passed: 155, failed: 5 },
  { date: '3月6日', total: 170, passed: 165, failed: 5 },
  { date: '3月7日', total: 180, passed: 172, failed: 8 }
];

// 测试耗时数据
export const testDurationData: TestDurationData[] = [
  { name: '认证流程', duration: 15 },
  { name: '支付', duration: 25 },
  { name: '用户资料', duration: 10 },
  { name: '搜索', duration: 20 },
  { name: '结账', duration: 30 }
];

// 测试类型数据
export const testTypeData: TestTypeData[] = [
  { name: '单元测试', value: 450 },
  { name: '集成测试', value: 300 },
  { name: '端到端测试', value: 150 },
  { name: '性能测试', value: 100 }
];

// 最常失败的测试
export const topFailedTests: FailedTestData[] = [
  { name: '支付处理', count: 12, increase: true },
  { name: '用户认证', count: 8, increase: false },
  { name: '数据导出', count: 5, increase: true },
  { name: '搜索功能', count: 3, increase: false }
]; 