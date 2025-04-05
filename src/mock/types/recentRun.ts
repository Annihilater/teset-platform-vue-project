// 最近测试运行的状态
export type TestRunStatus = 'success' | 'failed' | 'running' | 'pending';

// 最近测试运行数据类型
export interface TestRun {
  id: number;
  name: string;
  status: TestRunStatus;
  time: string;
  duration: string;
}

// 过滤参数接口
export interface TestRunFilterParams {
  status: string;
  search: string;
} 