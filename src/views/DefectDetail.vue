<template>
  <PageLayout>
    <div class="space-y-8">
      <!-- 页面顶部 -->
      <PageHeader
        :title="defect ? defect.title : '缺陷详情'"
        description="查看和管理缺陷详细信息"
      >
        <template #actions>
          <div class="flex space-x-2">
            <button
              @click="$router.push('/defects')"
              class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 transition-colors"
            >
              <ArrowLeft class="w-5 h-5 text-gray-600" />
              <span>返回</span>
            </button>
            <button
              v-if="defect && defect.status !== '已解决'"
              class="px-4 py-2 bg-blue-100 text-blue-800 rounded-md font-medium hover:bg-blue-200 transition"
              @click="updateStatus('已解决')"
            >
              标记为已解决
            </button>
            <button
              v-if="defect && defect.status !== '已关闭'"
              class="px-4 py-2 bg-green-100 text-green-800 rounded-md font-medium hover:bg-green-200 transition"
              @click="updateStatus('已关闭')"
            >
              关闭缺陷
            </button>
            <button
              v-if="defect"
              class="px-4 py-2 bg-gray-100 text-gray-800 rounded-md font-medium hover:bg-gray-200 transition"
            >
              编辑缺陷
            </button>
          </div>
        </template>
      </PageHeader>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <!-- 缺陷不存在 -->
      <div
        v-else-if="!defect"
        class="bg-red-50 p-4 rounded-md border border-red-200 mb-6"
      >
        <div class="flex items-center">
          <AlertTriangle class="h-5 w-5 text-red-500 mr-2" />
          <p class="text-red-700">未找到此缺陷，ID: {{ defectId }}</p>
        </div>
        <p class="mt-2 text-red-600">
          请返回
          <router-link to="/defects" class="text-blue-600 hover:underline"
            >缺陷列表</router-link
          >
          选择有效的缺陷。
        </p>
      </div>

      <!-- 缺陷详情内容 -->
      <div v-else class="grid grid-cols-3 gap-6">
        <!-- 左侧信息 -->
        <div class="col-span-2 space-y-6">
          <!-- 基本信息卡片 -->
          <DashboardCard title="缺陷信息">
            <div class="mb-4">
              <div class="flex mb-2">
                <span
                  class="px-2 py-1 rounded text-sm font-medium"
                  :class="{
                    'bg-red-100 text-red-800':
                      defect.severity === '严重' || defect.severity === '高',
                    'bg-yellow-100 text-yellow-800': defect.severity === '中',
                    'bg-green-100 text-green-800': defect.severity === '低',
                  }"
                >
                  {{ defect.severity }}
                </span>
                <span
                  class="px-2 py-1 rounded text-sm font-medium ml-2"
                  :class="{
                    'bg-blue-100 text-blue-800': defect.status === '进行中',
                    'bg-green-100 text-green-800':
                      defect.status === '已解决' || defect.status === '已关闭',
                    'bg-purple-100 text-purple-800': defect.status === '待验证',
                    'bg-gray-100 text-gray-800': defect.status === '新建',
                  }"
                >
                  {{ defect.status }}
                </span>
                <span
                  class="px-2 py-1 rounded text-sm font-medium ml-2 bg-gray-100 text-gray-800"
                >
                  {{ defect.priority }}
                </span>
              </div>
              <p class="text-gray-700 whitespace-pre-line">{{ defect.description }}</p>
            </div>

            <!-- 复现步骤 -->
            <div v-if="defect.steps && defect.steps.length > 0">
              <h3 class="font-medium text-lg mb-3">复现步骤</h3>
              <div class="space-y-4">
                <div
                  v-for="(step, index) in defect.steps"
                  :key="index"
                  class="border-l-2 border-gray-300 pl-4"
                >
                  <div class="mb-1">
                    <span class="font-medium">步骤 {{ index + 1 }}:</span>
                    {{ step.description }}
                  </div>
                  <div class="text-sm text-gray-600">
                    <div class="mb-1">
                      <span class="text-green-600 font-medium">期望结果:</span>
                      {{ step.expected }}
                    </div>
                    <div>
                      <span class="text-red-600 font-medium">实际结果:</span>
                      {{ step.actual }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>

          <!-- 评论区域 -->
          <DashboardCard title="评论">
            <div class="space-y-4">
              <div
                v-if="!defect.comments || defect.comments.length === 0"
                class="text-gray-500 italic"
              >
                暂无评论，请添加第一条评论。
              </div>
              <div
                v-for="comment in defect.comments"
                :key="comment.id"
                class="border-b border-gray-200 pb-4 last:border-0"
              >
                <div class="flex justify-between items-center mb-2">
                  <div class="font-medium">{{ comment.user?.name || "匿名用户" }}</div>
                  <div class="text-sm text-gray-500">{{ comment.created }}</div>
                </div>
                <p class="text-gray-700">{{ comment.content }}</p>
              </div>
            </div>

            <!-- 添加评论 -->
            <div class="mt-4">
              <div class="mb-2 font-medium">添加新评论</div>
              <textarea
                v-model="newComment"
                rows="3"
                class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入您的评论..."
              ></textarea>
              <div class="mt-2 flex justify-end">
                <button
                  @click="handleAddComment"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  :disabled="!newComment.trim()"
                  :class="{ 'opacity-50 cursor-not-allowed': !newComment.trim() }"
                >
                  提交评论
                </button>
              </div>
            </div>
          </DashboardCard>

          <!-- 附件 -->
          <DashboardCard
            v-if="defect.attachments && defect.attachments.length > 0"
            title="附件"
          >
            <div class="space-y-2">
              <div
                v-for="attachment in defect.attachments"
                :key="attachment.id"
                class="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
              >
                <div class="flex items-center">
                  <FileText class="h-5 w-5 text-gray-500 mr-2" />
                  <span>{{ attachment.name }}</span>
                </div>
                <div class="flex items-center space-x-4">
                  <span class="text-sm text-gray-500">{{
                    formatFileSize(attachment.size)
                  }}</span>
                  <a href="#" class="text-blue-600 hover:text-blue-800">
                    <Download class="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        <!-- 右侧信息 -->
        <div class="space-y-6">
          <!-- JIRA 信息 -->
          <DashboardCard title="JIRA 信息">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">JIRA ID:</span>
                <span class="font-medium">{{ defect.jiraId }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">JIRA 项目:</span>
                <span>{{ defect.jiraProject }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">模块:</span>
                <span>{{ defect.jiraModule }}</span>
              </div>
              <div v-if="defect.version" class="flex justify-between">
                <span class="text-gray-600">版本:</span>
                <span>{{ defect.version }}</span>
              </div>
              <button
                @click="goToJira(defect.jiraUrl)"
                class="w-full mt-4 px-4 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition flex items-center justify-center"
              >
                <ExternalLink class="h-4 w-4 mr-2" />
                在 JIRA 中查看
              </button>
            </div>
          </DashboardCard>

          <!-- 负责人信息 -->
          <DashboardCard title="负责信息">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">负责人:</span>
                <span>{{ defect.assignee }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">创建时间:</span>
                <span>{{ defect.created }}</span>
              </div>
              <div v-if="defect.modified" class="flex justify-between">
                <span class="text-gray-600">最后更新:</span>
                <span>{{ defect.modified }}</span>
              </div>
            </div>
          </DashboardCard>

          <!-- 快速操作 -->
          <DashboardCard title="快速操作">
            <div class="space-y-2">
              <button
                class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition flex items-center justify-center"
              >
                <UserPlus class="h-4 w-4 mr-2" />
                分配给我
              </button>
              <button
                v-if="defect.status !== '已解决'"
                class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition flex items-center justify-center"
              >
                <CheckCircle class="h-4 w-4 mr-2" />
                标记为已解决
              </button>
              <button
                v-if="defect.status !== '进行中'"
                class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition flex items-center justify-center"
              >
                <Play class="h-4 w-4 mr-2" />
                开始处理
              </button>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import {
  ArrowLeft,
  AlertTriangle,
  FileText,
  Download,
  ExternalLink,
  UserPlus,
  CheckCircle,
  Play,
} from "lucide-vue-next";
import DashboardCard from "@/components/DashboardCard.vue";
import PageLayout from "@/components/layout/PageLayout.vue";
import PageHeader from "@/components/layout/PageHeader.vue";
import type {
  Defect,
  DefectComment,
  DefectAttachment,
  DefectStatus,
  DefectPriority,
  DefectSeverity,
} from "@/mock/types/defect";
import { DefectService } from "@/mock/services/defect";

const route = useRoute();
const defectId = computed(() => route.params.id as string);

// 缺陷详情数据
const defect = ref<Defect | null>(null);
const comments = ref<DefectComment[]>([]);
const attachments = ref<DefectAttachment[]>([]);
const loading = ref(true);
const newComment = ref("");

// 加载缺陷详情
const loadDefectDetail = async () => {
  try {
    loading.value = true;
    defect.value = await DefectService.getDefectById(defectId.value);
    if (defect.value) {
      comments.value = await DefectService.getDefectComments(defectId.value);
      attachments.value = await DefectService.getDefectAttachments(defectId.value);
    }
  } catch (error) {
    console.error("加载缺陷详情失败:", error);
  } finally {
    loading.value = false;
  }
};

// 添加评论
const handleAddComment = async () => {
  if (!newComment.value.trim()) return;

  try {
    const comment: Omit<DefectComment, "id"> = {
      user: {
        id: "current-user",
        name: "当前用户",
      },
      content: newComment.value,
      created: new Date().toISOString().slice(0, 19).replace("T", " "),
    };
    comments.value = await DefectService.addDefectComment(defectId.value, comment);
    newComment.value = "";
  } catch (error) {
    console.error("添加评论失败:", error);
  }
};

// 添加附件
const addAttachment = async (file: File) => {
  try {
    const newAttachment: Omit<DefectAttachment, "id"> = {
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      created: new Date().toISOString().slice(0, 19).replace("T", " "),
    };
    attachments.value = await DefectService.addDefectAttachment(
      defectId.value,
      newAttachment
    );
  } catch (error) {
    console.error("添加附件失败:", error);
  }
};

// 更新缺陷状态
const updateStatus = async (status: DefectStatus) => {
  try {
    defect.value = await DefectService.updateDefectStatus(defectId.value, status);
  } catch (error) {
    console.error("更新状态失败:", error);
  }
};

// 更新缺陷优先级
const updatePriority = async (priority: DefectPriority) => {
  try {
    defect.value = await DefectService.updateDefectPriority(defectId.value, priority);
  } catch (error) {
    console.error("更新优先级失败:", error);
  }
};

// 更新缺陷严重程度
const updateSeverity = async (severity: DefectSeverity) => {
  try {
    defect.value = await DefectService.updateDefectSeverity(defectId.value, severity);
  } catch (error) {
    console.error("更新严重程度失败:", error);
  }
};

// 更新缺陷指派人
const updateAssignee = async (assignee: string) => {
  try {
    defect.value = await DefectService.updateDefectAssignee(defectId.value, assignee);
  } catch (error) {
    console.error("更新指派人失败:", error);
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadDefectDetail();
});

// 获取状态颜色
const getStatusColor = (status: DefectStatus) => {
  switch (status) {
    case "新建":
      return "bg-gray-100 text-gray-800";
    case "进行中":
      return "bg-blue-100 text-blue-800";
    case "已解决":
      return "bg-green-100 text-green-800";
    case "已关闭":
      return "bg-purple-100 text-purple-800";
    case "待验证":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// 获取状态文本
const getStatusText = (status: DefectStatus) => {
  switch (status) {
    case "新建":
      return "新建";
    case "进行中":
      return "修复中";
    case "已解决":
      return "已修复";
    case "已关闭":
      return "已关闭";
    case "待验证":
      return "待验证";
    default:
      return status;
  }
};

// 获取姓名首字母
const getInitials = (name: string) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

// 跳转到JIRA
const goToJira = (url: string) => {
  if (url) {
    window.open(url, "_blank");
  }
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};
</script>
