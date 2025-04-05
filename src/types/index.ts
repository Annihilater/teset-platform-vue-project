import type { Component } from 'vue';
import { ref } from 'vue';

export interface TestCase {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'pending' | 'blocked' | 'running' | 'queued';
  priority: 'low' | 'medium' | 'high' | 'critical';
  lastRun?: string;
  success?: number;
  total?: number;
  description?: string;
  assignee?: string;
  tags: string[];
  duration: number;
  automated: boolean;
  steps: TestStep[];
  prerequisites?: string[];
  attachments?: Attachment[];
  testSuiteId?: string;
  created: string;
  modified: string;
  version: string;
}

export interface TestStep {
  id: string;
  description: string;
  expectedResult: string;
  actualResult?: string;
  status?: 'passed' | 'failed' | 'pending' | 'blocked';
  notes?: string;
  screenshots?: string[];
  duration?: number;
}

export interface TestSuite {
  id: string;
  name: string;
  description: string;
  testCount: number;
  passRate: number;
  lastRun: string;
  owner: string;
  tags: string[];
  automated: boolean;
  testCases?: string[];
  dependencies?: string[];
  configuration?: Record<string, unknown>;
  created: string;
  modified: string;
  version: string;
}

export interface TestEnvironment {
  id: string;
  name: string;
  status: string;
  type: string;
  url: string;
  version: string;
  lastDeployment: string;
  health: {
    cpu: number;
    memory: number;
    status: string;
  };
  configuration: {
    operatingSystem: string;
    browser: string;
    database: string;
    services: string[];
  };
  maintainers: string[];
  created: string;
  modified: string;
}

export interface TestReport {
  id: string;
  executionId: string;
  projectId?: string;
  projectGroupId?: string;
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
    coverage?: number;
    environmentSetupTime: number;
    environmentTeardownTime: number;
  };
  environment: string;
  testSuite: string;
  executor: string;
  artifacts: Attachment[];
  metrics: {
    performance?: {
      avgResponseTime: number;
      p95ResponseTime: number;
      p99ResponseTime: number;
    };
    resources?: {
      cpuUsage: number;
      memoryUsage: number;
      networkIO: number;
    };
  };
  repositoryInfo?: {
    url: string;
    branch: string;
    commit: string;
    path: string;
  };
  created: string;
  modified: string;
  version: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'video' | 'log' | 'document';
  url: string;
  size: number;
  created: string;
  modified: string;
}

export interface TestExecution {
  id: string;
  projectId?: string;
  projectGroupId?: string;
  testCaseId: string;
  environment: string;
  status: 'initializing' | 'environment-setup' | 'running' | 'collecting-results' | 'environment-cleanup' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  duration?: number;
  executor: string;
  logs: string[];
  artifacts: Attachment[];
  results: TestStep[];
  environmentDetails?: {
    setupLogs: string[];
    teardownLogs: string[];
    resources: {
      name: string;
      type: string;
      status: string;
      metadata: Record<string, unknown>;
    }[];
  };
  repositoryInfo?: {
    url: string;
    branch: string;
    commit: string;
    path: string;
  };
  created: string;
  modified: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'tester' | 'viewer';
  avatar?: string;
  teams: string[];
  status: 'active' | 'inactive' | 'pending';
  lastActive?: string;
  created: string;
  modified: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    desktop: boolean;
    slack: boolean;
  };
  defaultView: string;
  timezone: string;
  language: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  projects: string[];
  created: string;
  modified: string;
  lead?: string;
  tags?: string[];
  metrics?: {
    totalTests: number;
    passRate: number;
    automationRate: number;
  };
}

export interface TeamMember {
  userId: string;
  role: 'lead' | 'member' | 'contributor';
  joinedAt: string;
  permissions: string[];
}

export interface Defect {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed' | 'reopened';
  severity: 'critical' | 'high' | 'medium' | 'low';
  priority: 'immediate' | 'high' | 'medium' | 'low';
  assignee: User;
  reporter: User;
  testCase?: TestCase;
  environment: string;
  steps: {
    description: string;
    expected: string;
    actual: string;
  }[];
  attachments: Attachment[];
  relatedDefects: string[];
  tags: string[];
  created: string;
  modified: string;
  resolvedDate?: string;
  closedDate?: string;
  comments: {
    id: string;
    user: User;
    content: string;
    created: string;
    modified: string;
    attachments: Attachment[];
  }[];
}

export interface TestPlan {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  phase: 'planning' | 'execution' | 'review' | 'completed';
  startDate: string;
  endDate: string;
  owner: User;
  team: Team;
  objectives: string[];
  scope: {
    included: string[];
    excluded: string[];
  };
  testSuites: TestSuite[];
  environments: TestEnvironment[];
  risks: {
    id: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    mitigation: string;
  }[];
  dependencies: {
    id: string;
    name: string;
    type: 'system' | 'data' | 'team' | 'external';
    status: 'ready' | 'pending' | 'blocked';
  }[];
  metrics: {
    totalTestCases: number;
    automated: number;
    manual: number;
    passed: number;
    failed: number;
    blocked: number;
    notRun: number;
    coverage: number;
    executionProgress: number;
  };
  schedule: {
    phases: {
      name: string;
      startDate: string;
      endDate: string;
      status: 'pending' | 'in-progress' | 'completed';
      progress: number;
    }[];
  };
  attachments: Attachment[];
  created: string;
  modified: string;
  version: string;
}

export interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: Component;
  component: Component;
}

export interface Integration {
  id: string;
  name: string;
  type: 'ci' | 'notification' | 'repository' | 'issue-tracker' | 'monitoring';
  status: 'active' | 'inactive' | 'error';
  configuration: Record<string, unknown>;
  lastSync?: string;
  created: string;
  modified: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  expires?: string;
  lastUsed?: string;
  scopes: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'archived';
  type: 'service' | 'application' | 'infrastructure';
  repository?: string;
  environments: {
    development: string;
    staging: string;
    production: string;
  };
  testCases: string[];
  configuration: {
    buildCommand?: string;
    testCommand?: string;
    deployCommand?: string;
    dependencies?: string[];
    environmentVariables?: Record<string, string>;
  };
  metrics: {
    totalTests: number;
    passRate: number;
    lastRun?: string;
    avgDuration?: number;
  };
  created: string;
  modified: string;
  version: string;
}

export interface ProjectGroup {
  id: string;
  name: string;
  description: string;
  projects: string[];
  status: 'active' | 'inactive' | 'archived';
  testStrategy: {
    executionOrder: 'parallel' | 'sequential';
    environmentStrategy: 'shared' | 'isolated';
    rollbackStrategy: 'automatic' | 'manual';
    retryPolicy?: {
      maxAttempts: number;
      backoffPeriod: number;
    };
  };
  dependencies?: {
    external: string[];
    infrastructure: string[];
  };
  created: string;
  modified: string;
} 