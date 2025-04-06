import { ref, onMounted, watch } from "vue";
import PageLayout from "@/components/layout/PageLayout.vue";
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
import DashboardCard from "@/components/DashboardCard.vue";
import PageHeader from "@/components/layout/PageHeader.vue";
import type {
  TestEnvironment,
  EnvironmentActivity,
  HealthStatus,
  EnvironmentStatus,
} from "@/mock/types/environment";
import { EnvironmentService } from "@/mock/services/environment";

export const searchQuery = ref("");
export const selectedStatus = ref("all");
export const selectedType = ref("all");
export const selectedEnvironment = ref<TestEnvironment | null>(null);
export const environments = ref<TestEnvironment[]>([]);
export const recentActivities = ref<EnvironmentActivity[]>([]);

export const getHealthIcon = (status: HealthStatus) => {
  switch (status) {
    case "healthy":
      return CheckCircle2;
    case "degraded":
      return AlertTriangle;
    case "down":
      return XCircle;
    default:
      return Activity;
  }
};

export const getHealthText = (status: HealthStatus) => {
  switch (status) {
    case "healthy":
      return "健康";
    case "degraded":
      return "性能下降";
    case "down":
      return "故障";
    default:
      return status;
  }
};

export const getActivityIcon = (action: string) => {
  switch (action) {
    case "Deployment":
      return RotateCw;
    case "Configuration Update":
      return Settings;
    case "Scaling":
      return Server;
    default:
      return Activity;
  }
};

export const getActionText = (action: string) => {
  switch (action) {
    case "Deployment":
      return "部署";
    case "Configuration Update":
      return "配置更新";
    case "Scaling":
      return "扩容";
    default:
      return action;
  }
};

export const getStatusClass = (status: EnvironmentStatus) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "maintenance":
      return "bg-yellow-100 text-yellow-800";
    case "inactive":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusText = (status: EnvironmentStatus) => {
  switch (status) {
    case "active":
      return "活跃";
    case "maintenance":
      return "维护中";
    case "inactive":
      return "不活跃";
    default:
      return status;
  }
};

export const loadEnvironments = async () => {
  environments.value = await EnvironmentService.getEnvironmentList({
    search: searchQuery.value,
    status: selectedStatus.value,
    type: selectedType.value,
  });
};

export const loadRecentActivities = async () => {
  recentActivities.value = await EnvironmentService.getRecentActivities();
};

watch([searchQuery, selectedStatus, selectedType], () => {
  loadEnvironments();
});
