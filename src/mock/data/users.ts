import type { User, ApiKey, Integration, Session, SecurityLog } from '../types/user';

export const currentUser: User = {
  id: '1',
  name: '陈思雨',
  email: 'chen@example.com',
  role: 'admin',
  teams: ['1', '2'],
  status: 'active',
  lastActive: '2024-03-15T12:30:00Z',
  created: '2024-01-01T00:00:00Z',
  modified: '2024-03-15T00:00:00Z',
  preferences: {
    theme: 'light',
    notifications: {
      email: true,
      desktop: true,
      slack: false
    },
    defaultView: 'dashboard',
    timezone: 'Asia/Shanghai',
    language: 'zh-CN'
  }
};

export const apiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'CI 流水线',
    key: '••••••••••••••••',
    created: '2024-03-01T00:00:00Z',
    expires: '2025-03-01T00:00:00Z',
    lastUsed: '2024-03-15T10:30:00Z',
    scopes: ['read:tests', 'write:results']
  },
  {
    id: '2',
    name: '监控服务',
    key: '••••••••••••••••',
    created: '2024-03-10T00:00:00Z',
    expires: '2025-03-10T00:00:00Z',
    lastUsed: '2024-03-15T11:45:00Z',
    scopes: ['read:metrics']
  }
];

export const integrations: Integration[] = [
  {
    id: '1',
    name: 'GitHub',
    type: 'repository',
    status: 'active',
    configuration: {
      repository: 'org/repo',
      branch: 'main'
    },
    lastSync: '2024-03-15T10:30:00Z',
    created: '2024-03-01T00:00:00Z',
    modified: '2024-03-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Jenkins',
    type: 'ci',
    status: 'active',
    configuration: {
      url: 'https://jenkins.example.com',
      job: 'test-automation'
    },
    lastSync: '2024-03-15T11:00:00Z',
    created: '2024-03-01T00:00:00Z',
    modified: '2024-03-15T00:00:00Z'
  }
];

export const activeSessions: Session[] = [
  { device: 'MacBook Pro', location: '北京, 中国', lastActive: '2 分钟前', current: true },
  { device: 'iPhone 13', location: '北京, 中国', lastActive: '1 小时前', current: false },
  { device: 'Windows PC', location: '上海, 中国', lastActive: '2 天前', current: false }
];

export const securityLogs: SecurityLog[] = [
  { action: '密码修改', ip: '192.168.1.1', time: '2024-03-15 14:30:00', status: 'success' },
  { action: '登录尝试', ip: '192.168.1.2', time: '2024-03-15 13:45:00', status: 'failed' },
  { action: '两步验证禁用', ip: '192.168.1.1', time: '2024-03-14 16:20:00', status: 'success' }
]; 