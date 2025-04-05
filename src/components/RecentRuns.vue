<template>
  <div class="space-y-4">
    <div
      v-for="run in recentExecutions"
      :key="run.id"
      class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
      @click="navigateToExecution(run.id)"
    >
      <div class="flex items-center space-x-4">
        <div :class="`w-2 h-2 rounded-full ${getStatusColor(run.status)}`"></div>
        <div>
          <div class="font-medium text-gray-900">{{ run.testCase.name }}</div>
          <div class="text-sm text-gray-500">{{ formatTime(run.startTime) }}</div>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <span
          :class="`px-2 py-1 text-xs font-medium rounded-full ${getStatusBgColor(
            run.status
          )}`"
        >
          {{ getStatusText(run.status) }}
        </span>
        <span class="text-sm text-gray-500">
          {{ run.duration ? `${run.duration}分钟` : getStatusDuration(run.status) }}
        </span>
      </div>
    </div>

    <div v-if="recentExecutions.length === 0" class="text-center py-4 text-gray-500">
      暂无最近执行的测试
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { TestExecution, ExecutionStatus } from "../mock/types/execution";
import { ExecutionService } from "../mock/services/execution";

// 使用路由导航
const router = useRouter();

// 使用ref存储测试执行数据
const recentExecutions = ref<TestExecution[]>([]);

// 在组件挂载时加载数据
onMounted(async () => {
  try {
    // 使用 ExecutionService 加载最近执行的测试
    const executions = await ExecutionService.getRecentExecutions();
    // 只显示最近的几条
    recentExecutions.value = executions.slice(0, 5);
  } catch (error) {
    console.error("加载最近执行测试数据失败:", error);
  }
});

// 导航到测试执行详情页
const navigateToExecution = (id: string) => {
  router.push({ name: "executionDetails", params: { id } });
};

// 将ISO时间格式化为"几分钟前"的形式
const formatTime = (isoTime: string): string => {
  const executionTime = new Date(isoTime).getTime();
  const now = new Date().getTime();
  const diffMinutes = Math.floor((now - executionTime) / (60 * 1000));

  if (diffMinutes < 1) return "刚刚";
  if (diffMinutes < 60) return `${diffMinutes}分钟前`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}小时前`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}天前`;
};

const getStatusColor = (status: ExecutionStatus) => {
  switch (status) {
    case "completed":
      return "bg-green-500";
    case "failed":
      return "bg-red-500";
    case "running":
      return "bg-blue-500";
    case "initializing":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusBgColor = (status: ExecutionStatus) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "failed":
      return "bg-red-100 text-red-800";
    case "running":
      return "bg-blue-100 text-blue-800";
    case "initializing":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status: ExecutionStatus) => {
  switch (status) {
    case "completed":
      return "成功";
    case "failed":
      return "失败";
    case "running":
      return "运行中";
    case "initializing":
      return "初始化中";
    default:
      return status;
  }
};

const getStatusDuration = (status: ExecutionStatus): string => {
  switch (status) {
    case "running":
      return "进行中";
    case "initializing":
      return "待执行";
    default:
      return "";
  }
};
</script>
