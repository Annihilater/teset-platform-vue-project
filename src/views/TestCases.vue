<template>
  <PageLayout>
    <!-- 复制成功/失败提示 -->
    <CopyNotification :status="copyStatus" />

    <div class="space-y-8">
      <PageHeader title="测试用例" description="管理和组织测试用例">
        <template #actions>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus class="w-5 h-5" />
            <span>创建测试用例</span>
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
                v-model="priorityFilter"
              >
                <option value="all">所有优先级</option>
                <option value="critical">紧急</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
              <ChevronDown
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
              />
            </div>

            <div class="relative">
              <select
                class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                v-model="statusFilter"
              >
                <option value="all">所有状态</option>
                <option value="passed">已通过</option>
                <option value="failed">失败</option>
                <option value="pending">等待中</option>
                <option value="blocked">被阻塞</option>
              </select>
              <ChevronDown
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
              />
            </div>

            <div class="relative">
              <select
                class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                v-model="automationFilter"
              >
                <option value="all">所有类型</option>
                <option value="automated">自动化</option>
                <option value="manual">手动</option>
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

        <!-- 添加批量操作栏 -->
        <BatchOperationBar
          :selected-count="selectedTestCaseIds.length"
          item-name="测试用例"
          :actions="[
            { type: 'run', label: '批量执行' },
            { type: 'assign', label: '批量分配' },
            { type: 'export', label: '导出选中' },
            { type: 'delete', label: '批量删除' },
          ]"
          @clear="selectedTestCaseIds = []"
          @action="handleBatchAction"
        />
      </PageHeader>

      <DashboardCard title="测试用例列表">
        <!-- A. 加载中状态 -->
        <LoadingSpinner v-if="initialLoading" message="正在加载测试用例..." />

        <div v-else class="overflow-auto border border-gray-200 rounded-lg shadow-sm">
          <table
            v-if="testCases.length > 0"
            class="w-full divide-y divide-gray-200 table-fixed"
          >
            <thead class="sticky top-0 bg-gray-50">
              <!-- 分页信息行 -->
              <tr>
                <th colspan="9" class="px-6 py-3">
                  <div class="flex items-center justify-between">
                    <!-- 分页按钮 -->
                    <nav
                      class="isolate inline-flex -space-x-px rounded-md shadow-sm"
                      aria-label="Pagination"
                    >
                      <button
                        @click="prevPage"
                        :disabled="currentPage === 1"
                        class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 transition-colors duration-150"
                        :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
                      >
                        <span class="sr-only">上一页</span>
                        <ChevronLeft class="h-5 w-5" aria-hidden="true" />
                      </button>
                      <button
                        v-for="page in displayedPages"
                        :key="page"
                        @click="goToPage(page)"
                        :class="[
                          'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 transition-colors duration-150',
                          page === currentPage
                            ? 'bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                            : 'text-gray-900 hover:bg-gray-50',
                        ]"
                      >
                        {{ page }}
                      </button>
                      <button
                        @click="nextPage"
                        :disabled="currentPage >= totalPages"
                        class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 transition-colors duration-150"
                        :class="
                          currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''
                        "
                      >
                        <span class="sr-only">下一页</span>
                        <ChevronRight class="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>

                    <!-- 显示条数信息 -->
                    <div class="text-sm text-gray-700 text-right">
                      显示第
                      <span class="font-medium">{{
                        (currentPage - 1) * pageSize + 1
                      }}</span>
                      到
                      <span class="font-medium">
                        {{ Math.min(currentPage * pageSize, filteredTestCases.length) }}
                      </span>
                      条， 共
                      <span class="font-medium">{{ filteredTestCases.length }}</span>
                      条结果
                    </div>
                  </div>
                </th>
              </tr>

              <!-- 表头行 -->
              <tr class="border-b border-gray-200">
                <th
                  class="pl-6 pr-3 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wide w-10"
                >
                  <div class="flex justify-center items-center">
                    <input
                      type="checkbox"
                      :checked="selectedTestCaseIds.length === testCases.length"
                      @change="handleSelectAll"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap w-[12%]"
                >
                  测试用例ID
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap w-[25%]"
                >
                  标题
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap w-[10%]"
                >
                  优先级
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap w-[10%]"
                >
                  类别
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap w-[10%]"
                >
                  创建者
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap w-[15%]"
                >
                  创建时间
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap w-[8%]"
                >
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="testCase in paginatedTestCases"
                :key="testCase.id"
                :class="`hover:bg-gray-50 transition-colors duration-150 ${
                  selectedTestCase?.id === testCase.id ? 'bg-blue-50' : ''
                }`"
              >
                <td class="px-6 py-4 whitespace-nowrap text-center w-10">
                  <input
                    type="checkbox"
                    v-model="selectedTestCaseIds"
                    :value="testCase.id"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center space-x-2">
                    <FileText class="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <CopyableText
                      :text="testCase.id"
                      customClass="font-medium text-gray-900"
                      @copy="copyToClipboard"
                    />
                  </div>
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="flex items-center justify-center max-w-md">
                    <CopyableText
                      :text="testCase.name"
                      customClass="text-gray-900 line-clamp-1"
                      @copy="copyToClipboard"
                    />
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <CopyableText
                    :text="testCase.priority"
                    :customClass="`px-2.5 py-1 text-xs font-medium rounded-full hover:opacity-80 transition-opacity duration-150 ${getPriorityColor(
                      testCase.priority
                    )}`"
                    @copy="copyToClipboard"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center space-x-2">
                    <Tag class="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <CopyableText
                      :text="testCase.tags[0] || '-'"
                      customClass="text-gray-900"
                      @copy="copyToClipboard"
                    />
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center space-x-2">
                    <div class="flex-shrink-0 h-8 w-8">
                      <img
                        :src="`https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop`"
                        :alt="testCase.assignee || '-'"
                        class="h-8 w-8 rounded-full object-cover border border-gray-200"
                      />
                    </div>
                    <CopyableText
                      :text="testCase.assignee || '-'"
                      customClass="text-gray-900"
                      @copy="copyToClipboard"
                    />
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center space-x-2 text-gray-500">
                    <Clock class="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <CopyableText
                      :text="formatDate(testCase.created)"
                      @copy="copyToClipboard"
                    />
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    class="px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-medium flex items-center transition-colors duration-150 shadow-sm mx-auto"
                    @click="navigateToTestCaseDetail(testCase.id)"
                  >
                    <ExternalLink class="w-3 h-3 mr-1" />
                    详情
                  </button>
                </td>
              </tr>
              <tr v-if="paginatedTestCases.length === 0">
                <td colspan="8" class="px-6 py-10 text-center text-gray-500">
                  <div class="flex flex-col items-center">
                    <FileText class="w-12 h-12 text-gray-300 mb-2" />
                    <p class="text-gray-500">没有找到符合条件的测试用例</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="text-center py-16">
            <FileText class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-700 mb-2">未找到测试用例</h3>
            <p class="text-sm text-gray-500 mb-4">没有符合条件的测试用例记录</p>
            <button
              @click="resetFilters"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2 shadow-sm transition-colors duration-150"
            >
              <RefreshCw class="w-4 h-4" />
              <span>重置筛选条件</span>
            </button>
          </div>
        </div>
      </DashboardCard>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { format } from "date-fns";
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  Clock,
  ExternalLink,
  FileText,
  Tag,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";
import StatusBadge from "@/components/StatusBadge.vue";
import DashboardCard from "@/components/DashboardCard.vue";
import PageLayout from "@/components/layout/PageLayout.vue";
import PageHeader from "@/components/layout/PageHeader.vue";
import { usePagination } from "@/composables/usePagination";
import { useCopyToClipboard } from "@/composables/useCopyToClipboard";
import CopyNotification from "@/components/CopyNotification.vue";
import CopyableText from "@/components/CopyableText.vue";
import BatchOperationBar from "@/components/BatchOperationBar.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { useRouter } from "vue-router";
import type { TestCase, TestStatus, TestPriority } from "@/mock/types/testCase";
import { TestCaseService } from "@/mock/services/testCase";

const { t } = useI18n();

// 使用复制到剪贴板的组合式API
const { copyStatus, copyToClipboard } = useCopyToClipboard();

const testCases = ref<TestCase[]>([]);
const testCaseColumns = ref(TestCaseService.getTestCaseColumns());
const loading = ref(false);
const initialLoading = ref(true);
const searchQuery = ref("");
const sortField = ref("id");
const sortOrder = ref<"asc" | "desc">("asc");
const priorityFilter = ref("all");
const statusFilter = ref("all");
const automationFilter = ref("all");

const router = useRouter();

// 过滤参数
const selectedFilters = computed(() => {
  const filters: any = {};

  if (statusFilter.value !== "all") {
    filters.status = [statusFilter.value as TestStatus];
  }

  if (priorityFilter.value !== "all") {
    filters.priority = [priorityFilter.value as TestPriority];
  }

  if (automationFilter.value !== "all") {
    filters.automated = automationFilter.value === "automated";
  }

  return filters;
});

// 筛选后的测试用例列表
const filteredTestCases = computed(() => testCases.value);

// 使用分页composable
const {
  currentPage,
  pageSize,
  paginatedItems: paginatedTestCases,
  resetPage,
  totalPages,
  prevPage,
  nextPage,
  displayedPages,
  goToPage,
} = usePagination(filteredTestCases, { pageSize: 10 });

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return format(new Date(dateString), "yyyy-MM-dd");
};

// 优先级标签
const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case "critical":
      return "紧急";
    case "high":
      return "高";
    case "medium":
      return "中";
    case "low":
      return "低";
    default:
      return priority;
  }
};

// 处理排序变更
const handleSortChange = (field: string, order: "asc" | "desc") => {
  sortField.value = field;
  sortOrder.value = order;
  loadTestCases();
};

// 加载测试用例数据
const loadTestCases = async () => {
  if (!initialLoading.value) {
    loading.value = true;
  }

  try {
    console.log("开始加载测试用例");
    const result = await TestCaseService.getTestCaseList(
      searchQuery.value,
      selectedFilters.value,
      sortField.value,
      sortOrder.value
    );

    testCases.value = result;
    console.log("加载完成", testCases.value);
  } catch (error) {
    console.error("加载测试用例失败:", error);
    testCases.value = [];
  } finally {
    loading.value = false;
    initialLoading.value = false;
  }
};

// 监听筛选条件变化时重置页码并加载数据，但不在初始加载时触发
watch(
  [searchQuery, statusFilter, priorityFilter, automationFilter],
  () => {
    // 只有在初始加载完成后，才响应筛选条件变化
    if (!initialLoading.value) {
      resetPage(); // 使用composable提供的方法重置页码
      loadTestCases();
    }
  },
  { deep: true }
);

// 组件加载前启动初始数据加载
onBeforeMount(() => {
  loadTestCases();
});

// 添加selectedTestCaseIds数组
const selectedTestCaseIds = ref<string[]>([]);

// 添加全选/取消全选方法
const handleSelectAll = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;
  selectedTestCaseIds.value = checked ? testCases.value.map((test) => test.id) : [];
};

// 添加批量操作处理方法
const handleBatchAction = (action: string) => {
  if (selectedTestCaseIds.value.length === 0) {
    return;
  }

  switch (action) {
    case "run":
      // 实现批量执行逻辑
      console.log("批量执行", selectedTestCaseIds.value);
      // 这里应该调用相应的API
      break;
    case "assign":
      // 实现批量分配逻辑
      console.log("批量分配", selectedTestCaseIds.value);
      // 这里应该调用相应的API
      break;
    case "export":
      // 实现批量导出逻辑
      console.log("批量导出", selectedTestCaseIds.value);
      // 这里应该调用相应的API
      break;
    case "delete":
      // 实现批量删除逻辑
      console.log("批量删除", selectedTestCaseIds.value);
      // 这里应该调用相应的API
      break;
    default:
      break;
  }
};

// 获取优先级颜色
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical":
      return "bg-red-100 text-red-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "";
  }
};

// 重置筛选条件
const resetFilters = () => {
  searchQuery.value = "";
  priorityFilter.value = "all";
  statusFilter.value = "all";
  automationFilter.value = "all";
  resetPage();
  loadTestCases();
};

// 导航到测试用例详情页面
const navigateToTestCaseDetail = (id: string) => {
  router.push({ name: "testCase", params: { id } });
};

// 添加缺失的变量
const selectedTestCase = ref<TestCase | null>(null);
</script>
