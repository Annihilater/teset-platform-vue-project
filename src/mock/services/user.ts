import type { User, ApiKey, Integration, Session, SecurityLog } from '../types/user';
import { currentUser, apiKeys, integrations, activeSessions, securityLogs } from '../data/users';

export class UserService {
  static async getCurrentUser(): Promise<User> {
    return { ...currentUser };
  }

  static async updateUserProfile(profile: Partial<User>): Promise<User> {
    const updatedUser = { ...currentUser, ...profile };
    
    if (profile.preferences) {
      updatedUser.preferences = {
        ...currentUser.preferences,
        ...profile.preferences
      };
    }
    
    updatedUser.modified = new Date().toISOString();
    
    return updatedUser;
  }

  static async updateUserPreferences(preferences: Partial<User['preferences']>): Promise<User> {
    if (!currentUser.preferences) {
      currentUser.preferences = {
        theme: 'light',
        notifications: {
          email: false,
          desktop: false,
          slack: false
        },
        defaultView: 'dashboard',
        timezone: 'Asia/Shanghai',
        language: 'zh-CN'
      };
    }
    
    const updatedUser = { 
      ...currentUser,
      preferences: {
        ...currentUser.preferences,
        ...preferences
      },
      modified: new Date().toISOString()
    };
    
    return updatedUser;
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean, message: string }> {
    // 模拟密码验证逻辑
    if (currentPassword === 'oldpassword') {
      return { success: true, message: '密码已更新' };
    } else {
      return { success: false, message: '当前密码不正确' };
    }
  }
}

export class ApiKeyService {
  static async getApiKeys(): Promise<ApiKey[]> {
    return [...apiKeys];
  }
  
  static async createApiKey(name: string, scopes: string[]): Promise<ApiKey> {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    
    const newKey: ApiKey = {
      id: (apiKeys.length + 1).toString(),
      name,
      key: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
      created: new Date().toISOString(),
      expires: expiryDate.toISOString(),
      scopes
    };
    
    apiKeys.push(newKey);
    return newKey;
  }

  static async deleteApiKey(id: string): Promise<boolean> {
    const keyIndex = apiKeys.findIndex(key => key.id === id);
    if (keyIndex !== -1) {
      apiKeys.splice(keyIndex, 1);
      return true;
    }
    return false;
  }
}

export class IntegrationService {
  static async getIntegrations(): Promise<Integration[]> {
    return [...integrations];
  }
  
  static async addIntegration(integration: Omit<Integration, 'id' | 'created' | 'modified'>): Promise<Integration> {
    const newIntegration: Integration = {
      ...integration,
      id: (integrations.length + 1).toString(),
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    };
    
    integrations.push(newIntegration);
    return newIntegration;
  }

  static async updateIntegrationStatus(id: string, status: 'active' | 'inactive'): Promise<Integration | null> {
    const integration = integrations.find(i => i.id === id);
    if (integration) {
      integration.status = status;
      integration.modified = new Date().toISOString();
      return integration;
    }
    return null;
  }
}

export class SecurityService {
  static async getActiveSessions(): Promise<Session[]> {
    return [...activeSessions];
  }

  static async getSecurityLogs(): Promise<SecurityLog[]> {
    return [...securityLogs];
  }

  static async terminateSession(device: string): Promise<boolean> {
    const sessionIndex = activeSessions.findIndex(session => session.device === device && !session.current);
    if (sessionIndex !== -1) {
      activeSessions.splice(sessionIndex, 1);
      return true;
    }
    return false;
  }

  static async enableTwoFactor(): Promise<{ success: boolean, secretKey?: string }> {
    // 模拟两步验证启用
    return {
      success: true,
      secretKey: 'ABCDEF123456'
    };
  }
} 