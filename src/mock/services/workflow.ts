import type { Workflow, CreateWorkflowDto, UpdateWorkflowDto } from '../types/workflow';
import { mockWorkflows } from '../data/workflows';

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class WorkflowService {
  private workflows: Workflow[] = [...mockWorkflows];

  // 获取工作流列表
  async getWorkflows(): Promise<Workflow[]> {
    return this.workflows;
  }

  // 获取单个工作流
  async getWorkflow(id: string): Promise<Workflow | undefined> {
    return this.workflows.find(w => w.id === id);
  }

  // 创建工作流
  async createWorkflow(dto: CreateWorkflowDto): Promise<Workflow> {
    const workflow: Workflow = {
      id: Math.random().toString(36).substr(2, 9),
      ...dto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.workflows.push(workflow);
    return workflow;
  }

  // 更新工作流
  async updateWorkflow(id: string, dto: UpdateWorkflowDto): Promise<Workflow | undefined> {
    const index = this.workflows.findIndex(w => w.id === id);
    if (index === -1) return undefined;

    const workflow = this.workflows[index];
    const updated: Workflow = {
      ...workflow,
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    this.workflows[index] = updated;
    return updated;
  }

  // 删除工作流
  async deleteWorkflow(id: string): Promise<boolean> {
    const index = this.workflows.findIndex(w => w.id === id);
    if (index === -1) return false;

    this.workflows.splice(index, 1);
    return true;
  }
}

// 导出单例实例
const workflowService = new WorkflowService();
export default workflowService; 