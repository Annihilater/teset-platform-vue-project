import type { TestEnvironment, EnvironmentActivity } from '../types/environment';

// 测试环境数据
export const environments: TestEnvironment[] = [
  {
    id: '1',
    name: '生产环境',
    status: 'active',
    type: 'production',
    url: 'https://app.example.com',
    version: '1.0.0',
    lastDeployment: '2024-03-15',
    health: {
      cpu: 45,
      memory: 60,
      status: 'healthy'
    },
    configuration: {
      operatingSystem: 'Ubuntu 22.04',
      browser: 'Chrome',
      database: 'PostgreSQL 15',
      services: ['API 网关', '认证服务', '支付服务', '缓存层']
    },
    maintainers: ['陈思雨', '李明'],
    created: '2024-03-01T00:00:00Z',
    modified: '2024-03-15T00:00:00Z'
  },
  {
    id: '2',
    name: '预发布环境',
    status: 'maintenance',
    type: 'staging',
    url: 'https://staging.example.com',
    version: '1.1.0-beta',
    lastDeployment: '2024-03-14',
    health: {
      cpu: 30,
      memory: 45,
      status: 'degraded'
    },
    configuration: {
      operatingSystem: 'Ubuntu 22.04',
      browser: 'Chrome',
      database: 'PostgreSQL 15',
      services: ['API 网关', '认证服务', '支付服务']
    },
    maintainers: ['王小明', '张丽'],
    created: '2024-03-01T00:00:00Z',
    modified: '2024-03-14T00:00:00Z'
  },
  {
    id: '3',
    name: '开发环境',
    status: 'active',
    type: 'development',
    url: 'https://dev.example.com',
    version: '1.1.0-dev',
    lastDeployment: '2024-03-13',
    health: {
      cpu: 25,
      memory: 40,
      status: 'healthy'
    },
    configuration: {
      operatingSystem: 'Ubuntu 22.04',
      browser: 'Chrome',
      database: 'PostgreSQL 15',
      services: ['API 网关', '认证服务']
    },
    maintainers: ['赵刚', '刘芳'],
    created: '2024-03-01T00:00:00Z',
    modified: '2024-03-13T00:00:00Z'
  }
];

// 环境活动数据
export const recentActivities: EnvironmentActivity[] = [
  {
    id: '1',
    environment: '生产环境',
    action: 'Deployment',
    description: '部署版本 1.0.0',
    user: '陈思雨',
    timestamp: '2024-03-15T10:30:00Z',
    status: 'success'
  },
  {
    id: '2',
    environment: '预发布环境',
    action: 'Configuration Update',
    description: '更新数据库连接池',
    user: '李明',
    timestamp: '2024-03-14T15:45:00Z',
    status: 'success'
  },
  {
    id: '3',
    environment: '生产环境',
    action: 'Scaling',
    description: '增加API实例到5个',
    user: '王小明',
    timestamp: '2024-03-14T09:15:00Z',
    status: 'success'
  }
]; 