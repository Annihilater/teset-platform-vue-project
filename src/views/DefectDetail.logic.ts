import { ref } from "vue";
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
import { DefectService } from "@/mock/services/defect";
import type {
  Defect,
  DefectComment,
  DefectAttachment,
  DefectStatus,
  DefectPriority,
  DefectSeverity,
} from "@/mock/types/defect";

export const defect = ref<Defect | null>(null);
export const comments = ref<DefectComment[]>([]);
export const attachments = ref<DefectAttachment[]>([]);
export const loading = ref(true);
export const newComment = ref("");

export const loadDefectDetailById = async (id: string) => {
  try {
    loading.value = true;
    defect.value = await DefectService.getDefectById(id);
    if (defect.value) {
      comments.value = await DefectService.getDefectComments(id);
      attachments.value = await DefectService.getDefectAttachments(id);
    }
  } catch (error) {
    console.error("加载缺陷详情失败:", error);
  } finally {
    loading.value = false;
  }
};

export const handleAddComment = async (id: string) => {
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
    comments.value = await DefectService.addDefectComment(id, comment);
    newComment.value = "";
  } catch (error) {
    console.error("添加评论失败:", error);
  }
};

export const addAttachment = async (id: string, file: File) => {
  try {
    const newAttachment: Omit<DefectAttachment, "id"> = {
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      created: new Date().toISOString().slice(0, 19).replace("T", " "),
    };
    attachments.value = await DefectService.addDefectAttachment(
      id,
      newAttachment
    );
  } catch (error) {
    console.error("添加附件失败:", error);
  }
};

export const updateStatus = async (id: string, status: DefectStatus) => {
  try {
    defect.value = await DefectService.updateDefectStatus(id, status);
  } catch (error) {
    console.error("更新状态失败:", error);
  }
};

export const updatePriority = async (id: string, priority: DefectPriority) => {
  try {
    defect.value = await DefectService.updateDefectPriority(id, priority);
  } catch (error) {
    console.error("更新优先级失败:", error);
  }
};

export const updateSeverity = async (id: string, severity: DefectSeverity) => {
  try {
    defect.value = await DefectService.updateDefectSeverity(id, severity);
  } catch (error) {
    console.error("更新严重程度失败:", error);
  }
};

export const updateAssignee = async (id: string, assignee: string) => {
  try {
    defect.value = await DefectService.updateDefectAssignee(id, assignee);
  } catch (error) {
    console.error("更新指派人失败:", error);
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

export const getInitials = (name: string) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const goToJira = (url: string) => {
  if (url) {
    window.open(url, "_blank");
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};
