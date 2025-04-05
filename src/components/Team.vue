<template>
  <div class="space-y-4">
    <!-- 团队成员列表 -->
    <div class="space-y-3">
      <div
        v-for="member in teamMembers"
        :key="member.id"
        class="flex items-center space-x-3"
      >
        <img :src="member.avatar" :alt="member.name" class="w-8 h-8 rounded-full" />
        <div>
          <div class="text-sm font-medium text-gray-900">{{ member.name }}</div>
          <div class="text-xs text-gray-500">{{ member.role }}</div>
        </div>
        <div
          :class="`w-2 h-2 rounded-full ml-auto ${getStatusColor(member.status)}`"
        ></div>
      </div>
    </div>

    <!-- 在线状态说明 -->
    <div class="pt-4 border-t border-gray-200">
      <div class="flex items-center justify-between text-xs text-gray-500">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 rounded-full bg-green-500"></div>
          <span>在线 ({{ getOnlineCount }})</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 rounded-full bg-gray-300"></div>
          <span>离线 ({{ getOfflineCount }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "online" | "offline" | "busy";
}

const teamMembers = ref<TeamMember[]>([
  {
    id: "1",
    name: "陈思雨",
    role: "测试负责人",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    status: "online",
  },
  {
    id: "2",
    name: "李明",
    role: "高级测试工程师",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    status: "busy",
  },
  {
    id: "3",
    name: "王红",
    role: "自动化测试工程师",
    avatar:
      "https://images.unsplash.com/photo-1550525811-e5869dd03032?w=100&h=100&fit=crop",
    status: "online",
  },
  {
    id: "4",
    name: "张伟",
    role: "测试工程师",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    status: "offline",
  },
]);

const getStatusColor = (status: TeamMember["status"]) => {
  switch (status) {
    case "online":
      return "bg-green-500";
    case "offline":
      return "bg-gray-300";
    case "busy":
      return "bg-yellow-500";
    default:
      return "bg-gray-300";
  }
};

const getOnlineCount = computed(
  () => teamMembers.value.filter((member) => member.status === "online").length
);

const getOfflineCount = computed(
  () => teamMembers.value.filter((member) => member.status === "offline").length
);
</script>
