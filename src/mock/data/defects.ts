import type { Defect, DefectColumn } from '../types/defect';

// 模拟缺陷数据
export const defects: Record<string, Defect> = {
  'DEF-001': {
    id: 'DEF-001',
    title: "登录页面在某些移动设备上显示异常",
    description: "在iPhone 12和小米11上，登录页面的输入框位置偏移，导致部分用户无法看到输入内容。",
    status: "新建",
    severity: "严重",
    priority: "P0",
    assignee: "张三",
    created: "2023-11-20 14:30",
    modified: "2023-11-22 09:15",
    jiraId: "PROJ-1234",
    jiraUrl: "https://jira.example.com/browse/PROJ-1234",
    jiraProject: "测试平台项目",
    jiraModule: "用户界面",
    version: "v2.3.0",
    comments: [
      {
        id: "1",
        user: {
          id: "u1",
          name: "李四"
        },
        content: "已经复现，确实是UI适配问题，需要调整响应式布局。",
        created: "2023-11-20 15:45"
      },
      {
        id: "2",
        user: {
          id: "u2",
          name: "王五"
        },
        content: "已经添加到本迭代的修复计划中，预计三天内解决。",
        created: "2023-11-21 10:20"
      }
    ],
    steps: [
      {
        description: "在iPhone 12上打开登录页面",
        expected: "输入框应正常显示，且输入内容完全可见",
        actual: "输入框位置偏移，输入内容部分不可见"
      },
      {
        description: "尝试输入用户名和密码",
        expected: "可以正常输入并看到全部内容",
        actual: "输入内容显示不完整，部分字符被截断"
      }
    ],
    attachments: [
      {
        id: "a1",
        name: "登录页面错误截图.png",
        url: "#",
        size: 1240000,
        created: "2023-11-20 14:35"
      },
      {
        id: "a2",
        name: "问题复现视频.mp4",
        url: "#",
        size: 8540000,
        created: "2023-11-20 14:40"
      }
    ]
  },
  'BUG-001': {
    id: 'BUG-001',
    title: '登录按钮在Safari浏览器上不可点击',
    description: '使用Safari浏览器访问登录页面时，登录按钮无法点击。在Chrome和Firefox上正常工作。',
    status: '新建',
    severity: '高',
    priority: 'P1',
    assignee: '张三',
    created: '2024-03-15',
    jiraId: 'PROJ-1234',
    jiraUrl: 'https://jira.example.com/browse/PROJ-1234',
    jiraProject: '核心系统',
    jiraModule: '用户认证',
    version: 'v2.3.1'
  },
  'BUG-002': {
    id: 'BUG-002',
    title: '支付完成后未显示确认信息',
    description: '用户完成支付流程后，系统未显示任何确认信息，导致用户不确定交易是否成功。',
    status: '进行中',
    severity: '严重',
    priority: 'P0',
    assignee: '李四',
    created: '2024-03-14',
    jiraId: 'PROJ-1235',
    jiraUrl: 'https://jira.example.com/browse/PROJ-1235',
    jiraProject: '支付系统',
    jiraModule: '交易流程',
    version: 'v2.3.0'
  },
  'BUG-003': {
    id: 'BUG-003',
    title: '搜索结果分页错误',
    description: '当搜索结果超过10条时，分页显示错误，点击下一页会返回到第一页的结果。',
    status: '已解决',
    severity: '中',
    priority: 'P2',
    assignee: '王五',
    created: '2024-03-12',
    jiraId: 'PROJ-1236',
    jiraUrl: 'https://jira.example.com/browse/PROJ-1236',
    jiraProject: '搜索服务',
    jiraModule: '结果展示',
    version: 'v2.2.5'
  },
  'BUG-004': {
    id: 'BUG-004',
    title: '产品图片在移动端显示不完整',
    description: '在移动设备上查看产品详情页时，产品图片被裁剪，无法完整显示。',
    status: '已关闭',
    severity: '低',
    priority: 'P3',
    assignee: '赵六',
    created: '2024-03-10',
    jiraId: 'PROJ-1237',
    jiraUrl: 'https://jira.example.com/browse/PROJ-1237',
    jiraProject: '电商前端',
    jiraModule: '产品详情',
    version: 'v2.3.0'
  },
  'BUG-005': {
    id: 'BUG-005',
    title: '注册表单提交后服务器500错误',
    description: '新用户在提交注册表单时，偶尔会收到服务器500错误响应，但用户账户仍被成功创建。',
    status: '待验证',
    severity: '严重',
    priority: 'P1',
    assignee: '张三',
    created: '2024-03-09',
    jiraId: 'PROJ-1238',
    jiraUrl: 'https://jira.example.com/browse/PROJ-1238',
    jiraProject: '核心系统',
    jiraModule: '用户服务',
    version: 'v2.3.1'
  }
};

// 缺陷列表配置
export const defectColumns: DefectColumn[] = [
  { field: 'id', label: '缺陷ID' },
  { field: 'title', label: '标题' },
  { field: 'description', label: '描述' },
  { field: 'status', label: '状态' },
  { field: 'priority', label: '优先级' },
  { field: 'assignee', label: '指派给' },
  { field: 'created', label: '创建时间' }
];

// 缺陷列表数据
export const defectList: Defect[] = [
  {
    id: 'BUG-001',
    title: '登录按钮在Safari浏览器上不可点击',
    description: '使用Safari浏览器访问登录页面时，登录按钮无法点击。在Chrome和Firefox上正常工作。',
    status: '新建',
    severity: '高',
    priority: 'P1',
    assignee: '张三',
    created: '2024-03-15',
    jiraId: 'PROJ-1234',
    jiraUrl: 'https://jira.example.com/browse/PROJ-1234',
    jiraProject: '核心系统',
    jiraModule: '用户认证',
    version: 'v2.3.1'
  },
  {
    id: 'BUG-002',
    title: '支付完成后未显示确认信息',
    description: '用户完成支付流程后，系统未显示任何确认信息，导致用户不确定交易是否成功。',
    status: '进行中',
    severity: '严重',
    priority: 'P0',
    assignee: '李四',
    created: '2024-03-14',
    jiraId: 'PROJ-1235',
    jiraUrl: 'https://jira.example.com/browse/PROJ-1235',
    jiraProject: '支付系统',
    jiraModule: '交易流程',
    version: 'v2.3.0'
  },
  {
    id: 'BUG-003',
    title: '搜索结果分页错误',
    description: '当搜索结果超过10条时，分页显示错误，点击下一页会返回到第一页的结果。',
    status: '已解决',
    severity: '中',
    priority: 'P2',
    assignee: '王五',
    created: '2024-03-12',
    jiraId: 'PROJ-1236',
    jiraUrl: 'https://jira.example.com/browse/PROJ-1236',
    jiraProject: '搜索服务',
    jiraModule: '结果展示',
    version: 'v2.2.5'
  },
  {
    id: 'BUG-004',
    title: '产品图片在移动端显示不完整',
    description: '在移动设备上查看产品详情页时，产品图片被裁剪，无法完整显示。',
    status: '已关闭',
    severity: '低',
    priority: 'P3',
    assignee: '赵六',
    created: '2024-03-10',
    jiraId: 'PROJ-1237',
    jiraUrl: 'https://jira.example.com/browse/PROJ-1237',
    jiraProject: '电商前端',
    jiraModule: '产品详情',
    version: 'v2.3.0'
  },
  {
    id: 'BUG-005',
    title: '注册表单提交后服务器500错误',
    description: '新用户在提交注册表单时，偶尔会收到服务器500错误响应，但用户账户仍被成功创建。',
    status: '待验证',
    severity: '严重',
    priority: 'P1',
    assignee: '张三',
    created: '2024-03-09',
    jiraId: 'PROJ-1238',
    jiraUrl: 'https://jira.example.com/browse/PROJ-1238',
    jiraProject: '核心系统',
    jiraModule: '用户服务',
    version: 'v2.3.1'
  }
]; 