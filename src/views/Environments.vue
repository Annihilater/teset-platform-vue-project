<template>
  <PageLayout>
    <div class="space-y-8">
      <PageHeader title="测试环境" description="管理和监控您的测试环境">
        <template #actions>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus class="w-5 h-5" />
            <span>创建环境</span>
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
                placeholder="搜索环境..."
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
                <option value="active">活跃</option>
                <option value="maintenance">维护中</option>
                <option value="inactive">不活跃</option>
              </select>
              <ChevronDown
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
              />
            </div>

            <div class="relative">
              <select
                class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                v-model="selectedType"
              >
                <option value="all">所有类型</option>
                <option value="production">生产环境</option>
                <option value="staging">预发布环境</option>
                <option value="development">开发环境</option>
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
          <div class="space-y-6">
            <div
              v-for="env in environments"
              :key="env.id"
              class="bg-white rounded-lg shadow-sm border transition-colors cursor-pointer"
              :class="
                selectedEnvironment?.id === env.id
                  ? 'border-blue-500'
                  : 'border-gray-200 hover:border-blue-300'
              "
              @click="selectedEnvironment = env"
            >
              <div class="p-6">
                <div class="flex items-start justify-between">
                  <div>
                    <div class="flex items-center space-x-3">
                      <h3 class="text-xl font-semibold text-gray-900">{{ env.name }}</h3>
                      <span
                        :class="`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                          env.status
                        )}`"
                      >
                        {{ getStatusText(env.status) }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-500 mt-1">版本 {{ env.version }}</p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <a
                      :href="env.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ExternalLink class="w-5 h-5 text-gray-500" />
                    </a>
                    <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Settings class="w-5 h-5 text-gray-500" />
                    </button>
                    <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical class="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div class="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <div class="text-sm text-gray-500">CPU 使用率</div>
                    <div class="mt-1 flex items-center space-x-2">
                      <div class="flex-1 h-2 bg-gray-200 rounded-full">
                        <div
                          class="h-2 bg-blue-500 rounded-full"
                          :style="{ width: `${env.health.cpu}%` }"
                        />
                      </div>
                      <span class="text-sm font-medium text-gray-700"
                        >{{ env.health.cpu }}%</span
                      >
                    </div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500">内存使用率</div>
                    <div class="mt-1 flex items-center space-x-2">
                      <div class="flex-1 h-2 bg-gray-200 rounded-full">
                        <div
                          class="h-2 bg-purple-500 rounded-full"
                          :style="{ width: `${env.health.memory}%` }"
                        />
                      </div>
                      <span class="text-sm font-medium text-gray-700"
                        >{{ env.health.memory }}%</span
                      >
                    </div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500">健康状态</div>
                    <div class="mt-1 flex items-center space-x-2">
                      <component :is="getHealthIcon(env.health.status)" />
                      <span class="text-sm font-medium text-gray-700 capitalize">{{
                        getHealthText(env.health.status)
                      }}</span>
                    </div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500">最近部署</div>
                    <div class="mt-1 flex items-center space-x-2">
                      <Clock class="w-4 h-4 text-gray-400" />
                      <span class="text-sm font-medium text-gray-700">{{
                        env.lastDeployment
                      }}</span>
                    </div>
                  </div>
                </div>

                <div class="mt-6">
                  <h4 class="text-sm font-medium text-gray-900">活跃服务</h4>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <span
                      v-for="service in env.configuration.services"
                      :key="service"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {{ service }}
                    </span>
                  </div>
                </div>

                <div class="mt-6 flex items-center space-x-6 text-sm text-gray-500">
                  <div class="flex items-center space-x-2">
                    <Database class="w-4 h-4" />
                    <span>{{ env.configuration.database }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Server class="w-4 h-4" />
                    <span>{{ env.configuration.operatingSystem }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Users class="w-4 h-4" />
                    <span>{{ env.maintainers.length }} 维护人员</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="space-y-6">
            <DashboardCard title="最近活动">
              <div class="space-y-4">
                <div
                  v-for="activity in recentActivities"
                  :key="activity.id"
                  class="flex items-start space-x-3"
                >
                  <div class="flex-shrink-0">
                    <component :is="getActivityIcon(activity.action)" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900">
                      {{ activity.environment }} 上的{{ getActionText(activity.action) }}
                    </p>
                    <p class="text-sm text-gray-500">{{ activity.description }}</p>
                    <div class="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                        :alt="activity.user"
                        class="w-4 h-4 rounded-full"
                      />
                      <span>{{ activity.user }}</span>
                      <span>•</span>
                      <span>{{ new Date(activity.timestamp).toLocaleString() }}</span>
                    </div>
                  </div>
                  <CheckCircle2
                    v-if="activity.status === 'success'"
                    class="w-5 h-5 text-green-500"
                  />
                  <XCircle v-else class="w-5 h-5 text-red-500" />
                </div>
              </div>
            </DashboardCard>

            <div v-if="selectedEnvironment" class="space-y-6">
              <DashboardCard title="环境详情">
                <div class="space-y-4">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">配置</h4>
                    <div class="mt-2 space-y-2">
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-500">操作系统</span>
                        <span class="text-gray-900">{{
                          selectedEnvironment.configuration.operatingSystem
                        }}</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-500">浏览器</span>
                        <span class="text-gray-900">{{
                          selectedEnvironment.configuration.browser
                        }}</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-500">数据库</span>
                        <span class="text-gray-900">{{
                          selectedEnvironment.configuration.database
                        }}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 class="text-sm font-medium text-gray-900">维护人员</h4>
                    <div class="mt-2 space-y-2">
                      <div
                        v-for="maintainer in selectedEnvironment.maintainers"
                        :key="maintainer"
                        class="flex items-center space-x-2"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                          :alt="maintainer"
                          class="w-6 h-6 rounded-full"
                        />
                        <span class="text-sm text-gray-900">{{ maintainer }}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 class="text-sm font-medium text-gray-900">环境URL</h4>
                    <div class="mt-2 space-y-2">
                      <a
                        :href="selectedEnvironment.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Globe class="w-4 h-4" />
                        <span>{{ selectedEnvironment.url }}</span>
                        <ExternalLink class="w-4 h-4" />
                      </a>
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
                      <RotateCw class="w-4 h-4" />
                      <span>部署新版本</span>
                    </div>
                    <ChevronDown class="w-4 h-4" />
                  </button>
                  <button
                    class="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <div class="flex items-center space-x-2">
                      <Terminal class="w-4 h-4" />
                      <span>查看日志</span>
                    </div>
                    <ChevronDown class="w-4 h-4" />
                  </button>
                  <button
                    class="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <div class="flex items-center space-x-2">
                      <Settings class="w-4 h-4" />
                      <span>配置环境</span>
                    </div>
                    <ChevronDown class="w-4 h-4" />
                  </button>
                </div>
              </DashboardCard>
            </div>
            <DashboardCard v-else title="选择环境">
              <div class="text-center py-6">
                <Server class="w-12 h-12 text-gray-400 mx-auto" />
                <h3 class="mt-2 text-sm font-medium text-gray-900">未选择环境</h3>
                <p class="mt-1 text-sm text-gray-500">从列表中选择一个环境查看详细信息</p>
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import {
  searchQuery,
  selectedStatus,
  selectedType,
  selectedEnvironment,
  environments,
  recentActivities,
  getHealthIcon,
  getHealthText,
  getActivityIcon,
  getActionText,
  getStatusClass,
  getStatusText,
  loadEnvironments,
  loadRecentActivities,
} from "./Environments.logic.ts";
import { onMounted } from "vue";
onMounted(() => {
  loadEnvironments();
  loadRecentActivities();
});
import "./Environments.styles.css";

import PageLayout from "@/components/layout/PageLayout.vue";
import PageHeader from "@/components/layout/PageHeader.vue";
import DashboardCard from "@/components/DashboardCard.vue";
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  Settings,
  Server,
  Database,
  Globe,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCw,
  Terminal,
  Users,
  MoreVertical,
  ExternalLink,
  Activity,
} from "lucide-vue-next";
</script>
