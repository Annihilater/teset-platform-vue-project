import type { TestRun, TestRunFilterParams } from '../types/recentRun';
import { recentRuns } from '../data/recentRuns';

// 导出数据，方便直接导入
export { recentRuns };

// 最近运行测试服务类
export class RecentRunService {
  /**
   * 获取最近运行的测试列表
   */
  static async getRecentRuns(params: Partial<TestRunFilterParams> = {}): Promise<TestRun[]> {
    console.log('获取最近运行测试，参数:', params);
    let result = [...recentRuns];
    
    // 根据搜索关键词过滤
    if (params.search) {
      const query = params.search.toLowerCase();
      result = result.filter(run => 
        run.name.toLowerCase().includes(query)
      );
    }
    
    // 根据状态过滤
    if (params.status && params.status !== 'all') {
      result = result.filter(run => run.status === params.status);
    }
    
    // 按照ID降序排序
    result.sort((a, b) => b.id - a.id);
    
    console.log('过滤后结果数量:', result.length);
    return result;
  }

  /**
   * 根据ID获取测试运行详情
   */
  static async getRunById(id: number): Promise<TestRun | null> {
    return recentRuns.find(run => run.id === id) || null;
  }
} 