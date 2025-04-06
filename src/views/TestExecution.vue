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
      <!-- 测试执行列表页面 - 仅在路由没有ID参数时显示 -->
      <template v-if="!route.params.id">
        <PageHeader title="测试执行" description="监控和管理测试执行情况">
          <template #actions>
            <button
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Play class="w-5 h-5" />
              <span>运行测试</span>
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
                  placeholder="搜索执行ID或测试用例..."
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
                  <option value="staging">预发布环境</option>
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
                  <option value="running">运行中</option>
                  <option value="completed">已完成</option>
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

          <!-- 添加批量操作栏 -->
          <div
            v-if="selectedExecutions.length > 0"
            class="flex justify-between items-center bg-blue-50 p-4 rounded-lg"
          >
            <div class="flex items-center space-x-2">
              <span class="text-sm text-blue-700"
                >已选择 {{ selectedExecutions.length }} 个执行</span
              >
              <button
                @click="selectedExecutions = []"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                取消选择
              </button>
            </div>
            <div class="flex space-x-2">
              <button
                @click="handleBatchAction('start')"
                class="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                批量启动
              </button>
              <button
                @click="handleBatchAction('stop')"
                class="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                批量停止
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

        <!-- 测试执行列表部分 -->
        <DashboardCard title="测试执行列表">
          <div class="overflow-auto border border-gray-200 rounded-lg shadow-sm">
            <table class="w-full divide-y divide-gray-200 table-fixed">
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
                          :class="
                            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                          "
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
                            currentPage >= totalPages
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
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
                          {{
                            Math.min(currentPage * pageSize, filteredExecutions.length)
                          }}
                        </span>
                        条， 共
                        <span class="font-medium">{{ filteredExecutions.length }}</span>
                        条结果
                      </div>
                    </div>
                  </th>
                </tr>

                <!-- 表头行 -->
                <tr class="border-b border-gray-200">
                  <!-- 添加全选复选框 -->
                  <th
                    class="pl-6 pr-3 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wide w-10"
                  >
                    <div class="flex justify-center items-center">
                      <input
                        type="checkbox"
                        :checked="selectedExecutions.length === executions.length"
                        @change="handleSelectAll"
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </th>
                  <th
                    class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap w-[10%]"
                  >
                    执行ID
                  </th>
                  <th
                    class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap w-[20%]"
                  >
                    测试用例
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
                    class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap w-[12%]"
                  >
                    开始时间
                  </th>
                  <th
                    class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap w-[10%]"
                  >
                    持续时间
                  </th>
                  <th
                    class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap w-[10%]"
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
                  v-for="execution in paginatedExecutions"
                  :key="execution.id"
                  class="hover:bg-gray-50 transition-colors duration-150"
                  :class="selectedExecution?.id === execution.id ? 'bg-blue-50' : ''"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-center w-4">
                    <input
                      type="checkbox"
                      v-model="selectedExecutions"
                      :value="execution.id"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <div class="flex items-center justify-center space-x-2">
                      <Hash class="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span
                        class="font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-150"
                        @click="copyToClipboard(execution.id)"
                        title="点击复制"
                        >{{ execution.id }}</span
                      >
                    </div>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <div>
                      <div
                        class="font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-150 line-clamp-1"
                        @click="copyToClipboard(execution.testCase.name)"
                        title="点击复制"
                      >
                        {{ execution.testCase.name }}
                      </div>
                      <div class="flex items-center justify-center flex-wrap gap-1 mt-1">
                        <span
                          v-for="tag in execution.testCase.tags"
                          :key="tag"
                          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 cursor-pointer hover:bg-gray-200 transition-colors duration-150"
                          @click="copyToClipboard(tag)"
                          title="点击复制"
                        >
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      class="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:text-blue-600 transition-colors duration-150"
                      @click="copyToClipboard(execution.environment)"
                      title="点击复制"
                      >{{ execution.environment }}</span
                    >
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <div class="flex items-center justify-center space-x-2">
                      <component
                        :is="getStatusIcon(execution.status)"
                        class="w-4 h-4 flex-shrink-0"
                      />
                      <span
                        class="cursor-pointer hover:opacity-80 transition-opacity duration-150"
                        @click="copyToClipboard(execution.status)"
                        title="点击复制"
                      >
                        <StatusBadge :status="getStatusForBadge(execution.status)" />
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <div class="flex items-center justify-center space-x-2 text-gray-500">
                      <Calendar class="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span
                        class="cursor-pointer hover:text-blue-600 transition-colors duration-150"
                        @click="copyToClipboard(formatDate(execution.startTime))"
                        title="点击复制"
                        >{{ formatDate(execution.startTime) }}</span
                      >
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <div class="flex items-center justify-center space-x-2 text-gray-500">
                      <Clock class="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span
                        class="cursor-pointer hover:text-blue-600 transition-colors duration-150"
                        @click="copyToClipboard(`${execution.duration || '-'} 分钟`)"
                        title="点击复制"
                        >{{ execution.duration || "-" }} 分钟</span
                      >
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <div class="flex items-center justify-center space-x-2">
                      <div class="flex-shrink-0 h-8 w-8">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                          :alt="execution.executor"
                          class="h-8 w-8 rounded-full object-cover border border-gray-200"
                        />
                      </div>
                      <span
                        class="text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-150"
                        @click="copyToClipboard(execution.executor)"
                        title="点击复制"
                        >{{ execution.executor }}</span
                      >
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center justify-end space-x-2">
                      <button
                        v-if="execution.status === 'running'"
                        class="p-1.5 hover:bg-red-100 rounded-full transition-colors duration-150"
                        @click="stopExecution(execution.id)"
                      >
                        <StopCircle class="w-5 h-5 text-red-600" />
                      </button>
                      <button
                        v-if="isQueuedOrInitializing(execution.status)"
                        class="p-1.5 hover:bg-green-100 rounded-full transition-colors duration-150"
                        @click="startExecution(execution.id)"
                      >
                        <PlayCircle class="w-5 h-5 text-green-600" />
                      </button>
                      <button
                        class="px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-medium flex items-center transition-colors duration-150 shadow-sm"
                        @click="navigateToExecutionDetails(execution.id)"
                      >
                        <ExternalLink class="w-3 h-3 mr-1" />
                        详情页面
                      </button>
                      <button
                        class="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-150"
                      >
                        <MoreVertical class="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="paginatedExecutions.length === 0">
                  <td colspan="9" class="px-6 py-10 text-center text-gray-500">
                    <div class="flex flex-col items-center">
                      <PlayCircle class="w-12 h-12 text-gray-300 mb-2" />
                      <p class="text-gray-500">没有找到匹配的测试执行</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </template>

      <!-- 测试执行详情页面 - 仅在路由有ID参数时显示 -->
      <template v-else>
        <PageHeader
          :title="`测试执行详情: ${selectedExecution?.id || ''}`"
          description="查看测试执行的详细信息"
        >
          <template #actions>
            <div class="flex items-center space-x-2">
              <button
                @click="goBack"
                class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 transition-colors"
              >
                <ArrowLeft class="w-5 h-5 text-gray-600" />
                <span>返回</span>
              </button>
              <StatusBadge
                v-if="selectedExecution"
                :status="getStatusForBadge(selectedExecution.status)"
              />
              <button
                v-if="selectedExecution?.status === 'running'"
                class="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center"
                @click="stopExecution(selectedExecution.id)"
              >
                <StopCircle class="w-4 h-4 mr-1" />
                <span>停止执行</span>
              </button>
              <button
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <RefreshCw class="w-5 h-5" />
                <span>重新执行</span>
              </button>
            </div>
          </template>
        </PageHeader>

        <!-- 测试执行详情部分 -->
        <div v-if="selectedExecution" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2">
            <DashboardCard title="执行详情">
              <div class="space-y-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <Hash class="w-4 h-4 text-gray-400" />
                    <span class="font-medium text-gray-900">{{
                      selectedExecution.id
                    }}</span>
                  </div>
                  <StatusBadge :status="getStatusForBadge(selectedExecution.status)" />
                </div>

                <div class="flex flex-col md:flex-row gap-6">
                  <div class="md:w-1/2">
                    <h3 class="text-sm font-medium text-gray-500">测试用例信息</h3>
                    <div class="mt-2 space-y-2">
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-500">名称:</span>
                        <span class="text-gray-900 font-medium">{{
                          selectedExecution.testCase.name
                        }}</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-500">优先级:</span>
                        <span class="text-gray-900">{{
                          selectedExecution.testCase.priority
                        }}</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-500">预计时间:</span>
                        <span class="text-gray-900"
                          >{{ selectedExecution.testCase.duration }} 分钟</span
                        >
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-500">标签:</span>
                        <div class="flex flex-wrap justify-end gap-1">
                          <span
                            v-for="tag in selectedExecution.testCase.tags"
                            :key="tag"
                            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {{ tag }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="md:w-1/2">
                    <h3 class="text-sm font-medium text-gray-500">执行信息</h3>
                    <div class="mt-2 space-y-2">
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-500">开始时间:</span>
                        <span class="text-gray-900">{{
                          formatDate(selectedExecution.startTime)
                        }}</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-500">结束时间:</span>
                        <span class="text-gray-900">{{
                          selectedExecution.endTime
                            ? formatDate(selectedExecution.endTime)
                            : "-"
                        }}</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-500">持续时间:</span>
                        <span class="text-gray-900"
                          >{{ selectedExecution.duration || "-" }} 分钟</span
                        >
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-500">执行人:</span>
                        <span class="text-gray-900">{{
                          selectedExecution.executor
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="text-sm font-medium text-gray-500">测试步骤进度</h3>
                  <div class="mt-2 space-y-2">
                    <div
                      v-for="(log, index) in selectedExecution.logs"
                      :key="index"
                      class="flex items-start space-x-3"
                    >
                      <div
                        class="w-6 h-6 mt-0.5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"
                      >
                        <CheckCircle2 class="w-4 h-4 text-green-600" />
                      </div>
                      <span class="text-sm text-gray-600">{{ log }}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="text-sm font-medium text-gray-500">执行日志</h3>
                  <div
                    class="mt-2 bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-auto max-h-[200px]"
                  >
                    <div
                      v-for="(log, index) in selectedExecution.logs"
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
            <div class="space-y-6">
              <DashboardCard title="环境信息">
                <div class="space-y-4" v-if="selectedExecution.environmentInfo">
                  <div class="mt-2 space-y-2 text-sm text-gray-600">
                    <div class="flex justify-between">
                      <span>环境:</span>
                      <span class="font-medium">{{ selectedExecution.environment }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>浏览器:</span>
                      <span>{{ selectedExecution.environmentInfo.browser }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>操作系统:</span>
                      <span>{{ selectedExecution.environmentInfo.operatingSystem }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>分辨率:</span>
                      <span>{{ selectedExecution.environmentInfo.resolution }}</span>
                    </div>
                  </div>
                </div>
              </DashboardCard>

              <DashboardCard title="快速操作">
                <div class="space-y-2">
                  <button
                    class="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <div class="flex items-center space-x-2">
                      <Terminal class="w-4 h-4" />
                      <span>查看完整日志</span>
                    </div>
                    <ChevronRight class="w-4 h-4" />
                  </button>
                  <button
                    class="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <div class="flex items-center space-x-2">
                      <RefreshCw class="w-4 h-4" />
                      <span>重新执行</span>
                    </div>
                    <ChevronRight class="w-4 h-4" />
                  </button>
                  <button
                    class="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <div class="flex items-center space-x-2">
                      <FileText class="w-4 h-4" />
                      <span>下载报告</span>
                    </div>
                    <ChevronRight class="w-4 h-4" />
                  </button>
                </div>
              </DashboardCard>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8 bg-white rounded-lg shadow">
          <Terminal class="w-12 h-12 text-gray-400 mx-auto" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">未找到执行</h3>
          <p class="mt-1 text-sm text-gray-500">
            未找到ID为 {{ route.params.id }} 的测试执行
          </p>
          <button
            @click="goBack"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回列表
          </button>
        </div>
      </template>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  formatDate,
  getStatusIcon,
  getStatusForBadge,
  isQueuedOrInitializing,
  loadExecutions as fetchExecutions,
  loadExecution as fetchExecution,
  stopExecution as stopExec,
  startExecution as startExec,
  handleSelectAll as handleSelectAllFn,
  handleBatchAction as handleBatchActionFn,
  navigateToExecutionDetails as gotoDetails,
  goBack as goBackFn,
  copyToClipboard as copyFn,
} from "./TestExecution.logic.ts";
import {
  Search,
  Filter,
  Play,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Settings,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Terminal,
  MoreVertical,
  Eye,
  Hash,
  StopCircle,
  RefreshCw,
  FileText,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  MoreHorizontal,
  Check,
  AlertTriangle,
  PlayCircle,
  Copy,
} from "lucide-vue-next";
import DashboardCard from "@/components/DashboardCard.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import PageHeader from "@/components/layout/PageHeader.vue";
import Pagination from "@/components/Pagination.vue";
import { usePagination } from "@/composables/usePagination";
import type { TestExecution } from "@/mock/types/execution";

const route = useRoute();
const router = useRouter();

const searchQuery = ref("");
const selectedEnvironment = ref("all");
const selectedStatus = ref("all");
const selectedExecution = ref<TestExecution | null>(null);
const executions = ref<TestExecution[]>([]);
const loading = ref(false);
const sortField = ref("startTime");
const sortOrder = ref<"asc" | "desc">("desc");

const selectedExecutions = ref<string[]>([]);
const copyStatus = ref<{ text: string; success: boolean; timestamp: number } | null>(
  null
);

const filteredExecutions = computed(() => executions.value);

const {
  currentPage,
  pageSize,
  paginatedItems: paginatedExecutions,
  resetPage,
  totalPages,
  displayedPages,
  prevPage,
  nextPage,
  goToPage,
} = usePagination(filteredExecutions, { pageSize: 5 });

const showCopyStatus = (text: string, success: boolean) => {
  copyStatus.value = {
    text,
    success,
    timestamp: Date.now(),
  };
  setTimeout(() => {
    if (copyStatus.value?.timestamp === Date.now()) {
      copyStatus.value = null;
    }
  }, 2000);
};

const copyToClipboard = async (text: string | undefined) => {
  await copyFn(text, showCopyStatus);
};

const loadData = async () => {
  loading.value = true;
  try {
    executions.value = await fetchExecutions(
      searchQuery.value,
      selectedEnvironment.value,
      selectedStatus.value,
      sortField.value,
      sortOrder.value
    );
  } finally {
    loading.value = false;
  }
};

const loadExecutionData = async (id: string) => {
  loading.value = true;
  try {
    const data = await fetchExecution(id);
    selectedExecution.value = data;
  } finally {
    loading.value = false;
  }
};

const stopExecution = async (id: string) => {
  await stopExec(id);
  await loadData();
  if (selectedExecution.value?.id === id) {
    selectedExecution.value = await fetchExecution(id);
  }
};

const startExecution = async (id: string) => {
  await startExec(id);
  await loadData();
  if (selectedExecution.value?.id === id) {
    selectedExecution.value = await fetchExecution(id);
  }
};

const handleSelectAll = (event: Event) => {
  handleSelectAllFn(event, executions.value, selectedExecutions);
};

const handleBatchAction = (action: "start" | "stop" | "export" | "delete") => {
  handleBatchActionFn(action, selectedExecutions.value);
};

const navigateToExecutionDetails = (id: string) => {
  gotoDetails(router, id);
};

const goBack = () => {
  goBackFn(router);
};

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadExecutionData(newId as string);
    } else {
      selectedExecution.value = null;
    }
  },
  { immediate: true }
);

watch([searchQuery, selectedEnvironment, selectedStatus], () => {
  resetPage();
  loadData();
});

onMounted(async () => {
  if (!route.params.id) {
    await loadData();
  }
});
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
