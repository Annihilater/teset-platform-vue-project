export default {
  common: {
    appName: 'Test Platform',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    search: 'Search',
    filter: 'Filter',
    actions: 'Actions',
    status: 'Status',
    name: 'Name',
    description: 'Description',
    details: 'Details',
    yes: 'Yes',
    no: 'No',
    back: 'Back',
    next: 'Next',
    submit: 'Submit'
  },
  auth: {
    login: 'Login',
    logout: 'Logout',
    username: 'Username',
    password: 'Password',
    register: 'Register',
    forgotPassword: 'Forgot Password?',
    loginButton: 'Login',
    registerButton: 'Register',
    noAccount: 'Don\'t have an account?',
    alreadyAccount: 'Already have an account?',
    loginHere: 'Login here',
    registerHere: 'Register here',
    demoCredentials: 'Demo credentials',
    passwordRequirements: 'Password must be at least {length} characters'
  },
  navigation: {
    dashboard: 'Dashboard',
    projects: 'Projects',
    recentRuns: 'Recent Runs',
    analytics: 'Analytics',
    testCases: 'Test Cases',
    testExecution: 'Test Execution',
    defects: 'Defects',
    testPlans: 'Test Plans',
    environments: 'Environments',
    team: 'Team',
    settings: 'Settings',
    reports: 'Reports',
    overview: 'Overview',
    workflow: 'Workflow',
    workflowEditor: 'Workflow Editor',
    sections: {
      overview: 'Overview',
      projects: 'Projects',
      testPlans: 'Test Plans',
      testCases: 'Test Cases',
      execution: 'Execution',
      reports: 'Reports',
      team: 'Team',
      configuration: 'Configuration'
    }
  },
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Overview of your test automation status',
    metrics: {
      totalTests: 'Total Tests',
      passRate: 'Pass Rate',
      avgDuration: 'Avg Duration',
      failedTests: 'Failed Tests'
    },
    cards: {
      recentExecutions: 'Recent Test Executions',
      testSuites: 'Test Suites',
      environments: 'Environments',
      upcomingRuns: 'Upcoming Runs'
    }
  },
  testCase: {
    id: 'ID',
    name: 'Name',
    status: {
      passed: 'Passed',
      failed: 'Failed',
      pending: 'Pending',
      blocked: 'Blocked',
      running: 'Running',
      queued: 'Queued'
    },
    priority: 'Priority',
    duration: 'Duration',
    automated: 'Automated',
    modified: 'Modified',
    tags: 'Tags',
    steps: 'Steps',
    expected: 'Expected Result',
    actual: 'Actual Result',
    passRate: 'Pass Rate',
    lastRun: 'Last Run',
    tests: 'tests'
  },
  settings: {
    general: 'General',
    account: 'Account',
    security: 'Security',
    integrations: 'Integrations',
    notifications: 'Notifications',
    apiKeys: 'API Keys',
    about: 'About'
  },
  workflow: {
    title: 'Workflow',
    configuration: 'Workflow Configuration',
    createAndManage: 'Create and manage automation workflows',
    save: 'Save Workflow',
    loading: 'Loading workflow...',
    nodes: {
      start: 'Start',
      end: 'End',
      answer: 'Direct Answer',
      llm: 'Model Call',
      condition: 'Condition'
    },
    startNodeDescription: 'Entry point of the workflow',
    endNodeDescription: 'End point of the workflow',
    answerNodeDescription: 'Node for returning direct answers',
    llmNodeDescription: 'Node for model processing',
    conditionNodeDescription: 'Node for conditional branching',
    conditionTrue: 'When condition is true',
    conditionFalse: 'When condition is false',
    actions: {
      undo: 'Undo',
      redo: 'Redo',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      reset: 'Reset View',
      configure: 'Configure'
    },
    labels: {
      configuration: 'Configuration',
      properties: 'Properties',
      description: 'Description',
      name: 'Name',
      tip: 'Tip'
    },
    namePlaceholder: 'Enter node name',
    descriptionPlaceholder: 'Enter node description',
    startNodeTip: 'The start node is the entry point of the workflow, user input will be processed from here.',
    endNodeTip: 'The end node marks the termination point of the workflow, execution will end here.'
  },
  error: {
    pageNotFound: 'Page Not Found',
    pageNotFoundMessage: 'The page you are looking for does not exist or has been removed.',
    returnHome: 'Return to Home',
    unauthorized: 'Unauthorized',
    serverError: 'Server Error'
  }
}; 