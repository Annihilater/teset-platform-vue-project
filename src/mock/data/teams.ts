import type { Team, TeamActivity } from '../types/team';
import type { User } from '../types/user';

export const teams: Team[] = [
  {
    id: '3',
    name: '管理系统团队',
    description: '负责内部管理系统的开发和测试',
    members: [
      {
        userId: '4',
        role: 'lead',
        joinedAt: '2024-01-10T00:00:00Z',
        permissions: ['manage_team', 'create_test_plans', 'assign_tasks']
      },
      {
        userId: '5',
        role: 'member',
        joinedAt: '2024-01-20T00:00:00Z',
        permissions: ['create_test_plans']
      }
    ],
    projects: ['管理后台', '权限系统'],
    created: '2024-01-10T00:00:00Z',
    modified: '2024-03-10T00:00:00Z',
    lead: '4',
    tags: ['管理', '内部系统'],
    metrics: {
      totalTests: 320,
      passRate: 90,
      automationRate: 70
    }
  },
  {
    id: '4',
    name: '发布平台团队',
    description: '负责发布平台的开发与维护',
    members: [
      {
        userId: '6',
        role: 'lead',
        joinedAt: '2024-01-05T00:00:00Z',
        permissions: ['manage_team', 'create_test_plans', 'assign_tasks']
      },
      {
        userId: '7',
        role: 'member',
        joinedAt: '2024-01-18T00:00:00Z',
        permissions: ['create_test_plans']
      }
    ],
    projects: ['发布系统', '构建系统'],
    created: '2024-01-05T00:00:00Z',
    modified: '2024-03-08T00:00:00Z',
    lead: '6',
    tags: ['发布', 'CI/CD'],
    metrics: {
      totalTests: 280,
      passRate: 95,
      automationRate: 85
    }
  },
  {
    id: '5',
    name: '测试平台团队',
    description: '负责测试平台的规划与实现',
    members: [
      {
        userId: '8',
        role: 'lead',
        joinedAt: '2024-01-03T00:00:00Z',
        permissions: ['manage_team', 'create_test_plans', 'assign_tasks']
      },
      {
        userId: '9',
        role: 'member',
        joinedAt: '2024-01-15T00:00:00Z',
        permissions: ['create_test_cases', 'execute_tests']
      }
    ],
    projects: ['测试平台', '自动化框架'],
    created: '2024-01-03T00:00:00Z',
    modified: '2024-03-12T00:00:00Z',
    lead: '8',
    tags: ['测试', '自动化'],
    metrics: {
      totalTests: 420,
      passRate: 92,
      automationRate: 90
    }
  },
  {
    id: '6',
    name: '交易柜台团队',
    description: '负责交易柜台系统的研发与维护',
    members: [
      {
        userId: '10',
        role: 'lead',
        joinedAt: '2024-01-08T00:00:00Z',
        permissions: ['manage_team', 'create_test_plans', 'assign_tasks']
      },
      {
        userId: '11',
        role: 'member',
        joinedAt: '2024-01-22T00:00:00Z',
        permissions: ['create_test_plans']
      }
    ],
    projects: ['交易系统', '结算系统'],
    created: '2024-01-08T00:00:00Z',
    modified: '2024-03-05T00:00:00Z',
    lead: '10',
    tags: ['交易', '金融'],
    metrics: {
      totalTests: 520,
      passRate: 96,
      automationRate: 65
    }
  },
  {
    id: '7',
    name: '行情团队',
    description: '负责行情数据系统的开发与测试',
    members: [
      {
        userId: '12',
        role: 'lead',
        joinedAt: '2024-01-12T00:00:00Z',
        permissions: ['manage_team', 'create_test_plans', 'assign_tasks']
      },
      {
        userId: '13',
        role: 'member',
        joinedAt: '2024-01-25T00:00:00Z',
        permissions: ['create_test_plans']
      }
    ],
    projects: ['行情系统', '数据分析'],
    created: '2024-01-12T00:00:00Z',
    modified: '2024-03-07T00:00:00Z',
    lead: '12',
    tags: ['行情', '数据'],
    metrics: {
      totalTests: 380,
      passRate: 93,
      automationRate: 75
    }
  },
  {
    id: '8',
    name: 'XLight 团队',
    description: '负责XLight平台的开发与维护',
    members: [
      {
        userId: '14',
        role: 'lead',
        joinedAt: '2024-01-15T00:00:00Z',
        permissions: ['manage_team', 'create_test_plans', 'assign_tasks']
      },
      {
        userId: '15',
        role: 'member',
        joinedAt: '2024-01-28T00:00:00Z',
        permissions: ['create_test_plans']
      }
    ],
    projects: ['XLight平台', '交互系统'],
    created: '2024-01-15T00:00:00Z',
    modified: '2024-03-09T00:00:00Z',
    lead: '14',
    tags: ['XLight', '平台'],
    metrics: {
      totalTests: 410,
      passRate: 89,
      automationRate: 78
    }
  },
  {
    id: '9',
    name: '客户端团队',
    description: '负责各类客户端的开发与测试',
    members: [
      {
        userId: '16',
        role: 'lead',
        joinedAt: '2024-01-20T00:00:00Z',
        permissions: ['manage_team', 'create_test_plans', 'assign_tasks']
      },
      {
        userId: '17',
        role: 'member',
        joinedAt: '2024-02-01T00:00:00Z',
        permissions: ['create_test_plans']
      }
    ],
    projects: ['PC客户端', '移动客户端'],
    created: '2024-01-20T00:00:00Z',
    modified: '2024-03-11T00:00:00Z',
    lead: '16',
    tags: ['客户端', '应用'],
    metrics: {
      totalTests: 350,
      passRate: 91,
      automationRate: 68
    }
  },
  {
    id: '1',
    name: '核心质量保障团队',
    description: '负责核心产品测试的主要团队',
    members: [
      {
        userId: '1',
        role: 'lead',
        joinedAt: '2024-01-01T00:00:00Z',
        permissions: ['manage_team', 'create_test_plans', 'assign_tasks']
      },
      {
        userId: '2',
        role: 'member',
        joinedAt: '2024-01-15T00:00:00Z',
        permissions: ['create_test_plans', 'assign_tasks']
      }
    ],
    projects: ['主应用', 'API服务'],
    created: '2024-01-01T00:00:00Z',
    modified: '2024-03-15T00:00:00Z',
    lead: '1',
    tags: ['核心', '关键'],
    metrics: {
      totalTests: 450,
      passRate: 92,
      automationRate: 75
    }
  },
  {
    id: '2',
    name: '移动端测试团队',
    description: '专门负责移动应用测试的团队',
    members: [
      {
        userId: '3',
        role: 'lead',
        joinedAt: '2024-01-01T00:00:00Z',
        permissions: ['manage_team', 'create_test_plans']
      }
    ],
    projects: ['移动应用'],
    created: '2024-01-01T00:00:00Z',
    modified: '2024-03-14T00:00:00Z',
    lead: '3',
    tags: ['移动', '应用'],
    metrics: {
      totalTests: 280,
      passRate: 88,
      automationRate: 60
    }
  }
];

export const teamMembers: User[] = [
  {
    id: '1',
    name: '陈思雨',
    email: 'sarah@example.com',
    role: 'manager',
    teams: ['1'],
    status: 'active',
    lastActive: '2024-03-15T12:30:00Z',
    created: '2024-01-01T00:00:00Z',
    modified: '2024-03-15T00:00:00Z'
  },
  {
    id: '2',
    name: '李明',
    email: 'mike@example.com',
    role: 'tester',
    teams: ['1'],
    status: 'active',
    lastActive: '2024-03-15T11:45:00Z',
    created: '2024-01-15T00:00:00Z',
    modified: '2024-03-15T00:00:00Z'
  },
  {
    id: '3',
    name: '王小明',
    email: 'alex@example.com',
    role: 'manager',
    teams: ['2'],
    status: 'active',
    lastActive: '2024-03-15T10:15:00Z',
    created: '2024-01-01T00:00:00Z',
    modified: '2024-03-14T00:00:00Z'
  },
  {
    id: '4',
    name: '张伟',
    email: 'zhang@example.com',
    role: 'manager',
    teams: ['3'],
    status: 'active',
    lastActive: '2024-03-14T09:30:00Z',
    created: '2024-01-10T00:00:00Z',
    modified: '2024-03-10T00:00:00Z'
  },
  {
    id: '5',
    name: '刘芳',
    email: 'liu@example.com',
    role: 'tester',
    teams: ['3'],
    status: 'active',
    lastActive: '2024-03-14T14:20:00Z',
    created: '2024-01-20T00:00:00Z',
    modified: '2024-03-10T00:00:00Z'
  },
  {
    id: '6',
    name: '赵强',
    email: 'zhao@example.com',
    role: 'manager',
    teams: ['4'],
    status: 'active',
    lastActive: '2024-03-13T11:10:00Z',
    created: '2024-01-05T00:00:00Z',
    modified: '2024-03-08T00:00:00Z'
  },
  {
    id: '7',
    name: '孙洋',
    email: 'sun@example.com',
    role: 'developer',
    teams: ['4'],
    status: 'active',
    lastActive: '2024-03-13T15:40:00Z',
    created: '2024-01-18T00:00:00Z',
    modified: '2024-03-08T00:00:00Z'
  },
  {
    id: '8',
    name: '周婷',
    email: 'zhou@example.com',
    role: 'manager',
    teams: ['5'],
    status: 'active',
    lastActive: '2024-03-12T10:25:00Z',
    created: '2024-01-03T00:00:00Z',
    modified: '2024-03-12T00:00:00Z'
  },
  {
    id: '9',
    name: '吴军',
    email: 'wu@example.com',
    role: 'tester',
    teams: ['5'],
    status: 'active',
    lastActive: '2024-03-12T16:35:00Z',
    created: '2024-01-15T00:00:00Z',
    modified: '2024-03-12T00:00:00Z'
  },
  {
    id: '10',
    name: '郑涛',
    email: 'zheng@example.com',
    role: 'manager',
    teams: ['6'],
    status: 'active',
    lastActive: '2024-03-10T13:45:00Z',
    created: '2024-01-08T00:00:00Z',
    modified: '2024-03-05T00:00:00Z'
  },
  {
    id: '11',
    name: '王丽',
    email: 'wangli@example.com',
    role: 'developer',
    teams: ['6'],
    status: 'active',
    lastActive: '2024-03-10T16:55:00Z',
    created: '2024-01-22T00:00:00Z',
    modified: '2024-03-05T00:00:00Z'
  },
  {
    id: '12',
    name: '林智',
    email: 'lin@example.com',
    role: 'manager',
    teams: ['7'],
    status: 'active',
    lastActive: '2024-03-11T09:15:00Z',
    created: '2024-01-12T00:00:00Z',
    modified: '2024-03-07T00:00:00Z'
  },
  {
    id: '13',
    name: '陈亮',
    email: 'chenliang@example.com',
    role: 'developer',
    teams: ['7'],
    status: 'active',
    lastActive: '2024-03-11T14:20:00Z',
    created: '2024-01-25T00:00:00Z',
    modified: '2024-03-07T00:00:00Z'
  },
  {
    id: '14',
    name: '张鑫',
    email: 'zhangxin@example.com',
    role: 'manager',
    teams: ['8'],
    status: 'active',
    lastActive: '2024-03-09T11:30:00Z',
    created: '2024-01-15T00:00:00Z',
    modified: '2024-03-09T00:00:00Z'
  },
  {
    id: '15',
    name: '李华',
    email: 'lihua@example.com',
    role: 'tester',
    teams: ['8'],
    status: 'active',
    lastActive: '2024-03-09T15:45:00Z',
    created: '2024-01-28T00:00:00Z',
    modified: '2024-03-09T00:00:00Z'
  },
  {
    id: '16',
    name: '王莉',
    email: 'wangli2@example.com',
    role: 'manager',
    teams: ['9'],
    status: 'active',
    lastActive: '2024-03-08T10:40:00Z',
    created: '2024-01-20T00:00:00Z',
    modified: '2024-03-11T00:00:00Z'
  },
  {
    id: '17',
    name: '赵明',
    email: 'zhaoming@example.com',
    role: 'developer',
    teams: ['9'],
    status: 'active',
    lastActive: '2024-03-08T16:25:00Z',
    created: '2024-02-01T00:00:00Z',
    modified: '2024-03-11T00:00:00Z'
  }
];

export const teamActivities: TeamActivity[] = [
  { action: '添加新成员', user: '陈思雨', time: '2小时前' },
  { action: '更新测试计划', user: '李明', time: '5小时前' },
  { action: '创建新测试套件', user: '王小明', time: '昨天' },
  { action: '完成测试执行', user: '张伟', time: '昨天' },
  { action: '提交测试报告', user: '赵强', time: '2天前' },
  { action: '创建缺陷报告', user: '周婷', time: '2天前' },
  { action: '更新团队信息', user: '郑涛', time: '3天前' },
  { action: '修复测试用例', user: '林智', time: '3天前' },
  { action: '添加项目里程碑', user: '张鑫', time: '4天前' },
  { action: '发布测试结果', user: '王莉', time: '5天前' }
]; 