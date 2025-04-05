<template>
  <PageLayout>
    <div class="space-y-8">
      <PageHeader title="项目" description="管理您的测试项目">
        <template #actions>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus class="w-5 h-5" />
            <span>创建项目</span>
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
                placeholder="搜索项目名称..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                v-model="searchQuery"
              />
            </div>
          </div>

          <div class="flex space-x-4">
            <div class="relative">
              <select
                class="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                v-model="statusFilter"
              >
                <option value="all">所有状态</option>
                <option value="active">活跃</option>
                <option value="inactive">不活跃</option>
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
          <DashboardCard title="项目列表">
            <div class="space-y-4">
              <div
                v-for="project in filteredProjects"
                :key="project.id"
                class="p-4 bg-white border rounded-lg cursor-pointer transition-colors"
                :class="
                  selectedProject?.id === project.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                "
                @click="selectedProject = project"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <div class="flex items-center space-x-3">
                      <h3 class="text-lg font-medium text-gray-900">
                        {{ project.name }}
                      </h3>
                      <span
                        :class="`px-2 py-1 text-xs font-medium rounded-full ${
                          project.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`"
                      >
                        {{ getStatusText(project.status) }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-500 mt-1">{{ project.description }}</p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button class="p-1 hover:bg-gray-100 rounded">
                      <Settings class="w-5 h-5 text-gray-500" />
                    </button>
                    <button class="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical class="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div class="mt-4">
                  <div class="flex items-center text-sm text-gray-500 mb-2">
                    <div class="w-1/2">测试用例: {{ project.testCount }}</div>
                    <div class="w-1/2">通过率: {{ project.passRate }}%</div>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-blue-600 h-2 rounded-full"
                      :style="`width: ${project.passRate}%`"
                    ></div>
                  </div>
                </div>

                <div class="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                  <div class="flex items-center space-x-2">
                    <Clock class="w-4 h-4" />
                    <span>更新于 {{ project.lastUpdate }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Users class="w-4 h-4" />
                    <span>{{ project.teamCount || 1 }} 个团队</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Target class="w-4 h-4" />
                    <span>{{ project.environmentCount || 2 }} 个环境</span>
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        <div class="lg:col-span-1">
          <div v-if="selectedProject" class="space-y-6">
            <DashboardCard title="项目详情">
              <div class="space-y-4">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">
                    {{ selectedProject.name }}
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ selectedProject.description }}
                  </p>
                </div>

                <div>
                  <h4 class="text-sm font-medium text-gray-500">基本信息</h4>
                  <div class="mt-2 space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500">项目ID:</span>
                      <span class="text-gray-900">{{ selectedProject.id }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500">状态:</span>
                      <span
                        :class="`px-2 py-1 text-xs font-medium rounded-full ${
                          selectedProject.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`"
                      >
                        {{ getStatusText(selectedProject.status) }}
                      </span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500">最后更新:</span>
                      <span class="text-gray-900">{{ selectedProject.lastUpdate }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="测试统计">
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-4 bg-gray-50 rounded-lg">
                  <div class="text-2xl font-bold text-blue-600">
                    {{ selectedProject.testCount }}
                  </div>
                  <div class="text-sm text-gray-500">测试用例</div>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded-lg">
                  <div class="text-2xl font-bold text-green-600">
                    {{ selectedProject.passRate }}%
                  </div>
                  <div class="text-sm text-gray-500">通过率</div>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded-lg">
                  <div class="text-2xl font-bold text-purple-600">
                    {{ selectedProject.automationRate || 65 }}%
                  </div>
                  <div class="text-sm text-gray-500">自动化率</div>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded-lg">
                  <div class="text-2xl font-bold text-orange-600">
                    {{ selectedProject.defectCount || 8 }}
                  </div>
                  <div class="text-sm text-gray-500">活跃缺陷</div>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="快速操作">
              <div class="space-y-2">
                <button
                  class="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <div class="flex items-center space-x-2">
                    <Play class="w-4 h-4" />
                    <span>运行测试</span>
                  </div>
                  <ChevronRight class="w-4 h-4" />
                </button>
                <button
                  class="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <div class="flex items-center space-x-2">
                    <FileText class="w-4 h-4" />
                    <span>查看报告</span>
                  </div>
                  <ChevronRight class="w-4 h-4" />
                </button>
                <button
                  class="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <div class="flex items-center space-x-2">
                    <Settings class="w-4 h-4" />
                    <span>项目设置</span>
                  </div>
                  <ChevronRight class="w-4 h-4" />
                </button>
              </div>
            </DashboardCard>
          </div>

          <DashboardCard v-else title="选择项目">
            <div class="text-center py-6">
              <Folder class="w-12 h-12 text-gray-400 mx-auto" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">未选择项目</h3>
              <p class="mt-1 text-sm text-gray-500">从列表中选择一个项目查看详细信息</p>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import PageLayout from "@/components/layout/PageLayout.vue";
import PageHeader from "@/components/layout/PageHeader.vue";
import DashboardCard from "@/components/DashboardCard.vue";
import {
  Plus,
  Settings,
  MoreVertical,
  Clock,
  Users,
  Target,
  Play,
  FileText,
  ChevronRight,
  Folder,
  Search,
  Filter,
  ChevronDown,
} from "lucide-vue-next";
import type { Project, ProjectStatus } from "@/mock/types/project";
import { ProjectService } from "@/mock/services/project";

const selectedProject = ref<Project | null>(null);
const projects = ref<Project[]>([]);
const searchQuery = ref("");
const statusFilter = ref("all");

// 过滤项目
const filteredProjects = computed(() => {
  let result = projects.value;

  // 根据搜索关键词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query)
    );
  }

  // 根据状态过滤
  if (statusFilter.value !== "all") {
    result = result.filter((project) => project.status === statusFilter.value);
  }

  return result;
});

const getStatusText = (status: ProjectStatus) => {
  switch (status) {
    case "active":
      return "活跃";
    case "inactive":
      return "不活跃";
    default:
      return status;
  }
};

// 加载项目列表
const loadProjects = async () => {
  projects.value = await ProjectService.getProjectList();
};

// 初始加载
onMounted(() => {
  loadProjects();
});
</script>
