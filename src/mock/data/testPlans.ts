import type { TestPlan } from '../types/testPlan';
import { teamMembers, teams } from './teams';

// 测试计划数据
export const testPlans: Record<string, TestPlan> = {
  '1': {
    id: '1',
    name: '2024年第二季度发布测试',
    description: '2024年第二季度主要版本的综合测试计划',
    status: 'active',
    phase: 'execution',
    startDate: '2024-04-01T00:00:00Z',
    endDate: '2024-06-30T00:00:00Z',
    owner: teamMembers[0],
    team: teams[0],
    objectives: [
      '验证所有核心功能',
      '确保向后兼容性',
      '在负载下进行性能测试',
      '安全合规验证'
    ],
    scope: {
      included: ['身份验证', '支付处理', '用户管理'],
      excluded: ['旧系统', '测试版功能']
    },
    testSuites: [],
    environments: [],
    risks: [
      {
        id: '1',
        description: '与支付网关的集成可能会延迟',
        impact: 'high',
        mitigation: '与支付团队提前协调'
      }
    ],
    dependencies: [
      {
        id: '1',
        name: '支付网关API',
        type: 'external',
        status: 'ready'
      }
    ],
    metrics: {
      totalTestCases: 250,
      automated: 180,
      manual: 70,
      passed: 120,
      failed: 15,
      blocked: 5,
      notRun: 110,
      coverage: 85,
      executionProgress: 52
    },
    schedule: {
      phases: [
        {
          name: '规划',
          startDate: '2024-04-01T00:00:00Z',
          endDate: '2024-04-15T00:00:00Z',
          status: 'completed',
          progress: 100
        },
        {
          name: '执行',
          startDate: '2024-04-16T00:00:00Z',
          endDate: '2024-06-15T00:00:00Z',
          status: 'in-progress',
          progress: 45
        }
      ]
    },
    attachments: [],
    created: '2024-03-15T00:00:00Z',
    modified: '2024-03-15T10:30:00Z',
    version: '1.0.0'
  },
  '2': {
    id: '2',
    name: '支付系统升级',
    description: '新支付处理系统的测试计划',
    status: 'draft',
    phase: 'planning',
    startDate: '2024-05-01T00:00:00Z',
    endDate: '2024-07-31T00:00:00Z',
    owner: teamMembers[2],
    team: teams[1],
    objectives: [
      '验证新支付网关集成',
      '并发交易的性能测试',
      '安全审计合规'
    ],
    scope: {
      included: ['支付处理', '退款', '交易历史'],
      excluded: ['用户认证', '报告']
    },
    testSuites: [],
    environments: [],
    risks: [],
    dependencies: [],
    metrics: {
      totalTestCases: 150,
      automated: 100,
      manual: 50,
      passed: 0,
      failed: 0,
      blocked: 0,
      notRun: 150,
      coverage: 0,
      executionProgress: 0
    },
    schedule: {
      phases: [
        {
          name: '规划',
          startDate: '2024-05-01T00:00:00Z',
          endDate: '2024-05-15T00:00:00Z',
          status: 'pending',
          progress: 0
        }
      ]
    },
    attachments: [],
    created: '2024-03-14T00:00:00Z',
    modified: '2024-03-14T15:45:00Z',
    version: '1.0.0'
  },
  '3': {
    id: '3',
    name: '移动应用安全测试',
    description: '移动应用安全合规测试计划',
    status: 'completed',
    phase: 'completed',
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-03-15T00:00:00Z',
    owner: teamMembers[1],
    team: teams[0],
    objectives: [
      '数据加密验证',
      '授权和认证安全测试',
      'OWASP Top 10 移动风险检查'
    ],
    scope: {
      included: ['安全功能', '数据存储', 'API集成'],
      excluded: ['UI测试', '功能测试']
    },
    testSuites: [],
    environments: [],
    risks: [
      {
        id: '2',
        description: '用户数据加密可能不符合新的法规要求',
        impact: 'high',
        mitigation: '与法务团队确认所有要求并进行专门测试'
      }
    ],
    dependencies: [],
    metrics: {
      totalTestCases: 85,
      automated: 60,
      manual: 25,
      passed: 80,
      failed: 5,
      blocked: 0,
      notRun: 0,
      coverage: 100,
      executionProgress: 100
    },
    schedule: {
      phases: [
        {
          name: '规划',
          startDate: '2024-02-01T00:00:00Z',
          endDate: '2024-02-10T00:00:00Z',
          status: 'completed',
          progress: 100
        },
        {
          name: '执行',
          startDate: '2024-02-11T00:00:00Z',
          endDate: '2024-03-05T00:00:00Z',
          status: 'completed',
          progress: 100
        },
        {
          name: '审查',
          startDate: '2024-03-06T00:00:00Z',
          endDate: '2024-03-15T00:00:00Z',
          status: 'completed',
          progress: 100
        }
      ]
    },
    attachments: [],
    created: '2024-01-25T00:00:00Z',
    modified: '2024-03-15T16:30:00Z',
    version: '1.0.0'
  },
  '4': {
    id: '4',
    name: '性能优化测试',
    description: '应用性能瓶颈识别与优化测试',
    status: 'active',
    phase: 'review',
    startDate: '2024-03-01T00:00:00Z',
    endDate: '2024-04-30T00:00:00Z',
    owner: teamMembers[1],
    team: teams[0],
    objectives: [
      '识别前端渲染瓶颈',
      '提高API响应时间',
      '优化数据库查询',
      '降低资源消耗'
    ],
    scope: {
      included: ['全文搜索功能', '数据导出', '报表生成'],
      excluded: ['离线功能']
    },
    testSuites: [],
    environments: [],
    risks: [],
    dependencies: [],
    metrics: {
      totalTestCases: 120,
      automated: 90,
      manual: 30,
      passed: 80,
      failed: 10,
      blocked: 0,
      notRun: 30,
      coverage: 75,
      executionProgress: 75
    },
    schedule: {
      phases: [
        {
          name: '规划',
          startDate: '2024-03-01T00:00:00Z',
          endDate: '2024-03-10T00:00:00Z',
          status: 'completed',
          progress: 100
        },
        {
          name: '执行',
          startDate: '2024-03-11T00:00:00Z',
          endDate: '2024-04-15T00:00:00Z',
          status: 'completed',
          progress: 100
        },
        {
          name: '审查',
          startDate: '2024-04-16T00:00:00Z',
          endDate: '2024-04-30T00:00:00Z',
          status: 'in-progress',
          progress: 50
        }
      ]
    },
    attachments: [],
    created: '2024-02-15T00:00:00Z',
    modified: '2024-04-17T09:30:00Z',
    version: '1.0.0'
  }
};

// 列表格式的测试计划数据，用于展示
export const testPlanList: TestPlan[] = Object.values(testPlans);