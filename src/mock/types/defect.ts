// 缺陷状态
export type DefectStatus = '新建' | '进行中' | '已解决' | '已关闭' | '待验证';

// 缺陷严重程度
export type DefectSeverity = '严重' | '高' | '中' | '低';

// 缺陷优先级
export type DefectPriority = 'P0' | 'P1' | 'P2' | 'P3';

// 缺陷用户
export interface DefectUser {
  id: string;
  name: string;
}

// 缺陷评论
export interface DefectComment {
  id: string;
  user?: DefectUser;
  content: string;
  created: string;
}

// 缺陷步骤
export interface DefectStep {
  description: string;
  expected: string;
  actual: string;
}

// 缺陷附件
export interface DefectAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  created: string;
}

// 缺陷过滤参数
export interface DefectFilterParams {
  severity: string;
  status: string;
  assignee: string;
  dateRange: [Date, Date] | null;
  priority: string;
  jiraProject: string;
}

// 缺陷列定义
export interface DefectColumn {
  field: string;
  label: string;
}

// 缺陷数据
export interface Defect {
  id: string;
  title: string;
  description: string;
  status: DefectStatus;
  severity: DefectSeverity;
  priority: DefectPriority;
  assignee: string;
  created: string;
  modified?: string;
  jiraId: string;
  jiraUrl: string;
  jiraProject: string;
  jiraModule: string;
  version?: string;
  comments?: DefectComment[];
  steps?: DefectStep[];
  attachments?: DefectAttachment[];
} 