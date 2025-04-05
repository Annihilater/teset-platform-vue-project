import type { TestCase } from '../types/testCase';

// 测试用例列表数据
export const testCases: Record<string, TestCase> = {
  '1': {
    id: '1',
    name: '用户认证流程',
    status: 'passed',
    priority: 'high',
    lastRun: '2024-03-10',
    description: '验证完整的用户认证流程，包括登录、注册和密码重置',
    assignee: '陈思雨',
    tags: ['认证', '安全', '用户流程'],
    duration: 15,
    automated: true,
    steps: [
      {
        id: 'step1',
        description: '导航到登录页面',
        expectedResult: '显示登录表单',
        actualResult: '登录表单正确显示',
        status: 'passed'
      },
      {
        id: 'step2',
        description: '输入有效凭据并点击登录',
        expectedResult: '成功登录并跳转到仪表盘',
        actualResult: '成功登录并跳转到仪表盘',
        status: 'passed'
      },
      {
        id: 'step3',
        description: '退出登录',
        expectedResult: '用户被安全登出并返回登录页面',
        actualResult: '用户成功登出并重定向到登录页面',
        status: 'passed'
      }
    ],
    created: '2024-03-01T00:00:00Z',
    modified: '2024-03-15T10:45:00Z',
    version: '1.0.0'
  },
  '2': {
    id: '2',
    name: '支付处理集成',
    status: 'failed',
    priority: 'critical',
    lastRun: '2024-03-09',
    description: '端到端支付处理验证，包括各种支付方式',
    assignee: '李明',
    tags: ['支付', '集成'],
    duration: 20,
    automated: true,
    steps: [
      {
        id: 'step1',
        description: '初始化支付流程',
        expectedResult: '加载支付表单',
        actualResult: '支付表单成功加载',
        status: 'passed'
      },
      {
        id: 'step2',
        description: '选择信用卡支付方式',
        expectedResult: '显示信用卡表单',
        actualResult: '正确显示信用卡表单',
        status: 'passed'
      },
      {
        id: 'step3',
        description: '提交支付信息',
        expectedResult: '处理支付并显示成功消息',
        actualResult: '支付处理超时',
        status: 'failed'
      }
    ],
    created: '2024-03-01T00:00:00Z',
    modified: '2024-03-15T11:00:00Z',
    version: '1.0.0'
  },
  '3': {
    id: '3',
    name: '数据导出功能',
    status: 'pending',
    priority: 'medium',
    lastRun: '2024-03-08',
    description: '验证各种格式的数据导出功能',
    assignee: '王小明',
    tags: ['导出', '数据'],
    duration: 10,
    automated: true,
    steps: [
      {
        id: 'step1',
        description: '选择导出格式',
        expectedResult: '显示格式选项',
        status: 'pending'
      },
      {
        id: 'step2', 
        description: '选择CSV格式并导出',
        expectedResult: '下载CSV文件',
        status: 'pending'
      },
      {
        id: 'step3',
        description: '选择Excel格式并导出',
        expectedResult: '下载Excel文件',
        status: 'pending'
      }
    ],
    created: '2024-03-01T00:00:00Z',
    modified: '2024-03-15T11:15:00Z',
    version: '1.0.0'
  },
  '4': {
    id: '4',
    name: '用户个人资料管理',
    status: 'blocked',
    priority: 'medium',
    lastRun: '2024-03-07',
    description: '验证用户个人资料编辑和更新功能',
    assignee: '张丽',
    tags: ['用户', '个人资料'],
    duration: 12,
    automated: false,
    steps: [
      {
        id: 'step1',
        description: '导航到个人资料页面',
        expectedResult: '显示用户个人资料',
        actualResult: '显示用户个人资料',
        status: 'passed'
      },
      {
        id: 'step2',
        description: '编辑个人信息',
        expectedResult: '表单允许编辑',
        actualResult: '表单允许编辑',
        status: 'passed'
      },
      {
        id: 'step3',
        description: '保存更新的信息',
        expectedResult: '信息更新并显示成功消息',
        status: 'blocked'
      }
    ],
    created: '2024-03-01T00:00:00Z',
    modified: '2024-03-15T11:15:00Z',
    version: '1.0.0'
  },
  '5': {
    id: '5',
    name: '搜索功能测试',
    status: 'passed',
    priority: 'low',
    lastRun: '2024-03-07',
    description: '验证搜索功能的准确性和性能',
    assignee: '刘强',
    tags: ['搜索', '性能'],
    duration: 8,
    automated: true,
    steps: [
      {
        id: 'step1',
        description: '输入搜索词',
        expectedResult: '搜索框接受输入',
        actualResult: '搜索框正常接受输入',
        status: 'passed'
      },
      {
        id: 'step2',
        description: '提交搜索',
        expectedResult: '显示搜索结果',
        actualResult: '正确显示相关搜索结果',
        status: 'passed'
      },
      {
        id: 'step3',
        description: '使用过滤器细化结果',
        expectedResult: '结果根据过滤器更新',
        actualResult: '结果正确根据过滤器更新',
        status: 'passed'
      }
    ],
    created: '2024-03-02T00:00:00Z',
    modified: '2024-03-15T09:30:00Z',
    version: '1.0.0'
  }
};

// 列表格式的测试用例数据
export const testCaseList: TestCase[] = Object.values(testCases);

// 测试用例列表列配置
export const testCaseColumns = [
  { field: 'name', label: '名称' },
  { field: 'status', label: '状态' },
  { field: 'priority', label: '优先级' },
  { field: 'tags', label: '标签' },
  { field: 'lastRun', label: '最后运行' },
  { field: 'assignee', label: '负责人' },
  { field: 'actions', label: '操作' }
]; 