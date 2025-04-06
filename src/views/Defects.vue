<template>
  <PageLayout>
    <div class="space-y-8">
      <PageHeader title="缺陷" description="跟踪和管理测试中发现的缺陷" :icon="Bug">
        <template #actions>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus class="w-5 h-5" />
            <span>新建缺陷</span>
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
                placeholder="搜索缺陷..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                v-model="searchQuery"
              />
            </div>
          </div>

          <div class="flex space-x-4">
            <div class="relative">
              <select
                v-model="filterParams.severity"
                class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8"
              >
                <option value="all">所有严重程度</option>
                <option value="严重">严重</option>
                <option value="高">高</option>
                <option value="中">中</option>
                <option value="低">低</option>
              </select>
              <ChevronDown
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
            </div>

            <div class="relative">
              <select
                v-model="filterParams.status"
                class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8"
              >
                <option value="all">所有状态</option>
                <option value="新建">新建</option>
                <option value="进行中">进行中</option>
                <option value="已解决">已解决</option>
                <option value="已关闭">已关闭</option>
                <option value="待验证">待验证</option>
              </select>
              <ChevronDown
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
            </div>

            <div class="relative">
              <select
                v-model="filterParams.priority"
                class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8"
              >
                <option value="all">所有优先级</option>
                <option value="P0">P0</option>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
              </select>
              <ChevronDown
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-lg">
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">指派给：</span>
            <select
              v-model="filterParams.assignee"
              class="border-gray-300 rounded-md text-sm"
            >
              <option value="all">所有人</option>
              <option value="unassigned">未分配</option>
            </select>
          </div>

          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">JIRA项目：</span>
            <select
              v-model="filterParams.jiraProject"
              class="border-gray-300 rounded-md text-sm"
            >
              <option value="all">所有项目</option>
            </select>
          </div>

          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">创建时间：</span>
            <DateRangePicker v-model="filterParams.dateRange" />
          </div>
        </div>

        <div
          v-if="selectedDefects.length > 0"
          class="flex justify-between items-center bg-blue-50 p-4 rounded-lg"
        >
          <div class="flex items-center space-x-2">
            <span class="text-sm text-blue-700"
              >已选择 {{ selectedDefects.length }} 个缺陷</span
            >
            <button
              @click="selectedDefects = []"
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              取消选择
            </button>
          </div>
          <div class="flex space-x-2">
            <button
              @click="handleBatchAction('assign')"
              class="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              批量分配
            </button>
            <button
              @click="handleBatchAction('close')"
              class="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              批量关闭
            </button>
            <button
              @click="handleBatchAction('export')"
              class="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              导出选中
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

      <!-- 缺陷列表部分 -->
      <DashboardCard title="缺陷列表">
        <div class="overflow-auto border border-gray-200 rounded-lg shadow-sm">
          <table
            v-if="defects.length > 0"
            class="w-full divide-y divide-gray-200 table-fixed"
          >
            <thead class="sticky top-0 bg-gray-50">
              <tr>
                <th colspan="9" class="px-6 py-3">
                  <div class="flex items-center justify-between">
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

                    <div class="text-sm text-gray-700 text-right">
                      显示第
                      <span class="font-medium">{{
                        (currentPage - 1) * pageSize + 1
                      }}</span>
                      到
                      <span class="font-medium">
                        {{ Math.min(currentPage * pageSize, filteredDefects.length) }}
                      </span>
                      条， 共
                      <span class="font-medium">{{ filteredDefects.length }}</span> 条结果
                    </div>
                  </div>
                </th>
              </tr>

              <tr class="border-b border-gray-200">
                <th scope="col" class="relative w-[4%] min-w-[40px]">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <input
                      type="checkbox"
                      :checked="selectedDefects.length === defects.length"
                      @change="handleSelectAll"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  class="w-[10%] px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  缺陷ID
                </th>
                <th
                  scope="col"
                  class="w-[22%] px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  概述
                </th>
                <th
                  scope="col"
                  class="w-[10%] px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  严重程度
                </th>
                <th
                  scope="col"
                  class="w-[10%] px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  状态
                </th>
                <th
                  scope="col"
                  class="w-[10%] px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  关联执行
                </th>
                <th
                  scope="col"
                  class="w-[12%] px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  创建时间
                </th>
                <th
                  scope="col"
                  class="w-[10%] px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  负责人
                </th>
                <th
                  scope="col"
                  class="w-[12%] px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="defect in paginatedDefects"
                :key="defect.id"
                :class="`hover:bg-gray-50 transition-colors duration-150 ${
                  selectedDefect?.id === defect.id ? 'bg-blue-50' : ''
                }`"
              >
                <td class="relative w-[4%] min-w-[40px]">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <input
                      type="checkbox"
                      v-model="selectedDefects"
                      :value="defect.id"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </td>
                <td class="w-[10%] px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-start space-x-2">
                    <BugIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span
                      class="font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-150"
                      @click="copyToClipboard(defect.id)"
                      title="点击复制"
                      >{{ defect.id }}</span
                    >
                  </div>
                </td>
                <td class="w-[22%] px-6 py-4">
                  <div class="flex items-center max-w-md">
                    <span
                      class="text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-150 line-clamp-1"
                      @click="copyToClipboard(defect.title)"
                      title="点击复制"
                      >{{ defect.title }}</span
                    >
                  </div>
                </td>
                <td class="w-[10%] px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <AlertTriangle
                      v-if="defect.severity === '严重'"
                      class="w-4 h-4 text-red-500 flex-shrink-0"
                    />
                    <AlertOctagon
                      v-else-if="defect.severity === '高'"
                      class="w-4 h-4 text-orange-500 flex-shrink-0"
                    />
                    <AlertCircle
                      v-else-if="defect.severity === '中'"
                      class="w-4 h-4 text-yellow-500 flex-shrink-0"
                    />
                    <Info v-else class="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span
                      class="cursor-pointer hover:text-blue-600 transition-colors duration-150"
                      @click="copyToClipboard(getSeverityText(defect.severity))"
                      title="点击复制"
                      >{{ getSeverityText(defect.severity) }}</span
                    >
                  </div>
                </td>
                <td class="w-[10%] px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-start">
                    <span
                      :class="`px-2.5 py-1 text-xs font-medium rounded-full cursor-pointer hover:opacity-80 transition-opacity duration-150 ${getStatusColor(
                        defect.status
                      )}`"
                      @click="copyToClipboard(getStatusText(defect.status))"
                      title="点击复制"
                      >{{ getStatusText(defect.status) }}</span
                    >
                  </div>
                </td>
                <td class="w-[10%] px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-start space-x-2">
                    <PlayIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span
                      class="text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-150"
                      @click="copyToClipboard(defect.id)"
                      title="点击复制"
                      >{{ defect.id }}</span
                    >
                  </div>
                </td>
                <td class="w-[12%] px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-start space-x-2 text-gray-500">
                    <ClockIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span
                      class="cursor-pointer hover:text-blue-600 transition-colors duration-150"
                      @click="copyToClipboard(formatDate(defect.created))"
                      title="点击复制"
                      >{{ formatDate(defect.created) }}</span
                    >
                  </div>
                </td>
                <td class="w-[10%] px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <div class="flex-shrink-0 h-8 w-8">
                      <img
                        v-if="defect.assignee"
                        :src="`https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop`"
                        :alt="defect.assignee"
                        class="h-8 w-8 rounded-full object-cover border border-gray-200"
                      />
                      <div
                        v-else
                        class="h-8 w-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 font-medium border border-gray-200"
                      >
                        ?
                      </div>
                    </div>
                    <span
                      class="text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-150"
                      @click="copyToClipboard(defect.assignee || '未分配')"
                      title="点击复制"
                      >{{ defect.assignee || "未分配" }}</span
                    >
                  </div>
                </td>
                <td class="w-[12%] px-6 py-4 whitespace-nowrap text-right">
                  <button
                    class="px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-medium flex items-center transition-colors duration-150 shadow-sm mx-auto"
                    @click="navigateToDefectDetail(defect.id)"
                  >
                    <ExternalLink class="w-3 h-3 mr-1" />
                    详情
                  </button>
                </td>
              </tr>
              <tr v-if="filteredDefects.length === 0">
                <td colspan="9" class="px-6 py-10 text-center text-gray-500">
                  <div class="flex flex-col items-center">
                    <BugIcon class="w-12 h-12 text-gray-300 mb-2" />
                    <p class="text-gray-500">没有找到符合条件的缺陷</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="text-center py-16">
            <BugIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-700 mb-2">未找到缺陷</h3>
            <p class="text-sm text-gray-500 mb-4">没有符合条件的缺陷记录</p>
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

      <!-- 缺陷详情部分 -->
      <div v-if="selectedDefect" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <DashboardCard title="缺陷详情">
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-medium text-gray-900">
                  {{ selectedDefect.title }}
                </h3>
                <p class="mt-2 text-sm text-gray-500">{{ selectedDefect.description }}</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 class="text-sm font-medium text-gray-500">基本信息</h4>
                  <div class="mt-2 space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500">缺陷ID:</span>
                      <span class="text-gray-900">{{ selectedDefect.id }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500">状态:</span>
                      <span
                        :class="`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          selectedDefect.status
                        )}`"
                      >
                        {{ getStatusText(selectedDefect.status) }}
                      </span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500">严重程度:</span>
                      <div class="flex items-center space-x-2">
                        <component :is="getSeverityIcon(selectedDefect.severity)" />
                        <span class="text-gray-900">{{ selectedDefect.severity }}</span>
                      </div>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500">优先级:</span>
                      <span class="text-gray-900">{{ selectedDefect.priority }}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-sm font-medium text-gray-500">指派信息</h4>
                  <div class="mt-2 space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500">指派给:</span>
                      <span class="text-gray-900">{{ selectedDefect.assignee }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500">创建时间:</span>
                      <span class="text-gray-900">{{ selectedDefect.created }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500">版本:</span>
                      <span class="text-gray-900">{{
                        selectedDefect.version || "未指定"
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        <div class="lg:col-span-1">
          <div class="space-y-6">
            <DashboardCard title="JIRA信息">
              <div class="space-y-4">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">JIRA ID:</span>
                  <a
                    :href="selectedDefect.jiraUrl"
                    target="_blank"
                    class="text-blue-600 hover:underline flex items-center space-x-1"
                  >
                    <span>{{ selectedDefect.jiraId }}</span>
                    <ExternalLink class="w-3 h-3" />
                  </a>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">项目:</span>
                  <span class="text-gray-900">{{ selectedDefect.jiraProject }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">模块:</span>
                  <span class="text-gray-900">{{ selectedDefect.jiraModule }}</span>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="快速操作">
              <div class="space-y-2">
                <button
                  class="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <div class="flex items-center space-x-2">
                    <ExternalLink class="w-4 h-4" />
                    <span>在JIRA中查看</span>
                  </div>
                  <ChevronRight class="w-4 h-4" />
                </button>
                <button
                  class="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <div class="flex items-center space-x-2">
                    <Edit class="w-4 h-4" />
                    <span>编辑缺陷</span>
                  </div>
                  <ChevronRight class="w-4 h-4" />
                </button>
                <button
                  class="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <div class="flex items-center space-x-2">
                    <ClipboardEdit class="w-4 h-4" />
                    <span>更改状态</span>
                  </div>
                  <ChevronRight class="w-4 h-4" />
                </button>
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>

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
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import {
  searchQuery,
  statusFilter,
  severityFilter,
  priorityFilter,
  assigneeFilter,
  dateFilter,
  selectedDefects,
  loading,
  sortField,
  sortDirection,
  showFilters,
  filterParams,
  getSeverityIcon,
  getStatusColor,
  getStatusText,
  getSeverityText,
  handleSort,
  handleBatchAction,
  defects,
  selectedDefect,
  filteredDefects,
  currentPage,
  pageSize,
  paginatedDefects,
  resetPage,
  totalPages,
  prevPage,
  nextPage,
  displayedPages,
  goToPage,
  loadDefects,
  handleSelectAll,
  copyStatus,
  copyToClipboard,
  formatDate,
  resetFilters,
} from "./Defects.logic.ts";
import { useRouter } from "vue-router";
const router = useRouter();
function navigateToDefectDetail(id: string) {
  router.push({ name: "defect-detail", params: { id } });
}
import "./Defects.styles.css";

import PageLayout from "@/components/layout/PageLayout.vue";
import PageHeader from "@/components/layout/PageHeader.vue";
import DashboardCard from "@/components/DashboardCard.vue";
import Pagination from "@/components/Pagination.vue";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  AlertOctagon,
  ExternalLink,
  ClipboardEdit,
  Edit,
  Bug,
  Check,
  RefreshCw,
  Info,
  PlayIcon,
  ClockIcon,
  BugIcon,
} from "lucide-vue-next";
</script>

<style scoped>
/* 自定义滚动条样式 */
.overflow-auto::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
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
