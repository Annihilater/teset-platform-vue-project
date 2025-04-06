import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { format } from "date-fns";
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  AlertTriangle,
  AlertOctagon,
  Calendar,
  Link,
  ExternalLink,
  User,
  Eye,
  Edit,
  ClipboardEdit,
  Bug,
  Copy,
  Check,
} from "lucide-vue-next";
import DashboardCard from "@/components/DashboardCard.vue";
import PageHeader from "@/components/layout/PageHeader.vue";
import PageLayout from "@/components/layout/PageLayout.vue";
import type {
  Defect,
  DefectFilterParams,
  DefectStatus,
  DefectSeverity,
  DefectPriority,
} from "@/mock/types/defect";
import { DefectService } from "@/mock/services/defect";
import { defectColumns } from "@/mock/data/defects";
import Pagination from "@/components/Pagination.vue";
import { usePagination } from "@/composables/usePagination";

export const searchQuery = ref("");
export const statusFilter = ref<DefectStatus | "all">("all");
export const severityFilter = ref<DefectSeverity | "all">("all");
export const priorityFilter = ref<DefectPriority | "all">("all");
export const assigneeFilter = ref("all");
export const dateFilter = ref<[Date | null, Date | null]>([null, null]);
export const selectedDefects = ref<string[]>([]);
export const loading = ref(false);
export const sortField = ref("modified");
export const sortDirection = ref<"asc" | "desc">("desc");
export const showFilters = ref(false);

export const filterParams = computed<DefectFilterParams>(() => {
  return {
    severity: severityFilter.value,
    status: statusFilter.value,
    assignee: assigneeFilter.value,
    dateRange:
      dateFilter.value[0] && dateFilter.value[1]
        ? ([dateFilter.value[0], dateFilter.value[1]] as [Date, Date])
        : null,
    priority: priorityFilter.value,
    jiraProject: "all",
  };
});

export const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "严重":
      return AlertOctagon;
    case "高":
      return AlertTriangle;
    case "中":
      return AlertTriangle;
    case "低":
      return AlertTriangle;
    default:
      return AlertTriangle;
  }
};

export const getStatusColor = (status: DefectStatus) => {
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

export const getStatusText = (status: DefectStatus) => {
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

export const getSeverityText = (severity: DefectSeverity) => {
  return severity;
};

export const handleSort = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "desc";
  }
  loadDefects();
};

export const handleBatchAction = (action: "delete" | "close" | "assign" | "export") => {
  switch (action) {
    case "delete":
      break;
    case "close":
      break;
    case "assign":
      break;
    case "export":
      break;
  }
};

export const defects = ref<Defect[]>([]);
export const selectedDefect = ref<Defect | null>(null);

export const filteredDefects = computed(() => defects.value);

export const {
  currentPage,
  pageSize,
  paginatedItems: paginatedDefects,
  resetPage,
  totalPages,
  prevPage,
  nextPage,
  displayedPages,
  goToPage,
} = usePagination(filteredDefects, { pageSize: 10 });

export const loadDefects = async () => {
  loading.value = true;
  try {
    defects.value = await DefectService.getDefectList(
      searchQuery.value,
      filterParams.value,
      sortField.value,
      sortDirection.value
    );
  } catch (error) {
    console.error("加载缺陷列表失败:", error);
    defects.value = [];
  } finally {
    loading.value = false;
  }
};

watch(
  [searchQuery, filterParams],
  () => {
    resetPage();
    loadDefects();
  },
  { deep: true }
);

export const handleSelectAll = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;
  selectedDefects.value = checked ? defects.value.map((d) => d.id) : [];
};

onMounted(() => {
  loadDefects();
});


export const copyStatus = ref<{ text: string; success: boolean; timestamp: number } | null>(null);

export const copyToClipboard = async (text: string) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      showCopyStatus(text, true);
      return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);

    if (successful) {
      showCopyStatus(text, true);
    } else {
      showCopyStatus(text, false);
    }
  } catch (err) {
    console.error("复制失败:", err);
    showCopyStatus(text, false);
  }
};

export const showCopyStatus = (text: string, success: boolean) => {
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

export const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return format(new Date(dateString), "yyyy-MM-dd");
};

export const resetFilters = () => {
  searchQuery.value = "";
  severityFilter.value = "all";
  statusFilter.value = "all";
  priorityFilter.value = "all";
  assigneeFilter.value = "all";
  dateFilter.value = [null, null];
  resetPage();
  loadDefects();
};