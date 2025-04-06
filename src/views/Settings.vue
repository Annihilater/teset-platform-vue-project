<template>
  <PageLayout>
    <div class="space-y-8">
      <PageHeader title="设置" description="管理您的账户设置和偏好" />

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div class="lg:col-span-1">
          <nav class="space-y-1">
            <button
              v-for="section in sections"
              :key="section.id"
              @click="handleSectionChange(section.id)"
              :class="`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg ${
                activeSection === section.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-900 hover:bg-gray-50'
              }`"
            >
              <component :is="section.icon" class="w-5 h-5" />
              <span>{{ section.name }}</span>
            </button>
          </nav>
        </div>

        <div class="lg:col-span-3">
          <DashboardCard title="账户设置">
            <!-- 个人资料部分 -->
            <div v-if="activeSection === 'profile'" class="space-y-6">
              <div>
                <h3 class="text-lg font-medium text-gray-900">个人资料信息</h3>
                <p class="mt-1 text-sm text-gray-500">更新您的个人信息和资料设置。</p>
              </div>

              <div class="flex items-center space-x-6">
                <div class="relative">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop"
                    :alt="mockUser?.name"
                    class="w-24 h-24 rounded-full"
                  />
                  <button
                    class="absolute bottom-0 right-0 p-1 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50"
                  >
                    <Edit3 class="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <div class="flex-1">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">姓名</label>
                      <input
                        type="text"
                        v-model="userName"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">邮箱</label>
                      <input
                        type="email"
                        v-model="userEmail"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">个人介绍</label>
                <textarea
                  rows="4"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="写一些关于自己的介绍..."
                ></textarea>
              </div>

              <div class="flex justify-end space-x-3">
                <button
                  class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  保存更改
                </button>
              </div>
            </div>

            <!-- 通知部分 -->
            <div v-if="activeSection === 'notifications'" class="space-y-6">
              <div>
                <h3 class="text-lg font-medium text-gray-900">通知偏好</h3>
                <p class="mt-1 text-sm text-gray-500">选择您希望如何接收通知。</p>
              </div>

              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <Mail class="w-5 h-5 text-gray-400" />
                    <div>
                      <div class="font-medium text-gray-900">邮件通知</div>
                      <div class="text-sm text-gray-500">通过邮件接收更新</div>
                    </div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      v-model="notificationEmail"
                    />
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                    ></div>
                  </label>
                </div>

                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <Bell class="w-5 h-5 text-gray-400" />
                    <div>
                      <div class="font-medium text-gray-900">桌面通知</div>
                      <div class="text-sm text-gray-500">显示桌面推送通知</div>
                    </div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      v-model="notificationDesktop"
                    />
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                    ></div>
                  </label>
                </div>

                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <MessageSquare class="w-5 h-5 text-gray-400" />
                    <div>
                      <div class="font-medium text-gray-900">Slack 通知</div>
                      <div class="text-sm text-gray-500">在 Slack 中接收通知</div>
                    </div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      v-model="notificationSlack"
                    />
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                    ></div>
                  </label>
                </div>
              </div>

              <div class="flex justify-end">
                <button
                  class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  保存偏好
                </button>
              </div>
            </div>

            <!-- 安全部分 -->
            <div v-if="activeSection === 'security'" class="space-y-8">
              <div>
                <h3 class="text-lg font-medium text-gray-900">安全设置</h3>
                <p class="mt-1 text-sm text-gray-500">管理您的账户安全和认证方式。</p>
              </div>

              <!-- 密码修改部分 -->
              <div class="space-y-4">
                <h4 class="text-md font-medium text-gray-900">修改密码</h4>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >当前密码</label
                    >
                    <div class="mt-1 relative">
                      <input
                        :type="showPassword ? 'text' : 'password'"
                        v-model="currentPassword"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        @click="showPassword = !showPassword"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <EyeOff v-if="showPassword" class="h-5 w-5 text-gray-400" />
                        <Eye v-else class="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">新密码</label>
                    <input
                      type="password"
                      v-model="newPassword"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >确认新密码</label
                    >
                    <input
                      type="password"
                      v-model="confirmPassword"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div class="flex justify-end">
                    <button
                      class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                      更新密码
                    </button>
                  </div>
                </div>
              </div>

              <!-- 两步验证 -->
              <div class="space-y-4 border-t pt-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-md font-medium text-gray-900">两步验证</h4>
                    <p class="text-sm text-gray-500">为您的账户添加额外的安全层。</p>
                  </div>
                  <button
                    class="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 flex items-center space-x-2"
                  >
                    <Smartphone class="w-4 h-4" />
                    <span>启用两步验证</span>
                  </button>
                </div>
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div class="flex items-start">
                    <AlertTriangle class="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div class="ml-3">
                      <h5 class="text-sm font-medium text-yellow-800">未启用两步验证</h5>
                      <p class="mt-1 text-sm text-yellow-700">
                        我们强烈建议启用两步验证以增强账户安全性。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 活跃会话 -->
              <div class="space-y-4 border-t pt-6">
                <h4 class="text-md font-medium text-gray-900">活跃会话</h4>
                <div class="space-y-3">
                  <div
                    v-for="(session, index) in activeSessions"
                    :key="index"
                    class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div class="flex items-center space-x-3">
                      <Activity class="w-5 h-5 text-gray-400" />
                      <div>
                        <div class="flex items-center space-x-2">
                          <span class="font-medium text-gray-900">{{
                            session.device
                          }}</span>
                          <span
                            v-if="session.current"
                            class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                          >
                            当前
                          </span>
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ session.location }} • 最后活跃 {{ session.lastActive }}
                        </div>
                      </div>
                    </div>
                    <button
                      v-if="!session.current"
                      class="px-3 py-1 text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
                    >
                      <LogOut class="w-4 h-4" />
                      <span>登出</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 安全审计日志 -->
              <div class="space-y-4 border-t pt-6">
                <h4 class="text-md font-medium text-gray-900">安全审计日志</h4>
                <div class="space-y-3">
                  <div
                    v-for="(log, index) in securityLogs"
                    :key="index"
                    class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div class="flex items-center space-x-3">
                      <History class="w-5 h-5 text-gray-400" />
                      <div>
                        <div class="font-medium text-gray-900">{{ log.action }}</div>
                        <div class="text-sm text-gray-500">
                          IP: {{ log.ip }} • {{ new Date(log.time).toLocaleString() }}
                        </div>
                      </div>
                    </div>
                    <span
                      :class="`px-2 py-1 text-xs font-medium rounded-full ${
                        log.status === 'success'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`"
                    >
                      {{ getStatusText(log.status) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- API 密钥部分 -->
            <div v-if="activeSection === 'api-keys'" class="space-y-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">API 密钥</h3>
                  <p class="mt-1 text-sm text-gray-500">管理用于外部集成的 API 密钥。</p>
                </div>
                <button
                  @click="showNewKeyModal = true"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus class="w-5 h-5" />
                  <span>创建 API 密钥</span>
                </button>
              </div>

              <div class="space-y-4">
                <div
                  v-for="key in mockApiKeys"
                  :key="key.id"
                  class="p-4 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-medium text-gray-900">{{ key.name }}</div>
                      <div class="text-sm text-gray-500 mt-1">
                        创建于 {{ new Date(key.created).toLocaleDateString() }}
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <button class="p-2 hover:bg-gray-200 rounded-lg">
                        <RefreshCw class="w-5 h-5 text-gray-500" />
                      </button>
                      <button class="p-2 hover:bg-gray-200 rounded-lg">
                        <Trash2 class="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div class="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                    <div class="flex items-center space-x-2">
                      <Key class="w-4 h-4" />
                      <span>{{ key.key }}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <Clock class="w-4 h-4" />
                      <span
                        >过期日期
                        {{ new Date(key.expires || "").toLocaleDateString() }}</span
                      >
                    </div>
                  </div>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <span
                      v-for="scope in key.scopes"
                      :key="scope"
                      class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                    >
                      {{ scope }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 集成部分 -->
            <div v-if="activeSection === 'integrations'" class="space-y-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">集成</h3>
                  <p class="mt-1 text-sm text-gray-500">连接和管理外部服务。</p>
                </div>
                <button
                  @click="showNewIntegrationModal = true"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus class="w-5 h-5" />
                  <span>添加集成</span>
                </button>
              </div>

              <div class="space-y-4">
                <div
                  v-for="integration in mockIntegrations"
                  :key="integration.id"
                  class="p-4 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div
                        class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center"
                      >
                        <Zap class="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <div class="font-medium text-gray-900">
                          {{ integration.name }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ getIntegrationType(integration.type) }}
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-4">
                      <span
                        :class="`px-2 py-1 text-xs font-medium rounded-full ${
                          integration.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`"
                      >
                        {{ getStatusText(integration.status) }}
                      </span>
                      <button class="p-2 hover:bg-gray-200 rounded-lg">
                        <Settings class="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <div class="mt-4 text-sm text-gray-500">
                    最近同步时间:
                    {{ new Date(integration.lastSync || "").toLocaleString() }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 偏好设置部分 -->
            <div v-if="activeSection === 'preferences'" class="space-y-6">
              <div>
                <h3 class="text-lg font-medium text-gray-900">用户偏好</h3>
                <p class="mt-1 text-sm text-gray-500">自定义您的应用体验。</p>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">主题</label>
                  <select
                    v-model="themePreference"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="light">浅色</option>
                    <option value="dark">深色</option>
                    <option value="system">系统</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">语言</label>
                  <select
                    v-model="languagePreference"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="zh-CN">中文（简体）</option>
                    <option value="en-US">英语（美国）</option>
                    <option value="es">西班牙语</option>
                    <option value="fr">法语</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">时区</label>
                  <select
                    v-model="timezonePreference"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Asia/Shanghai">中国标准时间 (GMT+8)</option>
                    <option value="America/New_York">东部时间 (ET)</option>
                    <option value="America/Chicago">中部时间 (CT)</option>
                    <option value="America/Denver">山地时间 (MT)</option>
                    <option value="America/Los_Angeles">太平洋时间 (PT)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">默认视图</label>
                  <select
                    v-model="defaultViewPreference"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="dashboard">仪表盘</option>
                    <option value="test-cases">测试用例</option>
                    <option value="analytics">分析</option>
                  </select>
                </div>
              </div>

              <div class="flex justify-end">
                <button
                  class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  保存偏好
                </button>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  fetchData,
  saveUserProfile,
  savePreferences,
  updatePassword as updatePasswordFn,
  createApiKey as createApiKeyFn,
  deleteApiKey as deleteApiKeyFn,
  terminateSession as terminateSessionFn,
  getStatusText,
  getIntegrationType,
} from "./Settings.logic.ts";
import DashboardCard from "@/components/DashboardCard.vue";
import PageHeader from "@/components/layout/PageHeader.vue";
import PageLayout from "@/components/layout/PageLayout.vue";
import {
  User,
  Bell,
  Lock,
  Key,
  Zap,
  Sliders,
  Mail,
  MessageSquare,
  Eye,
  EyeOff,
  Smartphone,
  AlertTriangle,
  Activity,
  LogOut,
  History,
  RefreshCw,
  Trash2,
  Plus,
  Clock,
  Settings,
  Edit3,
} from "lucide-vue-next";

const { t } = useI18n();
const router = useRouter();

type SectionId =
  | "profile"
  | "notifications"
  | "security"
  | "api-keys"
  | "integrations"
  | "preferences";

const activeSection = ref<SectionId>("profile");
const showNewKeyModal = ref(false);
const showNewIntegrationModal = ref(false);
const showPassword = ref(false);
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const mockUser = ref<any>(null);
const mockApiKeys = ref<any[]>([]);
const mockIntegrations = ref<any[]>([]);
const activeSessions = ref<any[]>([]);
const securityLogs = ref<any[]>([]);

const userName = computed({
  get: () => mockUser.value?.name || "",
  set: (value) => {
    if (mockUser.value) {
      mockUser.value.name = value;
      saveUserProfile(mockUser);
    }
  },
});

const userEmail = computed({
  get: () => mockUser.value?.email || "",
  set: (value) => {
    if (mockUser.value) {
      mockUser.value.email = value;
      saveUserProfile(mockUser);
    }
  },
});

const notificationEmail = computed({
  get: () => mockUser.value?.preferences?.notifications?.email ?? false,
  set: (value) => {
    if (mockUser.value?.preferences?.notifications) {
      mockUser.value.preferences.notifications.email = value;
      savePreferences(mockUser);
    }
  },
});

const notificationDesktop = computed({
  get: () => mockUser.value?.preferences?.notifications?.desktop ?? false,
  set: (value) => {
    if (mockUser.value?.preferences?.notifications) {
      mockUser.value.preferences.notifications.desktop = value;
      savePreferences(mockUser);
    }
  },
});

const notificationSlack = computed({
  get: () => mockUser.value?.preferences?.notifications?.slack ?? false,
  set: (value) => {
    if (mockUser.value?.preferences?.notifications) {
      mockUser.value.preferences.notifications.slack = value;
      savePreferences(mockUser);
    }
  },
});

const themePreference = computed({
  get: () => mockUser.value?.preferences?.theme ?? "light",
  set: (value) => {
    if (mockUser.value?.preferences) {
      mockUser.value.preferences.theme = value;
      savePreferences(mockUser);
    }
  },
});

const languagePreference = computed({
  get: () => mockUser.value?.preferences?.language ?? "zh-CN",
  set: (value) => {
    if (mockUser.value?.preferences) {
      mockUser.value.preferences.language = value;
      savePreferences(mockUser);
    }
  },
});

const timezonePreference = computed({
  get: () => mockUser.value?.preferences?.timezone ?? "Asia/Shanghai",
  set: (value) => {
    if (mockUser.value?.preferences) {
      mockUser.value.preferences.timezone = value;
      savePreferences(mockUser);
    }
  },
});

const defaultViewPreference = computed({
  get: () => mockUser.value?.preferences?.defaultView ?? "dashboard",
  set: (value) => {
    if (mockUser.value?.preferences) {
      mockUser.value.preferences.defaultView = value;
      savePreferences(mockUser);
    }
  },
});

const updatePassword = async () => {
  await updatePasswordFn(currentPassword.value, newPassword.value, confirmPassword.value);
};

const createApiKey = async (name: string, scopes: string[]) => {
  await createApiKeyFn(name, scopes, mockApiKeys, showNewKeyModal);
};

const deleteApiKey = async (id: string) => {
  await deleteApiKeyFn(id, mockApiKeys);
};

const terminateSession = async (device: string) => {
  await terminateSessionFn(device, activeSessions);
};

const sections = [
  { id: "profile", name: "个人资料", icon: User },
  { id: "notifications", name: "通知", icon: Bell },
  { id: "security", name: "安全", icon: Lock },
  { id: "api-keys", name: "API 密钥", icon: Key },
  { id: "integrations", name: "集成", icon: Zap },
  { id: "preferences", name: "偏好设置", icon: Sliders },
];

const handleSectionChange = (sectionId: string) => {
  activeSection.value = sectionId as SectionId;
};

onMounted(() => {
  fetchData(mockUser, mockApiKeys, mockIntegrations, activeSessions, securityLogs);
});
</script>
