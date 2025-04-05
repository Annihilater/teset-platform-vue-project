// 添加调试日志
console.log('加载报告类型定义模块');

export interface RepositoryInfo {
  url: string;
  branch: string;
  commit: string;
  path: string;
}

export interface TestReport {
  id: string;
  testCaseId: string;
  environment: string;
  status: 'completed' | 'failed' | 'initializing' | 'running';
  startTime: string;
  endTime?: string;
  duration?: number;
  executor: string;
  logs: string[];
  artifacts: any[];
  results: any[];
  repositoryInfo?: RepositoryInfo;
  created: string;
  modified: string;
}

export interface ReportFilterParams {
  environment: string;
  dateRange: string;
  search: string;
}

// 添加调试日志
console.log('报告类型定义加载完成'); 