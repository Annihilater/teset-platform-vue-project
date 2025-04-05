import type { TestReport } from '../types/report';

// 获取当前时间
const now = new Date();

// 生成近7天内的日期
function getRecentDate(daysBefore: number): string {
  const date = new Date();
  date.setDate(now.getDate() - daysBefore);
  return date.toISOString();
}

// 测试报告模拟数据
export const reports: TestReport[] = [
  {
    id: 'EXEC-001',
    testCaseId: 'TC-001',
    environment: '生产环境',
    status: 'completed',
    startTime: getRecentDate(6),
    endTime: getRecentDate(6).replace('Z', '').replace(/T(\d{2}):(\d{2}):(\d{2})/, (_, h, m) => `T${Number(h)}:${Number(m) + 15}:00Z`),
    duration: 15,
    executor: '陈思雨',
    logs: ['测试开始', '步骤1完成', '测试成功完成'],
    artifacts: [],
    results: [],
    repositoryInfo: {
      url: 'https://artifactory.example.com/repo',
      branch: 'main',
      commit: 'abc123',
      path: '/test-reports/2024/03/15/EXEC-001/report.html'
    },
    created: getRecentDate(6),
    modified: getRecentDate(6).replace('Z', '').replace(/T(\d{2}):(\d{2}):(\d{2})/, (_, h, m) => `T${Number(h)}:${Number(m) + 15}:00Z`),
  },
  {
    id: 'EXEC-002',
    testCaseId: 'TC-002',
    environment: '预发布环境',
    status: 'completed',
    startTime: getRecentDate(5),
    endTime: getRecentDate(5).replace('Z', '').replace(/T(\d{2}):(\d{2}):(\d{2})/, (_, h, m) => `T${Number(h)}:${Number(m) + 15}:00Z`),
    duration: 15,
    executor: '李明',
    logs: ['测试开始', '处理支付', '测试成功完成'],
    artifacts: [],
    results: [],
    repositoryInfo: {
      url: 'https://artifactory.example.com/repo',
      branch: 'develop',
      commit: 'def456',
      path: '/test-reports/2024/03/15/EXEC-002/report.html'
    },
    created: getRecentDate(5),
    modified: getRecentDate(5).replace('Z', '').replace(/T(\d{2}):(\d{2}):(\d{2})/, (_, h, m) => `T${Number(h)}:${Number(m) + 15}:00Z`),
  },
  {
    id: 'EXEC-003',
    testCaseId: 'TC-003',
    environment: '开发环境',
    status: 'failed',
    startTime: getRecentDate(5),
    endTime: getRecentDate(5).replace('Z', '').replace(/T(\d{2}):(\d{2}):(\d{2})/, (_, h, m) => `T${Number(h)}:${Number(m) + 5}:00Z`),
    duration: 5,
    executor: '王小明',
    logs: ['测试开始', '遇到错误', '测试失败'],
    artifacts: [],
    results: [],
    repositoryInfo: {
      url: 'https://artifactory.example.com/repo',
      branch: 'feature/new-test',
      commit: 'ghi789',
      path: '/test-reports/2024/03/15/EXEC-003/report.html'
    },
    created: getRecentDate(5),
    modified: getRecentDate(5).replace('Z', '').replace(/T(\d{2}):(\d{2}):(\d{2})/, (_, h, m) => `T${Number(h)}:${Number(m) + 5}:00Z`),
  },
  {
    id: 'EXEC-004',
    testCaseId: 'TC-004',
    environment: '生产环境',
    status: 'completed',
    startTime: getRecentDate(4),
    endTime: getRecentDate(4).replace('Z', '').replace(/T(\d{2}):(\d{2}):(\d{2})/, (_, h, m) => `T${Number(h)}:${Number(m) + 20}:00Z`),
    duration: 20,
    executor: '张三',
    logs: ['测试开始', '验证数据库连接', '验证API响应', '测试成功完成'],
    artifacts: [],
    results: [],
    repositoryInfo: {
      url: 'https://artifactory.example.com/repo',
      branch: 'main',
      commit: 'jkl012',
      path: '/test-reports/2024/03/16/EXEC-004/report.html'
    },
    created: getRecentDate(4),
    modified: getRecentDate(4).replace('Z', '').replace(/T(\d{2}):(\d{2}):(\d{2})/, (_, h, m) => `T${Number(h)}:${Number(m) + 20}:00Z`),
  },
  {
    id: 'EXEC-005',
    testCaseId: 'TC-005',
    environment: '开发环境',
    status: 'running',
    startTime: getRecentDate(3),
    duration: 0,
    executor: '李四',
    logs: ['测试开始', '正在执行测试...'],
    artifacts: [],
    results: [],
    repositoryInfo: {
      url: 'https://artifactory.example.com/repo',
      branch: 'feature/user-auth',
      commit: 'mno345',
      path: '/test-reports/2024/03/16/EXEC-005/report.html'
    },
    created: getRecentDate(3),
    modified: getRecentDate(3),
  },
  {
    id: 'EXEC-006',
    testCaseId: 'TC-006',
    environment: '预发布环境',
    status: 'initializing',
    startTime: getRecentDate(2),
    duration: 0,
    executor: '王五',
    logs: ['正在初始化测试环境...'],
    artifacts: [],
    results: [],
    repositoryInfo: {
      url: 'https://artifactory.example.com/repo',
      branch: 'release/1.2.0',
      commit: 'pqr678',
      path: '/test-reports/2024/03/16/EXEC-006/report.html'
    },
    created: getRecentDate(2),
    modified: getRecentDate(2),
  },
  {
    id: 'EXEC-007',
    testCaseId: 'TC-007',
    environment: '生产环境',
    status: 'failed',
    startTime: getRecentDate(2),
    endTime: getRecentDate(2).replace('Z', '').replace(/T(\d{2}):(\d{2}):(\d{2})/, (_, h, m) => `T${Number(h)}:${Number(m) + 15}:00Z`),
    duration: 15,
    executor: '赵六',
    logs: ['测试开始', '数据验证', '数据不匹配，测试失败'],
    artifacts: [],
    results: [],
    repositoryInfo: {
      url: 'https://artifactory.example.com/repo',
      branch: 'main',
      commit: 'stu901',
      path: '/test-reports/2024/03/17/EXEC-007/report.html'
    },
    created: getRecentDate(2),
    modified: getRecentDate(2).replace('Z', '').replace(/T(\d{2}):(\d{2}):(\d{2})/, (_, h, m) => `T${Number(h)}:${Number(m) + 15}:00Z`),
  },
  {
    id: 'EXEC-008',
    testCaseId: 'TC-008',
    environment: '开发环境',
    status: 'completed',
    startTime: getRecentDate(1),
    endTime: getRecentDate(1).replace('Z', '').replace(/T(\d{2}):(\d{2}):(\d{2})/, (_, h, m) => `T${Number(h)}:${Number(m) + 30}:00Z`),
    duration: 30,
    executor: '孙七',
    logs: ['测试开始', '登录验证', '权限验证', '功能测试', '测试成功完成'],
    artifacts: [],
    results: [],
    repositoryInfo: {
      url: 'https://artifactory.example.com/repo',
      branch: 'feature/admin-panel',
      commit: 'vwx234',
      path: '/test-reports/2024/03/17/EXEC-008/report.html'
    },
    created: getRecentDate(1),
    modified: getRecentDate(1).replace('Z', '').replace(/T(\d{2}):(\d{2}):(\d{2})/, (_, h, m) => `T${Number(h)}:${Number(m) + 30}:00Z`),
  },
  {
    id: 'EXEC-009',
    testCaseId: 'TC-009',
    environment: '预发布环境',
    status: 'completed',
    startTime: getRecentDate(0),
    endTime: getRecentDate(0).replace('Z', '').replace(/T(\d{2}):(\d{2}):(\d{2})/, (_, h, m) => `T${Number(h)}:${Number(m) + 10}:00Z`),
    duration: 10,
    executor: '周八',
    logs: ['测试开始', '接口响应验证', '测试成功完成'],
    artifacts: [],
    results: [],
    repositoryInfo: {
      url: 'https://artifactory.example.com/repo',
      branch: 'release/1.3.0',
      commit: 'yza567',
      path: '/test-reports/2024/03/18/EXEC-009/report.html'
    },
    created: getRecentDate(0),
    modified: getRecentDate(0).replace('Z', '').replace(/T(\d{2}):(\d{2}):(\d{2})/, (_, h, m) => `T${Number(h)}:${Number(m) + 10}:00Z`),
  },
  {
    id: 'EXEC-010',
    testCaseId: 'TC-010',
    environment: '生产环境',
    status: 'completed',
    startTime: getRecentDate(0),
    endTime: getRecentDate(0).replace('Z', '').replace(/T(\d{2}):(\d{2}):(\d{2})/, (_, h, m) => `T${Number(h)}:${Number(m) + 15}:00Z`),
    duration: 15,
    executor: '吴九',
    logs: ['测试开始', '数据验证', '性能检查', '测试成功完成'],
    artifacts: [],
    results: [],
    repositoryInfo: {
      url: 'https://artifactory.example.com/repo',
      branch: 'main',
      commit: 'bcd890',
      path: '/test-reports/2024/03/18/EXEC-010/report.html'
    },
    created: getRecentDate(0),
    modified: getRecentDate(0).replace('Z', '').replace(/T(\d{2}):(\d{2}):(\d{2})/, (_, h, m) => `T${Number(h)}:${Number(m) + 15}:00Z`),
  }
]; 