export interface TeamMember {
  userId: string;
  role: string;
  joinedAt: string;
  permissions: string[];
}

export interface TeamMetrics {
  totalTests: number;
  passRate: number;
  automationRate: number;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  projects: string[];
  created: string;
  modified: string;
  lead: string;
  tags: string[];
  metrics?: TeamMetrics;
}

export interface TeamActivity {
  action: string;
  user: string;
  time: string;
} 