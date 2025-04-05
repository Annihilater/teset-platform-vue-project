<template>
  <PageLayout>
    <PageHeader title="测试计划" description="规划并跟踪您的测试策略和执行">
      <template #actions>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus class="w-5 h-5" />
          <span>创建测试计划</span>
        </button>
      </template>

      <div class="mb-6 flex flex-wrap gap-4">
        <div class="flex-1 min-w-[300px]">
          <div class="relative">
            <Search
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            />
            <input
              type="text"
              placeholder="搜索测试计划..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              v-model="searchQuery"
            />
          </div>
        </div>

        <div class="flex space-x-4">
          <div class="relative">
            <select
              class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              v-model="selectedStatus"
            >
              <option value="all">所有状态</option>
              <option value="draft">草稿</option>
              <option value="active">活跃</option>
              <option value="completed">已完成</option>
              <option value="archived">已归档</option>
            </select>
            <ChevronDown
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
            />
          </div>

          <div class="relative">
            <select
              class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              v-model="selectedPhase"
            >
              <option value="all">所有阶段</option>
              <option value="planning">规划</option>
              <option value="execution">执行</option>
              <option value="review">审查</option>
              <option value="completed">完成</option>
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

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <DashboardCard title="测试计划">
          <div class="space-y-4">
            <div
              v-for="plan in testPlans"
              :key="plan.id"
              class="p-4 bg-white border rounded-lg cursor-pointer transition-colors"
              :class="
                selectedTestPlan?.id === plan.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              "
              @click="selectTestPlan(plan.id)"
            >
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center space-x-3">
                    <h3 class="font-medium text-gray-900">{{ plan.name }}</h3>
                    <span
                      :class="`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        plan.status
                      )}`"
                    >
                      {{ getStatusText(plan.status) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-500 mt-1">{{ plan.description }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <button class="p-1 hover:bg-gray-100 rounded">
                    <Edit3 class="w-5 h-5 text-gray-500" />
                  </button>
                  <button class="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical class="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div class="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div class="text-sm text-gray-500">进度</div>
                  <div class="mt-1">
                    <div class="h-2 bg-gray-200 rounded-full">
                      <div
                        class="h-2 bg-blue-500 rounded-full"
                        :style="{ width: `${plan.metrics.executionProgress}%` }"
                      />
                    </div>
                    <div class="mt-1 text-sm font-medium text-gray-900">
                      {{ plan.metrics.executionProgress }}%
                    </div>
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">覆盖率</div>
                  <div class="mt-1">
                    <div class="h-2 bg-gray-200 rounded-full">
                      <div
                        class="h-2 bg-green-500 rounded-full"
                        :style="{ width: `${plan.metrics.coverage}%` }"
                      />
                    </div>
                    <div class="mt-1 text-sm font-medium text-gray-900">
                      {{ plan.metrics.coverage }}%
                    </div>
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">测试用例</div>
                  <div class="mt-1 text-sm font-medium text-gray-900">
                    {{ plan.metrics.totalTestCases }}
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">自动化</div>
                  <div class="mt-1 text-sm font-medium text-gray-900">
                    {{
                      Math.round(
                        (plan.metrics.automated / plan.metrics.totalTestCases) * 100
                      )
                    }}%
                  </div>
                </div>
              </div>

              <div class="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                <div class="flex items-center space-x-2">
                  <Calendar class="w-4 h-4" />
                  <span
                    >{{ new Date(plan.startDate).toLocaleDateString() }} -
                    {{ new Date(plan.endDate).toLocaleDateString() }}</span
                  >
                </div>
                <div class="flex items-center space-x-2">
                  <Users class="w-4 h-4" />
                  <span>{{ plan.team.name }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <Clock class="w-4 h-4" />
                  <span>阶段: {{ getPhaseText(plan.phase) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="loading" class="py-8 text-center">
            <div
              class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
            ></div>
            <p class="mt-2 text-gray-500">加载测试计划...</p>
          </div>

          <div v-if="!loading && testPlans.length === 0" class="py-8 text-center">
            <FileText class="w-12 h-12 text-gray-400 mx-auto" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">无测试计划</h3>
            <p class="mt-1 text-sm text-gray-500">没有找到符合条件的测试计划</p>
          </div>
        </DashboardCard>
      </div>

      <div class="lg:col-span-1">
        <div v-if="selectedTestPlan" class="space-y-6">
          <DashboardCard title="测试指标">
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-4 bg-gray-50 rounded-lg">
                  <div class="text-2xl font-bold text-green-600">
                    {{ selectedTestPlan.metrics.passed }}
                  </div>
                  <div class="text-sm text-gray-500">通过</div>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded-lg">
                  <div class="text-2xl font-bold text-red-600">
                    {{ selectedTestPlan.metrics.failed }}
                  </div>
                  <div class="text-sm text-gray-500">失败</div>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded-lg">
                  <div class="text-2xl font-bold text-yellow-600">
                    {{ selectedTestPlan.metrics.blocked }}
                  </div>
                  <div class="text-sm text-gray-500">阻塞</div>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded-lg">
                  <div class="text-2xl font-bold text-gray-600">
                    {{ selectedTestPlan.metrics.notRun }}
                  </div>
                  <div class="text-sm text-gray-500">未运行</div>
                </div>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="进度计划">
            <div class="space-y-4">
              <div
                v-for="phase in selectedTestPlan.schedule.phases"
                :key="phase.name"
                class="space-y-2"
              >
                <div class="flex items-center justify-between">
                  <div class="font-medium text-gray-900">{{ phase.name }}</div>
                  <span
                    :class="`text-sm ${
                      phase.status === 'completed'
                        ? 'text-green-600'
                        : phase.status === 'in-progress'
                        ? 'text-blue-600'
                        : 'text-gray-600'
                    }`"
                  >
                    {{ getPhaseStatusText(phase.status) }}
                  </span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="flex-1 h-2 bg-gray-200 rounded-full">
                    <div
                      :class="`h-2 rounded-full ${
                        phase.status === 'completed'
                          ? 'bg-green-500'
                          : phase.status === 'in-progress'
                          ? 'bg-blue-500'
                          : 'bg-gray-400'
                      }`"
                      :style="{ width: `${phase.progress}%` }"
                    />
                  </div>
                  <span class="text-sm text-gray-600">{{ phase.progress }}%</span>
                </div>
                <div class="text-sm text-gray-500">
                  {{ new Date(phase.startDate).toLocaleDateString() }} -
                  {{ new Date(phase.endDate).toLocaleDateString() }}
                </div>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="目标">
            <div class="space-y-2">
              <div
                v-for="(objective, index) in selectedTestPlan.objectives"
                :key="index"
                class="flex items-start space-x-2"
              >
                <ChevronRight class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span class="text-gray-600">{{ objective }}</span>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="风险">
            <div class="space-y-4" v-if="selectedTestPlan.risks.length > 0">
              <div
                v-for="risk in selectedTestPlan.risks"
                :key="risk.id"
                class="p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center space-x-2">
                  <AlertTriangle
                    :class="`w-5 h-5 ${
                      risk.impact === 'high'
                        ? 'text-red-500'
                        : risk.impact === 'medium'
                        ? 'text-yellow-500'
                        : 'text-blue-500'
                    }`"
                  />
                  <span class="font-medium text-gray-900">{{ risk.description }}</span>
                </div>
                <p class="mt-2 text-sm text-gray-600">{{ risk.mitigation }}</p>
              </div>
            </div>
            <div v-else class="text-center py-4 text-gray-500">未识别风险</div>
          </DashboardCard>
        </div>
        <DashboardCard v-else title="选择测试计划" class="h-full">
          <div class="text-center py-6">
            <FileText class="w-12 h-12 text-gray-400 mx-auto" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">未选择测试计划</h3>
            <p class="mt-1 text-sm text-gray-500">从列表中选择一个测试计划查看详细信息</p>
          </div>
        </DashboardCard>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import PageLayout from "@/components/layout/PageLayout.vue";
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  MoreVertical,
  Calendar,
  Users,
  Target,
  Clock,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Edit3,
  Trash2,
  ChevronRight,
} from "lucide-vue-next";
import DashboardCard from "@/components/DashboardCard.vue";
import PageHeader from "@/components/layout/PageHeader.vue";
import type { TestPlan } from "@/mock/types/testPlan";
import { TestPlanService } from "@/mock/services/testPlan";

const route = useRoute();
const searchQuery = ref("");
const selectedStatus = ref("all");
const selectedPhase = ref("all");
const selectedTestPlan = ref<TestPlan | null>(null);
const testPlans = ref<TestPlan[]>([]);
const loading = ref(false);

// 加载测试计划列表
const loadTestPlans = async () => {
  loading.value = true;
  try {
    testPlans.value = await TestPlanService.getFilteredTestPlans(
      searchQuery.value,
      selectedStatus.value,
      selectedPhase.value
    );
  } catch (error) {
    console.error("加载测试计划失败:", error);
  } finally {
    loading.value = false;
  }
};

// 选择测试计划
const selectTestPlan = async (id: string) => {
  try {
    const plan = await TestPlanService.getTestPlanById(id);
    selectedTestPlan.value = plan;
  } catch (error) {
    console.error("加载测试计划详情失败:", error);
  }
};

// 状态样式
const getStatusColor = (status: string) => {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "active":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "archived":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// 状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case "draft":
      return "草稿";
    case "active":
      return "活跃";
    case "completed":
      return "已完成";
    case "archived":
      return "已归档";
    default:
      return status;
  }
};

// 阶段文本
const getPhaseText = (phase: string) => {
  switch (phase) {
    case "planning":
      return "规划";
    case "execution":
      return "执行";
    case "review":
      return "审查";
    case "completed":
      return "完成";
    default:
      return phase;
  }
};

// 阶段状态文本
const getPhaseStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "待处理";
    case "in-progress":
      return "进行中";
    case "completed":
      return "已完成";
    default:
      return status;
  }
};

// 监听筛选条件变化
watch([searchQuery, selectedStatus, selectedPhase], () => {
  loadTestPlans();
});

// 组件挂载时加载数据
onMounted(async () => {
  await loadTestPlans();

  // 如果URL中有测试计划ID，则加载该测试计划
  const planId = route.params.id as string;
  if (planId) {
    await selectTestPlan(planId);
  } else if (testPlans.value.length > 0) {
    // 默认选择第一个测试计划
    await selectTestPlan(testPlans.value[0].id);
  }
});
</script>
