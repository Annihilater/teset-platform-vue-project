import type { Team, TeamActivity } from '../types/team';
import type { User } from '../types/user';
import { teams, teamMembers, teamActivities } from '../data/teams';

export class TeamService {
  /**
   * 获取所有团队列表
   */
  static getAllTeams(): Promise<Team[]> {
    return Promise.resolve(teams);
  }

  /**
   * 根据ID获取特定团队
   */
  static getTeamById(id: string): Promise<Team | undefined> {
    const team = teams.find(team => team.id === id);
    return Promise.resolve(team);
  }

  /**
   * 获取所有团队成员
   */
  static getAllTeamMembers(): Promise<User[]> {
    return Promise.resolve(teamMembers);
  }

  /**
   * 获取团队成员
   */
  static getTeamMembers(teamId: string): Promise<User[]> {
    return Promise.resolve(
      teamMembers.filter(user => user.teams.includes(teamId))
    );
  }

  /**
   * 获取特定用户
   */
  static getUserById(userId: string): Promise<User | undefined> {
    const user = teamMembers.find(user => user.id === userId);
    return Promise.resolve(user);
  }

  /**
   * 获取团队活动
   */
  static getRecentActivities(): Promise<TeamActivity[]> {
    return Promise.resolve(teamActivities);
  }

  /**
   * 搜索团队
   */
  static searchTeams(query: string): Promise<Team[]> {
    if (!query) {
      return Promise.resolve(teams);
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = teams.filter(team => 
      team.name.toLowerCase().includes(lowerQuery) || 
      team.description.toLowerCase().includes(lowerQuery) ||
      team.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
    
    return Promise.resolve(filtered);
  }
}