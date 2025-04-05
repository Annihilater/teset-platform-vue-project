export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    desktop: boolean;
    slack: boolean;
  };
  defaultView: string;
  timezone: string;
  language: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  teams: string[];
  status: 'active' | 'inactive';
  lastActive: string;
  created: string;
  modified: string;
  preferences?: UserPreferences;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  expires?: string;
  lastUsed?: string;
  scopes: string[];
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive';
  configuration: Record<string, any>;
  lastSync?: string;
  created: string;
  modified: string;
}

export interface Session {
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export interface SecurityLog {
  action: string;
  ip: string;
  time: string;
  status: 'success' | 'failed';
} 