export default {
  common: {
    appName: '测试平台',
    loading: '加载中...',
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    create: '创建',
    search: '搜索',
    filter: '筛选',
    actions: '操作',
    status: '状态',
    name: '名称',
    description: '描述',
    details: '详情',
    yes: '是',
    no: '否',
    back: '返回',
    next: '下一步',
    submit: '提交'
  },
  auth: {
    login: '登录',
    logout: '退出登录',
    username: '用户名',
    password: '密码',
    register: '注册',
    forgotPassword: '忘记密码？',
    loginButton: '登录',
    registerButton: '注册',
    noAccount: '没有账号？',
    alreadyAccount: '已有账号？',
    loginHere: '点此登录',
    registerHere: '点此注册',
    demoCredentials: '演示账号',
    passwordRequirements: '密码至少需要 {length} 个字符'
  },
  navigation: {
    dashboard: '仪表盘',
    projects: '项目',
    recentRuns: '最近运行',
    analytics: '分析',
    testCases: '测试用例',
    testExecution: '测试执行',
    defects: '缺陷',
    testPlans: '测试计划',
    environments: '环境',
    team: '团队',
    settings: '设置',
    reports: '报告',
    overview: '概览',
    workflow: '工作流',
    sections: {
      overview: '概览',
      projects: '项目',
      testPlans: '测试计划',
      testCases: '测试用例',
      execution: '执行',
      reports: '报告',
      team: '团队',
      configuration: '配置'
    }
  },
  dashboard: {
    title: '仪表盘',
    subtitle: '测试自动化状态概览',
    metrics: {
      totalTests: '总测试数',
      passRate: '通过率',
      avgDuration: '平均耗时',
      failedTests: '失败测试'
    },
    cards: {
      recentExecutions: '最近测试执行',
      testSuites: '测试套件',
      environments: '测试环境',
      upcomingRuns: '即将运行'
    }
  },
  testCase: {
    id: 'ID',
    name: '名称',
    status: {
      passed: '通过',
      failed: '失败',
      pending: '等待中',
      blocked: '被阻塞',
      running: '运行中',
      queued: '队列中'
    },
    priority: '优先级',
    duration: '耗时',
    automated: '自动化',
    modified: '修改时间',
    tags: '标签',
    steps: '步骤',
    expected: '期望结果',
    actual: '实际结果',
    passRate: '通过率',
    lastRun: '最近运行',
    tests: '测试用例'
  },
  settings: {
    general: '通用',
    account: '账户',
    security: '安全',
    integrations: '集成',
    notifications: '通知',
    apiKeys: 'API密钥',
    about: '关于'
  },
  workflow: {
    title: '工作流',
    configuration: '工作流配置',
    createAndManage: '创建和管理工作流',
    save: '保存',
    loading: '加载中...',
    editor: '工作流编辑器',
    list: {
      title: '工作流管理',
      description: '创建和管理您的工作流',
      searchPlaceholder: '搜索工作流...',
      create: '新建工作流',
      workflows: '工作流列表',
      loading: '正在加载工作流列表...',
      empty: {
        title: '暂无工作流',
        description: '点击下方按钮创建您的第一个工作流'
      },
      table: {
        name: '名称',
        description: '描述',
        createdAt: '创建时间',
        updatedAt: '更新时间',
        actions: '操作'
      },
      actions: {
        edit: '编辑',
        delete: '删除'
      },
      success: {
        delete: '工作流删除成功'
      },
      error: {
        fetch: '获取工作流列表失败',
        delete: '删除工作流失败'
      }
    },
    nodes: {
      start: '开始',
      end: '结束',
      answer: '直接回答',
      llm: '模型调用',
      condition: '条件判断'
    },
    startNodeDescription: '工作流的入口点',
    endNodeDescription: '工作流的结束点',
    answerNodeDescription: '返回直接回答的节点',
    llmNodeDescription: '调用模型进行处理的节点',
    conditionNodeDescription: '根据条件判断下一步的节点',
    conditionTrue: '满足条件时',
    conditionFalse: '不满足条件时',
    actions: {
      undo: '撤销',
      redo: '重做',
      zoomIn: '放大',
      zoomOut: '缩小',
      reset: '重置视图',
      configure: '配置'
    },
    labels: {
      configuration: '配置',
      properties: '属性',
      description: '描述',
      name: '名称',
      tip: '提示'
    },
    namePlaceholder: '请输入节点名称',
    descriptionPlaceholder: '请输入节点描述',
    startNodeTip: '开始节点是工作流的入口点，用户输入将从这里开始处理。',
    endNodeTip: '结束节点标记工作流的终止点，工作流将在此处结束执行。'
  },
  error: {
    pageNotFound: '页面未找到',
    pageNotFoundMessage: '您访问的页面不存在或已被移除',
    returnHome: '返回首页',
    unauthorized: '未授权',
    serverError: '服务器错误'
  }
}; 