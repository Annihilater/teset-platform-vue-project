import type { Project, ProjectFilterParams } from '../types/project';
import { projects } from '../data/projects';

export class ProjectService {
  /**
   * 获取项目列表
   */
  static async getProjectList(
    filterParams: Partial<ProjectFilterParams> = {}
  ): Promise<Project[]> {
    let result = [...projects];

    // 搜索过滤
    if (filterParams.search) {
      const query = filterParams.search.toLowerCase();
      result = result.filter(project => 
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query)
      );
    }

    // 状态过滤
    if (filterParams.status && filterParams.status !== 'all') {
      result = result.filter(project => project.status === filterParams.status);
    }

    return result;
  }

  /**
   * 获取指定ID的项目详情
   */
  static async getProjectById(id: string): Promise<Project | null> {
    return projects.find(project => project.id === id) || null;
  }

  /**
   * 更新项目状态
   */
  static async updateProjectStatus(
    id: string,
    status: 'active' | 'inactive'
  ): Promise<Project | null> {
    const project = projects.find(p => p.id === id);
    if (!project) {
      return null;
    }

    project.status = status;
    project.modified = new Date().toISOString();
    return project;
  }

  /**
   * 更新项目信息
   */
  static async updateProject(
    id: string,
    data: Partial<Project>
  ): Promise<Project | null> {
    const project = projects.find(p => p.id === id);
    if (!project) {
      return null;
    }

    Object.assign(project, data);
    project.modified = new Date().toISOString();
    return project;
  }
} 