import type { TestExecution, ExecutionFilterParams, ExecutionStatus } from '../types/execution';
import { executionList, executions } from '../data/executions';

export class ExecutionService {
  /**
   * 获取最近的测试执行列表
   */
  static async getRecentExecutions(params: Partial<ExecutionFilterParams> = {}): Promise<TestExecution[]> {
    let result = [...executionList];
    
    if (params.search) {
      const query = params.search.toLowerCase();
      result = result.filter(execution => 
        execution.id.toLowerCase().includes(query) ||
        execution.testCase.name.toLowerCase().includes(query)
      );
    }
    
    if (params.environment && params.environment !== 'all') {
      const envMapping: Record<string, string> = {
        'production': '生产环境',
        'staging': '预发布环境',
        'development': '开发环境'
      };
      const targetEnv = envMapping[params.environment] || params.environment;
      result = result.filter(execution => execution.environment.includes(targetEnv));
    }
    
    if (params.status && params.status !== 'all') {
      result = result.filter(execution => execution.status === params.status);
    }
    
    // 按开始时间倒序排序
    result.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    
    return result;
  }

  /**
   * 获取所有测试执行列表，支持筛选和分页
   */
  static async getAllExecutions(
    searchQuery: string = '',
    environment: string = 'all',
    status: string = 'all',
    sortField: string = 'startTime',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<TestExecution[]> {
    let result = [...executionList];
    
    // 搜索
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(execution => 
        execution.id.toLowerCase().includes(query) || 
        execution.testCase.name.toLowerCase().includes(query)
      );
    }
    
    // 环境筛选
    if (environment !== 'all') {
      const envMapping: Record<string, string> = {
        'production': '生产环境',
        'staging': '预发布环境',
        'development': '开发环境'
      };
      const targetEnv = envMapping[environment] || environment;
      result = result.filter(execution => execution.environment.includes(targetEnv));
    }
    
    // 状态筛选
    if (status !== 'all') {
      result = result.filter(execution => execution.status === status);
    }
    
    // 排序
    result.sort((a, b) => {
      let aValue: any = a[sortField as keyof TestExecution];
      let bValue: any = b[sortField as keyof TestExecution];
      
      // 处理日期
      if (typeof aValue === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(aValue)) {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue as string).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return result;
  }

  /**
   * 根据ID获取测试执行详情
   */
  static async getExecutionById(id: string): Promise<TestExecution | null> {
    return executions[id] || null;
  }

  /**
   * 更新执行状态
   */
  static async updateExecutionStatus(id: string, status: ExecutionStatus): Promise<TestExecution | null> {
    const execution = executions[id];
    if (!execution) return null;
    
    execution.status = status;
    execution.modified = new Date().toISOString();
    
    // 如果状态为已完成或失败，添加结束时间和持续时间
    if (status === 'completed' || status === 'failed') {
      const now = new Date();
      execution.endTime = now.toISOString();
      
      // 计算持续时间（分钟）
      const startTime = new Date(execution.startTime);
      execution.duration = Math.round((now.getTime() - startTime.getTime()) / 60000);
    }
    
    return execution;
  }
  
  /**
   * 停止测试执行
   */
  static async stopExecution(id: string): Promise<TestExecution | null> {
    return this.updateExecutionStatus(id, 'failed');
  }
  
  /**
   * 开始测试执行
   */
  static async startExecution(id: string): Promise<TestExecution | null> {
    const execution = executions[id];
    if (!execution) return null;
    
    execution.status = 'running';
    execution.startTime = new Date().toISOString();
    execution.modified = execution.startTime;
    
    return execution;
  }
} 