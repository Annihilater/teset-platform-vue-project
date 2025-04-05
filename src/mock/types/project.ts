// 项目状态
export type ProjectStatus = 'active' | 'inactive';

// 项目统计信息
export interface ProjectStats {
  testCount: number;
  passRate: number;
  automationRate: number;
  defectCount: number;
}

// 项目信息
export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  testCount: number;
  passRate: number;
  lastUpdate: string;
  teamCount: number;
  environmentCount: number;
  automationRate: number;
  defectCount: number;
  created: string;
  modified: string;
}

// 项目过滤参数
export interface ProjectFilterParams {
  status: string;
  search: string;
} 