<template>
  <PageLayout>
    <div class="space-y-8">
      <PageHeader title="团队" description="管理您的测试团队和成员">
        <template #actions>
          <div class="flex space-x-4">
            <button
              class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <UserPlus class="w-5 h-5" />
              <span>邀请成员</span>
            </button>
            <button
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus class="w-5 h-5" />
              <span>创建团队</span>
            </button>
          </div>
        </template>

        <div class="mb-6 flex flex-wrap gap-4">
          <div class="flex-1 min-w-[300px]">
            <div class="relative">
              <Search
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
              <input
                type="text"
                placeholder="搜索团队..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                v-model="searchQuery"
              />
            </div>
          </div>

          <button
            class="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter class="w-5 h-5 text-gray-400" />
            <span>筛选</span>
          </button>
        </div>
      </PageHeader>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="space-y-6">
            <div
              v-for="team in teams"
              :key="team.id"
              class="bg-white rounded-lg shadow-sm border transition-colors cursor-pointer"
              :class="
                selectedTeam?.id === team.id
                  ? 'border-blue-500'
                  : 'border-gray-200 hover:border-blue-300'
              "
              @click="selectedTeam = team"
            >
              <div class="p-6">
                <div class="flex items-start justify-between">
                  <div>
                    <div class="flex items-center space-x-3">
                      <h3 class="text-xl font-semibold text-gray-900">{{ team.name }}</h3>
                      <div class="flex space-x-2">
                        <span
                          v-for="tag in team.tags"
                          :key="tag"
                          class="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                        >
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                    <p class="text-sm text-gray-500 mt-1">{{ team.description }}</p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Settings class="w-5 h-5 text-gray-500" />
                    </button>
                    <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical class="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div class="mt-6 grid grid-cols-3 gap-4">
                  <div>
                    <div class="text-sm text-gray-500">通过率</div>
                    <div class="mt-1 flex items-center space-x-2">
                      <span
                        :class="`text-2xl font-bold ${getTeamMetricsColor(
                          team.metrics?.passRate || 0,
                          'passRate'
                        )}`"
                      >
                        {{ team.metrics?.passRate }}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500">自动化率</div>
                    <div class="mt-1 flex items-center space-x-2">
                      <span
                        :class="`text-2xl font-bold ${getTeamMetricsColor(
                          team.metrics?.automationRate || 0,
                          'automationRate'
                        )}`"
                      >
                        {{ team.metrics?.automationRate }}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-500">测试总数</div>
                    <div class="mt-1 flex items-center space-x-2">
                      <span class="text-2xl font-bold text-gray-900">{{
                        team.metrics?.totalTests
                      }}</span>
                    </div>
                  </div>
                </div>

                <div class="mt-6">
                  <h4 class="text-sm font-medium text-gray-900">团队成员</h4>
                  <div class="mt-2 flex -space-x-2">
                    <img
                      v-for="user in getUsersByTeam(team.id)"
                      :key="user.id"
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                      :alt="user.name"
                      class="w-8 h-8 rounded-full border-2 border-white"
                      :title="user.name"
                    />
                    <button
                      class="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-gray-600 hover:bg-gray-200"
                    >
                      <Plus class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div v-if="selectedTeam" class="space-y-6">
            <DashboardCard title="团队详情">
              <div class="space-y-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">成员</h4>
                  <div class="mt-2 space-y-3">
                    <div
                      v-for="user in getUsersByTeam(selectedTeam.id)"
                      :key="user.id"
                      class="flex items-center justify-between"
                    >
                      <div class="flex items-center space-x-3">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                          :alt="user.name"
                          class="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div class="text-sm font-medium text-gray-900">
                            {{ user.name }}
                          </div>
                          <div class="text-xs text-gray-500">
                            {{ getRoleText(user.role) }}
                          </div>
                        </div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span
                          v-if="user.id === selectedTeam.lead"
                          class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                        >
                          团队负责人
                        </span>
                        <button class="p-1 hover:bg-gray-100 rounded">
                          <MoreVertical class="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-sm font-medium text-gray-900">项目</h4>
                  <div class="mt-2 space-y-2">
                    <div
                      v-for="project in selectedTeam.projects"
                      :key="project"
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <span class="text-sm text-gray-700">{{ project }}</span>
                      <button class="p-1 hover:bg-gray-200 rounded">
                        <ExternalLink class="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-sm font-medium text-gray-900">最近活动</h4>
                  <div class="mt-2 space-y-3">
                    <div
                      v-for="(activity, index) in recentActivities"
                      :key="index"
                      class="flex items-start space-x-3"
                    >
                      <div class="flex-shrink-0">
                        <Clock class="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p class="text-sm text-gray-900">{{ activity.action }}</p>
                        <div class="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{{ activity.user }}</span>
                          <span>•</span>
                          <span>{{ activity.time }}</span>
                        </div>
                      </div>
                    </div>
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
                    <UserPlus class="w-4 h-4" />
                    <span>添加成员</span>
                  </div>
                  <ChevronDown class="w-4 h-4" />
                </button>
                <button
                  class="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <div class="flex items-center space-x-2">
                    <Shield class="w-4 h-4" />
                    <span>管理权限</span>
                  </div>
                  <ChevronDown class="w-4 h-4" />
                </button>
                <button
                  class="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <div class="flex items-center space-x-2">
                    <Settings class="w-4 h-4" />
                    <span>团队设置</span>
                  </div>
                  <ChevronDown class="w-4 h-4" />
                </button>
              </div>
            </DashboardCard>
          </div>
          <DashboardCard v-else title="选择团队">
            <div class="text-center py-6">
              <Users class="w-12 h-12 text-gray-400 mx-auto" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">未选择团队</h3>
              <p class="mt-1 text-sm text-gray-500">从列表中选择一个团队查看详细信息</p>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  Users,
  UserPlus,
  Settings,
  BarChart2,
  Mail,
  Clock,
  MoreVertical,
  Edit3,
  Trash2,
  Shield,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-vue-next";
import DashboardCard from "@/components/DashboardCard.vue";
import PageHeader from "@/components/layout/PageHeader.vue";
import PageLayout from "@/components/layout/PageLayout.vue";
import { TeamService } from "@/mock/services/team";
import type { Team } from "@/mock/types/team";
import type { User } from "@/mock/types/user";
import type { TeamActivity } from "@/mock/types/team";

const searchQuery = ref("");
const teams = ref<Team[]>([]);
const selectedTeam = ref<Team | null>(null);
const teamMembers = ref<User[]>([]);
const recentActivities = ref<TeamActivity[]>([]);
const loading = ref(false);

const getTeamMetricsColor = (value: number, type: "passRate" | "automationRate") => {
  if (type === "passRate") {
    return value >= 90
      ? "text-green-600"
      : value >= 75
      ? "text-yellow-600"
      : "text-red-600";
  }
  return value >= 70
    ? "text-green-600"
    : value >= 50
    ? "text-yellow-600"
    : "text-red-600";
};

const getUsersByTeam = (teamId: string) => {
  return teamMembers.value.filter((user) => user.teams.includes(teamId));
};

const getRoleText = (role: string) => {
  switch (role) {
    case "manager":
      return "管理员";
    case "tester":
      return "测试员";
    case "admin":
      return "超级管理员";
    case "viewer":
      return "查看者";
    default:
      return role;
  }
};

const loadTeams = async () => {
  loading.value = true;
  try {
    if (searchQuery.value) {
      teams.value = await TeamService.searchTeams(searchQuery.value);
    } else {
      teams.value = await TeamService.getAllTeams();
    }
  } catch (error) {
    console.error("加载团队失败:", error);
  } finally {
    loading.value = false;
  }
};

const loadTeamMembers = async () => {
  try {
    teamMembers.value = await TeamService.getAllTeamMembers();
  } catch (error) {
    console.error("加载团队成员失败:", error);
  }
};

const loadRecentActivities = async () => {
  try {
    recentActivities.value = await TeamService.getRecentActivities();
  } catch (error) {
    console.error("加载最近活动失败:", error);
  }
};

// 监听搜索查询变化
watch(searchQuery, () => {
  loadTeams();
});

// 监听选中团队变化
watch(selectedTeam, async () => {
  // 移除团队成员加载，因为现在在初始化时已加载所有成员
});

// 组件挂载时加载数据
onMounted(async () => {
  await Promise.all([loadTeams(), loadTeamMembers(), loadRecentActivities()]);
});
</script>
