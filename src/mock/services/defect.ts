import type { Defect, DefectComment, DefectAttachment, DefectStatus, DefectPriority, DefectSeverity, DefectFilterParams } from '../types/defect';
import { defects, defectList } from '../data/defects';

export class DefectService {
  /**
   * 获取缺陷列表
   */
  static async getDefectList(
    searchQuery: string = '',
    filterParams: Partial<DefectFilterParams> = {},
    sortField: string = 'created',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<Defect[]> {
    let result = [...defectList];

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(defect => 
        defect.id.toLowerCase().includes(query) ||
        defect.title.toLowerCase().includes(query) ||
        defect.description.toLowerCase().includes(query)
      );
    }

    // 条件过滤
    if (filterParams.severity && filterParams.severity !== 'all') {
      result = result.filter(defect => defect.severity === filterParams.severity);
    }
    if (filterParams.status && filterParams.status !== 'all') {
      result = result.filter(defect => defect.status === filterParams.status);
    }
    if (filterParams.priority && filterParams.priority !== 'all') {
      result = result.filter(defect => defect.priority === filterParams.priority);
    }
    if (filterParams.assignee && filterParams.assignee !== 'all') {
      result = result.filter(defect => 
        filterParams.assignee === 'unassigned' 
          ? !defect.assignee 
          : defect.assignee === filterParams.assignee
      );
    }
    if (filterParams.jiraProject && filterParams.jiraProject !== 'all') {
      result = result.filter(defect => defect.jiraProject === filterParams.jiraProject);
    }
    if (filterParams.dateRange) {
      const [start, end] = filterParams.dateRange;
      result = result.filter(defect => {
        const defectDate = new Date(defect.created);
        return defectDate >= start && defectDate <= end;
      });
    }

    // 排序
    result.sort((a, b) => {
      const aValue = a[sortField as keyof Defect];
      const bValue = b[sortField as keyof Defect];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });

    return result;
  }

  /**
   * 获取指定ID的缺陷详情
   */
  static async getDefectById(id: string): Promise<Defect | null> {
    return defects[id] || null;
  }

  /**
   * 获取缺陷的评论列表
   */
  static async getDefectComments(defectId: string): Promise<DefectComment[]> {
    const defect = defects[defectId];
    if (!defect?.comments) {
      defect.comments = [];
    }
    return defect.comments;
  }

  /**
   * 添加缺陷评论
   */
  static async addDefectComment(defectId: string, comment: Omit<DefectComment, 'id'>): Promise<DefectComment[]> {
    const defect = defects[defectId];
    if (!defect) {
      throw new Error('缺陷不存在');
    }

    if (!defect.comments) {
      defect.comments = [];
    }

    const newComment = {
      ...comment,
      id: (defect.comments.length + 1).toString()
    };

    defect.comments.push(newComment);
    return defect.comments;
  }

  /**
   * 获取缺陷的附件列表
   */
  static async getDefectAttachments(defectId: string): Promise<DefectAttachment[]> {
    const defect = defects[defectId];
    if (!defect?.attachments) {
      defect.attachments = [];
    }
    return defect.attachments;
  }

  /**
   * 添加缺陷附件
   */
  static async addDefectAttachment(defectId: string, attachment: Omit<DefectAttachment, 'id'>): Promise<DefectAttachment[]> {
    const defect = defects[defectId];
    if (!defect) {
      throw new Error('缺陷不存在');
    }

    if (!defect.attachments) {
      defect.attachments = [];
    }

    const newAttachment = {
      ...attachment,
      id: (defect.attachments.length + 1).toString()
    };

    defect.attachments.push(newAttachment);
    return defect.attachments;
  }

  /**
   * 更新缺陷状态
   */
  static async updateDefectStatus(defectId: string, status: DefectStatus): Promise<Defect> {
    const defect = defects[defectId];
    if (!defect) {
      throw new Error('缺陷不存在');
    }

    defect.status = status;
    defect.modified = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return defect;
  }

  /**
   * 更新缺陷优先级
   */
  static async updateDefectPriority(defectId: string, priority: DefectPriority): Promise<Defect> {
    const defect = defects[defectId];
    if (!defect) {
      throw new Error('缺陷不存在');
    }

    defect.priority = priority;
    defect.modified = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return defect;
  }

  /**
   * 更新缺陷严重程度
   */
  static async updateDefectSeverity(defectId: string, severity: DefectSeverity): Promise<Defect> {
    const defect = defects[defectId];
    if (!defect) {
      throw new Error('缺陷不存在');
    }

    defect.severity = severity;
    defect.modified = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return defect;
  }

  /**
   * 更新缺陷指派人
   */
  static async updateDefectAssignee(defectId: string, assignee: string): Promise<Defect> {
    const defect = defects[defectId];
    if (!defect) {
      throw new Error('缺陷不存在');
    }

    defect.assignee = assignee;
    defect.modified = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return defect;
  }
} 