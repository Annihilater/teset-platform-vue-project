// 测试统计数据类型
export interface TestStats {
  passed: number;
  failed: number;
  pending: number;
  total: number;
}

// 用户信息类型
export interface User {
  name: string;
  avatar: string;
}

// 活动信息类型
export interface Activity {
  id: number;
  user: User;
  action: string;
  time: string;
}

// 仪表盘数据类型
export interface DashboardData {
  userName: string;
  stats: TestStats;
  recentActivities: Activity[];
} 