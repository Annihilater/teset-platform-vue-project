import type { User } from './user';
import type { Team } from './team';

export interface TestPlanRisk {
  id: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  mitigation: string;
}

export interface TestPlanDependency {
  id: string;
  name: string;
  type: 'internal' | 'external';
  status: 'ready' | 'pending' | 'blocked';
}

export interface TestPlanPhase {
  name: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
}

export interface TestPlanSchedule {
  phases: TestPlanPhase[];
}

export interface TestPlanMetrics {
  totalTestCases: number;
  automated: number;
  manual: number;
  passed: number;
  failed: number;
  blocked: number;
  notRun: number;
  coverage: number;
  executionProgress: number;
}

export interface TestPlanScope {
  included: string[];
  excluded: string[];
}

export type TestPlanStatus = 'draft' | 'active' | 'completed' | 'archived';
export type TestPlanPhaseType = 'planning' | 'execution' | 'review' | 'completed';

export interface TestPlan {
  id: string;
  name: string;
  description: string;
  status: TestPlanStatus;
  phase: TestPlanPhaseType;
  startDate: string;
  endDate: string;
  owner: User;
  team: Team;
  objectives: string[];
  scope: TestPlanScope;
  testSuites: string[];
  environments: string[];
  risks: TestPlanRisk[];
  dependencies: TestPlanDependency[];
  metrics: TestPlanMetrics;
  schedule: TestPlanSchedule;
  attachments: string[];
  created: string;
  modified: string;
  version: string;
}

export interface TestPlanFilterParams {
  status: string;
  phase: string;
  search: string;
  team?: string;
  owner?: string;
} 