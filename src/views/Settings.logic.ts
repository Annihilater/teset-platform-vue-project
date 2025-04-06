import type {
  User as UserType,
  ApiKey,
  Integration,
  Session,
  SecurityLog,
} from "../mock/types/user";
import {
  UserService,
  ApiKeyService,
  IntegrationService,
  SecurityService,
} from "../mock/services/user";

export const fetchData = async (
  mockUserRef: any,
  mockApiKeysRef: any,
  mockIntegrationsRef: any,
  activeSessionsRef: any,
  securityLogsRef: any
) => {
  try {
    mockUserRef.value = await UserService.getCurrentUser();
    mockApiKeysRef.value = await ApiKeyService.getApiKeys();
    mockIntegrationsRef.value = await IntegrationService.getIntegrations();
    activeSessionsRef.value = await SecurityService.getActiveSessions();
    securityLogsRef.value = await SecurityService.getSecurityLogs();
  } catch (error) {
    console.error("获取设置数据失败:", error);
  }
};

export const saveUserProfile = async (mockUserRef: any) => {
  if (mockUserRef.value) {
    try {
      await UserService.updateUserProfile({
        name: mockUserRef.value.name,
        email: mockUserRef.value.email,
      });
    } catch (error) {
      console.error("保存用户资料失败:", error);
    }
  }
};

export const savePreferences = async (mockUserRef: any) => {
  if (mockUserRef.value?.preferences) {
    try {
      await UserService.updateUserPreferences(mockUserRef.value.preferences);
    } catch (error) {
      console.error("保存偏好设置失败:", error);
    }
  }
};

export const updatePassword = async (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    alert("请填写所有密码字段");
    return;
  }
  if (newPassword !== confirmPassword) {
    alert("新密码和确认密码不匹配");
    return;
  }
  try {
    const result = await UserService.changePassword(currentPassword, newPassword);
    if (result.success) {
      alert("密码已成功更新");
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("更新密码失败:", error);
    alert("更新密码失败");
  }
};

export const createApiKey = async (
  name: string,
  scopes: string[],
  mockApiKeysRef: any,
  showNewKeyModalRef: any
) => {
  try {
    const newKey = await ApiKeyService.createApiKey(name, scopes);
    mockApiKeysRef.value.push(newKey);
    showNewKeyModalRef.value = false;
  } catch (error) {
    console.error("创建API密钥失败:", error);
  }
};

export const deleteApiKey = async (id: string, mockApiKeysRef: any) => {
  try {
    const success = await ApiKeyService.deleteApiKey(id);
    if (success) {
      mockApiKeysRef.value = mockApiKeysRef.value.filter((key: any) => key.id !== id);
    }
  } catch (error) {
    console.error("删除API密钥失败:", error);
  }
};

export const terminateSession = async (
  device: string,
  activeSessionsRef: any
) => {
  try {
    const success = await SecurityService.terminateSession(device);
    if (success) {
      activeSessionsRef.value = activeSessionsRef.value.filter(
        (session: any) => !(session.device === device && !session.current)
      );
    }
  } catch (error) {
    console.error("终止会话失败:", error);
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case "active":
      return "活跃";
    case "inactive":
      return "不活跃";
    case "success":
      return "成功";
    case "failed":
      return "失败";
    default:
      return status;
  }
};

export const getIntegrationType = (type: string) => {
  switch (type) {
    case "repository":
      return "代码仓库";
    case "ci":
      return "持续集成";
    case "notification":
      return "通知服务";
    case "issue-tracker":
      return "问题跟踪";
    case "monitoring":
      return "监控";
    default:
      return type;
  }
};