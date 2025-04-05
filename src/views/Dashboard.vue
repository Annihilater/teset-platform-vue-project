<template>
  <PageLayout>
    <div class="space-y-8">
      <!-- 测试用例统计 -->
      <DashboardCard title="测试用例统计">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-4 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ stats.passed }}</div>
            <div class="text-sm text-gray-600">通过</div>
          </div>
          <div class="p-4 bg-red-50 rounded-lg">
            <div class="text-2xl font-bold text-red-600">{{ stats.failed }}</div>
            <div class="text-sm text-gray-600">失败</div>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <div class="text-2xl font-bold text-yellow-600">{{ stats.pending }}</div>
            <div class="text-sm text-gray-600">待执行</div>
          </div>
          <div class="p-4 bg-purple-50 rounded-lg">
            <div class="text-2xl font-bold text-purple-600">{{ stats.total }}</div>
            <div class="text-sm text-gray-600">总计</div>
          </div>
        </div>
      </DashboardCard>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧内容区域 -->
        <div class="lg:col-span-2 space-y-8">
          <!-- 欢迎卡片 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h1 class="text-2xl font-bold text-gray-900">欢迎回来，{{ userName }}</h1>
            <p class="mt-2 text-gray-600">这里是您的测试执行概览</p>
          </div>

          <!-- 最近执行 -->
          <DashboardCard title="最近执行">
            <RecentRuns />
          </DashboardCard>
        </div>

        <!-- 右侧边栏 -->
        <div class="lg:col-span-1 space-y-8">
          <!-- 团队信息 -->
          <DashboardCard title="团队信息">
            <Team />
          </DashboardCard>

          <!-- 最近活动 -->
          <DashboardCard title="最近活动">
            <div class="space-y-4">
              <div
                v-for="activity in recentActivities"
                :key="activity.id"
                class="flex items-start space-x-3"
              >
                <div class="flex-shrink-0">
                  <img
                    :src="activity.user.avatar"
                    :alt="activity.user.name"
                    class="w-8 h-8 rounded-full"
                  />
                </div>
                <div>
                  <p class="text-sm text-gray-900">
                    <span class="font-medium">{{ activity.user.name }}</span>
                    {{ activity.action }}
                  </p>
                  <p class="text-xs text-gray-500">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import PageLayout from "@/components/layout/PageLayout.vue";
import DashboardCard from "@/components/DashboardCard.vue";
import RecentRuns from "@/components/RecentRuns.vue";
import Team from "@/components/Team.vue";
import { DashboardService } from "@/mock/services/dashboard";
import type { TestStats, Activity } from "@/mock/types/dashboard";

const userName = ref("");
const stats = ref<TestStats>({
  passed: 0,
  failed: 0,
  pending: 0,
  total: 0,
});
const recentActivities = ref<Activity[]>([]);

// 加载仪表盘数据
const loadDashboardData = async () => {
  try {
    const data = await DashboardService.getDashboardData();
    userName.value = data.userName;
    stats.value = data.stats;
    recentActivities.value = data.recentActivities;
  } catch (error) {
    console.error("加载仪表盘数据失败:", error);
  }
};

// 初始加载数据
onMounted(() => {
  loadDashboardData();
});
</script>
