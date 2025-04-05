import type { TestRun } from '../types/recentRun';

// 最近运行的测试数据
export const recentRuns: TestRun[] = [
  {
    id: 1,
    name: "登录功能回归测试",
    status: "success",
    time: "10分钟前",
    duration: "2分钟",
  },
  {
    id: 2,
    name: "支付流程测试",
    status: "failed",
    time: "30分钟前",
    duration: "5分钟",
  },
  {
    id: 3,
    name: "性能压力测试",
    status: "running",
    time: "1小时前",
    duration: "进行中",
  },
  {
    id: 4,
    name: "安全扫描测试",
    status: "pending",
    time: "2小时前",
    duration: "待执行",
  },
  {
    id: 5,
    name: "接口集成测试",
    status: "success",
    time: "3小时前",
    duration: "8分钟",
  },
  {
    id: 6,
    name: "数据库备份测试",
    status: "success",
    time: "4小时前",
    duration: "3分钟",
  },
  {
    id: 7,
    name: "UI兼容性测试",
    status: "failed",
    time: "5小时前",
    duration: "12分钟",
  },
  {
    id: 8,
    name: "负载均衡测试",
    status: "pending",
    time: "6小时前",
    duration: "待执行",
  }
]; 