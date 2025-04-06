import { ref } from 'vue';
import PageLayout from '@/components/layout/PageLayout.vue';
import DashboardCard from '@/components/DashboardCard.vue';
import RecentRuns from '@/components/RecentRuns.vue';
import Team from '@/components/Team.vue';
import { DashboardService } from '@/mock/services/dashboard';
import type { TestStats, Activity } from '@/mock/types/dashboard';

export const userName = ref('');
export const stats = ref<TestStats>({
  passed: 0,
  failed: 0,
  pending: 0,
  total: 0,
});
export const recentActivities = ref<Activity[]>([]);

export const loadDashboardData = async () => {
  try {
    const data = await DashboardService.getDashboardData();
    userName.value = data.userName;
    stats.value = data.stats;
    recentActivities.value = data.recentActivities;
  } catch (error) {
    console.error('加载仪表盘数据失败:', error);
  }
};