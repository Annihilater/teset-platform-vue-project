<template>
  <PageLayout>
    <!-- 复制成功/失败提示 -->
    <div
      v-if="copyStatus"
      class="fixed bottom-4 right-4 px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg z-50"
      :class="copyStatus.success ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
    >
      <component :is="copyStatus.success ? Check : AlertTriangle" class="w-4 h-4" />
      <span
        >{{ copyStatus.success ? "已复制" : "复制失败" }}:
        {{
          copyStatus.text.length > 20
            ? copyStatus.text.substring(0, 20) + "..."
            : copyStatus.text
        }}</span
      >
    </div>

    <div class="space-y-8">
      <PageHeader title="测试报告" description="查看 Artifactory 仓库中的测试执行报告">
        <div class="mb-6 flex flex-wrap gap-4">
          <div class="flex-1 min-w-[300px]">
            <div class="relative">
              <Search
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
              <input
                type="text"
                placeholder="通过报告ID、执行ID或测试用例搜索..."
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
                <option value="生产环境">生产环境</option>
                <option value="预发布环境">预发布环境</option>
                <option value="开发环境">开发环境</option>
              </select>
              <ChevronDown
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
              />
            </div>

            <div class="relative">
              <select
                class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                v-model="selectedDateRange"
              >
                <option value="1d">最近24小时</option>
                <option value="7d">最近7天</option>
                <option value="30d">最近30天</option>
                <option value="custom">自定义范围</option>
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

            <button
              @click="resetFilters"
              class="flex items-center space-x-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
            >
              <RefreshCw class="w-5 h-5 text-gray-600" />
              <span>重置筛选</span>
            </button>
          </div>
        </div>

        <!-- 添加批量操作栏 -->
        <div
          v-if="selectedReportIds.length > 0"
          class="flex justify-between items-center bg-blue-50 p-4 rounded-lg"
        >
          <div class="flex items-center space-x-2">
            <span class="text-sm text-blue-700"
              >已选择 {{ selectedReportIds.length }} 个报告</span
            >
            <button
              @click="selectedReportIds = []"
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              取消选择
            </button>
          </div>
          <div class="flex space-x-2">
            <button
              @click="handleBatchAction('download')"
              class="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              批量下载
            </button>
            <button
              @click="handleBatchAction('archive')"
              class="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              批量归档
            </button>
            <button
              @click="handleBatchAction('share')"
              class="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              批量分享
            </button>
            <button
              @click="handleBatchAction('delete')"
              class="px-3 py-1 text-sm text-red-600 bg-white border border-gray-300 rounded-md hover:bg-red-50"
            >
              批量删除
            </button>
          </div>
        </div>
      </PageHeader>

      <DashboardCard title="测试报告列表">
        <div class="overflow-auto border border-gray-200 rounded-lg shadow-sm">
          <table
            v-if="reports.length > 0"
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
                        {{ Math.min(currentPage * pageSize, filteredReports.length) }}
                      </span>
                      条， 共
                      <span class="font-medium">{{ filteredReports.length }}</span> 条结果
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
                      :checked="selectedReportIds.length === reports.length"
                      @change="handleSelectAll"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap w-[10%]"
                >
                  报告ID
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap w-[10%]"
                >
                  执行ID
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap w-[10%]"
                >
                  环境
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap w-[10%]"
                >
                  状态
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap w-[15%]"
                >
                  Artifactory仓库
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap w-[15%]"
                >
                  执行时间
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap w-[12%]"
                >
                  执行人
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
                v-for="report in paginatedReports"
                :key="report.id"
                :class="`hover:bg-gray-50 transition-colors duration-150 ${
                  selectedReport?.id === report.id ? 'bg-blue-50' : ''
                }`"
              >
                <td class="px-6 py-4 whitespace-nowrap text-center w-4">
                  <input
                    type="checkbox"
                    v-model="selectedReportIds"
                    :value="report.id"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center space-x-2">
                    <Hash class="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span
                      class="font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-150"
                      @click="copyToClipboard(getReportId(report.id))"
                      title="点击复制"
                      >{{ getReportId(report.id) }}</span
                    >
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center space-x-2">
                    <FileText class="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span
                      class="text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-150"
                      @click="copyToClipboard(report.id)"
                      title="点击复制"
                      >{{ report.id }}</span
                    >
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    class="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full cursor-pointer hover:bg-blue-200 transition-colors duration-150"
                    @click="copyToClipboard(report.environment)"
                    title="点击复制"
                  >
                    {{ report.environment }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    :class="`px-2.5 py-1 text-xs font-medium rounded-full cursor-pointer hover:opacity-80 transition-opacity duration-150 ${getStatusColor(
                      report.status
                    )}`"
                    @click="copyToClipboard(getStatusText(report.status))"
                    title="点击复制"
                  >
                    {{ getStatusText(report.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center space-x-2">
                    <Library class="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span
                      class="text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-150 truncate max-w-[120px]"
                      @click="
                        copyToClipboard(
                          report.repositoryInfo?.url.split('/').slice(-1)[0] || ''
                        )
                      "
                      title="点击复制"
                      >{{ report.repositoryInfo?.url.split("/").slice(-1)[0] }}</span
                    >
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center space-x-2 text-gray-500">
                    <Clock class="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span
                      class="cursor-pointer hover:text-blue-600 transition-colors duration-150"
                      @click="copyToClipboard(formatDate(report.startTime))"
                      title="点击复制"
                      >{{ formatDate(report.startTime) }}</span
                    >
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center space-x-2">
                    <div class="flex-shrink-0 h-8 w-8">
                      <img
                        :src="`https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop`"
                        :alt="report.executor"
                        class="h-8 w-8 rounded-full object-cover border border-gray-200"
                      />
                    </div>
                    <span
                      class="text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-150"
                      @click="copyToClipboard(report.executor)"
                      title="点击复制"
                      >{{ report.executor }}</span
                    >
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    class="px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-medium flex items-center justify-center transition-colors duration-150 shadow-sm mx-auto"
                    @click="selectedReport = report"
                  >
                    <ExternalLink class="w-3 h-3 mr-1" />
                    详情信息
                  </button>
                </td>
              </tr>
              <tr v-if="paginatedReports.length === 0">
                <td colspan="9" class="px-6 py-10 text-center text-gray-500">
                  <div class="flex flex-col items-center">
                    <FileText class="w-12 h-12 text-gray-300 mb-2" />
                    <p class="text-gray-500">没有找到匹配的测试报告</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="text-center py-16">
            <FileText class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-700 mb-2">未找到报告</h3>
            <p class="text-sm text-gray-500 mb-4">没有符合条件的测试报告</p>
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

      <!-- 报告详情部分 -->
      <div v-if="selectedReport" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <DashboardCard title="报告详情">
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-medium text-gray-900">
                  {{ getReportId(selectedReport.id) }}
                </h3>
                <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 class="text-sm font-medium text-gray-500">基本信息</h4>
                    <div class="mt-2 space-y-2">
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-500">执行ID:</span>
                        <span class="text-gray-900">{{ selectedReport.id }}</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-500">状态:</span>
                        <span
                          :class="`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            selectedReport.status
                          )}`"
                        >
                          {{ getStatusText(selectedReport.status) }}
                        </span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-500">环境:</span>
                        <span class="text-gray-900">{{
                          selectedReport.environment
                        }}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 class="text-sm font-medium text-gray-500">执行信息</h4>
                    <div class="mt-2 space-y-2">
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-500">执行人:</span>
                        <span class="text-gray-900">{{ selectedReport.executor }}</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-500">开始时间:</span>
                        <span class="text-gray-900">{{
                          formatDate(selectedReport.startTime)
                        }}</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-500">持续时间:</span>
                        <span class="text-gray-900"
                          >{{ selectedReport.duration }} 分钟</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-sm font-medium text-gray-500">执行日志</h4>
                <div class="mt-2 bg-gray-900 rounded-lg p-4 font-mono text-sm">
                  <div
                    v-for="(log, index) in selectedReport.logs"
                    :key="index"
                    class="text-gray-300"
                  >
                    {{ log }}
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        <div class="lg:col-span-1">
          <DashboardCard title="Artifactory 信息">
            <div class="space-y-4">
              <div>
                <h4 class="text-sm font-medium text-gray-500">仓库信息</h4>
                <div class="mt-2 space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">仓库URL:</span>
                    <a
                      :href="selectedReport.repositoryInfo?.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <span>{{ selectedReport.repositoryInfo?.url }}</span>
                      <ExternalLink class="w-3 h-3" />
                    </a>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">仓库路径:</span>
                    <span class="text-gray-900">{{
                      selectedReport.repositoryInfo?.path
                    }}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-sm font-medium text-gray-500">快速操作</h4>
                <div class="mt-2 space-y-2">
                  <a
                    :href="`${selectedReport.repositoryInfo?.url}${selectedReport.repositoryInfo?.path}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <div class="flex items-center space-x-2">
                      <FileText class="w-4 h-4" />
                      <span>查看完整报告</span>
                    </div>
                    <ExternalLink class="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>

      <div v-else class="text-center py-8 bg-white rounded-lg shadow">
        <FileText class="w-12 h-12 text-gray-400 mx-auto" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">未选择报告</h3>
        <p class="mt-1 text-sm text-gray-500">从列表中选择一个报告查看详细信息</p>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  formatDate,
  getStatusColor,
  getStatusText,
  getReportId,
  loadReports as fetchReports,
  resetFilters as resetFiltersFn,
  handleSelectAll as handleSelectAllFn,
  handleBatchAction as handleBatchActionFn,
  copyToClipboard as copyToClipboardFn,
  showCopyStatus,
} from "./Reports.logic.ts";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Clock,
  FileText,
  Hash,
  Library,
  RefreshCw,
  Check,
  AlertTriangle,
} from "lucide-vue-next";
import DashboardCard from "@/components/DashboardCard.vue";
import PageLayout from "@/components/layout/PageLayout.vue";
import PageHeader from "@/components/layout/PageHeader.vue";
import type { TestReport } from "../mock/types/report";
import { reports as mockReports } from "../mock/services/report";

const { t } = useI18n();
const router = useRouter();

const searchQuery = ref("");
const selectedEnvironment = ref("all");
const selectedDateRange = ref("7d");
const selectedReport = ref<TestReport | null>(null);
const reports = ref<TestReport[]>([]);
const currentPage = ref(1);
const pageSize = ref(5);
const selectedReportIds = ref<string[]>([]);
const copyStatus = ref<{ text: string; success: boolean; timestamp: number } | null>(
  null
);

const loadData = async () => {
  const result = await fetchReports(
    searchQuery.value,
    selectedEnvironment.value,
    selectedDateRange.value
  );
  reports.value = result;
  currentPage.value = 1;
};

const resetFilters = () => {
  resetFiltersFn(searchQuery, selectedEnvironment, selectedDateRange, loadData);
};

const handleSelectAll = (event: Event) => {
  handleSelectAllFn(event, reports.value, selectedReportIds);
};

const handleBatchAction = (action: "download" | "archive" | "share" | "delete") => {
  handleBatchActionFn(action, selectedReportIds.value);
};

const copyToClipboard = async (text: string | undefined) => {
  await copyToClipboardFn(text, (text, success) =>
    showCopyStatus(copyStatus, text, success)
  );
};

watch([searchQuery, selectedEnvironment, selectedDateRange], () => {
  loadData();
});

onMounted(() => {
  reports.value = [...mockReports];
  loadData();
});

const filteredReports = computed(() => reports.value);

const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredReports.value.slice(start, start + pageSize.value);
});

const totalPages = computed(() =>
  Math.ceil(filteredReports.value.length / pageSize.value)
);

const displayedPages = computed(() => {
  const range = [];
  const maxPages = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxPages / 2));
  let end = Math.min(totalPages.value, start + maxPages - 1);
  if (end - start + 1 < maxPages) {
    start = Math.max(1, end - maxPages + 1);
  }
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
});

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function goToPage(page: number) {
  currentPage.value = page;
}
</script>

<style>
.overflow-auto::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
