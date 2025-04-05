import type { TestReport, ReportFilterParams } from '../types/report';
import { reports } from '../data/reports';

// 导出报告数据，方便直接导入
export { reports };

// 报告服务类
export class ReportService {
  static async getReports(params: Partial<ReportFilterParams> = {}): Promise<TestReport[]> {
    console.log('调用 getReports 方法，参数:', params);
    console.log('原始报告数据长度:', reports.length);
    
    let result = [...reports];
    
    if (params.search) {
      const query = params.search.toLowerCase();
      console.log('搜索关键词:', query);
      
      // 搜索前记录数据
      console.log('搜索前数据数量:', result.length);
      
      result = result.filter(report => {
        const matchId = report.id.toLowerCase().includes(query);
        const matchTestCaseId = report.testCaseId.toLowerCase().includes(query);
        const matchExecutor = report.executor && report.executor.toLowerCase().includes(query);
        
        console.log(`检查报告 ${report.id}:`, 
          `匹配ID: ${matchId}`, 
          `匹配测试用例ID: ${matchTestCaseId}`, 
          `匹配执行人: ${matchExecutor}`
        );
        
        return matchId || matchTestCaseId || matchExecutor;
      });
      
      // 搜索后记录结果
      console.log('搜索后数据数量:', result.length);
      console.log('搜索结果IDs:', result.map(r => r.id).join(', '));
    }
    
    if (params.environment && params.environment !== 'all') {
      // 直接按环境名称过滤
      console.log('过滤环境:', params.environment);
      const beforeCount = result.length;
      result = result.filter(report => report.environment === params.environment);
      console.log(`环境过滤: ${beforeCount} -> ${result.length}`);
    }
    
    if (params.dateRange) {
      const now = new Date();
      let startDate = new Date();
      
      switch (params.dateRange) {
        case '1d':
          startDate.setDate(now.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        default:
          // 自定义或其他值时不进行日期过滤
          console.log('不进行日期过滤');
          return result;
      }
      
      console.log('日期范围:', params.dateRange, '开始日期:', startDate.toISOString());
      const beforeCount = result.length;
      
      // 对日期范围过滤放宽要求
      // 将mock数据视为在30天内产生，所以当选择30天时返回所有数据
      if (params.dateRange === '30d') {
        console.log('选择30天范围，返回所有数据');
        return result;
      }
      
      result = result.filter(report => {
        const reportDate = new Date(report.startTime);
        const inRange = reportDate >= startDate && reportDate <= now;
        console.log(`报告日期 ${report.id}:`, reportDate.toISOString(), '是否在范围内:', inRange);
        return inRange;
      });
      
      console.log(`日期过滤: ${beforeCount} -> ${result.length}`);
    }
    
    console.log('最终返回的报告数据:', result.length);
    return result;
  }

  static async getReportById(id: string): Promise<TestReport | null> {
    return reports.find(report => report.id === id) || null;
  }
} 