import { defineStore } from 'pinia';
import config from '@/config';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  userRole: string | null;
  userEmail: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
    username: localStorage.getItem('username'),
    userRole: localStorage.getItem('userRole') || '测试工程师',
    userEmail: localStorage.getItem('userEmail') || 'user@example.com'
  }),

  actions: {
    login(username: string, password: string): boolean {
      const { defaultCredentials } = config.auth;

      if (username === defaultCredentials.username && password === defaultCredentials.password) {
        this.isAuthenticated = true;
        this.username = username;
        this.userRole = '测试工程师';
        this.userEmail = `${username}@example.com`;
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('userRole', this.userRole);
        localStorage.setItem('userEmail', this.userEmail);
        return true;
      }
      return false;
    },

    logout() {
      this.isAuthenticated = false;
      this.username = null;
      this.userRole = null;
      this.userEmail = null;
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
    },

    register(username: string, password: string): boolean {
      if (!config.features.registration) {
        return false;
      }
      
      if (password.length < config.auth.minPasswordLength) {
        return false;
      }

      // 在实际环境中，会向后端API发送注册请求
      this.isAuthenticated = true;
      this.username = username;
      this.userRole = '测试工程师';
      this.userEmail = `${username}@example.com`;
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', username);
      localStorage.setItem('userRole', this.userRole);
      localStorage.setItem('userEmail', this.userEmail);
      return true;
    }
  }
}); 