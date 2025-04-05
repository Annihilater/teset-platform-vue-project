import type { TestEnvironment, EnvironmentActivity, EnvironmentFilterParams } from '../types/environment';
import { environments, recentActivities } from '../data/environments';

export class EnvironmentService {
  /**
   * 获取环境列表
   */
  static async getEnvironmentList(
    filterParams: Partial<EnvironmentFilterParams> = {}
  ): Promise<TestEnvironment[]> {
    let result = [...environments];

    // 搜索过滤
    if (filterParams.search) {
      const query = filterParams.search.toLowerCase();
      result = result.filter(env => 
        env.name.toLowerCase().includes(query) ||
        env.type.toLowerCase().includes(query) ||
        env.url.toLowerCase().includes(query)
      );
    }

    // 状态过滤
    if (filterParams.status && filterParams.status !== 'all') {
      result = result.filter(env => env.status === filterParams.status);
    }

    // 类型过滤
    if (filterParams.type && filterParams.type !== 'all') {
      result = result.filter(env => env.type === filterParams.type);
    }

    return result;
  }

  /**
   * 获取指定ID的环境详情
   */
  static async getEnvironmentById(id: string): Promise<TestEnvironment | null> {
    return environments.find(env => env.id === id) || null;
  }

  /**
   * 获取最近活动列表
   */
  static async getRecentActivities(): Promise<EnvironmentActivity[]> {
    return recentActivities;
  }

  /**
   * 更新环境状态
   */
  static async updateEnvironmentStatus(
    id: string, 
    status: 'active' | 'maintenance' | 'inactive'
  ): Promise<TestEnvironment | null> {
    const environment = environments.find(env => env.id === id);
    if (!environment) {
      return null;
    }

    environment.status = status;
    environment.modified = new Date().toISOString();
    return environment;
  }

  /**
   * 更新环境配置
   */
  static async updateEnvironmentConfig(
    id: string,
    config: Partial<TestEnvironment['configuration']>
  ): Promise<TestEnvironment | null> {
    const environment = environments.find(env => env.id === id);
    if (!environment) {
      return null;
    }

    environment.configuration = {
      ...environment.configuration,
      ...config
    };
    environment.modified = new Date().toISOString();
    return environment;
  }

  /**
   * 更新环境维护人员
   */
  static async updateEnvironmentMaintainers(
    id: string,
    maintainers: string[]
  ): Promise<TestEnvironment | null> {
    const environment = environments.find(env => env.id === id);
    if (!environment) {
      return null;
    }

    environment.maintainers = maintainers;
    environment.modified = new Date().toISOString();
    return environment;
  }
} 