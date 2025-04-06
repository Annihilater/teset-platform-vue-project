<template>
  <PageLayout>
    <div class="space-y-6">
      <PageHeader title="测试用例详情" description="查看和管理测试用例">
        <template #actions>
          <div class="flex space-x-2">
            <button
              class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 transition-colors"
              @click="goBack"
            >
              <ArrowLeftIcon class="w-5 h-5 text-gray-600" />
              <span>返回</span>
            </button>
            <button
              class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 transition-colors"
            >
              <PencilIcon class="w-5 h-5 text-gray-600" />
              <span>编辑</span>
            </button>
            <button
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
            >
              <PlayIcon class="w-5 h-5" />
              <span>运行测试</span>
            </button>
          </div>
        </template>
      </PageHeader>

      <div v-if="loading" class="flex justify-center items-center p-20">
        <div class="flex flex-col items-center space-y-4">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-500"
          ></div>
          <p class="text-gray-500 font-medium">加载中...</p>
        </div>
      </div>

      <div v-else-if="testCase" class="space-y-6">
        <!-- 测试用例基本信息卡片 -->
        <DashboardCard title="基本信息" class="overflow-visible">
          <div class="p-1">
            <div class="flex items-start">
              <!-- 左侧基本信息 -->
              <div class="flex-1">
                <div class="mb-6">
                  <h1 class="text-2xl font-bold text-gray-900 mb-2">
                    {{ testCase.name }}
                  </h1>
                  <p class="text-gray-600">{{ testCase.description }}</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div>
                      <div class="text-sm font-medium text-gray-500 mb-1">状态</div>
                      <StatusBadge :status="testCase.status" size="large" />
                    </div>

                    <div>
                      <div class="text-sm font-medium text-gray-500 mb-1">优先级</div>
                      <span
                        :class="`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
                          testCase.priority === 'critical'
                            ? 'bg-red-100 text-red-800'
                            : testCase.priority === 'high'
                            ? 'bg-orange-100 text-orange-800'
                            : testCase.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`"
                      >
                        {{ getPriorityLabel(testCase.priority) }}
                      </span>
                    </div>

                    <div>
                      <div class="text-sm font-medium text-gray-500 mb-1">自动化状态</div>
                      <span
                        :class="`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          testCase.automated
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`"
                      >
                        {{ testCase.automated ? "已自动化" : "手动测试" }}
                      </span>
                    </div>
                  </div>

                  <div class="space-y-4">
                    <div>
                      <div class="text-sm font-medium text-gray-500 mb-1">负责人</div>
                      <div class="flex items-center space-x-2">
                        <img
                          v-if="testCase.assignee"
                          :src="`https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop`"
                          :alt="testCase.assignee"
                          class="w-8 h-8 rounded-full"
                        />
                        <span class="text-gray-900 font-medium">{{
                          testCase.assignee || "未分配"
                        }}</span>
                      </div>
                    </div>

                    <div>
                      <div class="text-sm font-medium text-gray-500 mb-1">最后运行</div>
                      <div class="flex items-center space-x-2 text-gray-700">
                        <ClockIcon class="w-4 h-4" />
                        <span>{{
                          formatDate(testCase.lastRun || testCase.modified)
                        }}</span>
                      </div>
                    </div>

                    <div>
                      <div class="text-sm font-medium text-gray-500 mb-1">标签</div>
                      <div class="flex flex-wrap gap-2">
                        <span
                          v-for="tag in testCase.tags"
                          :key="tag"
                          class="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {{ tag }}
                        </span>
                        <span
                          v-if="!testCase.tags || testCase.tags.length === 0"
                          class="text-gray-500"
                          >无标签</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 右侧元数据 -->
              <div class="w-60 ml-8 p-4 bg-gray-50 rounded-lg">
                <h3 class="text-sm font-medium text-gray-500 mb-3">元数据</h3>
                <div class="space-y-3">
                  <div>
                    <div class="text-xs font-medium text-gray-500">ID</div>
                    <div class="text-sm text-gray-900">{{ testCase.id }}</div>
                  </div>
                  <div>
                    <div class="text-xs font-medium text-gray-500">创建时间</div>
                    <div class="text-sm text-gray-900">
                      {{ formatDate(testCase.created) }}
                    </div>
                  </div>
                  <div>
                    <div class="text-xs font-medium text-gray-500">最后修改</div>
                    <div class="text-sm text-gray-900">
                      {{ formatDate(testCase.modified) }}
                    </div>
                  </div>
                  <div>
                    <div class="text-xs font-medium text-gray-500">版本</div>
                    <div class="text-sm text-gray-900">
                      {{ testCase.version || "v1.0" }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>

        <!-- 测试步骤 -->
        <DashboardCard title="测试步骤">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                  >
                    #
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    描述
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    预期结果
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                  >
                    状态
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(step, index) in testCase.steps"
                  :key="step.id"
                  class="hover:bg-gray-50"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {{ index + 1 }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ step.description }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    {{ step.expectedResult }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <StatusBadge :status="step.status || 'pending'" />
                  </td>
                </tr>
                <tr v-if="!testCase.steps || testCase.steps.length === 0">
                  <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                    暂无测试步骤
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <!-- 相关测试执行 -->
        <DashboardCard title="测试执行历史">
          <div v-if="testCase.executions && testCase.executions.length > 0">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th
                      class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      执行ID
                    </th>
                    <th
                      class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      执行时间
                    </th>
                    <th
                      class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      执行人
                    </th>
                    <th
                      class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      状态
                    </th>
                    <th
                      class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="execution in testCase.executions"
                    :key="execution.id"
                    class="hover:bg-gray-50"
                  >
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline"
                    >
                      <router-link
                        :to="{ name: 'execution', params: { id: execution.id } }"
                      >
                        {{ execution.id }}
                      </router-link>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(execution.time) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ execution.executor }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <StatusBadge :status="execution.status" />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button class="text-blue-600 hover:text-blue-800 font-medium">
                        查看详情
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="py-8 text-center text-gray-500">暂无测试执行历史记录</div>
        </DashboardCard>
      </div>

      <div v-else class="bg-white shadow rounded-lg p-10 text-center">
        <div class="flex flex-col items-center">
          <AlertTriangleIcon class="w-12 h-12 text-yellow-500 mb-4" />
          <div class="text-xl font-medium text-gray-700 mb-2">未找到测试用例</div>
          <div class="text-gray-500 mb-6">该测试用例可能已被删除或不存在</div>
          <button
            @click="goBack"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回测试用例列表
          </button>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  formatDate,
  getPriorityLabel,
  loadTestCase as fetchTestCase,
} from "./TestCaseDetail.logic.ts";
import {
  ArrowLeftIcon,
  PencilIcon,
  PlayIcon,
  ClockIcon,
  AlertTriangleIcon,
} from "lucide-vue-next";

import PageLayout from "@/components/layout/PageLayout.vue";
import PageHeader from "@/components/layout/PageHeader.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import DashboardCard from "@/components/DashboardCard.vue";

import type { TestCase } from "@/mock/types/testCase";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const testCase = ref<TestCase | null>(null);
const loading = ref(true);

const loadData = async () => {
  const id = route.params.id as string;
  if (!id) {
    loading.value = false;
    return;
  }
  try {
    loading.value = true;
    testCase.value = await fetchTestCase(id);
  } catch (error) {
    console.error("加载测试用例详情失败:", error);
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* 为状态标签添加过渡动画 */
.transition-colors {
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}
</style>
