import type { TestCase } from './testCase';

export interface ExecutionLog {
  timestamp: string;
  message: string;
  level: 'info' | 'warning' | 'error';
}

export interface ExecutionEnvironment {
  name: string;
  browser: string;
  operatingSystem: string;
  resolution: string;
}

// 测试执行状态
export type ExecutionStatus = 'completed' | 'running' | 'failed' | 'initializing' | 'environment-setup' | 'environment-cleanup' | 'collecting-results';

// 测试用例优先级
export type TestPriority = 'critical' | 'high' | 'medium' | 'low';

// 测试执行
export interface TestExecution {
  id: string;
  testCaseId: string;
  environment: string;
  status: ExecutionStatus;
  startTime: string;
  endTime?: string;
  duration?: number;
  executor: string;
  logs: string[];
  artifacts: any[]; // 可以根据需要定义具体的制品类型
  results: any[]; // 可以根据需要定义具体的结果类型
  created: string;
  modified: string;
  testCase: TestCase;
  environmentInfo?: ExecutionEnvironment;
}

// 执行过滤参数
export interface ExecutionFilterParams {
  environment: string;
  status: string;
  search: string;
} 