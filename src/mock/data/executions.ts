import type { TestExecution } from '../types/execution';
import { testCases } from './testCases';

export const executions: Record<string, TestExecution> = {
  'EXEC-001': {
    id: 'EXEC-001',
    testCaseId: '1',
    environment: '生产环境',
    status: 'running',
    startTime: '2024-03-15T14:30:00Z',
    executor: '陈思雨',
    logs: [
      '[14:30:00] 开始执行测试...',
      '[14:30:01] 导航到登录页面',
      '[14:30:02] 输入登录凭证',
      '[14:30:03] 验证登录状态...'
    ],
    artifacts: [],
    results: [],
    created: '2024-03-15T14:30:00Z',
    modified: '2024-03-15T14:30:00Z',
    testCase: {
      id: '1',
      name: '用户认证流程',
      status: 'running',
      priority: 'high',
      tags: ['认证', '关键路径'],
      duration: 15,
      automated: true,
      steps: [],
      created: '2024-03-01T00:00:00Z',
      modified: '2024-03-15T14:30:00Z',
      version: '1.0.0'
    },
    environmentInfo: {
      name: '生产环境',
      browser: 'Chrome 121.0',
      operatingSystem: 'Ubuntu 22.04',
      resolution: '1920x1080'
    }
  },
  'EXEC-002': {
    id: 'EXEC-002',
    testCaseId: '2',
    environment: '预发布环境',
    status: 'completed',
    startTime: '2024-03-15T14:00:00Z',
    endTime: '2024-03-15T14:15:00Z',
    duration: 15,
    executor: '李明',
    logs: [
      '[14:00:00] 开始执行测试...',
      '[14:00:01] 初始化支付流程',
      '[14:00:02] 处理支付',
      '[14:15:00] 测试完成'
    ],
    artifacts: [],
    results: [],
    created: '2024-03-15T14:00:00Z',
    modified: '2024-03-15T14:15:00Z',
    testCase: {
      id: '2',
      name: '支付处理集成',
      status: 'passed',
      priority: 'critical',
      tags: ['支付', '集成'],
      duration: 20,
      automated: true,
      steps: [],
      created: '2024-03-01T00:00:00Z',
      modified: '2024-03-15T14:15:00Z',
      version: '1.0.0'
    },
    environmentInfo: {
      name: '预发布环境',
      browser: 'Chrome 121.0',
      operatingSystem: 'Ubuntu 22.04',
      resolution: '1920x1080'
    }
  },
  'EXEC-003': {
    id: 'EXEC-003',
    testCaseId: '3',
    environment: '开发环境',
    status: 'failed',
    startTime: '2024-03-15T13:30:00Z',
    endTime: '2024-03-15T13:35:00Z',
    duration: 5,
    executor: '王小明',
    logs: [
      '[13:30:00] 开始执行测试...',
      '[13:30:01] 选择导出格式',
      '[13:30:02] 错误: 生成导出文件失败',
      '[13:35:00] 测试失败'
    ],
    artifacts: [],
    results: [],
    created: '2024-03-15T13:30:00Z',
    modified: '2024-03-15T13:35:00Z',
    testCase: {
      id: '3',
      name: '数据导出功能',
      status: 'failed',
      priority: 'medium',
      tags: ['导出', '数据'],
      duration: 10,
      automated: true,
      steps: [],
      created: '2024-03-01T00:00:00Z',
      modified: '2024-03-15T13:35:00Z',
      version: '1.0.0'
    },
    environmentInfo: {
      name: '开发环境',
      browser: 'Chrome 121.0',
      operatingSystem: 'Ubuntu 22.04',
      resolution: '1920x1080'
    }
  },
  'EXEC-004': {
    id: 'EXEC-004',
    testCaseId: '4',
    environment: '预发布环境',
    status: 'completed',
    startTime: '2024-03-15T12:30:00Z',
    endTime: '2024-03-15T12:45:00Z',
    duration: 15,
    executor: '张丽',
    logs: [
      '[12:30:00] 开始执行测试...',
      '[12:30:05] 测试用户注册流程',
      '[12:45:00] 测试完成'
    ],
    artifacts: [],
    results: [],
    created: '2024-03-15T12:30:00Z',
    modified: '2024-03-15T12:45:00Z',
    testCase: {
      id: '4',
      name: '用户注册流程',
      status: 'passed',
      priority: 'high',
      tags: ['用户', '注册'],
      duration: 15,
      automated: true,
      steps: [],
      created: '2024-03-01T00:00:00Z',
      modified: '2024-03-15T12:45:00Z',
      version: '1.0.0'
    },
    environmentInfo: {
      name: '预发布环境',
      browser: 'Chrome 121.0',
      operatingSystem: 'Ubuntu 22.04',
      resolution: '1920x1080'
    }
  },
  'EXEC-005': {
    id: 'EXEC-005',
    testCaseId: '5',
    environment: '开发环境',
    status: 'running',
    startTime: '2024-03-15T11:30:00Z',
    executor: '刘强',
    logs: [
      '[11:30:00] 开始执行测试...',
      '[11:30:10] 测试搜索功能',
      '[11:30:20] 验证搜索结果...'
    ],
    artifacts: [],
    results: [],
    created: '2024-03-15T11:30:00Z',
    modified: '2024-03-15T11:30:00Z',
    testCase: {
      id: '5',
      name: '搜索功能测试',
      status: 'running',
      priority: 'medium',
      tags: ['搜索', '功能'],
      duration: 10,
      automated: true,
      steps: [],
      created: '2024-03-01T00:00:00Z',
      modified: '2024-03-15T11:30:00Z',
      version: '1.0.0'
    },
    environmentInfo: {
      name: '开发环境',
      browser: 'Chrome 121.0',
      operatingSystem: 'Ubuntu 22.04',
      resolution: '1920x1080'
    }
  },
  'EXEC-006': {
    id: 'EXEC-006',
    testCaseId: '6',
    environment: '生产环境',
    status: 'completed',
    startTime: '2024-03-15T10:30:00Z',
    endTime: '2024-03-15T10:50:00Z',
    duration: 20,
    executor: '赵梅',
    logs: [
      '[10:30:00] 开始执行测试...',
      '[10:40:00] 测试商品下单流程',
      '[10:50:00] 测试完成'
    ],
    artifacts: [],
    results: [],
    created: '2024-03-15T10:30:00Z',
    modified: '2024-03-15T10:50:00Z',
    testCase: {
      id: '6',
      name: '商品下单流程',
      status: 'passed',
      priority: 'critical',
      tags: ['订单', '电商'],
      duration: 20,
      automated: true,
      steps: [],
      created: '2024-03-01T00:00:00Z',
      modified: '2024-03-15T10:50:00Z',
      version: '1.0.0'
    },
    environmentInfo: {
      name: '生产环境',
      browser: 'Chrome 121.0',
      operatingSystem: 'Ubuntu 22.04',
      resolution: '1920x1080'
    }
  },
  'EXEC-007': {
    id: 'EXEC-007',
    testCaseId: '7',
    environment: '开发环境',
    status: 'failed',
    startTime: '2024-03-15T09:30:00Z',
    endTime: '2024-03-15T09:40:00Z',
    duration: 10,
    executor: '吴刚',
    logs: [
      '[09:30:00] 开始执行测试...',
      '[09:35:00] 测试购物车功能',
      '[09:38:00] 错误: 无法添加商品到购物车',
      '[09:40:00] 测试失败'
    ],
    artifacts: [],
    results: [],
    created: '2024-03-15T09:30:00Z',
    modified: '2024-03-15T09:40:00Z',
    testCase: {
      id: '7',
      name: '购物车功能',
      status: 'failed',
      priority: 'high',
      tags: ['购物车', '电商'],
      duration: 15,
      automated: true,
      steps: [],
      created: '2024-03-01T00:00:00Z',
      modified: '2024-03-15T09:40:00Z',
      version: '1.0.0'
    },
    environmentInfo: {
      name: '开发环境',
      browser: 'Chrome 121.0',
      operatingSystem: 'Ubuntu 22.04',
      resolution: '1920x1080'
    }
  }
};

// 列表格式的执行数据，用于分页展示
export const executionList: TestExecution[] = Object.values(executions);

// 测试执行数据
export const recentExecutions: TestExecution[] = [
  {
    id: '1',
    testCaseId: '1',
    environment: '生产环境',
    status: 'completed',
    startTime: '2024-03-15T10:30:00Z',
    endTime: '2024-03-15T10:45:00Z',
    duration: 15,
    executor: '陈思雨',
    logs: ['测试开始', '步骤1完成', '测试成功完成'],
    artifacts: [],
    results: [],
    created: '2024-03-15T10:30:00Z',
    modified: '2024-03-15T10:45:00Z',
    testCase: {
      id: '1',
      name: '用户认证流程',
      status: 'passed',
      priority: 'high',
      tags: ['认证', '关键路径'],
      duration: 15,
      automated: true,
      steps: [],
      created: '2024-03-01T00:00:00Z',
      modified: '2024-03-15T10:45:00Z',
      version: '1.0.0'
    }
  },
  {
    id: '2',
    testCaseId: '2',
    environment: '预发环境',
    status: 'running',
    startTime: '2024-03-15T11:00:00Z',
    executor: '李明',
    logs: ['测试开始', '执行步骤1'],
    artifacts: [],
    results: [],
    created: '2024-03-15T11:00:00Z',
    modified: '2024-03-15T11:00:00Z',
    testCase: {
      id: '2',
      name: '支付处理集成',
      status: 'running',
      priority: 'critical',
      tags: ['支付', '集成'],
      duration: 20,
      automated: true,
      steps: [],
      created: '2024-03-01T00:00:00Z',
      modified: '2024-03-15T11:00:00Z',
      version: '1.0.0'
    }
  },
  {
    id: '3',
    testCaseId: '3',
    environment: '开发环境',
    status: 'initializing',
    startTime: '2024-03-15T11:15:00Z',
    executor: '王小明',
    logs: ['等待执行'],
    artifacts: [],
    results: [],
    created: '2024-03-15T11:15:00Z',
    modified: '2024-03-15T11:15:00Z',
    testCase: {
      id: '3',
      name: '数据导出功能',
      status: 'queued',
      priority: 'medium',
      tags: ['导出', '数据'],
      duration: 10,
      automated: true,
      steps: [],
      created: '2024-03-01T00:00:00Z',
      modified: '2024-03-15T11:15:00Z',
      version: '1.0.0'
    }
  }
]; 