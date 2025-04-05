import type { TestPlan, TestPlanFilterParams, TestPlanStatus, TestPlanPhaseType } from '../types/testPlan';
import { testPlans, testPlanList } from '../data/testPlans';

export class TestPlanService {
  /**
   * 获取所有测试计划列表
   */
  static async getAllTestPlans(): Promise<TestPlan[]> {
    return Promise.resolve(testPlanList);
  }

  /**
   * 按条件筛选测试计划列表
   */
  static async getFilteredTestPlans(
    searchQuery: string = '',
    status: string = 'all',
    phase: string = 'all',
    teamId?: string,
    ownerId?: string
  ): Promise<TestPlan[]> {
    let result = [...testPlanList];
    
    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(plan => 
        plan.id.toLowerCase().includes(query) ||
        plan.name.toLowerCase().includes(query) ||
        plan.description.toLowerCase().includes(query)
      );
    }

    // 状态过滤
    if (status && status !== 'all') {
      result = result.filter(plan => plan.status === status);
    }

    // 阶段过滤
    if (phase && phase !== 'all') {
      result = result.filter(plan => plan.phase === phase);
    }

    // 团队过滤
    if (teamId) {
      result = result.filter(plan => plan.team.id === teamId);
    }

    // 负责人过滤
    if (ownerId) {
      result = result.filter(plan => plan.owner.id === ownerId);
    }

    // 排序：先展示活跃的，然后是草稿，然后是已完成和归档的
    result.sort((a, b) => {
      const order: Record<TestPlanStatus, number> = {
        'active': 0,
        'draft': 1,
        'completed': 2,
        'archived': 3
      };
      return order[a.status] - order[b.status] || 
             new Date(b.modified).getTime() - new Date(a.modified).getTime();
    });
    
    return Promise.resolve(result);
  }

  /**
   * 根据ID获取测试计划
   */
  static async getTestPlanById(id: string): Promise<TestPlan | null> {
    return Promise.resolve(testPlans[id] || null);
  }

  /**
   * 更新测试计划状态
   */
  static async updateTestPlanStatus(id: string, status: TestPlanStatus): Promise<TestPlan | null> {
    const plan = testPlans[id];
    if (!plan) return null;
    
    plan.status = status;
    plan.modified = new Date().toISOString();
    
    return Promise.resolve(plan);
  }

  /**
   * 更新测试计划阶段
   */
  static async updateTestPlanPhase(id: string, phase: TestPlanPhaseType): Promise<TestPlan | null> {
    const plan = testPlans[id];
    if (!plan) return null;
    
    plan.phase = phase;
    plan.modified = new Date().toISOString();
    
    return Promise.resolve(plan);
  }

  /**
   * 获取测试计划统计数据
   */
  static async getTestPlanStats(): Promise<{
    total: number;
    active: number;
    completed: number;
    draft: number;
    archived: number;
  }> {
    const stats = {
      total: testPlanList.length,
      active: testPlanList.filter(plan => plan.status === 'active').length,
      completed: testPlanList.filter(plan => plan.status === 'completed').length,
      draft: testPlanList.filter(plan => plan.status === 'draft').length,
      archived: testPlanList.filter(plan => plan.status === 'archived').length
    };
    
    return Promise.resolve(stats);
  }
} 