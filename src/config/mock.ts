import type { TestCase, TestSuite, TestEnvironment } from '@/types';

export const mockTestCases: TestCase[] = [
  {
    id: '1',
    name: 'User Authentication Flow',
    status: 'passed',
    priority: 'high',
    tags: ['auth', 'critical-path'],
    duration: 15,
    automated: true,
    steps: [
      {
        id: 'step1',
        description: 'Navigate to login page',
        expectedResult: 'Login form is displayed',
        actualResult: 'Login form displayed correctly',
        status: 'passed'
      }
    ],
    created: '2024-03-01T00:00:00Z',
    modified: '2024-03-15T10:45:00Z',
    version: '1.0.0'
  },
  {
    id: '2',
    name: 'Payment Processing',
    status: 'failed',
    priority: 'critical',
    tags: ['payment', 'integration'],
    duration: 20,
    automated: true,
    steps: [
      {
        id: 'step1',
        description: 'Initialize payment',
        expectedResult: 'Payment form loads',
        actualResult: 'Error loading form',
        status: 'failed'
      }
    ],
    created: '2024-03-01T00:00:00Z',
    modified: '2024-03-15T11:00:00Z',
    version: '1.0.0'
  }
];

export const mockTestSuites: TestSuite[] = [
  {
    id: '1',
    name: 'Core Features',
    description: 'Essential application functionality tests',
    testCount: 25,
    passRate: 92,
    lastRun: '2024-03-15',
    owner: 'Sarah Chen',
    tags: ['core', 'regression'],
    automated: true,
    created: '2024-03-01T00:00:00Z',
    modified: '2024-03-15T00:00:00Z',
    version: '1.0.0'
  }
];

export const mockEnvironments: TestEnvironment[] = [
  {
    id: '1',
    name: 'Production',
    status: 'active',
    type: 'production',
    url: 'https://app.example.com',
    version: '1.0.0',
    lastDeployment: '2024-03-15',
    health: {
      cpu: 45,
      memory: 60,
      status: 'healthy'
    },
    configuration: {
      operatingSystem: 'Ubuntu 22.04',
      browser: 'Chrome',
      database: 'PostgreSQL',
      services: ['API', 'Worker', 'Cache']
    },
    maintainers: ['Sarah Chen', 'Mike Johnson'],
    created: '2024-03-01T00:00:00Z',
    modified: '2024-03-15T00:00:00Z'
  }
]; 