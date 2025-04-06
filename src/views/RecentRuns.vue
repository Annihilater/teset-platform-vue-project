<template>
  <PageLayout>
    <div class="space-y-8">
      <PageHeader title="最近测试运行" description="查看和管理您的最近测试执行">
        <div class="mb-6 flex flex-wrap gap-4">
          <div class="flex-1 min-w-[300px]">
            <div class="relative">
              <Search
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
              <input
                type="text"
                placeholder="搜索测试用例..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                v-model="searchQuery"
              />
            </div>
          </div>

          <div class="flex space-x-4">
            <div class="relative">
              <select
                class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                v-model="selectedEnvironment"
              >
                <option value="all">所有环境</option>
                <option value="production">生产环境</option>
                <option value="staging">预发环境</option>
                <option value="development">开发环境</option>
              </select>
              <ChevronDown
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
              />
            </div>

            <div class="relative">
              <select
                class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                v-model="selectedStatus"
              >
                <option value="all">所有状态</option>
                <option value="completed">已完成</option>
                <option value="running">运行中</option>
                <option value="queued">队列中</option>
                <option value="failed">失败</option>
              </select>
              <ChevronDown
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
              />
            </div>

            <button
              class="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter class="w-5 h-5 text-gray-400" />
              <span>更多筛选</span>
            </button>
          </div>
        </div>
      </PageHeader>

      <DashboardCard title="最近运行">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  测试用例
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  环境
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  状态
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  开始时间
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  耗时
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  执行人
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="execution in recentExecutions"
                :key="execution.id"
                class="hover:bg-gray-50 cursor-pointer"
                @click="router.push(`/test-execution/${execution.id}`)"
              >
                <td class="px-6 py-4">
                  <div>
                    <div class="font-medium text-gray-900">
                      {{ execution.testCase.name }}
                    </div>
                    <div class="flex items-center space-x-2 mt-1">
                      <span
                        v-for="tag in execution.testCase.tags"
                        :key="tag"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-gray-900">{{ execution.environment }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2">
                    <RefreshCcw
                      v-if="execution.status === 'running'"
                      class="w-4 h-4 text-blue-600 animate-spin"
                    />
                    <StatusBadge :status="mapExecutionStatus(execution.status)" />
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2 text-gray-500">
                    <Calendar class="w-4 h-4" />
                    <span>{{ formatDate(execution.startTime) }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2 text-gray-500">
                    <Clock class="w-4 h-4" />
                    <span>{{ execution.duration || "-" }} 分钟</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2">
                    <img
                      :src="`https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop`"
                      :alt="execution.executor"
                      class="w-6 h-6 rounded-full"
                    />
                    <span class="text-gray-900">{{ execution.executor }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      v-if="execution.status === 'running'"
                      class="text-gray-400 hover:text-red-600"
                      title="停止"
                    >
                      <StopCircle class="w-5 h-5" />
                    </button>
                    <button
                      v-if="isQueuedOrInitializing(execution.status)"
                      class="text-gray-400 hover:text-green-600"
                      title="开始"
                    >
                      <PlayCircle class="w-5 h-5" />
                    </button>
                    <button class="text-gray-400 hover:text-gray-600">
                      <MoreVertical class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  formatDate,
  mapExecutionStatus,
  isQueuedOrInitializing,
  loadExecutions as fetchExecutions,
} from './RecentRuns.logic.ts';
import {
  Calendar,
  Clock,
  Filter,
  Search,
  ChevronDown,
  MoreVertical,
  PlayCircle,
  StopCircle,
  RefreshCcw,
} from 'lucide-vue-next';
import StatusBadge from '@/components/StatusBadge.vue';
import DashboardCard from '@/components/DashboardCard.vue';
import PageLayout from '@/components/layout/PageLayout.vue';
import PageHeader from '@/components/layout/PageHeader.vue';
import type { TestExecution } from '@/mock/types/execution';

const { t } = useI18n();
const searchQuery = ref('');
const selectedEnvironment = ref('all');
const selectedStatus = ref('all');
const router = useRouter();
const recentExecutions = ref<TestExecution[]>([]);

const loadData = async () => {
  recentExecutions.value = await fetchExecutions(
    searchQuery.value,
    selectedEnvironment.value,
    selectedStatus.value
  );
};

watch([searchQuery, selectedEnvironment, selectedStatus], () => {
  loadData();
});

onMounted(() => {
  loadData();
});
</script>
