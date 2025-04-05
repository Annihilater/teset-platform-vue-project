import type { Project } from '../types/project';

// 项目数据
export const projects: Project[] = [
  {
    id: '1',
    name: 'Web应用测试',
    description: '电商网站的功能和性能测试项目',
    status: 'active',
    testCount: 138,
    passRate: 92,
    lastUpdate: '2024-03-18',
    teamCount: 2,
    environmentCount: 3,
    automationRate: 75,
    defectCount: 12,
    created: '2024-03-01T00:00:00Z',
    modified: '2024-03-18T00:00:00Z'
  },
  {
    id: '2',
    name: 'API测试自动化',
    description: '后端API接口的自动化测试项目',
    status: 'active',
    testCount: 76,
    passRate: 87,
    lastUpdate: '2024-03-15',
    teamCount: 1,
    environmentCount: 2,
    automationRate: 90,
    defectCount: 5,
    created: '2024-03-01T00:00:00Z',
    modified: '2024-03-15T00:00:00Z'
  },
  {
    id: '3',
    name: '移动应用测试',
    description: 'iOS和Android平台的兼容性测试',
    status: 'inactive',
    testCount: 45,
    passRate: 60,
    lastUpdate: '2024-02-28',
    teamCount: 1,
    environmentCount: 4,
    automationRate: 45,
    defectCount: 15,
    created: '2024-02-01T00:00:00Z',
    modified: '2024-02-28T00:00:00Z'
  }
]; 