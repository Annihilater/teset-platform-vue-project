import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

// 视图组件
const Dashboard = () => import('@/views/Dashboard.vue');
const RecentRuns = () => import('@/views/RecentRuns.vue');
const Analytics = () => import('@/views/Analytics.vue');
const TestCases = () => import('@/views/TestCases.vue');
const TestCaseDetail = () => import('@/views/TestCaseDetail.vue');
const TestExecution = () => import('@/views/TestExecution.vue');
const Defects = () => import('@/views/Defects.vue');
const TestPlans = () => import('@/views/TestPlans.vue');
const Environments = () => import('@/views/Environments.vue');
const Team = () => import('@/views/Team.vue');
const Settings = () => import('@/views/Settings.vue');
const Projects = () => import('@/views/Projects.vue');
const Reports = () => import('@/views/Reports.vue');
const Login = () => import('@/views/auth/Login.vue');
const Register = () => import('@/views/auth/Register.vue');
const NotFound = () => import('@/views/NotFound.vue');
const DefectDetail = () => import('@/views/DefectDetail.vue');
const WorkflowList = () => import('@/views/WorkflowList.vue');
const WorkflowEditor = () => import('@/views/WorkflowEditor.vue');
const WorkflowBuilder = () => import('@/views/WorkflowBuilder.vue');

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/recent-runs',
    name: 'recent-runs',
    component: RecentRuns,
    meta: { requiresAuth: true }
  },
  {
    path: '/analytics',
    name: 'analytics',
    component: Analytics,
    meta: { requiresAuth: true }
  },
  {
    path: '/test-cases',
    name: 'test-cases',
    component: TestCases,
    meta: { requiresAuth: true }
  },
  {
    path: '/test-cases/:id',
    name: 'testCase',
    component: TestCaseDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/test-execution',
    name: 'testExecution',
    component: TestExecution,
    meta: { requiresAuth: true }
  },
  {
    path: '/test-execution/:id',
    name: 'executionDetails',
    component: TestExecution,
    meta: { requiresAuth: true }
  },
  {
    path: '/defects',
    name: 'defects',
    component: Defects,
    meta: { requiresAuth: true }
  },
  {
    path: '/defects/:id',
    name: 'defect-detail',
    component: DefectDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/test-plans',
    name: 'test-plans',
    component: TestPlans,
    meta: { requiresAuth: true }
  },
  {
    path: '/environments',
    name: 'environments',
    component: Environments,
    meta: { requiresAuth: true }
  },
  {
    path: '/team',
    name: 'team',
    component: Team,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: { requiresAuth: true }
  },
  {
    path: '/projects',
    name: 'projects',
    component: Projects,
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'reports',
    component: Reports,
    meta: { requiresAuth: true }
  },
  {
    path: '/workflow',
    name: 'workflow',
    component: WorkflowList,
  },
  {
    path: '/workflow/create',
    name: 'workflow-create',
    component: WorkflowBuilder,
  },
  {
    path: '/workflow/:id/edit',
    name: 'workflow-edit',
    component: WorkflowEditor,
  },
  {
    path: '/workflow-builder',
    name: 'workflow-builder',
    component: WorkflowBuilder,
    meta: { requiresAuth: false }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const requiresAuth = to.meta.requiresAuth !== false;

  if (isAuthenticated && (to.path === '/login' || to.path === '/register')) {
    next('/dashboard');
    return;
  }

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router; 