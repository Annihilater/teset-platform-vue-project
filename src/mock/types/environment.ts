// 环境状态
export type EnvironmentStatus = 'active' | 'maintenance' | 'inactive';

// 环境类型
export type EnvironmentType = 'production' | 'staging' | 'development';

// 健康状态
export type HealthStatus = 'healthy' | 'degraded' | 'down';

// 环境健康信息
export interface EnvironmentHealth {
  cpu: number;
  memory: number;
  status: HealthStatus;
}

// 环境配置
export interface EnvironmentConfig {
  operatingSystem: string;
  browser: string;
  database: string;
  services: string[];
}

// 环境活动类型
export type ActivityAction = 'Deployment' | 'Configuration Update' | 'Scaling';

// 环境活动
export interface EnvironmentActivity {
  id: string;
  environment: string;
  action: ActivityAction;
  description: string;
  user: string;
  timestamp: string;
  status: 'success' | 'failed';
}

// 环境过滤参数
export interface EnvironmentFilterParams {
  status: string;
  type: string;
  search: string;
}

// 测试环境
export interface TestEnvironment {
  id: string;
  name: string;
  status: EnvironmentStatus;
  type: EnvironmentType;
  url: string;
  version: string;
  lastDeployment: string;
  health: EnvironmentHealth;
  configuration: EnvironmentConfig;
  maintainers: string[];
  created: string;
  modified: string;
} 