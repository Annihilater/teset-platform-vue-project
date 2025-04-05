<template>
  <div
    :class="[
      'bg-gray-900 text-white min-h-screen flex flex-col overflow-y-auto fixed top-0 left-0 z-40 transition-all duration-300',
      layoutStore.sidebarExpanded ? 'w-auto min-w-[16rem] max-w-[20rem]' : 'w-20',
      {
        '-translate-x-full': !sidebarOpen && !isLargeScreen,
        'translate-x-0': sidebarOpen || isLargeScreen,
      },
      $attrs.class,
    ]"
    @keydown.escape.window="closeSidebar"
  >
    <div class="flex grow flex-col gap-y-5 px-2 ring-1 ring-white/10">
      <div
        class="flex h-16 shrink-0 items-center"
        :class="layoutStore.sidebarExpanded ? 'justify-start' : 'justify-center'"
      >
        <div
          class="flex items-center"
          :class="layoutStore.sidebarExpanded ? '' : 'justify-center'"
        >
          <Beaker
            class="w-8 h-8 text-white transition-all duration-300"
            :class="layoutStore.sidebarExpanded ? 'mr-2' : ''"
          />
          <h2
            v-if="layoutStore.sidebarExpanded"
            class="text-xl font-semibold text-white overflow-hidden transition-all duration-300"
          >
            {{ $t("common.appName") }}
          </h2>
        </div>
      </div>

      <nav class="flex flex-1 flex-col">
        <ul role="list" class="flex flex-1 flex-col gap-y-7">
          <!-- Overview Section -->
          <li>
            <div
              v-if="layoutStore.sidebarExpanded"
              class="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wider"
            >
              {{ $t("navigation.sections.overview") }}
            </div>
            <ul role="list" class="mt-2 space-y-1">
              <li>
                <router-link
                  to="/dashboard"
                  :class="[
                    isCurrentRoute('/dashboard')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                    layoutStore.sidebarExpanded ? 'px-2' : 'justify-center',
                  ]"
                  :title="$t('navigation.dashboard')"
                >
                  <LayoutDashboard class="h-6 w-6 shrink-0" />
                  <span v-if="layoutStore.sidebarExpanded">{{
                    $t("navigation.dashboard")
                  }}</span>
                </router-link>
              </li>
              <li>
                <router-link
                  to="/recent-runs"
                  :class="[
                    isCurrentRoute('/recent-runs')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                    layoutStore.sidebarExpanded ? 'px-2' : 'justify-center',
                  ]"
                  :title="$t('navigation.recentRuns')"
                >
                  <Clock class="h-6 w-6 shrink-0" />
                  <span v-if="layoutStore.sidebarExpanded">{{
                    $t("navigation.recentRuns")
                  }}</span>
                </router-link>
              </li>
              <li>
                <router-link
                  to="/analytics"
                  :class="[
                    isCurrentRoute('/analytics')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                    layoutStore.sidebarExpanded ? 'px-2' : 'justify-center',
                  ]"
                  :title="$t('navigation.analytics')"
                >
                  <BarChart3 class="h-6 w-6 shrink-0" />
                  <span v-if="layoutStore.sidebarExpanded">{{
                    $t("navigation.analytics")
                  }}</span>
                </router-link>
              </li>
            </ul>
          </li>

          <!-- Projects Section -->
          <li>
            <div
              v-if="layoutStore.sidebarExpanded"
              class="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wider"
            >
              {{ $t("navigation.sections.projects") }}
            </div>
            <ul role="list" class="mt-2 space-y-1">
              <li>
                <router-link
                  to="/projects"
                  :class="[
                    isCurrentRoute('/projects')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                    layoutStore.sidebarExpanded ? 'px-2' : 'justify-center',
                  ]"
                  :title="$t('navigation.projects')"
                >
                  <Folders class="h-6 w-6 shrink-0" />
                  <span v-if="layoutStore.sidebarExpanded">{{
                    $t("navigation.projects")
                  }}</span>
                </router-link>
              </li>
            </ul>
          </li>

          <!-- Test Plans Section -->
          <li>
            <div
              v-if="layoutStore.sidebarExpanded"
              class="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wider"
            >
              {{ $t("navigation.sections.testPlans") }}
            </div>
            <ul role="list" class="mt-2 space-y-1">
              <li>
                <router-link
                  to="/test-plans"
                  :class="[
                    isCurrentRoute('/test-plans')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                    layoutStore.sidebarExpanded ? 'px-2' : 'justify-center',
                  ]"
                  :title="$t('navigation.testPlans')"
                >
                  <Calendar class="h-6 w-6 shrink-0" />
                  <span v-if="layoutStore.sidebarExpanded">{{
                    $t("navigation.testPlans")
                  }}</span>
                </router-link>
              </li>
            </ul>
          </li>

          <!-- Test Cases Section -->
          <li>
            <div
              v-if="layoutStore.sidebarExpanded"
              class="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wider"
            >
              {{ $t("navigation.sections.testCases") }}
            </div>
            <ul role="list" class="mt-2 space-y-1">
              <li>
                <router-link
                  to="/test-cases"
                  :class="[
                    isCurrentRoute('/test-cases')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                    layoutStore.sidebarExpanded ? 'px-2' : 'justify-center',
                  ]"
                  :title="$t('navigation.testCases')"
                >
                  <ClipboardCheck class="h-6 w-6 shrink-0" />
                  <span v-if="layoutStore.sidebarExpanded">{{
                    $t("navigation.testCases")
                  }}</span>
                </router-link>
              </li>
            </ul>
          </li>

          <!-- Execution Section -->
          <li>
            <div
              v-if="layoutStore.sidebarExpanded"
              class="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wider"
            >
              {{ $t("navigation.sections.execution") }}
            </div>
            <ul role="list" class="mt-2 space-y-1">
              <li>
                <router-link
                  to="/test-execution"
                  :class="[
                    isCurrentRoute('/test-execution')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                    layoutStore.sidebarExpanded ? 'px-2' : 'justify-center',
                  ]"
                  :title="$t('navigation.testExecution')"
                >
                  <PlayCircle class="h-6 w-6 shrink-0" />
                  <span v-if="layoutStore.sidebarExpanded">{{
                    $t("navigation.testExecution")
                  }}</span>
                </router-link>
              </li>
              <li>
                <router-link
                  to="/defects"
                  :class="[
                    isCurrentRoute('/defects')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                    layoutStore.sidebarExpanded ? 'px-2' : 'justify-center',
                  ]"
                  :title="$t('navigation.defects')"
                >
                  <Bug class="h-6 w-6 shrink-0" />
                  <span v-if="layoutStore.sidebarExpanded">{{
                    $t("navigation.defects")
                  }}</span>
                </router-link>
              </li>
            </ul>
          </li>

          <!-- Reports Section -->
          <li>
            <div
              v-if="layoutStore.sidebarExpanded"
              class="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wider"
            >
              {{ $t("navigation.sections.reports") }}
            </div>
            <ul role="list" class="mt-2 space-y-1">
              <li>
                <router-link
                  to="/reports"
                  :class="[
                    isCurrentRoute('/reports')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                    layoutStore.sidebarExpanded ? 'px-2' : 'justify-center',
                  ]"
                  :title="$t('navigation.reports')"
                >
                  <FileBarChart class="h-6 w-6 shrink-0" />
                  <span v-if="layoutStore.sidebarExpanded">{{
                    $t("navigation.reports")
                  }}</span>
                </router-link>
              </li>
              <li>
                <router-link
                  to="/workflow"
                  :class="[
                    isCurrentRoute('/workflow')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                    layoutStore.sidebarExpanded ? 'px-2' : 'justify-center',
                  ]"
                  :title="$t('navigation.workflow')"
                >
                  <Share2 class="h-6 w-6 shrink-0" />
                  <span v-if="layoutStore.sidebarExpanded">{{
                    $t("navigation.workflow")
                  }}</span>
                </router-link>
              </li>
              <li>
                <router-link
                  to="/workflow-builder"
                  :class="[
                    isCurrentRoute('/workflow-builder')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                    layoutStore.sidebarExpanded ? 'px-2' : 'justify-center',
                  ]"
                  :title="$t('navigation.workflowEditor')"
                >
                  <WorkflowIcon class="h-6 w-6 shrink-0" />
                  <span v-if="layoutStore.sidebarExpanded">{{
                    $t("navigation.workflowEditor")
                  }}</span>
                </router-link>
              </li>
            </ul>
          </li>

          <!-- Team Section -->
          <li>
            <div
              v-if="layoutStore.sidebarExpanded"
              class="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wider"
            >
              {{ $t("navigation.sections.team") }}
            </div>
            <ul role="list" class="mt-2 space-y-1">
              <li>
                <router-link
                  to="/team"
                  :class="[
                    isCurrentRoute('/team')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                    layoutStore.sidebarExpanded ? 'px-2' : 'justify-center',
                  ]"
                  :title="$t('navigation.team')"
                >
                  <Users class="h-6 w-6 shrink-0" />
                  <span v-if="layoutStore.sidebarExpanded">{{
                    $t("navigation.team")
                  }}</span>
                </router-link>
              </li>
            </ul>
          </li>

          <!-- Configuration Section -->
          <li>
            <div
              v-if="layoutStore.sidebarExpanded"
              class="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wider"
            >
              {{ $t("navigation.sections.configuration") }}
            </div>
            <ul role="list" class="mt-2 space-y-1">
              <li>
                <router-link
                  to="/environments"
                  :class="[
                    isCurrentRoute('/environments')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                    layoutStore.sidebarExpanded ? 'px-2' : 'justify-center',
                  ]"
                  :title="$t('navigation.environments')"
                >
                  <Monitor class="h-6 w-6 shrink-0" />
                  <span v-if="layoutStore.sidebarExpanded">{{
                    $t("navigation.environments")
                  }}</span>
                </router-link>
              </li>
              <li>
                <router-link
                  to="/settings"
                  :class="[
                    isCurrentRoute('/settings')
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                    layoutStore.sidebarExpanded ? 'px-2' : 'justify-center',
                  ]"
                  :title="$t('navigation.settings')"
                >
                  <Settings class="h-6 w-6 shrink-0" />
                  <span v-if="layoutStore.sidebarExpanded">{{
                    $t("navigation.settings")
                  }}</span>
                </router-link>
              </li>
            </ul>
          </li>

          <li class="mt-auto">
            <div class="space-y-3 py-3 border-t border-gray-700/50">
              <div :class="layoutStore.sidebarExpanded ? 'px-2' : 'flex justify-center'">
                <LanguageSwitcher />
              </div>

              <!-- 用户信息按钮 -->
              <div class="relative">
                <button
                  @click.stop="toggleProfileMenu"
                  class="user-profile-button"
                  ref="userProfileButtonRef"
                  :class="[
                    'w-full flex items-center rounded-lg p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white',
                    layoutStore.sidebarExpanded ? 'justify-between' : 'justify-center',
                  ]"
                >
                  <div class="flex items-center gap-x-3">
                    <div class="relative">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                        class="w-8 h-8 rounded-full object-cover border-2 border-gray-700"
                        alt="用户头像"
                      />
                      <div
                        class="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"
                      ></div>
                    </div>
                    <div v-if="layoutStore.sidebarExpanded" class="text-left">
                      <p class="font-medium text-white leading-tight">{{ username }}</p>
                      <p class="text-xs text-gray-400">
                        {{ authStore.userRole || "测试工程师" }}
                      </p>
                    </div>
                  </div>
                  <ChevronDown v-if="layoutStore.sidebarExpanded" class="w-5 h-5" />
                </button>
              </div>

              <!-- 收起导航按钮 -->
              <button
                @click="layoutStore.toggleSidebar"
                :class="[
                  'w-full flex items-center rounded-lg p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white',
                  layoutStore.sidebarExpanded ? 'justify-between' : 'justify-center',
                ]"
                :title="layoutStore.sidebarExpanded ? '收起导航' : '展开导航'"
              >
                <div class="flex items-center gap-x-3">
                  <PanelLeftClose v-if="layoutStore.sidebarExpanded" class="w-5 h-5" />
                  <PanelLeftOpen v-else class="w-5 h-5" />
                  <span v-if="layoutStore.sidebarExpanded">收起导航</span>
                </div>
                <ChevronLeft v-if="layoutStore.sidebarExpanded" class="w-5 h-5" />
              </button>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  </div>

  <!-- 移动端菜单按钮和顶栏 -->
  <div
    class="sticky top-0 z-10 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 md:hidden"
  >
    <button type="button" class="-m-2.5 p-2.5 text-gray-700" @click="openSidebar">
      <Menu class="h-6 w-6" />
    </button>

    <div class="flex flex-1 justify-between">
      <div class="flex items-center">
        <Beaker class="w-8 h-8 text-blue-600" />
        <h2 class="ml-2 text-lg font-semibold">{{ $t("common.appName") }}</h2>
      </div>

      <div class="relative">
        <button @click="toggleUserMenu" class="flex items-center text-sm">
          <span class="flex items-center">
            <span class="text-sm font-semibold leading-6 text-gray-900">
              {{ username }}
            </span>
            <ChevronDown class="ml-2 h-5 w-5 text-gray-400" />
          </span>
        </button>

        <div
          v-if="userMenuOpen"
          class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
          @click="closeUserMenu"
        >
          <router-link
            to="/settings"
            class="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50"
          >
            {{ $t("navigation.settings") }}
          </router-link>
          <a
            href="#"
            @click.prevent="logout"
            class="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50"
          >
            {{ $t("auth.logout") }}
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- 遮罩层，移动端菜单打开时显示 -->
  <div
    v-if="sidebarOpen && !isLargeScreen"
    class="fixed inset-0 z-30 bg-gray-900/80 backdrop-blur-sm transition-opacity md:hidden"
    @click="closeSidebar"
  ></div>

  <!-- 全局用户信息弹窗 -->
  <Teleport to="body">
    <div
      v-if="profileMenuOpen"
      class="fixed inset-0 bg-black bg-opacity-10 z-50 flex items-center justify-center"
      @click="closeProfileMenu"
    >
      <div
        class="user-profile-menu w-64 bg-white rounded-lg shadow-xl overflow-hidden"
        :style="profileMenuStyle"
        @click.stop
      >
        <div class="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <p class="text-sm font-medium text-gray-900">{{ username }}</p>
          <p class="text-xs text-gray-500 truncate">{{ authStore.userEmail }}</p>
        </div>
        <div class="py-2">
          <a
            href="#"
            @click.prevent="logout"
            class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            <div class="flex items-center">
              <LogOut class="w-4 h-4 mr-2" />
              退出登录
            </div>
          </a>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { useLayoutStore } from "@/stores/layout";
import {
  BarChart3,
  Clock,
  ClipboardCheck,
  PlayCircle,
  Bug,
  Calendar,
  Monitor,
  Users,
  Settings,
  Menu,
  ChevronDown,
  ChevronLeft,
  LogOut,
  LayoutDashboard,
  Folders,
  FileBarChart,
  Beaker,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Share2,
  WorkflowIcon,
} from "lucide-vue-next";
import LanguageSwitcher from "./LanguageSwitcher.vue";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const layoutStore = useLayoutStore();

const sidebarOpen = ref(false);
const userMenuOpen = ref(false);
const profileMenuOpen = ref(false);
const isLargeScreen = ref(window.innerWidth >= 768);
const userProfileButtonRef = ref<HTMLElement | null>(null);
const profileMenuStyle = ref({});

const username = computed(() => authStore.username || "User");

function openSidebar() {
  sidebarOpen.value = true;
}

function closeSidebar() {
  sidebarOpen.value = false;
}

function toggleUserMenu() {
  userMenuOpen.value = !userMenuOpen.value;
}

function closeUserMenu() {
  userMenuOpen.value = false;
}

function toggleProfileMenu() {
  if (!profileMenuOpen.value) {
    calculateProfileMenuPosition();
  }
  profileMenuOpen.value = !profileMenuOpen.value;
}

function closeProfileMenu() {
  profileMenuOpen.value = false;
}

function calculateProfileMenuPosition() {
  if (userProfileButtonRef.value) {
    const rect = userProfileButtonRef.value.getBoundingClientRect();

    // 根据当前窗口尺寸和按钮位置计算弹窗位置
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // 计算弹窗的位置
    let top = rect.top;
    let left = 0;

    // 如果导航栏收缩，将弹窗显示在按钮的右侧
    if (!layoutStore.sidebarExpanded) {
      left = rect.right + 8; // 右侧偏移8px
    } else {
      left = rect.left;
      top = rect.top - 10; // 避免紧贴按钮
    }

    // 确保弹窗不会超出视口
    // 如果弹窗会超出右侧边界，则将其向左调整
    if (left + 256 > windowWidth) {
      left = windowWidth - 264;
    }

    // 在小屏幕上水平居中
    if (windowWidth < 640) {
      left = (windowWidth - 256) / 2;
    }

    // 应用计算出的样式
    profileMenuStyle.value = {
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
    };
  }
}

function isCurrentRoute(path: string) {
  return route.path === path;
}

function logout() {
  authStore.logout();
  router.push("/login");
}

function handleResize() {
  isLargeScreen.value = window.innerWidth >= 768;
  if (profileMenuOpen.value) {
    calculateProfileMenuPosition();
  }
}

// 挂载事件监听器
onMounted(() => {
  window.addEventListener("resize", handleResize);
  window.addEventListener("scroll", handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("scroll", handleResize);
});

// 当侧边栏状态变化时，关闭弹窗
watch(
  () => layoutStore.sidebarExpanded,
  () => {
    profileMenuOpen.value = false;
  }
);
</script>

<style scoped>
.user-profile-menu {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
