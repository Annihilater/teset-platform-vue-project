export interface TestStep {
  id: string;
  description: string;
  expectedResult: string;
  actualResult?: string;
  status: 'passed' | 'failed' | 'pending' | 'blocked';
}

export type TestPriority = 'critical' | 'high' | 'medium' | 'low';
export type TestStatus = 'passed' | 'failed' | 'pending' | 'blocked' | 'running' | 'queued';

export interface TestExecution {
  id: string;
  time: string;
  executor: string;
  status: TestStatus;
}

export interface TestCase {
  id: string;
  name: string;
  description?: string;
  status: TestStatus;
  priority: TestPriority;
  tags: string[];
  duration: number;
  automated: boolean;
  steps: TestStep[];
  assignee?: string;
  lastRun?: string;
  created: string;
  modified: string;
  version: string;
  executions?: TestExecution[];
}

export interface TestCaseFilterParams {
  status?: TestStatus[];
  priority?: TestPriority[];
  assignee?: string[];
  automated?: boolean;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
} 