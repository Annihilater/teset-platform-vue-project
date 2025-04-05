import type { TestCase, TestCaseFilterParams } from '../types/testCase';
import { testCases, testCaseList, testCaseColumns } from '../data/testCases';

export class TestCaseService {
  /**
   * 获取测试用例列表
   * @param search 搜索关键词
   * @param filter 过滤参数
   * @param sortField 排序字段
   * @param sortOrder 排序方向
   * @returns 过滤后的测试用例列表
   */
  static getTestCaseList(
    search?: string, 
    filter?: TestCaseFilterParams,
    sortField: string = 'id',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<TestCase[]> {
    return new Promise((resolve) => {
      // 模拟API延迟
      setTimeout(() => {
        let result = [...testCaseList];
        
        // 搜索
        if (search) {
          const searchLower = search.toLowerCase();
          result = result.filter(testCase => {
            return (
              testCase.name.toLowerCase().includes(searchLower) ||
              testCase.description?.toLowerCase().includes(searchLower) ||
              testCase.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
          });
        }
        
        // 过滤
        if (filter) {
          // 按状态过滤
          if (filter.status && filter.status.length > 0) {
            result = result.filter(testCase => filter.status?.includes(testCase.status));
          }
          
          // 按优先级过滤
          if (filter.priority && filter.priority.length > 0) {
            result = result.filter(testCase => filter.priority?.includes(testCase.priority));
          }
          
          // 按自动化状态过滤
          if (filter.automated !== undefined) {
            result = result.filter(testCase => testCase.automated === filter.automated);
          }
          
          // 按负责人过滤
          if (filter.assignee && filter.assignee.length > 0) {
            result = result.filter(testCase => 
                testCase.assignee && filter.assignee?.includes(testCase.assignee)
              );
          }
          
          // 按日期范围过滤
          if (filter.dateFrom || filter.dateTo) {
            result = result.filter(testCase => {
              const testDate = new Date(testCase.lastRun || testCase.modified);
              
              if (filter.dateFrom && filter.dateTo) {
                const from = new Date(filter.dateFrom);
                const to = new Date(filter.dateTo);
                return testDate >= from && testDate <= to;
              } else if (filter.dateFrom) {
                const from = new Date(filter.dateFrom);
                return testDate >= from;
              } else if (filter.dateTo) {
                const to = new Date(filter.dateTo);
                return testDate <= to;
              }
              
              return true;
            });
          }
          
          // 按标签过滤
          if (filter.tags && filter.tags.length > 0) {
            result = result.filter(testCase => {
              return filter.tags?.some(tag => testCase.tags.includes(tag));
            });
          }
        }
        
        // 排序
        result.sort((a, b) => {
          let valueA: any = a[sortField as keyof TestCase];
          let valueB: any = b[sortField as keyof TestCase];
          
          // 对日期字符串进行特殊处理
          if (typeof valueA === 'string' && valueA.match(/^\d{4}-\d{2}-\d{2}/) && 
              typeof valueB === 'string' && valueB.match(/^\d{4}-\d{2}-\d{2}/)) {
            valueA = new Date(valueA);
            valueB = new Date(valueB);
          }
          
          if (valueA === valueB) return 0;
          
          if (valueA === undefined || valueA === null) return sortOrder === 'asc' ? -1 : 1;
          if (valueB === undefined || valueB === null) return sortOrder === 'asc' ? 1 : -1;
          
          if (typeof valueA === 'string' && typeof valueB === 'string') {
            return sortOrder === 'asc' 
              ? valueA.localeCompare(valueB) 
              : valueB.localeCompare(valueA);
          }
          
          return sortOrder === 'asc' ? (valueA < valueB ? -1 : 1) : (valueA < valueB ? 1 : -1);
        });
        
        resolve(result);
      }, 0);
    });
  }
  
  /**
   * 获取测试用例详情
   * @param id 测试用例ID
   * @returns 测试用例详情
   */
  static getTestCaseById(id: string): Promise<TestCase | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const testCase = testCases[id];
        resolve(testCase || null);
      }, 300);
    });
  }

  /**
   * 获取测试用例列表列配置
   * @returns 列配置
   */
  static getTestCaseColumns() {
    return testCaseColumns;
  }
}

export { testCases, testCaseList, testCaseColumns }; 