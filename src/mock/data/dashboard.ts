import type { DashboardData } from '../types/dashboard';

export const dashboardData: DashboardData = {
  userName: '张工',
  stats: {
    passed: 245,
    failed: 12,
    pending: 34,
    total: 291
  },
  recentActivities: [
    {
      id: 1,
      user: {
        name: '李明',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      action: '执行了登录功能测试',
      time: '10分钟前'
    },
    {
      id: 2,
      user: {
        name: '王红',
        avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      action: '更新了测试用例TC-001',
      time: '30分钟前'
    },
    {
      id: 3,
      user: {
        name: '张伟',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80'
      },
      action: '创建了新的测试计划',
      time: '2小时前'
    }
  ]
}; 